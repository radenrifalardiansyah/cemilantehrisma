import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/lib/db';
import {
  normalizePhone, createSessionCookieValue, verifyPendingGoogleCookieValue,
  SESSION_COOKIE_NAME, SESSION_COOKIE_MAX_AGE, PENDING_GOOGLE_COOKIE_NAME,
} from '@/lib/customerAuth';

interface CompleteBody { phone?: string }

// Second half of the Google sign-in flow (see /api/auth/google) — the client lands
// here from /lengkapi-profil once it has a phone number to attach to the new account.
export async function POST(req: NextRequest) {
  const pending = verifyPendingGoogleCookieValue(req.cookies.get(PENDING_GOOGLE_COOKIE_NAME)?.value);
  if (!pending) {
    return NextResponse.json({ error: 'pending_expired' }, { status: 401 });
  }

  const body: CompleteBody = await req.json().catch(() => ({}));
  const phone = normalizePhone((body.phone ?? '').toString());
  if (phone.length < 10 || phone.length > 15) {
    return NextResponse.json({ error: 'invalid_phone' }, { status: 400 });
  }

  // Nomor HP berasal dari input pengguna dan TIDAK diverifikasi, jadi jangan pernah
  // menautkan identitas Google ke akun yang sudah ada: siapa pun yang tahu nomor korban
  // bisa mengambil alih akunnya. Akun lama masuk dengan password.
  const sql = getSql();
  let name: string;
  try {
    const inserted = await sql<{ id: string }[]>`
      insert into storefront_customers (id, name, phone, google_uid, auth_provider, email, created_at)
      values (${phone}, ${pending.name}, ${phone}, ${pending.uid}, 'google', ${pending.email || null}, now())
      on conflict do nothing
      returning id
    `;
    // Konflik: nomor sudah terdaftar, atau akun Google ini sudah dibuat (double submit/dua tab).
    if (inserted.length === 0) {
      const [mine] = await sql<{ id: string; name: string }[]>`
        select id, name from storefront_customers where google_uid = ${pending.uid} and id = ${phone} limit 1
      `;
      if (!mine) return NextResponse.json({ error: 'phone_registered' }, { status: 409 });
      name = mine.name ?? pending.name;
    } else {
      name = pending.name;
    }
  } catch (err) {
    console.error('[api/auth/google-complete] db error', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }

  const res = NextResponse.json({ ok: true, customer: { id: phone, name, phone } });
  res.cookies.set(SESSION_COOKIE_NAME, createSessionCookieValue(phone), {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax',
    maxAge: SESSION_COOKIE_MAX_AGE, path: '/',
  });
  res.cookies.set(PENDING_GOOGLE_COOKIE_NAME, '', { maxAge: 0, path: '/' });
  return res;
}
