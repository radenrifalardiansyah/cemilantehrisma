import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

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
export function getAuthAdmin() {
  ensureApp();
  return getAuth();
}
