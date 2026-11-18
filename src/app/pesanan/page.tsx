'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Truck, Clock, Star, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import Cart from '@/components/Cart';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/lib/whatsapp';
import {
  getDisplayStatus, getTimelineSteps, DISPLAY_STATUS_LABEL, DISPLAY_STATUS_COLOR,
} from '@/lib/order-display-status';

interface MyReview { rating: number; comment: string; approved: boolean }

function ReviewCard() {
  const [data, setData] = useState<{ eligible: boolean; review: MyReview | null } | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/reviews/mine')
      .then(r => r.ok ? r.json() : null)
      .then((d: { eligible: boolean; review: MyReview | null } | null) => {
        setData(d);
        if (d?.review) { setRating(d.review.rating); setComment(d.review.comment); }
      })
      .catch(() => setData(null));
  }, []);

  if (!data?.eligible) return null;

  const submit = async () => {
    if (rating < 1) { toast.error('Pilih rating bintang dulu.'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      });
      if (!res.ok) { toast.error('Gagal mengirim ulasan.'); return; }
      toast.success('Terima kasih atas ulasannya!');
      setData(d => d ? { ...d, review: { rating, comment, approved: false } } : d);
    } catch {
      toast.error('Gagal mengirim ulasan.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-amber-100 p-5 mb-6 shadow-sm">
      <h2 className="font-display font-bold text-amber-950 text-base mb-1">Beri Ulasan</h2>
      <p className="text-amber-700/50 text-xs mb-4">
        {data.review
          ? (data.review.approved ? 'Ulasan Anda sudah tayang. Bisa diperbarui kapan saja.' : 'Ulasan Anda sedang menunggu persetujuan admin.')
          : 'Bagaimana pengalaman belanja Anda?'}
      </p>
      <div className="flex mb-2">
        {[1, 2, 3, 4, 5].map(i => (
          <button key={i} type="button" onClick={() => setRating(i)} aria-label={`${i} bintang`} aria-pressed={i === rating} className="w-11 h-11 -mx-0.5 flex items-center justify-center rounded-lg hover:bg-amber-50 transition-colors">
            <Star size={24} aria-hidden="true" className={i <= rating ? 'text-amber-400 fill-amber-400' : 'text-amber-200 fill-amber-200'} />
          </button>
        ))}
      </div>
      <textarea
        value={comment} onChange={e => setComment(e.target.value)}
        placeholder="Ceritakan pengalaman Anda (opsional)"
        rows={3}
        className="w-full px-4 py-3 rounded-xl input-field text-sm resize-none mb-3"
      />
      <button
        onClick={submit} disabled={saving}
        className="btn-primary px-5 py-2.5 text-sm font-bold disabled:opacity-50"
      >
        {saving ? 'Mengirim...' : data.review ? 'Perbarui Ulasan' : 'Kirim Ulasan'}
      </button>
    </div>
  );
}

interface OrderItem { name: string; qty: number; weight: string; price: number }
interface Order {
  id: string; invoiceNo: string; date: string; status: string; total: number;
  deliveryMethod: 'pickup' | 'delivery'; address: string; items: OrderItem[];
  paymentStatus: 'lunas' | 'belum_lunas'; hasProof: boolean;
  fulfillmentStatus?: string | null; shippingCourier?: string; trackingNo?: string;
}

