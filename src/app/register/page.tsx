'use client';

import { Suspense, useRef, useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { User, Phone, Lock, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Field from '@/components/Field';
import BottomNav from '@/components/BottomNav';
import GoogleSignInButton from '@/components/GoogleSignInButton';
import { useAuth } from '@/contexts/AuthContext';

function FormSkeleton() {
  return (
    <main className="min-h-screen" aria-busy="true">
      <div className="max-w-md mx-auto px-4 pt-28 sm:pt-32 pb-20 animate-pulse">
        <div className="h-9 w-40 rounded-lg bg-amber-100 mb-3" />
        <div className="h-4 w-64 max-w-full rounded bg-amber-100 mb-8" />
        <div className="bg-white rounded-2xl border border-amber-100 p-6 space-y-4 shadow-sm">
          <div className="h-12 rounded-xl bg-amber-50" />
          <div className="h-12 rounded-xl bg-amber-50" />
          <div className="h-12 rounded-xl bg-amber-50" />
          <div className="h-12 rounded-xl bg-amber-50" />
          <div className="h-12 rounded-xl bg-amber-200/60" />
        </div>
      </div>
    </main>
  );
}

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const nextUrl = params.get('next') || '/products';
  const { refresh } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  type Errs = { name?: string; phone?: string; password?: string; confirmPassword?: string };
  const [errors, setErrors] = useState<Errs>({});
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  const clear = (k: keyof Errs) => setErrors(v => ({ ...v, [k]: undefined }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: Errs = {};
    if (!name.trim()) errs.name = 'Nama wajib diisi.';
    if (!phone.trim()) errs.phone = 'Nomor HP wajib diisi.';
    if (!password) errs.password = 'Password wajib diisi.';
    else if (password.length < 6) errs.password = 'Password minimal 6 karakter.';
    if (password && password !== confirmPassword) errs.confirmPassword = 'Konfirmasi password tidak cocok.';
    setErrors(errs);
    const first = errs.name ? nameRef : errs.phone ? phoneRef : errs.password ? passwordRef : errs.confirmPassword ? confirmRef : null;
    if (first) {
      first.current?.focus();
      toast.error('Periksa kembali data yang ditandai.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, password }),
      });
      if (res.status === 409) {
        toast.error('Nomor HP ini sudah terdaftar. Silakan masuk.');
        return;
      }
      if (!res.ok) {
        toast.error('Gagal mendaftar, cek kembali data Anda.');
        return;
      }
      await refresh();
      toast.success('Akun berhasil dibuat!');
      router.replace(nextUrl);
    } catch {
      toast.error('Gagal mendaftar, coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="max-w-md mx-auto px-4 pt-28 sm:pt-32 pb-20">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-amber-950 mb-1">Daftar Akun</h1>
        <p className="text-amber-800/55 text-sm mb-8">Buat akun untuk bisa checkout & lacak pesanan.</p>

        <form onSubmit={submit} noValidate className="bg-white rounded-2xl border border-amber-100 p-6 space-y-4 shadow-sm">
          <Field
            ref={nameRef} label="Nama" icon={User} type="text" value={name}
            onChange={e => { setName(e.target.value); clear('name'); }}
            placeholder="Nama lengkap" autoComplete="name" error={errors.name}
          />
          <Field
            ref={phoneRef} label="No. HP" icon={Phone} type="tel" value={phone}
            onChange={e => { setPhone(e.target.value); clear('phone'); }}
            placeholder="08xxxxxxxxxx" autoComplete="tel" inputMode="tel" error={errors.phone}
          />
          <Field
            ref={passwordRef} label="Password" icon={Lock} type="password" value={password}
            onChange={e => { setPassword(e.target.value); clear('password'); }}
            placeholder="Minimal 6 karakter" autoComplete="new-password" error={errors.password}
          />
          <Field
            ref={confirmRef} label="Ulangi Password" icon={Lock} type="password" value={confirmPassword}
            onChange={e => { setConfirmPassword(e.target.value); clear('confirmPassword'); }}
            placeholder="••••••••" autoComplete="new-password" error={errors.confirmPassword}
          />
          <button
            type="submit" disabled={loading}
            className="w-full btn-primary py-3.5 font-bold flex items-center justify-center gap-2 shadow-md disabled:opacity-50 text-sm"
          >
            <UserPlus size={15} /> {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-amber-200/60" />
          <span className="text-amber-700/40 text-xs font-medium">atau</span>
          <div className="flex-1 h-px bg-amber-200/60" />
        </div>

        <GoogleSignInButton nextUrl={nextUrl} />

        <p className="text-center text-amber-800/60 text-sm mt-5">
          Sudah punya akun?{' '}
          <Link
            href={`/login${nextUrl !== '/products' ? `?next=${encodeURIComponent(nextUrl)}` : ''}`}
            className="text-amber-700 font-semibold underline"
          >
            Masuk
          </Link>
        </p>
      </div>
      <div className="hidden sm:block"><Footer /></div>
      <BottomNav />
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <RegisterForm />
    </Suspense>
  );
}
