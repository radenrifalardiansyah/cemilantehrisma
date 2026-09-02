import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/lib/db';

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

  try {
    const sql = getSql();
    const rows = await sql<{ id: string; name: string | null; phone: string | null; created_at: Date }[]>`
      select id, name, phone, created_at from storefront_customers order by created_at desc
    `;
    const customers = rows.map(r => ({
      id: r.id, name: r.name ?? '', phone: r.phone ?? r.id,
      createdAt: r.created_at ? r.created_at.toISOString() : null,
    }));
    return NextResponse.json({ customers });
  } catch (err) {
    console.error('[admin/customers]', err);
    return NextResponse.json({ error: 'db_error', customers: [] });
  }
}
