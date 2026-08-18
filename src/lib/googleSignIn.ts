'use client';

import { signInWithPopup } from 'firebase/auth';
import { getFirebaseAuth, googleProvider, isGoogleSignInConfigured } from '@/lib/firebaseClient';

export type GoogleSignInResult =
  | { status: 'ok' }
  | { status: 'needsPhone'; name: string }
  | { status: 'error' };

export async function signInWithGoogle(): Promise<GoogleSignInResult> {
  if (!isGoogleSignInConfigured()) {
    console.error('[signInWithGoogle] NEXT_PUBLIC_FIREBASE_* env vars are not set — see .env.example');
    return { status: 'error' };
  }

  try {
    const result = await signInWithPopup(getFirebaseAuth(), googleProvider);
    const idToken = await result.user.getIdToken();

    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
    if (!res.ok) return { status: 'error' };

    const data: { ok?: boolean; needsPhone?: boolean; name?: string } = await res.json();
    if (data.needsPhone) return { status: 'needsPhone', name: data.name ?? '' };
    return { status: 'ok' };
  } catch (err) {
    console.error('[signInWithGoogle]', err);
    return { status: 'error' };
  }
}
