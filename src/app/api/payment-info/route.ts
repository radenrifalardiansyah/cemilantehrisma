import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { getSettings } from '@/lib/settings-pg';

interface SettingsDoc {
  storeBankName?: string; storeBankAccountNumber?: string; storeBankAccountHolder?: string;
  storeQrisImageUrl?: string;
}

// Rekening & QRIS toko diatur admin lewat Settings > Rekening Pembayaran (tabel Postgres
// `settings`, field-nya sama di kedua repo — lihat SettingsTab.tsx di karyaputra-admin).
// Cache 1 jam, admin bisa memanggil POST /api/revalidate dengan tag "payment-info" untuk
// memperbarui lebih cepat setelah mengganti rekening.
const getCachedPaymentInfo = unstable_cache(
  async () => {
    const s = (await getSettings()) as SettingsDoc;
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
