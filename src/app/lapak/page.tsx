'use client';

import { useDialogA11y } from '@/lib/useDialogA11y';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MapPin, Store, CheckCircle, XCircle, AlertTriangle, Info, Tag, Weight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import ProductGridSkeleton from '@/components/ProductGridSkeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { trackClick } from '@/lib/trackClick';
import type { LapakProduct, LapakStall } from '@/app/api/lapak/route';

// Menu "Lapak": hanya MELIHAT produk & stok per lapak (tanpa keranjang/checkout). Pembelian dilakukan langsung di lapak.
const LOW_STOCK = 3;
const FETCH_TIMEOUT_MS = 15000;
const MUTED = 'text-[color:var(--text-muted)]';
const rp = (n: number) => `Rp${Math.round(n).toLocaleString('id-ID')}`;

type StockState = 'available' | 'low' | 'out';
const stockState = (p: LapakProduct): StockState => (p.stock <= 0 ? 'out' : p.stock <= LOW_STOCK ? 'low' : 'available');
const STOCK_STYLE: Record<StockState, { color: string; bg: string; border: string }> = {
  available: { color: '#16A34A', bg: 'rgba(22,163,74,0.1)', border: 'rgba(22,163,74,0.25)' },
  low: { color: '#D97706', bg: 'rgba(217,119,6,0.1)', border: 'rgba(217,119,6,0.3)' },
  out: { color: '#DC2626', bg: 'rgba(220,38,38,0.08)', border: 'rgba(220,38,38,0.22)' },
};

type Row = LapakProduct & { stallId: string; stallName: string };

