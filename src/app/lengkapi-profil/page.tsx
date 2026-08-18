'use client';

import { Suspense, useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Phone, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

function CompleteProfileForm() {
  const router = useRouter();
  const params = useSearchParams();
  const nextUrl = params.get('next') || '/products';
  const name = params.get('name') || '';
  const { refresh } = useAuth();

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast.error('Nomor HP wajib diisi.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/google-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      if (res.status === 401) {
        toast.error('Sesi Google sudah kedaluwarsa, silakan masuk lagi.');
        router.replace('/login');
        return;
      }
      if (!res.ok) {
        toast.error('Nomor HP tidak valid.');
        return;
      }
      await refresh();
      toast.success('Akun berhasil dilengkapi!');
      router.replace(nextUrl);
    } catch {
      toast.error('Gagal menyimpan nomor HP, coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen" style={{ background: '#FFFBF5' }}>
      <Navbar />
      <div className="max-w-md mx-auto px-4 pt-28 sm:pt-32 pb-20">
        <h1 className="font-display text-3xl font-bold text-amber-950 mb-1">Satu Langkah Lagi</h1>
        <p className="text-amber-800/55 text-sm mb-8">
          {name ? `Halo, ${name}! ` : ''}Kami perlu nomor HP Anda untuk konfirmasi pesanan.
        </p>

        <form onSubmit={submit} className="bg-white rounded-2xl border border-amber-100 p-6 space-y-4 shadow-sm">
          <div>
            <label className="text-amber-700/60 text-xs font-semibold uppercase tracking-wider mb-1.5 block">No. HP</label>
            <div className="relative">
              <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500/60" />
              <input
                type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="08xxxxxxxxxx" autoComplete="tel" autoFocus
                className="w-full pl-10 pr-4 py-3 rounded-xl input-field text-sm"
              />
            </div>
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full btn-primary py-3.5 font-bold flex items-center justify-center gap-2 shadow-md disabled:opacity-50 text-sm"
          >
            <UserCheck size={15} /> {loading ? 'Memproses...' : 'Lanjutkan'}
          </button>
        </form>
      </div>
      <Footer />
    </main>
  );
}

export default function CompleteProfilePage() {
  return (
    <Suspense fallback={null}>
      <CompleteProfileForm />
    </Suspense>
  );
}
