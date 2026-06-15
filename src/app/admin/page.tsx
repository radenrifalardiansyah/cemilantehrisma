'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { LogOut, RefreshCw, MessageCircle, BarChart2, Eye, Smartphone, Monitor, TrendingUp } from 'lucide-react';

const PAGE_LABELS: Record<string, string> = {
  '/':         'Beranda',
  '/products': 'Menu Produk',
  '/reseller': 'Reseller',
  '/panduan':  'Panduan',
  '/kontak':   'Kontak',
  '/checkout': 'Checkout',
};

function pageLabel(p: string) {
  return PAGE_LABELS[p] ?? p;
}

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
        setStatsErr('Gagal memuat data. Pastikan VERCEL_TOKEN sudah diset.');
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

  const login = async (e: React.FormEvent) => {
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
    const s     = stats as Record<string, Record<string, unknown> | unknown[] | null> | null;
    const total = (s?.stats as Record<string, unknown>)?.visitors ?? '–';
    const pageViews = (s?.stats as Record<string, unknown>)?.pageViews ?? '–';

    const devArr  = (s?.devices as unknown[]) ?? [];
    const mobile  = (devArr.find((d: unknown) => (d as Record<string,string>).type === 'mobile') as Record<string, number> | undefined)?.count ?? 0;
    const desktop = (devArr.find((d: unknown) => (d as Record<string,string>).type === 'desktop') as Record<string, number> | undefined)?.count ?? 0;

    const topPages = ((s?.paths as unknown[]) ?? []).slice(0, 3).map((p: unknown) => {
      const pg = p as Record<string, unknown>;
      return `• ${pageLabel(pg.path as string)}: ${pg.visitors} pengunjung`;
    }).join('\n');

    const date = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const msg =
      `📊 *Rekap Cemilan Teh Risma*\n` +
      `📅 ${date}\n\n` +
      `👥 Total Pengunjung: ${total}\n` +
      `📄 Total Halaman Dibuka: ${pageViews}\n` +
      `📱 Mobile: ${mobile}  💻 Desktop: ${desktop}\n\n` +
      (topPages ? `🔥 *Halaman Terpopuler:*\n${topPages}\n\n` : '') +
      `_Dikirim dari Dashboard Cemilan Teh Risma_`;

    window.open(`https://wa.me/6281212132014?text=${encodeURIComponent(msg)}`, '_blank');
  };

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
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-amber-200 text-sm text-amber-900 focus:outline-none focus:border-amber-400 bg-amber-50/50"
                placeholder="Username"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-amber-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-amber-200 text-sm text-amber-900 focus:outline-none focus:border-amber-400 bg-amber-50/50"
                placeholder="Password"
                autoComplete="current-password"
              />
            </div>
            {loginErr && <p className="text-red-500 text-xs">{loginErr}</p>}
            <button
              type="submit"
              className="w-full py-3 rounded-xl text-sm font-bold text-white shadow transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#D97706,#EA580C)' }}
            >
              Masuk
            </button>
          </form>
        </div>
      </div>
    );
  }

  const s        = stats as Record<string, Record<string, unknown> | unknown[] | null> | null;
  const total    = (s?.stats as Record<string, unknown>)?.visitors      as number | undefined;
  const views    = (s?.stats as Record<string, unknown>)?.pageViews     as number | undefined;
  const bounce   = (s?.stats as Record<string, unknown>)?.bounceRate    as number | undefined;
  const devArr   = (s?.devices as unknown[]) ?? [];
  const mobile   = (devArr.find((d: unknown) => (d as Record<string,string>).type === 'mobile')  as Record<string, number> | undefined)?.count ?? 0;
  const desktop  = (devArr.find((d: unknown) => (d as Record<string,string>).type === 'desktop') as Record<string, number> | undefined)?.count ?? 0;
  const topPages = (s?.paths as unknown[]) ?? [];
  const mobilePercent  = total ? Math.round((mobile  / (mobile + desktop)) * 100) : 0;

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
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {statsErr && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 text-sm">
            {statsErr}
          </div>
        )}

        {/* Period note */}
        <p className="text-amber-600/60 text-xs text-center">Data 30 hari terakhir</p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Eye size={14} className="text-amber-500" />
              <span className="text-xs text-amber-600/70 font-semibold">Pengunjung</span>
            </div>
            <p className="text-2xl font-bold text-amber-900">{total?.toLocaleString('id') ?? '–'}</p>
          </div>
          <div className="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={14} className="text-amber-500" />
              <span className="text-xs text-amber-600/70 font-semibold">Halaman Dibuka</span>
            </div>
            <p className="text-2xl font-bold text-amber-900">{views?.toLocaleString('id') ?? '–'}</p>
          </div>
          <div className="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Smartphone size={14} className="text-amber-500" />
              <span className="text-xs text-amber-600/70 font-semibold">Mobile</span>
            </div>
            <p className="text-2xl font-bold text-amber-900">{mobile.toLocaleString('id')}</p>
            <p className="text-xs text-amber-500 mt-0.5">{mobilePercent}% dari total</p>
          </div>
          <div className="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Monitor size={14} className="text-amber-500" />
              <span className="text-xs text-amber-600/70 font-semibold">Desktop</span>
            </div>
            <p className="text-2xl font-bold text-amber-900">{desktop.toLocaleString('id')}</p>
            <p className="text-xs text-amber-500 mt-0.5">{100 - mobilePercent}% dari total</p>
          </div>
        </div>

        {/* Bounce rate */}
        {bounce !== undefined && (
          <div className="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm flex items-center justify-between">
            <span className="text-sm text-amber-700 font-semibold">Bounce Rate</span>
            <span className="text-amber-900 font-bold">{(bounce * 100).toFixed(1)}%</span>
          </div>
        )}

        {/* Top pages */}
        {topPages.length > 0 && (
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-amber-50">
              <p className="text-sm font-bold text-amber-900">🔥 Halaman Terpopuler</p>
            </div>
            {topPages.slice(0, 5).map((p: unknown, i: number) => {
              const pg = p as Record<string, unknown>;
              const pct = total ? Math.round(((pg.visitors as number) / total) * 100) : 0;
              return (
                <div key={i} className="px-4 py-3 flex items-center justify-between border-b border-amber-50 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-400 w-4">{i + 1}</span>
                    <span className="text-sm text-amber-800">{pageLabel(pg.path as string)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-amber-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-bold text-amber-700 w-8 text-right">{(pg.visitors as number).toLocaleString('id')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Send to WA */}
        <button
          onClick={sendWA}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-white font-bold text-sm shadow-lg transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#16A34A,#22C55E)' }}
        >
          <MessageCircle size={18} />
          Kirim Rekap ke WhatsApp
        </button>

        <p className="text-center text-amber-400/60 text-xs">
          Data akan terbuka di WhatsApp — tap Send untuk kirim ke nomor sendiri
        </p>

      </div>
    </div>
  );
}
