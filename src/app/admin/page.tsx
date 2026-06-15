'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { LogOut, RefreshCw, MessageCircle, Eye, Smartphone, Monitor, TrendingUp, BarChart2 } from 'lucide-react';

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
        const label = d.date.slice(5); // MM-DD
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
    const s        = stats as Record<string, Record<string, unknown> | unknown[] | null> | null;
    const total    = (s?.stats as Record<string, unknown>)?.visitors ?? '–';
    const pageViews= (s?.stats as Record<string, unknown>)?.pageViews ?? '–';
    const devArr   = (s?.devices as unknown[]) ?? [];
    const mobile   = (devArr.find((d: unknown) => (d as Record<string,string>).type === 'mobile')  as Record<string,number>|undefined)?.count ?? 0;
    const desktop  = (devArr.find((d: unknown) => (d as Record<string,string>).type === 'desktop') as Record<string,number>|undefined)?.count ?? 0;
    const topPages = ((s?.paths as unknown[]) ?? []).slice(0, 3).map((p: unknown) => {
      const pg = p as Record<string, unknown>;
      return `• ${pageLabel(pg.path as string)}: ${pg.visitors} pengunjung`;
    }).join('\n');
    const date = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const msg =
      `📊 *Rekap Cemilan Teh Risma*\n📅 ${date}\n\n` +
      `👥 Total Pengunjung: ${total}\n📄 Total Halaman Dibuka: ${pageViews}\n` +
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

  const s         = stats as Record<string, Record<string, unknown> | unknown[] | null> | null;
  const total     = (s?.stats as Record<string, unknown>)?.visitors  as number | undefined;
  const views     = (s?.stats as Record<string, unknown>)?.pageViews as number | undefined;
  const devArr    = (s?.devices as unknown[]) ?? [];
  const mobile    = (devArr.find((d: unknown) => (d as Record<string,string>).type === 'mobile')  as Record<string,number>|undefined)?.count ?? 0;
  const desktop   = (devArr.find((d: unknown) => (d as Record<string,string>).type === 'desktop') as Record<string,number>|undefined)?.count ?? 0;
  const topPages  = (s?.paths  as unknown[]) ?? [];
  const dailyRaw  = (s?.daily  as unknown[]) ?? [];
  const daily     = dailyRaw as DailyRow[];
  const devTotal  = mobile + desktop;
  const mPct      = devTotal > 0 ? Math.round((mobile  / devTotal) * 100) : 0;
  const dPct      = devTotal > 0 ? Math.round((desktop / devTotal) * 100) : 0;
  const todayViews = daily.length > 0 ? daily[daily.length - 1].views : 0;

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

        {/* Footer */}
        <div className="border-t border-amber-100 pt-5 flex flex-col items-center gap-3">
          <a
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-amber-200 text-amber-700 text-sm font-semibold hover:bg-amber-50 transition-colors shadow-sm"
          >
            <span>🏪</span>
            Lihat Halaman Utama
          </a>
          <p className="text-amber-400/50 text-xs text-center">
            © {new Date().getFullYear()} Cemilan Teh Risma · Dibuat oleh{' '}
            <a href="https://rmediasolutions.id" target="_blank" rel="noopener noreferrer"
              className="text-amber-500 hover:text-amber-700 transition-colors">
              RMedia Solutions
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}
