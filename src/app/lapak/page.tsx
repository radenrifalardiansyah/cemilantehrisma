'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MapPin, Store, CheckCircle, XCircle, AlertTriangle, Info, Tag, Weight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import { useLanguage } from '@/contexts/LanguageContext';
import { trackClick } from '@/lib/trackClick';
import type { LapakProduct, LapakStall } from '@/app/api/lapak/route';

// Menu "Lapak": hanya MELIHAT produk & stok per lapak (tanpa keranjang/checkout). Pembelian dilakukan langsung di lapak.
const LOW_STOCK = 3;
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

  useEffect(() => {
    let alive = true;
    fetch('/api/lapak')
      .then(r => r.ok ? r.json() as Promise<{ stalls: LapakStall[]; updatedAt: string }> : { stalls: [], updatedAt: '' })
      .then(d => { if (alive) { setStalls(d.stalls); setUpdatedAt(d.updatedAt); } })
      .catch(() => { if (alive) setStalls([]); });
    return () => { alive = false; };
  }, []);

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

        {stalls === null ? (
          <p className="text-center py-24 text-amber-800/50 text-sm">{t.lapak.loading}</p>
        ) : stalls.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-4">🏪</div>
            <p className="text-amber-900/50 font-semibold">{t.lapak.noStalls}</p>
          </div>
        ) : (
          <>
            {/* Pilihan lapak */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
              {[{ id: 'semua', name: t.lapak.allStalls, count: rows.length }, ...stalls.map(s => ({ id: s.id, name: s.name, count: s.products.length }))].map(s => (
                <button key={s.id} onClick={() => { trackClick('category', `lapak:${s.id}`); setStallId(s.id); setCategory('semua'); }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${stallId === s.id ? 'text-white shadow-md' : 'bg-white border border-amber-200 text-amber-700/70 hover:border-amber-300 hover:text-amber-800'}`}
                  style={stallId === s.id ? { background: 'linear-gradient(135deg, #D97706, #F59E0B)' } : {}}>
                  <Store size={14} />
                  <span>{s.name}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-xs ${stallId === s.id ? 'bg-white/25 text-white' : 'bg-amber-100 text-amber-600'}`}>{s.count}</span>
                </button>
              ))}
            </div>
            {activeStall?.address && (
              <p className="flex items-center gap-1.5 text-sm text-amber-800/60 mb-4"><MapPin size={14} className="text-amber-500" /> {activeStall.address}</p>
            )}

            {/* Cari + filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500/60" />
                <input type="text" placeholder={t.lapak.search} value={query} onChange={e => setQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl input-field text-sm placeholder:text-amber-700/30" />
                {query && <button onClick={() => setQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-amber-500/60 hover:text-amber-700"><X size={14} /></button>}
              </div>
              <label className="flex items-center gap-2 text-sm text-amber-800/70 px-1 select-none cursor-pointer">
                <input type="checkbox" checked={onlyAvailable} onChange={e => setOnlyAvailable(e.target.checked)} className="accent-amber-600" />
                {t.lapak.onlyAvailable}
              </label>
            </div>
            {categories.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
                {['semua', ...categories.map(c => c[0])].map(c => (
                  <button key={c} onClick={() => setCategory(c)}
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
                    <button key={`${r.stallId}-${r.id}`} onClick={() => setDetail(r)}
                      className="text-left bg-white rounded-2xl border border-amber-100 overflow-hidden flex flex-col hover:shadow-lg hover:shadow-amber-200/60 hover:border-amber-200 transition-all"
                      style={{ opacity: st === 'out' ? 0.65 : 1 }}>
                      <div className="relative w-full" style={{ aspectRatio: '1 / 1', background: 'linear-gradient(135deg, #B4530912, #B4530906)' }}>
                        {r.imageUrl
                          ? <Image src={r.imageUrl} alt={r.name} fill sizes="(max-width: 640px) 50vw, 20vw" className="object-contain" unoptimized />
                          : <div className="w-full h-full flex items-center justify-center text-5xl">{r.emoji || '🛍️'}</div>}
                        <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold"
                          style={{ background: sty.bg, border: `1px solid ${sty.border}`, color: sty.color, backdropFilter: 'blur(4px)' }}>
                          <Icon size={10} /> {stateLabel(st)}
                        </span>
                        {r.kind === 'titipan' && <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-amber-700 border border-amber-200">{t.lapak.consigned}</span>}
                      </div>
                      <div className="p-3 flex flex-col gap-1 flex-1">
                        <p className="text-sm font-bold text-amber-950 leading-tight line-clamp-2">{r.name}</p>
                        {(r.weight || r.category) && <p className="text-[11px] text-amber-800/50 truncate">{[r.category, r.weight].filter(Boolean).join(' · ')}</p>}
                        <div className="mt-auto pt-1 flex items-end justify-between gap-2">
                          <p className="text-sm font-extrabold text-amber-700">{rp(r.price)}</p>
                          <p className="text-[11px] text-amber-800/60 whitespace-nowrap">{t.lapak.stock}: <strong style={{ color: sty.color }}>{r.stock}</strong></p>
                        </div>
                        {stallId === 'semua' && <p className="text-[10px] text-amber-800/45 flex items-center gap-1 truncate"><Store size={9} /> {r.stallName}</p>}
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
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
              className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="relative w-full" style={{ aspectRatio: '4 / 3', background: 'linear-gradient(135deg, #B4530912, #B4530906)' }}>
                {detail.imageUrl
                  ? <Image src={detail.imageUrl} alt={detail.name} fill sizes="512px" className="object-contain" unoptimized />
                  : <div className="w-full h-full flex items-center justify-center text-7xl">{detail.emoji || '🛍️'}</div>}
                <button onClick={() => setDetail(null)} aria-label={t.lapak.close} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center text-amber-800"><X size={16} /></button>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-display text-xl font-bold text-amber-950 leading-tight">{detail.name}</h2>
                  {detail.kind === 'titipan' && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 flex-shrink-0">{t.lapak.consigned}</span>}
                </div>
                <p className="text-2xl font-extrabold text-amber-700">{rp(detail.price)}</p>
                {(() => { const st = stockState(detail); const sty = STOCK_STYLE[st]; const Icon = StateIcon(st); return (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold" style={{ background: sty.bg, border: `1px solid ${sty.border}`, color: sty.color }}>
                    <Icon size={12} /> {stateLabel(st)} · {t.lapak.stock} {detail.stock} {detail.unit}
                  </span>
                ); })()}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {detail.category && <div><p className="text-[11px] uppercase tracking-wide text-amber-800/45 flex items-center gap-1"><Tag size={10} /> {t.lapak.category}</p><p className="font-semibold text-amber-900">{detail.category}</p></div>}
                  {detail.weight && <div><p className="text-[11px] uppercase tracking-wide text-amber-800/45 flex items-center gap-1"><Weight size={10} /> {t.lapak.weight}</p><p className="font-semibold text-amber-900">{detail.weight}</p></div>}
                  <div className="col-span-2"><p className="text-[11px] uppercase tracking-wide text-amber-800/45 flex items-center gap-1"><Store size={10} /> {t.lapak.stall}</p><p className="font-semibold text-amber-900">{detail.stallName}</p>
                    {stalls?.find(s => s.id === detail.stallId)?.address && <p className="text-xs text-amber-800/60 mt-0.5">{stalls?.find(s => s.id === detail.stallId)?.address}</p>}</div>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-amber-800/45 mb-1">{t.lapak.description}</p>
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
