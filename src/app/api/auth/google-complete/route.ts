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

  const sql = getSql();
  const [existing] = await sql<{ id: string; name: string }[]>`select id, name from storefront_customers where id = ${phone}`;

  let name: string;
  if (existing) {
    // Nomor ini sudah pernah daftar (mis. lewat HP+password) — tautkan akun Google
    // ke situ saja daripada bikin akun duplikat.
    await sql`
      update storefront_customers set google_uid = ${pending.uid}, email = coalesce(${pending.email || null}, email), updated_at = now()
      where id = ${phone}
    `;
    name = existing.name ?? pending.name;
  } else {
    await sql`
      insert into storefront_customers (id, name, phone, google_uid, auth_provider, email, created_at)
      values (${phone}, ${pending.name}, ${phone}, ${pending.uid}, 'google', ${pending.email || null}, now())
    `;
    name = pending.name;
  }

  const res = NextResponse.json({ ok: true, customer: { id: phone, name, phone } });
  res.cookies.set(SESSION_COOKIE_NAME, createSessionCookieValue(phone), {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax',
    maxAge: SESSION_COOKIE_MAX_AGE, path: '/',
  });
  res.cookies.set(PENDING_GOOGLE_COOKIE_NAME, '', { maxAge: 0, path: '/' });
  return res;
}