function OrderProgress({ order }: { order: Order }) {
  const [copied, setCopied] = useState(false);
  const display = getDisplayStatus(order.status, order.fulfillmentStatus);
  if (display === 'dibatalkan') return null;
  const steps = getTimelineSteps(display, order.deliveryMethod);
  const courier = order.shippingCourier?.trim();
  const resi = order.trackingNo?.trim();

  const copyResi = async () => {
    if (!resi) return;
    try {
      await navigator.clipboard.writeText(resi);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Gagal menyalin nomor resi.');
    }
  };

  return (
    <div className="px-5 py-3 border-b border-amber-50">
      <ol className="flex items-start" aria-label="Progres pesanan">
        {steps.map((st, i) => (
          <li key={st.key} aria-current={st.current ? 'step' : undefined} className="flex-1 min-w-0 flex flex-col items-center text-center relative">
            {i > 0 && (
              <span aria-hidden="true" className={`absolute top-[7px] right-1/2 w-full h-0.5 ${st.done || st.current ? 'bg-amber-400' : 'bg-amber-100'}`} />
            )}
            <span aria-hidden="true" className={`relative w-4 h-4 rounded-full border-2 ${st.done ? 'bg-amber-400 border-amber-400' : st.current ? 'bg-white border-amber-500 ring-2 ring-amber-200' : 'bg-white border-amber-200'}`} />
            <span className={`mt-1.5 text-[10px] sm:text-xs leading-tight px-0.5 break-words ${st.current ? 'font-bold text-amber-950' : st.done ? 'text-amber-800/70' : 'text-amber-700/40'}`}>
              {st.label}
            </span>
          </li>
        ))}
      </ol>
      {display === 'dikirim' && (courier || resi) && (
        <div className="mt-3 rounded-xl bg-indigo-50/60 border border-indigo-100 px-3 py-2 flex items-center justify-between gap-2 text-xs">
          <div className="min-w-0">
            {courier && <p className="text-indigo-900 font-semibold break-words">{courier}</p>}
            {resi && <p className="text-indigo-800/80 font-mono break-all">Resi: {resi}</p>}
          </div>
          {resi && (
            <button type="button" onClick={copyResi} aria-label="Salin nomor resi" className="shrink-0 min-h-9 inline-flex items-center gap-1 px-3 rounded-lg border border-indigo-200 bg-white text-indigo-700 font-semibold hover:bg-indigo-50 transition-colors">
              {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Tersalin' : 'Salin'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const { customer: account, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (!authLoading && !account) router.replace('/login?next=%2Fpesanan');
  }, [authLoading, account, router]);

  useEffect(() => {
    if (!account) return;
    fetch('/api/orders/mine')
      .then(r => r.ok ? r.json() : null)
      .then(d => setOrders(d?.orders ?? []))
      .catch(() => setOrders([]));
  }, [account]);

  if (authLoading || !account) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div role="status" aria-live="polite" className="max-w-2xl mx-auto px-4 sm:px-6 pt-28 pb-40 md:pb-20 animate-pulse">
          <span className="sr-only">Memuat...</span>
          <div className="h-9 w-48 rounded-lg bg-amber-100 mb-3" />
          <div className="h-4 w-64 max-w-full rounded bg-amber-100/70 mb-8" />
          <div className="h-36 rounded-2xl bg-amber-100/60" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-28 pb-40 md:pb-20">
        <Link
          href="/products"
          className="hidden md:inline-flex items-center gap-1.5 text-amber-600/70 hover:text-amber-700 text-sm mb-5 transition-colors"
        >
          <ArrowLeft size={14} /> Kembali ke menu
        </Link>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-1">
          <span className="text-amber-950">Pesanan </span>
          <span className="gradient-text">Saya</span>
        </h1>
        <p className="text-amber-800/55 text-sm mb-8">Riwayat & status pesanan akun Anda.</p>

        <ReviewCard />

        {orders === null ? (
          <div role="status" aria-live="polite" className="space-y-4 animate-pulse">
            <span className="sr-only">Memuat pesanan...</span>
            <div className="h-40 rounded-2xl bg-amber-100/60" />
            <div className="h-40 rounded-2xl bg-amber-100/60" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-amber-100 p-10 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3" aria-hidden="true">
              <Package size={28} className="text-amber-600" />
            </div>
            <p className="text-amber-800/50 text-sm mb-4">Belum ada pesanan.</p>
            <Link href="/products" className="btn-primary inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold">Lihat Menu</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl border border-amber-100 overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-amber-50 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-display font-bold text-amber-950 text-sm">{order.invoiceNo}</p>
                    <p className="text-amber-700/50 text-xs flex items-center gap-1 mt-0.5">
                      <Clock size={11} /> {order.date}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${DISPLAY_STATUS_COLOR[getDisplayStatus(order.status, order.fulfillmentStatus)]}`}>
                    {DISPLAY_STATUS_LABEL[getDisplayStatus(order.status, order.fulfillmentStatus)]}
                  </span>
                </div>
                <OrderProgress order={order} />
                <div className="divide-y divide-amber-50">
                  {order.items.map((it, i) => (
                    <div key={i} className="flex items-center justify-between px-5 py-2.5 text-sm">
                      <span className="text-amber-900">{it.name} <span className="text-amber-700/50">× {it.qty}</span></span>
                      <span className="text-amber-700/70">{formatCurrency(it.price * it.qty)}</span>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3 bg-amber-50 flex items-center justify-between">
                  <span className="text-amber-700/60 text-xs flex items-center gap-1.5">
                    {order.deliveryMethod === 'pickup' ? <><Package size={12} /> Pickup</> : <><Truck size={12} /> Delivery</>}
                  </span>
                  <span className="font-display font-bold text-amber-950">{formatCurrency(order.total)}</span>
                </div>
                {order.paymentStatus === 'belum_lunas' && order.status !== 'dibatalkan' && order.status !== 'selesai' && (
                  <div className="px-5 py-3 border-t border-amber-50 flex items-center justify-between gap-3">
                    {order.hasProof ? (
                      <span className="text-amber-700/60 text-xs flex items-center gap-1.5">
                        <Clock size={12} /> Menunggu verifikasi admin
                      </span>
                    ) : (
                      <span className="text-red-600/70 text-xs font-semibold">Belum dibayar</span>
                    )}
                    <Link href={`/pesanan/${order.id}/bayar`} className="btn-primary inline-flex items-center justify-center px-4 py-2 text-xs font-bold">
                      {order.hasProof ? 'Lihat Pembayaran' : 'Bayar Sekarang'}
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="hidden sm:block"><Footer /></div>
      <BottomNav />
      <Cart />
    </main>
  );
}
