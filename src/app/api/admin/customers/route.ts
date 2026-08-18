import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase';

// Daftar akun customer (dibuat lewat /register di storefront) untuk ditampilkan
// di admin app. Sama pola auth-nya dengan /api/admin/stats.
function isAuthed(req: NextRequest) {
  const validUser = (process.env.ADMIN_USERNAME ?? '').trim();
  const validPass = (process.env.ADMIN_PASSWORD ?? '').trim();

  const auth = req.headers.get('x-admin-auth') ?? '';
  const [user, ...rest] = auth.split(':');
  if (validUser && user === validUser && rest.join(':') === validPass) return true;

  const cookie = req.cookies.get('admin_auth')?.value ?? '';
  const [cu, ...cr] = cookie.split(':');
  return validUser ? cu === validUser && cr.join(':') === validPass : false;
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    return NextResponse.json({ error: 'no_firebase' }, { status: 500 });
  }

  try {
    const snap = await getDb().collection('storefront_customers').orderBy('createdAt', 'desc').get();
    const customers = snap.docs.map(d => {
      const data = d.data() as { name?: string; phone?: string; createdAt?: { toDate?: () => Date } };
      return {
        id: d.id,
        name: data.name ?? '',
        phone: data.phone ?? d.id,
        createdAt: data.createdAt?.toDate?.().toISOString() ?? null,
      };
    });
    return NextResponse.json({ customers });
  } catch (err) {
    console.error('[admin/customers]', err);
    return NextResponse.json({ error: 'firebase_error', customers: [] });
  }
}
