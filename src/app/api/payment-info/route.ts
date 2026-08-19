import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { getDb } from '@/lib/firebase';

interface SettingsDoc {
  storeBankName?: string; storeBankAccountNumber?: string; storeBankAccountHolder?: string;
  storeQrisImageUrl?: string;
}

// Rekening & QRIS toko diatur admin lewat Settings > Rekening Pembayaran (settings/main
// di Firestore, field-nya sama di kedua repo — lihat SettingsTab.tsx di cemilantehrisma-admin).
// Cache 1 jam, admin bisa memanggil POST /api/revalidate dengan tag "payment-info" untuk
// memperbarui lebih cepat setelah mengganti rekening.
const getCachedPaymentInfo = unstable_cache(
  async () => {
    const doc = await getDb().collection('settings').doc('main').get();
    const s = (doc.exists ? doc.data() : {}) as SettingsDoc;
    return {
      bankName: s.storeBankName ?? '',
      bankAccountNumber: s.storeBankAccountNumber ?? '',
      bankAccountHolder: s.storeBankAccountHolder ?? '',
      qrisImageUrl: s.storeQrisImageUrl ?? '',
    };
  },
  ['public-payment-info'],
  { revalidate: 3600, tags: ['payment-info'] }
);

export async function GET() {
  try {
    const info = await getCachedPaymentInfo();
    return NextResponse.json(info);
  } catch (err) {
    console.error('[api/payment-info]', err);
    return NextResponse.json({ bankName: '', bankAccountNumber: '', bankAccountHolder: '', qrisImageUrl: '' });
  }
}
