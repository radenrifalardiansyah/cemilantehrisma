import { NextRequest, NextResponse } from 'next/server';
import { getAuthAdmin, getDb } from '@/lib/firebase';
import {
  createSessionCookieValue, createPendingGoogleCookieValue,
  SESSION_COOKIE_NAME, SESSION_COOKIE_MAX_AGE, PENDING_GOOGLE_COOKIE_NAME,
} from '@/lib/customerAuth';

interface GoogleBody { idToken?: string }

// Verifies the Firebase ID token from the client's signInWithPopup(googleProvider)
// (see src/lib/firebaseClient.ts). Accounts here are always keyed by phone number
// (see customerAuth.ts), and Google never gives us one, so:
// - Returning Google user (googleUid already linked to a customers doc) -> log in.
// - First-time Google user -> stash identity in a short-lived cookie and ask the
//   client to send them to /lengkapi-profil to supply a phone number.
export async function POST(req: NextRequest) {
  const body: GoogleBody = await req.json().catch(() => ({}));
  const idToken = (body.idToken ?? '').toString();
  if (!idToken) return NextResponse.json({ error: 'missing_token' }, { status: 400 });

  let decoded;
  try {
    decoded = await getAuthAdmin().verifyIdToken(idToken);
  } catch (err) {
    console.error('[api/auth/google] invalid token', err);
    return NextResponse.json({ error: 'invalid_token' }, { status: 401 });
  }

  const uid = decoded.uid;
  const email = decoded.email ?? '';
  const name = (decoded.name ?? email.split('@')[0] ?? 'Pengguna').toString();

  const db = getDb();
  const existing = await db.collection('customers').where('googleUid', '==', uid).limit(1).get();

  if (!existing.empty) {
    const doc = existing.docs[0];
    const data = doc.data() as { name?: string; phone?: string };
    const res = NextResponse.json({
      ok: true,
      customer: { id: doc.id, name: data.name ?? name, phone: data.phone ?? doc.id },
    });
    res.cookies.set(SESSION_COOKIE_NAME, createSessionCookieValue(doc.id), {
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
