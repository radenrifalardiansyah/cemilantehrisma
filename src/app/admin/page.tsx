'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  LogOut, RefreshCw, MessageCircle, Eye, Smartphone, Monitor,
  TrendingUp, BarChart2, Home, Receipt, ChevronRight, ChevronLeft,
  Plus, Minus, Send, CheckCircle2, ShoppingBag,
} from 'lucide-react';
import { products } from '@/lib/products';
import { formatCurrency, WHATSAPP_NUMBER } from '@/lib/whatsapp';

// ─── Analytics chart helpers ────────────────────────────────────────────────

const PAGE_LABELS: Record<string, string> = {
  '/':         'Beranda',
  '/products': 'Menu Produk',
  '/reseller': 'Reseller',
  '/panduan':  'Panduan',
  '/kontak':   'Kontak',
  '/checkout': 'Checkout',
};

function pageLabel(p: string) { return PAGE_LABELS[p] ?? p; }

type DailyRow = { date: string; views: number; visitors: number };

function MiniBarChart({ data }: { data: DailyRow[] }) {
  const maxVal = Math.max(...data.map(d => d.views), 1);
  const W = 36, GAP = 4, H = 64, LABEL_H = 14;
  const totalW = data.length * (W + GAP);
  return (
    <svg width="100%" viewBox={`0 0 ${totalW} ${H + LABEL_H}`} preserveAspectRatio="none">
      {data.map((d, i) => {
        const barH = Math.max((d.views / maxVal) * H, d.views > 0 ? 4 : 2);
        const x = i * (W + GAP);
        const label = d.date.slice(5);
        return (
          <g key={i}>
            <rect x={x} y={H - barH} width={W} height={barH} rx="4"
              fill={i === data.length - 1 ? '#D97706' : '#FDE68A'} />
            {d.views > 0 && (
              <text x={x + W / 2} y={H - barH - 3} textAnchor="middle" fontSize="8" fill="#92400E" fontWeight="600">
                {d.views}
              </text>
            )}
            <text x={x + W / 2} y={H + LABEL_H - 2} textAnchor="middle" fontSize="8" fill="#B45309">
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function DonutChart({ mobile, desktop }: { mobile: number; desktop: number }) {
  const total = mobile + desktop;
  if (total === 0) {
    return (
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="28" fill="none" stroke="#FDE68A" strokeWidth="12" />
        <text x="40" y="44" textAnchor="middle" fontSize="10" fill="#B45309">–</text>
      </svg>
    );
  }
  const r = 28, cx = 40, cy = 40;
  const circ = 2 * Math.PI * r;
  const mArc = (mobile / total) * circ;
  const mPct = Math.round((mobile / total) * 100);
  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#FDE68A" strokeWidth="12" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#D97706" strokeWidth="12"
        strokeDasharray={`${mArc} ${circ - mArc}`}
        transform={`rotate(-90 ${cx} ${cy})`}
        strokeLinecap="butt" />
      <text x={cx} y={cy - 3} textAnchor="middle" fontSize="11" fontWeight="700" fill="#92400E">{mPct}%</text>
      <text x={cx} y={cy + 9} textAnchor="middle" fontSize="7" fill="#B45309">mobile</text>
    </svg>
  );
}

// ─── Invoice helpers ─────────────────────────────────────────────────────────

type InvoiceItem = { productId: string; qty: number };

function formatInvoiceMessage(items: InvoiceItem[], customerName: string): string {
  const SEP = '─────────────────────';
  const lines = items
    .filter(i => i.qty > 0)
    .map((i, idx) => {
      const p = products.find(pr => pr.id === i.productId)!;
      return `${idx + 1}. *${p.name}*\n   ${i.qty} pcs × ${formatCurrency(p.price)} = *${formatCurrency(p.price * i.qty)}*`;
    })
    .join('\n\n');

  const totalQty = items.filter(i => i.qty > 0).reduce((s, i) => s + i.qty, 0);
  const totalPrice = items.filter(i => i.qty > 0).reduce((s, i) => {
    const p = products.find(pr => pr.id === i.productId)!;
    return s + p.price * i.qty;
  }, 0);

  const displayPhone = WHATSAPP_NUMBER.replace(/^62/, '0').replace(/(\d{4})(\d{4})(\d+)/, '$1-$2-$3');

  return `*INVOICE CEMILAN TEH RISMA* 🧾\n${SEP}\n\n*Kepada:* ${customerName}\n\n*Detail Pesanan:*\n\n${lines}\n\n${SEP}\nJumlah item : ${totalQty} pcs\n*Total      : ${formatCurrency(totalPrice)}*\n${SEP}\n\nTerima kasih sudah pesan di Cemilan Teh Risma! 🙏\nSilakan transfer sesuai total di atas.\n\n_Cemilan Teh Risma_\n_📞 ${displayPhone}_`.trim();
}

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('62')) return digits;
  if (digits.startsWith('0'))  return '62' + digits.slice(1);
  return '62' + digits;
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed,   setAuthed]   = useState(false);
  const [checking, setChecking] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [creds,    setCreds]    = useState('');
  const [loginErr, setLoginErr] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [stats,    setStats]    = useState<Record<string, unknown> | null>(null);
  const [statsErr, setStatsErr] = useState('');

  // Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'invoice'>('dashboard');

  // Invoice state
  const [invoiceStep, setInvoiceStep] = useState<1 | 2 | 3>(1);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>(
    () => products.map(p => ({ productId: p.id, qty: 0 }))
  );
  const [custName,  setCustName]  = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [sent,      setSent]      = useState(false);

  const invoiceTotal = invoiceItems.reduce((sum, i) => {
    if (i.qty === 0) return sum;
    const p = products.find(pr => pr.id === i.productId);
    return sum + (p?.price ?? 0) * i.qty;
  }, 0);

  const hasItems = invoiceItems.some(i => i.qty > 0);

  const updateQty = (productId: string, delta: number) => {
    setInvoiceItems(prev =>
      prev.map(i => i.productId === productId ? { ...i, qty: Math.max(0, i.qty + delta) } : i)
    );
  };

  const resetInvoice = () => {
    setInvoiceStep(1);
    setInvoiceItems(products.map(p => ({ productId: p.id, qty: 0 })));
    setCustName('');
    setCustPhone('');
    setSent(false);
  };

  const sendInvoice = () => {
    const phone = normalizePhone(custPhone);
    const msg   = formatInvoiceMessage(invoiceItems, custName);
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    setSent(true);
  };

  // Analytics
  const fetchStats = useCallback(async (authHeader?: string) => {
    setLoading(true);
    setStatsErr('');
    try {
      const token = authHeader ?? creds;
      const res = await fetch('/api/admin/stats', {
        headers: token ? { 'x-admin-auth': token } : {},
      });
      if (res.ok) {
        setStats(await res.json());
      } else if (res.status === 500) {
        setStatsErr('Gagal memuat data. Pastikan Firebase sudah dikonfigurasi.');
      } else {
        setStatsErr('Sesi habis. Silakan login ulang.');
      }
    } catch {
      setStatsErr('Gagal memuat data.');
    }
    setLoading(false);
  }, [creds]);

  useEffect(() => {
    fetch('/api/admin/stats').then(r => {
      if (r.ok) { setAuthed(true); r.json().then(setStats); }
      setChecking(false);
    }).catch(() => setChecking(false));
  }, []);

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginErr('');
    const res = await fetch('/api/admin/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ username, password }),
    });
    if (res.ok) {
      const authHeader = `${username}:${password}`;
      setCreds(authHeader);
      setAuthed(true);
      fetchStats(authHeader);
    } else {
      setLoginErr('Username atau password salah.');
    }
  };

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthed(false);
    setStats(null);
  };

  const sendWA = () => {
    const s         = stats as Record<string, Record<string, unknown> | unknown[] | null> | null;
    const total     = (s?.stats as Record<string, unknown>)?.visitors ?? '–';
    const pageViews = (s?.stats as Record<string, unknown>)?.pageViews ?? '–';
    const devArr    = (s?.devices as unknown[]) ?? [];
    const mobile    = (devArr.find((d: unknown) => (d as Record<string,string>).type === 'mobile')  as Record<string,number>|undefined)?.count ?? 0;
    const desktop   = (devArr.find((d: unknown) => (d as Record<string,string>).type === 'desktop') as Record<string,number>|undefined)?.count ?? 0;
    const topPages  = ((s?.paths as unknown[]) ?? []).slice(0, 3).map((p: unknown, i: number) => {
      const pg = p as Record<string, unknown>;
      return `${i + 1}. ${pageLabel(pg.path as string)} — ${pg.visitors}x`;
    }).join('\n');
    const date = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const msg =
      `*Rekap Cemilan Teh Risma*\n_${date}_\n\n` +
      `*Pengunjung:* ${total}\n*Halaman Dibuka:* ${pageViews}\n` +
      `*Mobile:* ${mobile}  |  *Desktop:* ${desktop}\n` +
      (topPages ? `\n*Terpopuler:*\n${topPages}\n` : '') +
      `\n_Dashboard Cemilan Teh Risma_`;
    window.open(`https://wa.me/6281212132014?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // ── Loading / Login screens ────────────────────────────────────────────────

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFFBF5' }}>
        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#FFFBF5' }}>
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-amber-100 p-8">
          <div className="flex flex-col items-center mb-6">
            <Image src="/icon-192.png" alt="Cemilan Teh Risma" width={64} height={64} className="rounded-2xl shadow mb-3" />
            <p className="font-bold text-amber-900 text-sm">Dashboard Admin</p>
            <p className="text-amber-600/60 text-xs">Cemilan Teh Risma</p>
          </div>
          <form onSubmit={login} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-amber-700 mb-1.5">Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-amber-200 text-sm text-amber-900 focus:outline-none focus:border-amber-400 bg-amber-50/50"
                placeholder="Username" autoComplete="username" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-amber-700 mb-1.5">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-amber-200 text-sm text-amber-900 focus:outline-none focus:border-amber-400 bg-amber-50/50"
                placeholder="Password" autoComplete="current-password" />
            </div>
            {loginErr && <p className="text-red-500 text-xs">{loginErr}</p>}
            <button type="submit"
              className="w-full py-3 rounded-xl text-sm font-bold text-white shadow transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#D97706,#EA580C)' }}>
              Masuk
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Analytics data ─────────────────────────────────────────────────────────

  const s          = stats as Record<string, Record<string, unknown> | unknown[] | null> | null;
  const total      = (s?.stats as Record<string, unknown>)?.visitors  as number | undefined;
  const views      = (s?.stats as Record<string, unknown>)?.pageViews as number | undefined;
  const devArr     = (s?.devices as unknown[]) ?? [];
  const mobile     = (devArr.find((d: unknown) => (d as Record<string,string>).type === 'mobile')  as Record<string,number>|undefined)?.count ?? 0;
  const desktop    = (devArr.find((d: unknown) => (d as Record<string,string>).type === 'desktop') as Record<string,number>|undefined)?.count ?? 0;
  const topPages   = (s?.paths  as unknown[]) ?? [];
  const dailyRaw   = (s?.daily  as unknown[]) ?? [];
  const daily      = dailyRaw as DailyRow[];
  const devTotal   = mobile + desktop;
  const mPct       = devTotal > 0 ? Math.round((mobile  / devTotal) * 100) : 0;
  const dPct       = devTotal > 0 ? Math.round((desktop / devTotal) * 100) : 0;
  const todayViews = daily.length > 0 ? daily[daily.length - 1].views : 0;

  // ── Invoice UI helpers ─────────────────────────────────────────────────────

  const categoryOrder: Array<{ key: Product['category']; label: string; emoji: string }> = [
    { key: 'mie',     label: 'Mie Kremes',    emoji: '🍝' },
    { key: 'keripik', label: 'Keripik Kimpul', emoji: '🥔' },
    { key: 'paket',   label: 'Paket Hemat',    emoji: '🎁' },
  ];

  type Product = (typeof products)[0];

  const selectedCount = invoiceItems.filter(i => i.qty > 0).length;

  // ── Invoice Step 1 – Pilih Produk ─────────────────────────────────────────

  const renderInvoiceStep1 = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-amber-900">Pilih Produk</p>
          <p className="text-xs text-amber-500/70">Tambah qty produk yang dipesan</p>
        </div>
        {hasItems && (
          <button onClick={() => setInvoiceItems(products.map(p => ({ productId: p.id, qty: 0 })))}
            className="text-xs text-red-400 hover:text-red-600 transition-colors">
            Reset
          </button>
        )}
      </div>

      {categoryOrder.map(({ key, label, emoji }) => {
        const catProducts = products.filter(p => p.category === key);
        return (
          <div key={key} className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 bg-amber-50/50 border-b border-amber-100 flex items-center gap-2">
              <span className="text-sm">{emoji}</span>
              <span className="text-xs font-bold text-amber-800">{label}</span>
            </div>
            <div className="divide-y divide-amber-50">
              {catProducts.map(p => {
                const item = invoiceItems.find(i => i.productId === p.id)!;
                return (
                  <div key={p.id} className="px-4 py-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-amber-900 truncate">{p.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-amber-600">{formatCurrency(p.price)}</p>
                        {p.weight && <span className="text-xs text-amber-400/60">· {p.weight}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => updateQty(p.id, -1)}
                        disabled={item.qty === 0}
                        className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center hover:bg-amber-200 transition-colors disabled:opacity-30">
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-amber-900">
                        {item.qty > 0 ? item.qty : <span className="text-amber-300">0</span>}
                      </span>
                      <button
                        onClick={() => updateQty(p.id, 1)}
                        className="w-7 h-7 rounded-full flex items-center justify-center transition-colors text-white"
                        style={{ background: item.qty > 0 ? 'linear-gradient(135deg,#D97706,#EA580C)' : '#FCD34D' }}>
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Bottom sticky bar */}
      <div className="sticky bottom-4">
        <button
          onClick={() => setInvoiceStep(2)}
          disabled={!hasItems}
          className="w-full flex items-center justify-between px-5 py-4 rounded-2xl text-white font-bold text-sm shadow-lg transition-opacity hover:opacity-90 disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg,#D97706,#EA580C)' }}>
          <span className="flex items-center gap-2">
            <ShoppingBag size={16} />
            {hasItems ? `${selectedCount} produk · ${formatCurrency(invoiceTotal)}` : 'Pilih produk dulu'}
          </span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );

  // ── Invoice Step 2 – Data Customer ────────────────────────────────────────

  const renderInvoiceStep2 = () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-bold text-amber-900">Data Customer</p>
        <p className="text-xs text-amber-500/70">Invoice akan dikirim ke nomor ini</p>
      </div>

      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-4 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-amber-700 mb-1.5">Nama Customer</label>
          <input
            type="text"
            value={custName}
            onChange={e => setCustName(e.target.value)}
            placeholder="cth: Ibu Sari"
            className="w-full px-3 py-2.5 rounded-xl border border-amber-200 text-sm text-amber-900 focus:outline-none focus:border-amber-400 bg-amber-50/50"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-amber-700 mb-1.5">Nomor WhatsApp Customer</label>
          <input
            type="tel"
            value={custPhone}
            onChange={e => setCustPhone(e.target.value)}
            placeholder="cth: 08123456789"
            className="w-full px-3 py-2.5 rounded-xl border border-amber-200 text-sm text-amber-900 focus:outline-none focus:border-amber-400 bg-amber-50/50"
          />
          <p className="text-xs text-amber-400/70 mt-1">Format 08xxx, 628xxx, atau 8xxx</p>
        </div>
      </div>

      {/* Ringkasan singkat */}
      <div className="bg-amber-50 rounded-xl border border-amber-100 p-3">
        <p className="text-xs font-semibold text-amber-700 mb-1">Ringkasan Pesanan</p>
        <div className="space-y-0.5">
          {invoiceItems.filter(i => i.qty > 0).map(i => {
            const p = products.find(pr => pr.id === i.productId)!;
            return (
              <div key={i.productId} className="flex justify-between text-xs text-amber-800">
                <span>{p.name} × {i.qty}</span>
                <span className="font-semibold">{formatCurrency(p.price * i.qty)}</span>
              </div>
            );
          })}
          <div className="flex justify-between text-xs font-bold text-amber-900 pt-1 border-t border-amber-200 mt-1">
            <span>Total</span>
            <span>{formatCurrency(invoiceTotal)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => setInvoiceStep(1)}
          className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 transition-colors">
          <ChevronLeft size={16} /> Kembali
        </button>
        <button
          onClick={() => setInvoiceStep(3)}
          disabled={!custName.trim() || !custPhone.trim()}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white shadow transition-opacity hover:opacity-90 disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg,#D97706,#EA580C)' }}>
          Lihat Preview <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );

  // ── Invoice Step 3 – Preview & Kirim ─────────────────────────────────────

  const renderInvoiceStep3 = () => {
    if (sent) {
      return (
        <div className="flex flex-col items-center py-10 gap-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 size={36} className="text-green-500" />
          </div>
          <div className="text-center">
            <p className="font-bold text-amber-900 text-base">Invoice Terkirim!</p>
            <p className="text-xs text-amber-500/70 mt-1">
              WhatsApp sudah terbuka ke nomor <br />
              <span className="font-semibold text-amber-700">{custPhone}</span> atas nama <span className="font-semibold text-amber-700">{custName}</span>
            </p>
          </div>
          <button onClick={resetInvoice}
            className="mt-2 px-6 py-3 rounded-xl text-sm font-bold text-white shadow"
            style={{ background: 'linear-gradient(135deg,#D97706,#EA580C)' }}>
            Buat Invoice Baru
          </button>
        </div>
      );
    }

    const selectedProducts = invoiceItems.filter(i => i.qty > 0).map(i => ({
      product: products.find(pr => pr.id === i.productId)!,
      qty: i.qty,
    }));

    return (
      <div className="space-y-4">
        <div>
          <p className="text-sm font-bold text-amber-900">Preview Invoice</p>
          <p className="text-xs text-amber-500/70">Pastikan sudah benar sebelum dikirim</p>
        </div>

        {/* Invoice card */}
        <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
          {/* Header kartu */}
          <div className="px-4 py-3 text-center" style={{ background: 'linear-gradient(135deg,#D97706,#EA580C)' }}>
            <p className="text-white font-bold text-sm">INVOICE CEMILAN TEH RISMA</p>
            <p className="text-white/70 text-xs">🧾</p>
          </div>

          <div className="px-4 py-3 border-b border-amber-100">
            <p className="text-xs text-amber-500/70 mb-0.5">Kepada</p>
            <p className="text-sm font-bold text-amber-900">{custName}</p>
            <p className="text-xs text-amber-600">{custPhone}</p>
          </div>

          <div className="px-4 py-3 space-y-2.5">
            {selectedProducts.map((item, i) => (
              <div key={item.product.id} className="flex items-start gap-2">
                <span className="text-xs text-amber-400 w-4 flex-shrink-0 pt-0.5">{i + 1}.</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-amber-900 leading-tight">{item.product.name}</p>
                  <p className="text-xs text-amber-500">
                    {item.qty} pcs × {formatCurrency(item.product.price)}
                  </p>
                </div>
                <span className="text-sm font-bold text-amber-800 flex-shrink-0">
                  {formatCurrency(item.product.price * item.qty)}
                </span>
              </div>
            ))}
          </div>

          <div className="mx-4 border-t border-dashed border-amber-200" />

          <div className="px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-amber-700">Total</span>
            <span className="text-base font-bold text-amber-900">{formatCurrency(invoiceTotal)}</span>
          </div>

          <div className="px-4 pb-4 pt-0">
            <p className="text-xs text-amber-500/70 text-center italic">
              Terima kasih sudah pesan di Cemilan Teh Risma! 🙏
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => setInvoiceStep(2)}
            className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 transition-colors">
            <ChevronLeft size={16} /> Edit
          </button>
          <button onClick={sendInvoice}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white shadow-lg transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#16A34A,#22C55E)' }}>
            <Send size={16} /> Kirim via WhatsApp
          </button>
        </div>

        <p className="text-center text-amber-400/60 text-xs">
          WA akan terbuka ke nomor {custPhone} — tap Send untuk kirim
        </p>
      </div>
    );
  };

  // ── Rendered page ──────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen pb-10" style={{ background: '#FFFBF5' }}>
      {/* Header */}
      <div className="border-b border-amber-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image src="/icon-192.png" alt="Cemilan Teh Risma" width={28} height={28} className="rounded-lg" />
            <span className="font-bold text-amber-900 text-sm">Dashboard Admin</span>
            <span className="text-amber-400/60 text-xs ml-0.5">· Cemilan Teh Risma</span>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" rel="noopener noreferrer"
              className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 hover:bg-amber-100 transition-colors">
              <Home size={15} />
            </a>
            <button onClick={() => fetchStats()} disabled={loading}
              className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 hover:bg-amber-100 transition-colors disabled:opacity-50">
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
            <button onClick={logout}
              className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 hover:bg-amber-100 transition-colors">
              <LogOut size={15} />
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="max-w-2xl mx-auto px-4 pb-3 flex gap-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'dashboard'
                ? 'text-white shadow'
                : 'text-amber-600 bg-amber-50 border border-amber-200 hover:bg-amber-100'
            }`}
            style={activeTab === 'dashboard' ? { background: 'linear-gradient(135deg,#D97706,#EA580C)' } : {}}>
            <BarChart2 size={13} /> Analitik
          </button>
          <button
            onClick={() => { setActiveTab('invoice'); resetInvoice(); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'invoice'
                ? 'text-white shadow'
                : 'text-amber-600 bg-amber-50 border border-amber-200 hover:bg-amber-100'
            }`}
            style={activeTab === 'invoice' ? { background: 'linear-gradient(135deg,#D97706,#EA580C)' } : {}}>
            <Receipt size={13} /> Kirim Invoice
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* ── Tab: Analitik ──────────────────────────────────────────── */}
        {activeTab === 'dashboard' && (
          <>
            {statsErr && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 text-sm">{statsErr}</div>
            )}

            <p className="text-amber-600/60 text-xs text-center">Data 30 hari terakhir</p>

            {/* Stats utama */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Eye size={14} className="text-amber-500" />
                  <span className="text-xs text-amber-600/70 font-semibold">Pengunjung Unik</span>
                </div>
                <p className="text-2xl font-bold text-amber-900">{total?.toLocaleString('id') ?? '–'}</p>
                <p className="text-xs text-amber-400/70 mt-0.5">sesi berbeda</p>
              </div>
              <div className="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp size={14} className="text-amber-500" />
                  <span className="text-xs text-amber-600/70 font-semibold">Halaman Dibuka</span>
                </div>
                <p className="text-2xl font-bold text-amber-900">{views?.toLocaleString('id') ?? '–'}</p>
                <p className="text-xs text-amber-400/70 mt-0.5">total pageview</p>
              </div>
            </div>

            {/* Chart tren harian */}
            {daily.length > 0 && (
              <div className="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <BarChart2 size={14} className="text-amber-500" />
                    <span className="text-sm font-bold text-amber-900">Tren 7 Hari Terakhir</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-amber-600/60">
                    <span>Hari ini: <strong className="text-amber-800">{todayViews}</strong></span>
                  </div>
                </div>
                <MiniBarChart data={daily} />
                <p className="text-xs text-amber-400/60 text-center mt-2">pageview per hari</p>
              </div>
            )}

            {/* Device breakdown */}
            <div className="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Smartphone size={14} className="text-amber-500" />
                <span className="text-sm font-bold text-amber-900">Perangkat Pengunjung</span>
              </div>
              <div className="flex items-center gap-5">
                <DonutChart mobile={mobile} desktop={desktop} />
                <div className="flex-1 space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                        <span className="text-xs font-semibold text-amber-800 flex items-center gap-1">
                          <Smartphone size={11} /> Mobile
                        </span>
                      </div>
                      <span className="text-xs font-bold text-amber-900">{mobile} <span className="text-amber-500 font-normal">({mPct}%)</span></span>
                    </div>
                    <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${mPct}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-sm bg-amber-200" />
                        <span className="text-xs font-semibold text-amber-800 flex items-center gap-1">
                          <Monitor size={11} /> Desktop
                        </span>
                      </div>
                      <span className="text-xs font-bold text-amber-900">{desktop} <span className="text-amber-500 font-normal">({dPct}%)</span></span>
                    </div>
                    <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-200 rounded-full transition-all" style={{ width: `${dPct}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top pages */}
            {topPages.length > 0 && (
              <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-amber-50 flex items-center gap-2">
                  <span className="text-sm">🔥</span>
                  <p className="text-sm font-bold text-amber-900">Halaman Terpopuler</p>
                </div>
                {topPages.slice(0, 5).map((p: unknown, i: number) => {
                  const pg  = p as Record<string, unknown>;
                  const cnt = pg.visitors as number;
                  const maxCnt = (topPages[0] as Record<string,unknown>).visitors as number;
                  const pct = maxCnt > 0 ? Math.round((cnt / maxCnt) * 100) : 0;
                  return (
                    <div key={i} className="px-4 py-3 flex items-center justify-between border-b border-amber-50 last:border-0">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-xs font-bold text-amber-400 w-4 flex-shrink-0">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-amber-800 truncate">{pageLabel(pg.path as string)}</p>
                          <div className="h-1 bg-amber-100 rounded-full mt-1 overflow-hidden">
                            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-amber-700 ml-3 flex-shrink-0">{cnt.toLocaleString('id')}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Avg pages per visitor */}
            {(total ?? 0) > 0 && (views ?? 0) > 0 && (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm text-center">
                  <p className="text-xs text-amber-600/70 font-semibold mb-1">Halaman / Pengunjung</p>
                  <p className="text-2xl font-bold text-amber-900">{((views ?? 0) / (total ?? 1)).toFixed(1)}</p>
                  <p className="text-xs text-amber-400/70">rata-rata</p>
                </div>
                <div className="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm text-center">
                  <p className="text-xs text-amber-600/70 font-semibold mb-1">Hari Ini</p>
                  <p className="text-2xl font-bold text-amber-900">{todayViews}</p>
                  <p className="text-xs text-amber-400/70">pageview</p>
                </div>
              </div>
            )}

            {/* WA button */}
            <button onClick={sendWA}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-white font-bold text-sm shadow-lg transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#16A34A,#22C55E)' }}>
              <MessageCircle size={18} />
              Kirim Rekap ke WhatsApp
            </button>

            <p className="text-center text-amber-400/60 text-xs">
              Data akan terbuka di WhatsApp — tap Send untuk kirim ke nomor sendiri
            </p>
          </>
        )}

        {/* ── Tab: Kirim Invoice ─────────────────────────────────────── */}
        {activeTab === 'invoice' && (
          <>
            {/* Step indicator */}
            {!sent && (
              <div className="flex items-center justify-center gap-2 py-1">
                {([1, 2, 3] as const).map(step => (
                  <div key={step} className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      invoiceStep === step
                        ? 'text-white'
                        : invoiceStep > step
                          ? 'bg-amber-200 text-amber-700'
                          : 'bg-amber-100 text-amber-400'
                    }`}
                    style={invoiceStep === step ? { background: 'linear-gradient(135deg,#D97706,#EA580C)' } : {}}>
                      {invoiceStep > step ? <CheckCircle2 size={14} /> : step}
                    </div>
                    {step < 3 && (
                      <div className={`w-8 h-0.5 rounded-full ${invoiceStep > step ? 'bg-amber-400' : 'bg-amber-100'}`} />
                    )}
                  </div>
                ))}
              </div>
            )}
            {!sent && (
              <p className="text-center text-xs text-amber-500/70 -mt-1">
                {invoiceStep === 1 && 'Pilih produk'}
                {invoiceStep === 2 && 'Data customer'}
                {invoiceStep === 3 && 'Preview & kirim'}
              </p>
            )}

            {invoiceStep === 1 && renderInvoiceStep1()}
            {invoiceStep === 2 && renderInvoiceStep2()}
            {invoiceStep === 3 && renderInvoiceStep3()}
          </>
        )}

        {/* Credit */}
        <p className="text-amber-400/50 text-xs text-center pt-2 border-t border-amber-100">
          Dikembangkan oleh{' '}
          <a href="https://eleven-digital.id/" target="_blank" rel="noopener noreferrer"
            className="text-amber-500 hover:text-amber-700 transition-colors">
            PT. Eleven Digital Indonesia
          </a>
          {' · '}didukung oleh <span className="text-amber-500">PT. RMedia Production</span>
        </p>

      </div>
    </div>
  );
}
