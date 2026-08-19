import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

export { FieldValue };

function ensureApp() {
  const raw    = process.env.FIREBASE_SERVICE_ACCOUNT ?? '{}';
  const parsed = JSON.parse(raw) as Record<string, unknown>;

  if (!getApps().length && parsed.project_id) {
    initializeApp({ credential: cert(parsed as Parameters<typeof cert>[0]) });
  }
}

export function getDb() {
  ensureApp();
  return getFirestore();
}

// Used to verify the Firebase ID token a client gets from signInWithPopup(googleProvider)
// — see src/app/api/auth/google/route.ts. Same underlying app/credential as getDb().
// Dynamic import (not a top-level one) so routes that only need getDb() — i.e. almost
// every API route — don't bundle firebase-admin/auth's jwks-rsa/jose dependency chain,
// which fails to load under Vercel's Turbopack build (ERR_REQUIRE_ESM) and was taking
// down every route that merely imported this file.
export async function getAuthAdmin() {
  ensureApp();
  const { getAuth } = await import('firebase-admin/auth');
  return getAuth();
}
