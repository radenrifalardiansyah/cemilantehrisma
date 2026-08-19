'use client';

import { Suspense, useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Phone, Lock, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import GoogleSignInButton from '@/components/GoogleSignInButton';
import { useAuth } from '@/contexts/AuthContext';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const nextUrl = params.get('next') || '/products';
  const { refresh } = useAuth();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !password) {
      toast.error('Nomor HP & password wajib diisi.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });
      if (!res.ok) {
        toast.error('Nomor HP atau password salah.');
        return;
      }
      await refresh();
      toast.success('Berhasil masuk!');
      router.replace(nextUrl);
    } catch {
      toast.error('Gagal masuk, coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen" style={{ background: '#FFFBF5' }}>
      <Navbar />
      <div className="max-w-md mx-auto px-4 pt-28 sm:pt-32 pb-20">
        <h1 className="font-display text-3xl font-bold text-amber-950 mb-1">Masuk</h1>
        <p className="text-amber-800/55 text-sm mb-8">Masuk ke akun untuk melanjutkan checkout.</p>

        <form onSubmit={submit} className="bg-white rounded-2xl border border-amber-100 p-6 space-y-4 shadow-sm">
          <div>
            <label className="text-amber-700/60 text-xs font-semibold uppercase tracking-wider mb-1.5 block">No. HP</label>
            <div className="relative">
              <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500/60" />
              <input
                type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="08xxxxxxxxxx" autoComplete="tel"
                className="w-full pl-10 pr-4 py-3 rounded-xl input-field text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-amber-700/60 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500/60" />
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" autoComplete="current-password"
                className="w-full pl-10 pr-4 py-3 rounded-xl input-field text-sm"
              />
            </div>
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full btn-primary py-3.5 font-bold flex items-center justify-center gap-2 shadow-md disabled:opacity-50 text-sm"
          >
            <LogIn size={15} /> {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-amber-200/60" />
          <span className="text-amber-700/40 text-xs font-medium">atau</span>
          <div className="flex-1 h-px bg-amber-200/60" />
        </div>

        <GoogleSignInButton nextUrl={nextUrl} />

        <p className="text-center text-amber-800/60 text-sm mt-5">
          Belum punya akun?{' '}
          <Link
            href={`/register${nextUrl !== '/products' ? `?next=${encodeURIComponent(nextUrl)}` : ''}`}
            className="text-amber-700 font-semibold underline"
          >
            Daftar
          </Link>
        </p>
      </div>
      <div className="hidden sm:block"><Footer /></div>
      <BottomNav />
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
