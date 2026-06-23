import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

export { FieldValue };

export function getDb() {
  const raw    = process.env.FIREBASE_SERVICE_ACCOUNT ?? '{}';
  const parsed = JSON.parse(raw) as Record<string, unknown>;

  if (!getApps().length && parsed.project_id) {
    initializeApp({ credential: cert(parsed as Parameters<typeof cert>[0]) });
  }

  return getFirestore();
}
