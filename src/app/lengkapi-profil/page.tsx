'use client';

import { Suspense, useRef, useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Phone, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import Field from '@/components/Field';
import { useAuth } from '@/contexts/AuthContext';

function FormSkeleton() {
  return (
    <main className="min-h-screen" aria-busy="true">
      <div className="max-w-md mx-auto px-4 pt-28 sm:pt-32 pb-20 animate-pulse">
        <div className="h-9 w-40 rounded-lg bg-amber-100 mb-3" />
        <div className="h-4 w-64 max-w-full rounded bg-amber-100 mb-8" />
        <div className="bg-white rounded-2xl border border-amber-100 p-6 space-y-4 shadow-sm">
          <div className="h-12 rounded-xl bg-amber-50" />
          <div className="h-12 rounded-xl bg-amber-200/60" />
        </div>
      </div>
    </main>
  );
}

function CompleteProfileForm() {
  const router = useRouter();
  const params = useSearchParams();
  const nextUrl = params.get('next') || '/products';
  const name = params.get('name') || '';
  const { refresh } = useAuth();

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const phoneRef = useRef<HTMLInputElement>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setPhoneError('Nomor HP wajib diisi.');
      phoneRef.current?.focus();
      toast.error('Nomor HP wajib diisi.');
      return;
    }
    setPhoneError('');
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
      if (res.status === 409) {
        toast.error('Nomor ini sudah terdaftar. Masuk dengan nomor HP dan password, atau gunakan nomor lain.', { duration: 5000 });
        return;
      }
      if (res.status >= 500) {
        toast.error('Terjadi gangguan server, coba lagi.');
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
    <main className="min-h-screen">
      <Navbar />
      <div className="max-w-md mx-auto px-4 pt-28 sm:pt-32 pb-20">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-amber-950 mb-1">Satu Langkah Lagi</h1>
        <p className="text-amber-800/55 text-sm mb-8">
          {name ? `Halo, ${name}! ` : ''}Kami perlu nomor HP Anda untuk konfirmasi pesanan.
        </p>

        <form onSubmit={submit} noValidate className="bg-white rounded-2xl border border-amber-100 p-6 space-y-4 shadow-sm">
          <Field
            ref={phoneRef} label="No. HP" icon={Phone} type="tel" value={phone}
            onChange={e => { setPhone(e.target.value); setPhoneError(''); }}
            placeholder="08xxxxxxxxxx" autoComplete="tel" inputMode="tel" autoFocus error={phoneError}
          />
          <button
            type="submit" disabled={loading}
            className="w-full btn-primary py-3.5 font-bold flex items-center justify-center gap-2 shadow-md disabled:opacity-50 text-sm"
          >
            <UserCheck size={15} /> {loading ? 'Memproses...' : 'Lanjutkan'}
          </button>
        </form>
      </div>
      <div className="hidden sm:block"><Footer /></div>
      <BottomNav />
    </main>
  );
}

export default function CompleteProfilePage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <CompleteProfileForm />
    </Suspense>
  );
}
