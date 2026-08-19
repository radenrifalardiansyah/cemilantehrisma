'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, Landmark, QrCode, Copy, Upload, CheckCircle2, Loader2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/lib/whatsapp';
import { compressImage } from '@/lib/imageCompress';

interface Order {
  id: string; invoiceNo: string; status: string; total: number;
  paymentMethod: 'transfer' | 'qris' | null; paymentStatus: 'lunas' | 'belum_lunas';
  transferBank: string; transferProofUrl: string;
}

interface PaymentInfo {
  bankName: string; bankAccountNumber: string; bankAccountHolder: string; qrisImageUrl: string;
}

export default function BayarPesananPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { customer: account, loading: authLoading } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [orderError, setOrderError] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [method, setMethod] = useState<'transfer' | 'qris'>('transfer');
  const [uploading, setUploading] = useState(false);
  const [reuploading, setReuploading] = useState(false);

  useEffect(() => {
    if (!authLoading && !account) router.replace(`/login?next=%2Fpesanan%2F${params.id}%2Fbayar`);
  }, [authLoading, account, router, params.id]);

  const loadOrder = useCallback(async () => {
    const res = await fetch(`/api/orders/${params.id}`);
    if (!res.ok) { setOrderError(true); return; }
    const data = await res.json() as { order: Order };
    setOrder(data.order);
    if (data.order.paymentMethod) setMethod(data.order.paymentMethod);
  }, [params.id]);

  useEffect(() => {
    if (!account) return;
    loadOrder();
    fetch('/api/payment-info').then(r => r.ok ? r.json() : null).then(setPaymentInfo).catch(() => setPaymentInfo(null));
  }, [account, loadOrder]);

  const copyAccountNumber = () => {
    if (!paymentInfo?.bankAccountNumber) return;
    navigator.clipboard.writeText(paymentInfo.bankAccountNumber);
    toast.success('Nomor rekening disalin.');
  };

  const handleFile = async (file: File | undefined) => {
    if (!file || !order) return;
    setUploading(true);
    try {
      const compressed = await compressImage(file);
      const form = new FormData();
      form.append('file', compressed);
      const uploadRes = await fetch('/api/upload-payment-proof', { method: 'POST', body: form });
      const uploadData = await uploadRes.json() as { url?: string; error?: string };
      if (!uploadRes.ok || !uploadData.url) throw new Error(uploadData.error ?? 'Upload gagal.');

      const patchRes = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: method,
          transferBank: method === 'transfer' ? paymentInfo?.bankName : undefined,
          transferProofUrl: uploadData.url,
        }),
      });
      if (!patchRes.ok) throw new Error('Gagal menyimpan bukti pembayaran.');

      toast.success('Bukti pembayaran terkirim!');
      setReuploading(false);
      await loadOrder();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal upload bukti pembayaran.');
    } finally {
      setUploading(false);
    }
  };

  if (authLoading || !account || (!order && !orderError)) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: '#FFFBF5' }}>
        <p className="text-amber-700/60 text-sm">Memuat...</p>
      </main>
    );
  }

  if (orderError || !order) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-3" style={{ background: '#FFFBF5' }}>
        <p className="text-amber-800/60 text-sm">Pesanan tidak ditemukan.</p>
        <Link href="/pesanan" className="btn-primary px-5 py-2.5 text-sm font-bold">Lihat Pesanan Saya</Link>
      </main>
    );
  }

  const isDone = order.paymentStatus === 'lunas' || order.status === 'selesai' || order.status === 'dibatalkan';
  const hasProof = !!order.transferProofUrl && !reuploading;

  return (
    <main className="min-h-screen" style={{ background: '#FFFBF5' }}>
      <Navbar />
      <div className="max-w-lg mx-auto px-4 sm:px-6 pt-28 pb-40 md:pb-20">
        <Link href="/pesanan" className="inline-flex items-center gap-1.5 text-amber-600/70 hover:text-amber-700 text-sm mb-5 transition-colors">
          <ArrowLeft size={14} /> Pesanan Saya
        </Link>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="font-display text-2xl sm:text-3xl font-bold mb-1">
            <span className="text-amber-950">Pembayaran </span>
            <span className="gradient-text">{order.invoiceNo}</span>
          </h1>
          <p className="text-amber-800/55 text-sm">Total: <span className="font-bold text-amber-900">{formatCurrency(order.total)}</span></p>
        </motion.div>

        {isDone ? (
          <div className="bg-white rounded-2xl border border-amber-100 p-8 text-center shadow-sm">
            <CheckCircle2 size={40} className="text-green-500 mx-auto mb-3" />
            <p className="font-display font-bold text-amber-950 mb-1">
              {order.status === 'dibatalkan' ? 'Pesanan dibatalkan' : order.paymentStatus === 'lunas' ? 'Pembayaran sudah lunas' : 'Pesanan selesai'}
            </p>
            <p className="text-amber-700/50 text-sm mb-5">Tidak ada tindakan lain yang diperlukan.</p>
            <Link href="/pesanan"><button className="btn-primary px-5 py-2.5 text-sm font-bold">Lihat Pesanan Saya</button></Link>
          </div>
        ) : hasProof ? (
          <div className="bg-white rounded-2xl border border-amber-100 p-6 text-center shadow-sm">
            <Clock size={36} className="text-amber-500 mx-auto mb-3" />
            <p className="font-display font-bold text-amber-950 mb-1">Menunggu verifikasi admin</p>
            <p className="text-amber-700/50 text-sm mb-4">Bukti pembayaran sudah kami terima. Kami akan segera memverifikasinya.</p>
            <div className="w-28 h-28 mx-auto rounded-xl overflow-hidden border border-amber-100 mb-4">
              <Image src={order.transferProofUrl} alt="Bukti pembayaran" width={112} height={112} className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setReuploading(true)} className="btn-outline px-4 py-2.5 text-sm font-semibold">Upload Ulang</button>
              <Link href="/pesanan"><button className="btn-primary px-4 py-2.5 text-sm font-bold">Selesai</button></Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-amber-100 overflow-hidden shadow-sm">
              <div className="grid grid-cols-2">
                <button
                  onClick={() => setMethod('transfer')}
                  className={`flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-all ${method === 'transfer' ? 'text-white' : 'text-amber-700/60 bg-amber-50/50'}`}
                  style={method === 'transfer' ? { background: 'linear-gradient(135deg, #D97706, #F59E0B)' } : {}}
                >
                  <Landmark size={15} /> Transfer Bank
                </button>
                <button
                  onClick={() => setMethod('qris')}
                  className={`flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-all ${method === 'qris' ? 'text-white' : 'text-amber-700/60 bg-amber-50/50'}`}
                  style={method === 'qris' ? { background: 'linear-gradient(135deg, #D97706, #F59E0B)' } : {}}
                >
                  <QrCode size={15} /> QRIS
                </button>
              </div>

              <div className="p-5">
                {method === 'transfer' ? (
                  paymentInfo?.bankAccountNumber ? (
                    <div className="rounded-xl p-4" style={{ background: 'var(--surface-2, #FFF7EB)', border: '1px solid rgba(217,119,6,0.15)' }}>
                      <p className="text-amber-700/50 text-xs mb-1">{paymentInfo.bankName}</p>
                      <div className="flex items-center gap-2 mb-1.5">
                        <p className="font-display text-xl font-bold text-amber-950">{paymentInfo.bankAccountNumber}</p>
                        <button onClick={copyAccountNumber} className="w-7 h-7 rounded-lg flex items-center justify-center bg-amber-100 hover:bg-amber-200 text-amber-700 flex-shrink-0">
                          <Copy size={12} />
                        </button>
                      </div>
                      <p className="text-amber-800/70 text-sm">a.n. {paymentInfo.bankAccountHolder}</p>
                    </div>
                  ) : (
                    <p className="text-amber-700/50 text-sm text-center py-4">Rekening belum diatur admin, silakan hubungi kami langsung.</p>
                  )
                ) : (
                  paymentInfo?.qrisImageUrl ? (
                    <div className="w-full max-w-[220px] mx-auto rounded-xl overflow-hidden border border-amber-100">
                      <Image src={paymentInfo.qrisImageUrl} alt="QRIS" width={220} height={220} className="w-full h-auto" />
                    </div>
                  ) : (
                    <p className="text-amber-700/50 text-sm text-center py-4">QRIS belum tersedia, silakan pakai transfer bank.</p>
                  )
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-amber-100 p-5 shadow-sm">
              <p className="text-amber-950 font-semibold text-sm mb-3">Upload Bukti Pembayaran</p>
              <label className={`flex flex-col items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${uploading ? 'opacity-60 pointer-events-none' : 'border-amber-200 hover:border-amber-400'}`}>
                {uploading ? <Loader2 size={22} className="animate-spin text-amber-500" /> : <Upload size={22} className="text-amber-500" />}
                <span className="text-amber-700/60 text-xs">{uploading ? 'Mengunggah...' : 'Pilih gambar bukti transfer/pembayaran'}</span>
                <input
                  type="file" accept="image/*" className="hidden" disabled={uploading}
                  onChange={e => handleFile(e.target.files?.[0])}
                />
              </label>
            </div>
          </div>
        )}
      </div>
      <div className="hidden sm:block"><Footer /></div>
      <BottomNav />
    </main>
  );
}
