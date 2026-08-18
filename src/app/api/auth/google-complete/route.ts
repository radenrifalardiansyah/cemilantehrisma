import { NextRequest, NextResponse } from 'next/server';
import { getDb, FieldValue } from '@/lib/firebase';
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

  const db = getDb();
  const ref = db.collection('storefront_customers').doc(phone);
  const existing = await ref.get();

  if (existing.exists) {
    // Nomor ini sudah pernah daftar (mis. lewat HP+password) — tautkan akun Google
    // ke situ saja daripada bikin akun duplikat.
    await ref.set({ googleUid: pending.uid }, { merge: true });
  } else {
    await ref.set({
      name: pending.name, phone, googleUid: pending.uid, authProvider: 'google',
      createdAt: FieldValue.serverTimestamp(),
    });
  }

  const data = (await ref.get()).data() as { name?: string };
  const res = NextResponse.json({ ok: true, customer: { id: phone, name: data?.name ?? pending.name, phone } });
  res.cookies.set(SESSION_COOKIE_NAME, createSessionCookieValue(phone), {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax',
    maxAge: SESSION_COOKIE_MAX_AGE, path: '/',
  });
  res.cookies.set(PENDING_GOOGLE_COOKIE_NAME, '', { maxAge: 0, path: '/' });
  return res;
}
