'use client';

import { useRef, useState } from 'react';
import { Clock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDialogA11y } from '@/lib/useDialogA11y';
import { paymentDeadline, isPaymentExpired, formatDeadlineWib } from '@/lib/order-expiry';

/** Batas bayar 24 jam. Hanya dirender untuk pesanan yang masih menunggu pembayaran. */
export function PaymentDeadlineNote({ createdAt, className = '' }: { createdAt?: string | null; className?: string }) {
  const deadline = paymentDeadline(createdAt);
  if (!deadline) return null;
  const expired = isPaymentExpired(deadline);
  return (
    <p className={`text-xs flex items-center gap-1.5 ${expired ? 'text-red-600 font-semibold' : 'text-amber-700/70'} ${className}`}>
      <Clock size={12} aria-hidden="true" className="shrink-0" />
      {expired ? 'Batas bayar terlewat, pesanan akan dibatalkan otomatis' : `Bayar sebelum ${formatDeadlineWib(deadline)}`}
    </p>
  );
}

/** Tombol sekunder + dialog konfirmasi pembatalan pesanan oleh pelanggan. */
export function CancelOrderButton({
  orderId, invoiceNo, onCancelled, className = '',
}: { orderId: string; invoiceNo: string; onCancelled: () => void | Promise<void>; className?: string }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const keepBtnRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = () => { if (!busy) setOpen(false); };
  useDialogA11y(open, close, dialogRef, keepBtnRef, { returnFocusRef: triggerRef });

  const cancel = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, { method: 'POST' });
      const data = await res.json().catch(() => ({})) as { error?: string };
      if (!res.ok) throw new Error(data.error && data.error !== 'unauthenticated' ? data.error : 'Gagal membatalkan pesanan.');
      toast.success('Pesanan dibatalkan.');
      setOpen(false);
      await onCancelled();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal membatalkan pesanan.');
      setOpen(false);
      // Status mungkin berubah di server (mis. sudah diproses admin): muat ulang agar tampilan sesuai.
      try { await onCancelled(); } catch { /* abaikan */ }
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        ref={triggerRef} type="button" onClick={() => setOpen(true)}
        className={`min-h-11 inline-flex items-center justify-center px-4 rounded-xl border border-red-200 bg-white text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors focus-visible:outline-2 focus-visible:outline-red-400 focus-visible:outline-offset-2 ${className}`}
      >
        Batalkan Pesanan
      </button>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50" onClick={close}>
          <div
            ref={dialogRef} role="alertdialog" aria-modal="true" aria-labelledby="cancel-title" aria-describedby="cancel-desc"
            onClick={e => e.stopPropagation()}
            className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl"
          >
            <h2 id="cancel-title" className="font-display font-bold text-amber-950 text-lg mb-2">Batalkan pesanan?</h2>
            <p id="cancel-desc" className="text-amber-800/70 text-sm mb-5">
              Pesanan {invoiceNo} akan dibatalkan dan tidak bisa dikembalikan. Voucher yang dipakai akan dikembalikan.
            </p>
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
              <button
                ref={keepBtnRef} type="button" onClick={close} disabled={busy}
                className="btn-outline min-h-11 px-4 text-sm font-semibold disabled:opacity-50"
              >
                Tidak, Pertahankan
              </button>
              <button
                type="button" onClick={cancel} disabled={busy}
                className="min-h-11 px-4 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2"
              >
                {busy && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
                {busy ? 'Membatalkan...' : 'Ya, Batalkan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
