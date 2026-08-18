'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Truck, Clock, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/lib/whatsapp';

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
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map(i => (
          <button key={i} type="button" onClick={() => setRating(i)}>
            <Star size={24} className={i <= rating ? 'text-amber-400 fill-amber-400' : 'text-amber-200 fill-amber-200'} />
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
}

const STATUS_LABEL: Record<string, string> = {
  baru: 'Pesanan Baru', diproses: 'Diproses', selesai: 'Selesai', dibatalkan: 'Dibatalkan',
};
const STATUS_COLOR: Record<string, string> = {
  baru: 'bg-blue-50 text-blue-700 border-blue-200',
  diproses: 'bg-amber-50 text-amber-700 border-amber-200',
  selesai: 'bg-green-50 text-green-700 border-green-200',
  dibatalkan: 'bg-red-50 text-red-700 border-red-200',
};

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
      <main className="min-h-screen flex items-center justify-center" style={{ background: '#FFFBF5' }}>
        <p className="text-amber-700/60 text-sm">Memuat...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ background: '#FFFBF5' }}>
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
          <p className="text-amber-700/50 text-sm">Memuat pesanan...</p>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-amber-100 p-10 text-center shadow-sm">
            <div className="text-5xl mb-3">📦</div>
            <p className="text-amber-800/50 text-sm mb-4">Belum ada pesanan.</p>
            <Link href="/products">
              <button className="btn-primary px-5 py-2.5 text-sm font-bold">Lihat Menu</button>
            </Link>
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
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${STATUS_COLOR[order.status] ?? 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                    {STATUS_LABEL[order.status] ?? order.status}
                  </span>
                </div>
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
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="hidden sm:block"><Footer /></div>
      <BottomNav />
    </main>
  );
}
