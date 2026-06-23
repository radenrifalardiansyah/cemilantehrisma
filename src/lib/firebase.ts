import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

export { FieldValue };

function initFirebase() {
  const raw    = process.env.FIREBASE_SERVICE_ACCOUNT ?? '{}';
  const parsed = JSON.parse(raw) as Record<string, unknown>;

  if (!getApps().length && parsed.project_id) {
    initializeApp({
      credential: cert(parsed as Parameters<typeof cert>[0]),
      storageBucket: `${parsed.project_id}.firebasestorage.app`,
    });
  }
}

export function getDb() {
  initFirebase();
  return getFirestore();
}

export function getBucket() {
  initFirebase();
  return getStorage().bucket();
}
