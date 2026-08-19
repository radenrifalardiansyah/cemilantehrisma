'use client';

import { signInWithPopup, signInWithRedirect, getRedirectResult, type User } from 'firebase/auth';
import { getFirebaseAuthReady, googleProvider, isGoogleSignInConfigured } from '@/lib/firebaseClient';

export type GoogleSignInResult =
  | { status: 'ok' }
  | { status: 'needsPhone'; name: string }
  | { status: 'redirecting' }
  | { status: 'error' };

const POPUP_TIMEOUT_MS = 12000;
const REDIRECT_PENDING_KEY = 'google-signin-redirect-pending';

// Firebase's popup flow relays the auth result back to this tab via a hidden iframe
// on the project's authDomain, using storage that Safari ITP, Brave, Chrome's
// third-party-cookie deprecation, and most in-app webviews partition or block. In
// those environments the popup completes visibly and closes, but the relay message
// never reaches the opener, so signInWithPopup()'s promise never resolves or
// rejects. Race it and fall back to a full-page redirect, which doesn't depend on
// that cross-window relay.
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('popup-timeout')), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

async function exchangeForSession(user: User): Promise<GoogleSignInResult> {
  const idToken = await user.getIdToken();

  const res = await fetch('/api/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) return { status: 'error' };

  const data: { ok?: boolean; needsPhone?: boolean; name?: string } = await res.json();
  if (data.needsPhone) return { status: 'needsPhone', name: data.name ?? '' };
  return { status: 'ok' };
}

export async function signInWithGoogle(): Promise<GoogleSignInResult> {
  if (!isGoogleSignInConfigured()) {
    console.error('[signInWithGoogle] NEXT_PUBLIC_FIREBASE_* env vars are not set — see .env.example');
    return { status: 'error' };
  }

  try {
    const auth = await getFirebaseAuthReady();
    const result = await withTimeout(signInWithPopup(auth, googleProvider), POPUP_TIMEOUT_MS);
    return await exchangeForSession(result.user);
  } catch (err) {
    if (err instanceof Error && err.message === 'popup-timeout') {
      sessionStorage.setItem(REDIRECT_PENDING_KEY, '1');
      await signInWithRedirect(await getFirebaseAuthReady(), googleProvider);
      return { status: 'redirecting' };
    }
    console.error('[signInWithGoogle]', err);
    return { status: 'error' };
  }
}

// Resumes the flow after signInWithGoogle() falls back to signInWithRedirect() above.
// Gated on REDIRECT_PENDING_KEY so normal page loads never touch Firebase Auth —
// getFirebaseAuth()/getRedirectResult() force IndexedDB persistence init, which is
// meant to stay lazy (see the comment on getFirebaseAuth in firebaseClient.ts).
// Calling it unconditionally on every mount also collided with Next.js dev-mode
// double-invocation and threw "Database is closing/hidden" from the Auth SDK.
export async function completeGoogleRedirectSignIn(): Promise<GoogleSignInResult | null> {
  if (typeof window === 'undefined' || !sessionStorage.getItem(REDIRECT_PENDING_KEY)) return null;
  sessionStorage.removeItem(REDIRECT_PENDING_KEY);
  if (!isGoogleSignInConfigured()) return null;

  const result = await getRedirectResult(await getFirebaseAuthReady());
  if (!result) return null;
  return exchangeForSession(result.user);
}
