'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, LogOut, Pencil, Check, X as XIcon, Clock, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/contexts/AuthContext';

interface Order { status: string }

const STATUS_LABEL: Record<string, string> = {
  baru: 'Baru', diproses: 'Diproses', selesai: 'Selesai', dibatalkan: 'Dibatalkan',
};
const STATUSES = ['baru', 'diproses', 'selesai', 'dibatalkan'];

export default function AkunPage() {
  const router = useRouter();
  const { customer: account, loading: authLoading, refresh, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (!authLoading && !account && !loggingOut) router.replace('/login?next=%2Fakun');
  }, [authLoading, account, loggingOut, router]);

  useEffect(() => {
    if (!account) return;
    fetch('/api/orders/mine')
      .then(r => r.ok ? r.json() : null)
      .then(d => setOrders(d?.orders ?? []))
      .catch(() => setOrders([]));
  }, [account]);

  if (authLoading || !account) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: '#FFFFFF' }}>
        <p className="text-green-700/60 text-sm">Memuat...</p>
      </main>
    );
  }

  const startEdit = () => {
    setNameInput(account.name);
    setEditingName(true);
  };

  const saveName = async () => {
    const trimmed = nameInput.trim();
    if (!trimmed) { toast.error('Nama tidak boleh kosong.'); return; }
    setSavingName(true);
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      });
      if (!res.ok) { toast.error('Gagal menyimpan nama.'); return; }
      await refresh();
      toast.success('Nama berhasil diperbarui.');
      setEditingName(false);
    } catch {
      toast.error('Gagal menyimpan nama.');
    } finally {
      setSavingName(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    toast.success('Berhasil keluar.');
    router.replace('/');
  };

  const statusCounts = STATUSES.map(status => ({
    status,
    label: STATUS_LABEL[status],
    count: orders?.filter(o => o.status === status).length ?? 0,
  }));

  const initial = account.name.trim().charAt(0).toUpperCase() || '?';
  const memberSince = account.createdAt
    ? new Date(account.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <main className="min-h-screen" style={{ background: '#FFFFFF' }}>
      <Navbar />
      <div className="max-w-md mx-auto px-4 pt-28 sm:pt-32 pb-40 md:pb-20">
        <h1 className="font-display text-3xl font-bold mb-1">
          <span className="text-green-950">Akun </span>
          <span className="gradient-text">Saya</span>
        </h1>
        <p className="text-green-800/55 text-sm mb-8">Kelola profil & pantau pesanan Anda.</p>

        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-green-100 p-6 shadow-sm mb-4">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-display font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #16A34A, #D4AF37)' }}
            >
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    maxLength={60}
                    className="min-w-0 flex-1 px-3 py-1.5 rounded-lg input-field text-sm"
                  />
                  <button onClick={saveName} disabled={savingName} className="p-1.5 rounded-lg bg-green-100 text-green-700 disabled:opacity-50">
                    <Check size={16} />
                  </button>
                  <button onClick={() => setEditingName(false)} className="p-1.5 rounded-lg bg-green-50 text-green-500">
                    <XIcon size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="font-display font-bold text-green-950 text-lg truncate">{account.name || 'Tanpa nama'}</p>
                  <button onClick={startEdit} className="text-green-400 hover:text-green-600 flex-shrink-0">
                    <Pencil size={14} />
                  </button>
                </div>
              )}
              <p className="text-green-700/60 text-sm mt-0.5">+{account.phone}</p>
              {memberSince && (
                <p className="text-green-700/40 text-xs flex items-center gap-1 mt-1">
                  <Clock size={11} /> Member sejak {memberSince}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Status pesanan */}
        <div className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-green-950 text-sm">Status Pesanan</h2>
            <Link href="/pesanan" className="text-green-600 text-xs font-semibold flex items-center gap-0.5">
              Lihat semua <ChevronRight size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {statusCounts.map(s => (
              <Link
                key={s.status}
                href="/pesanan"
                className="flex flex-col items-center gap-1.5 py-2 rounded-xl hover:bg-green-50 transition-colors"
              >
                <span className="relative">
                  <Package size={22} className="text-green-700/60" />
                  {s.count > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
                      {s.count > 9 ? '9+' : s.count}
                    </span>
                  )}
                </span>
                <span className="text-[11px] text-green-700/60 font-medium text-center">{s.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Menu */}
        <div className="bg-white rounded-2xl border border-green-100 overflow-hidden shadow-sm divide-y divide-green-50 mb-4">
          <Link href="/pesanan" className="flex items-center gap-3 px-5 py-4 hover:bg-green-50/60 transition-colors">
            <Package size={18} className="text-green-600" />
            <span className="flex-1 text-sm font-medium text-green-900">Pesanan Saya</span>
            <ChevronRight size={16} className="text-green-300" />
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-green-50/60 transition-colors text-left">
            <LogOut size={18} className="text-red-500" />
            <span className="flex-1 text-sm font-medium text-red-600">Keluar</span>
          </button>
        </div>
      </div>
      <div className="hidden sm:block"><Footer /></div>
      <BottomNav />
    </main>
  );
}