export default function LapakPage() {
  const { t } = useLanguage();
  const [stalls, setStalls] = useState<LapakStall[] | null>(null);
  const [updatedAt, setUpdatedAt] = useState('');
  const [stallId, setStallId] = useState('semua');
  const [category, setCategory] = useState('semua');
  const [query, setQuery] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [detail, setDetail] = useState<Row | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const triggerRef = useRef<HTMLElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const hasDetail = detail !== null;

  useEffect(() => {
    let cancelled = false;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
    (async () => {
      try {
        const r = await fetch('/api/lapak', { signal: ctrl.signal });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const d = await r.json() as { stalls: LapakStall[]; updatedAt: string };
        if (cancelled) return;
        setStalls(d.stalls);
        setUpdatedAt(d.updatedAt);
        setLoadError(false);
      } catch (err) {
        if (cancelled) return;
        console.error('Gagal memuat lapak', err);
        setLoadError(true);
        setStalls(null);
      } finally {
        clearTimeout(timer);
      }
    })();
    return () => { cancelled = true; clearTimeout(timer); ctrl.abort(); };
  }, [reloadKey]);

  const retry = () => { setLoadError(false); setStalls(null); setReloadKey(k => k + 1); };

  const openDetail = useCallback((row: Row, el: HTMLElement) => { triggerRef.current = el; setDetail(row); }, []);

  // Modal detail: Escape, focus trap, scroll lock, fokus awal ke tombol tutup, fokus kembali ke pemicu.
  const closeDetail = useCallback(() => setDetail(null), []);
  useDialogA11y(hasDetail, closeDetail, dialogRef, closeBtnRef, { returnFocusRef: triggerRef });

  const rows: Row[] = useMemo(
    () => (stalls ?? []).flatMap(s => s.products.map(p => ({ ...p, stallId: s.id, stallName: s.name }))),
    [stalls],
  );
  const inStall = useMemo(() => rows.filter(r => stallId === 'semua' || r.stallId === stallId), [rows, stallId]);
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of inStall) if (r.category) counts.set(r.category, (counts.get(r.category) ?? 0) + 1);
    return [...counts].sort((a, b) => a[0].localeCompare(b[0], 'id'));
  }, [inStall]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inStall
      .filter(r => category === 'semua' || r.category === category)
      .filter(r => !onlyAvailable || r.stock > 0)
      .filter(r => !q || `${r.name} ${r.description}`.toLowerCase().includes(q))
      .sort((a, b) => (a.stock <= 0 ? 1 : 0) - (b.stock <= 0 ? 1 : 0));   // habis di bawah
  }, [inStall, category, onlyAvailable, query]);

  const activeStall = stalls?.find(s => s.id === stallId);
  const detailStall = detail ? stalls?.find(s => s.id === detail.stallId) : undefined;
  const stateLabel = (s: StockState) => s === 'available' ? t.lapak.available : s === 'low' ? t.lapak.lowStock : t.lapak.outOfStock;
  const StateIcon = (s: StockState) => s === 'available' ? CheckCircle : s === 'low' ? AlertTriangle : XCircle;
  const updatedText = updatedAt ? new Date(updatedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <main className="min-h-screen" style={{ background: '#FFFBF5' }}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-32 md:pb-20">
        <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 sm:mb-10">
          <p className="text-amber-600/70 text-sm font-semibold tracking-widest uppercase mb-3">{t.lapak.badge}</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-3">
            <span className="text-amber-950">{t.lapak.title1} </span>
            <span className="gradient-text">{t.lapak.title2}</span>
          </h1>
          <p className="text-amber-800/55 text-sm sm:text-base max-w-lg mx-auto">{t.lapak.subtitle}</p>
        </motion.div>

        <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 mb-6 text-sm text-amber-800/80">
          <Info size={16} className="mt-0.5 flex-shrink-0 text-amber-600" />
          <p>{t.lapak.noOrder}</p>
        </div>

        {loadError ? (
          <div role="alert" className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-4" aria-hidden="true">⚠️</div>
            <p className="text-amber-900 font-semibold mb-4">Gagal memuat, coba lagi</p>
            <button onClick={retry} className="btn-primary px-5 py-2.5 text-sm font-bold">Coba Lagi</button>
          </div>
        ) : stalls === null ? (
          <ProductGridSkeleton count={10} label={t.lapak.loading} gridClassName="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4" />
        ) : stalls.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-4">🏪</div>
            <p className="text-amber-900 font-semibold">{t.lapak.noStalls}</p>
          </div>
        ) : (
          <>
            {/* Pilihan lapak */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
              {[{ id: 'semua', name: t.lapak.allStalls, count: rows.length, logoUrl: '' }, ...stalls.map(s => ({ id: s.id, name: s.name, count: s.products.length, logoUrl: s.logoUrl }))].map(s => (
                <button key={s.id} aria-pressed={stallId === s.id} onClick={() => { trackClick('category', `lapak:${s.id}`); setStallId(s.id); setCategory('semua'); }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${stallId === s.id ? 'text-white shadow-md' : 'bg-white border border-amber-200 text-amber-700/70 hover:border-amber-300 hover:text-amber-800'}`}
                  style={stallId === s.id ? { background: 'linear-gradient(135deg, #D97706, #F59E0B)' } : {}}>
                  {s.logoUrl
                    ? <Image src={s.logoUrl} alt="" width={20} height={20} unoptimized className="w-5 h-5 rounded-full object-cover bg-white" />
                    : <Store size={14} />}
                  <span>{s.name}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-xs ${stallId === s.id ? 'bg-white/25 text-white' : 'bg-amber-100 text-amber-600'}`}>{s.count}</span>
                </button>
              ))}
            </div>
            {activeStall && (
              <div className="flex items-center gap-3 rounded-2xl border border-amber-100 bg-white px-4 py-3 mb-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center bg-amber-50 border border-amber-100">
                  {activeStall.logoUrl
                    ? <Image src={activeStall.logoUrl} alt={activeStall.name} width={48} height={48} unoptimized className="w-full h-full object-contain" />
                    : <Store size={20} className="text-amber-500" />}
                </div>
                <div className="min-w-0">
                  <p className="font-display font-bold text-amber-950 leading-tight">{activeStall.name}</p>
                  {activeStall.address && <p className="flex items-center gap-1.5 text-sm text-amber-800/60"><MapPin size={13} className="text-amber-500 flex-shrink-0" /> <span className="truncate">{activeStall.address}</span></p>}
                </div>
              </div>
            )}

            {/* Cari + filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500/60" />
                <input type="text" placeholder={t.lapak.search} value={query} onChange={e => setQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl input-field text-sm placeholder:text-amber-700/30" />
                {query && <button onClick={() => setQuery('')} aria-label="Hapus pencarian" className="before:absolute before:-inset-[15px] before:content-[''] absolute right-3.5 top-1/2 -translate-y-1/2 text-amber-500/60 hover:text-amber-700"><X size={14} aria-hidden="true" /></button>}
              </div>
              <label className="flex items-center gap-2 text-sm text-amber-800/70 px-1 py-2 select-none cursor-pointer">
                <input type="checkbox" checked={onlyAvailable} onChange={e => setOnlyAvailable(e.target.checked)} className="accent-amber-600" />
                {t.lapak.onlyAvailable}
              </label>
            </div>
            {categories.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
                {['semua', ...categories.map(c => c[0])].map(c => (
                  <button key={c} onClick={() => setCategory(c)} aria-pressed={category === c}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all ${category === c ? 'text-white shadow' : 'bg-white border border-amber-200 text-amber-700/70 hover:border-amber-300'}`}
                    style={category === c ? { background: 'linear-gradient(135deg, #D97706, #F59E0B)' } : {}}>
                    {c === 'semua' ? t.lapak.allCategory : c}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between mb-5">
              <p className="text-amber-800/50 text-sm"><span className="text-amber-700 font-semibold">{filtered.length}</span> {t.lapak.found}</p>
              {updatedText && <p className="text-xs text-amber-800/40">{t.lapak.updated} {updatedText}</p>}
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="font-display text-xl font-bold text-amber-900/50 mb-2">{t.lapak.notFound}</h3>
                <p className="text-amber-700/45 text-sm mb-5">{t.lapak.notFoundDesc}</p>
                <button onClick={() => { setQuery(''); setCategory('semua'); setStallId('semua'); setOnlyAvailable(false); }} className="btn-primary px-5 py-2.5 text-sm font-bold">{t.lapak.reset}</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {filtered.map(r => {
                  const st = stockState(r); const sty = STOCK_STYLE[st]; const Icon = StateIcon(st);
                  return (
                    <button key={`${r.stallId}-${r.id}`} onClick={e => openDetail(r, e.currentTarget)}
                      className="text-left bg-white rounded-2xl border border-amber-100 overflow-hidden flex flex-col hover:shadow-lg hover:shadow-amber-200/60 hover:border-amber-200 transition-all"
                      style={{ opacity: st === 'out' ? 0.65 : 1 }}>
                      <div className="relative w-full" style={{ aspectRatio: '1 / 1', background: 'linear-gradient(135deg, #B4530912, #B4530906)' }}>
                        {r.imageUrl
                          ? <Image src={r.imageUrl} alt={r.name} fill sizes="(max-width: 640px) 50vw, 20vw" className="object-contain" unoptimized />
                          : <div className="w-full h-full flex items-center justify-center text-5xl">{r.emoji || '🛍️'}</div>}
                        <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
                          style={{ background: sty.bg, border: `1px solid ${sty.border}`, color: sty.color, backdropFilter: 'blur(4px)' }}>
                          <Icon size={10} /> {stateLabel(st)}
                        </span>
                        {r.kind === 'titipan' && <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold bg-white/90 text-amber-700 border border-amber-200">{t.lapak.consigned}</span>}
                      </div>
                      <div className="p-3 flex flex-col gap-1 flex-1">
                        <p className="text-sm font-bold text-amber-950 leading-tight line-clamp-2">{r.name}</p>
                        {(r.weight || r.category) && <p className={`text-xs truncate ${MUTED}`}>{[r.category, r.weight].filter(Boolean).join(' · ')}</p>}
                        <div className="mt-auto pt-1 flex items-end justify-between gap-2">
                          <p className="text-sm font-extrabold text-amber-700">{rp(r.price)}</p>
                          <p className={`text-xs whitespace-nowrap ${MUTED}`}>{t.lapak.stock}: <strong style={{ color: sty.color }}>{r.stock}</strong></p>
                        </div>
                        {stallId === 'semua' && <p className={`text-xs flex items-center gap-1 truncate ${MUTED}`}><Store size={11} aria-hidden="true" /> {r.stallName}</p>}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail produk (hanya informasi) */}
      <AnimatePresence>
        {detail && (
          <motion.div key="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setDetail(null)}>
            <motion.div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="lapak-detail-title" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
              className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="relative w-full" style={{ aspectRatio: '4 / 3', background: 'linear-gradient(135deg, #B4530912, #B4530906)' }}>
                {detail.imageUrl
                  ? <Image src={detail.imageUrl} alt={detail.name} fill sizes="512px" className="object-contain" unoptimized />
                  : <div className="w-full h-full flex items-center justify-center text-7xl">{detail.emoji || '🛍️'}</div>}
                <button ref={closeBtnRef} onClick={() => setDetail(null)} aria-label={t.lapak.close} className="absolute top-3 right-3 w-11 h-11 rounded-full bg-white/90 shadow flex items-center justify-center text-amber-800"><X size={16} /></button>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h2 id="lapak-detail-title" className="font-display text-xl font-bold text-amber-950 leading-tight">{detail.name}</h2>
                  {detail.kind === 'titipan' && <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 flex-shrink-0">{t.lapak.consigned}</span>}
                </div>
                <p className="text-2xl font-extrabold text-amber-700">{rp(detail.price)}</p>
                {(() => { const st = stockState(detail); const sty = STOCK_STYLE[st]; const Icon = StateIcon(st); return (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold" style={{ background: sty.bg, border: `1px solid ${sty.border}`, color: sty.color }}>
                    <Icon size={12} /> {stateLabel(st)} · {t.lapak.stock} {detail.stock} {detail.unit}
                  </span>
                ); })()}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {detail.category && <div><p className={`text-xs uppercase tracking-wide ${MUTED} flex items-center gap-1`}><Tag size={10} /> {t.lapak.category}</p><p className="font-semibold text-amber-900">{detail.category}</p></div>}
                  {detail.weight && <div><p className={`text-xs uppercase tracking-wide ${MUTED} flex items-center gap-1`}><Weight size={10} /> {t.lapak.weight}</p><p className="font-semibold text-amber-900">{detail.weight}</p></div>}
                  <div className="col-span-2"><p className={`text-xs uppercase tracking-wide ${MUTED} flex items-center gap-1`}><Store size={10} /> {t.lapak.stall}</p>
                    <p className="font-semibold text-amber-900 flex items-center gap-2">
                      {detailStall?.logoUrl
                        ? <Image src={detailStall.logoUrl} alt="" width={24} height={24} unoptimized className="w-6 h-6 rounded-full object-cover" />
                        : null}
                      {detail.stallName}
                    </p>
                    {detailStall?.address && <p className={`text-xs mt-0.5 ${MUTED}`}>{detailStall.address}</p>}</div>
                </div>
                <div>
                  <p className={`text-xs uppercase tracking-wide ${MUTED} mb-1`}>{t.lapak.description}</p>
                  <p className="text-sm text-amber-900/80 whitespace-pre-line">{detail.description || t.lapak.noDescription}</p>
                </div>
                <p className="text-xs text-amber-800/50 flex items-start gap-1.5 pt-1"><Info size={13} className="mt-0.5 flex-shrink-0" /> {t.lapak.noOrder}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <BottomNav />
    </main>
  );
}
