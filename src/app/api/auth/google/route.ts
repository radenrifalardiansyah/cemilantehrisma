import { NextRequest, NextResponse } from 'next/server';
import { getAuthAdmin } from '@/lib/firebase';
import { getSql } from '@/lib/db';
import {
  createSessionCookieValue, createPendingGoogleCookieValue,
  SESSION_COOKIE_NAME, SESSION_COOKIE_MAX_AGE, PENDING_GOOGLE_COOKIE_NAME,
} from '@/lib/customerAuth';

interface GoogleBody { idToken?: string }

// Verifies the Firebase ID token from the client's signInWithPopup(googleProvider)
// (see src/lib/firebaseClient.ts). Accounts here are always keyed by phone number
// (see customerAuth.ts), and Google never gives us one, so:
// - Returning Google user (googleUid already linked to a customers row) -> log in.
// - First-time Google user -> stash identity in a short-lived cookie and ask the
//   client to send them to /lengkapi-profil to supply a phone number.
export async function POST(req: NextRequest) {
  const body: GoogleBody = await req.json().catch(() => ({}));
  const idToken = (body.idToken ?? '').toString();
  if (!idToken) return NextResponse.json({ error: 'missing_token' }, { status: 400 });

  let decoded;
  try {
    decoded = await (await getAuthAdmin()).verifyIdToken(idToken);
  } catch (err) {
    console.error('[api/auth/google] invalid token', err);
    return NextResponse.json({ error: 'invalid_token' }, { status: 401 });
  }

  const uid = decoded.uid;
  const email = decoded.email ?? '';
  const name = (decoded.name ?? email.split('@')[0] ?? 'Pengguna').toString();

  const sql = getSql();
  const [existing] = await sql<{ id: string; name: string; phone: string }[]>`
    select id, name, phone from storefront_customers where google_uid = ${uid} limit 1
  `;

  if (existing) {
    const res = NextResponse.json({
      ok: true,
      customer: { id: existing.id, name: existing.name ?? name, phone: existing.phone ?? existing.id },
    });
    res.cookies.set(SESSION_COOKIE_NAME, createSessionCookieValue(existing.id), {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax',
      maxAge: SESSION_COOKIE_MAX_AGE, path: '/',
    });
    res.cookies.set(PENDING_GOOGLE_COOKIE_NAME, '', { maxAge: 0, path: '/' });
    return res;
  }

  const res = NextResponse.json({ needsPhone: true, name, email });
  res.cookies.set(PENDING_GOOGLE_COOKIE_NAME, createPendingGoogleCookieValue({ uid, email, name }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 10 * 60,
    path: '/',
  });
  return res;
}
