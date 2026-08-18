'use client';

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';

// Client-safe config (not the service account) — from Firebase Console >
// Project settings > General > Your apps > Web app. Only used for Google Sign-In;
// Firestore reads/writes always go through the server APIs, never this client SDK.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function isGoogleSignInConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId
  );
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

// Lazy on purpose — initializeApp()/getAuth() validate the config immediately and
// throw if it's missing, which would crash prerendering of /login and /register
// (client components still get a server-side render pass) whenever the
// NEXT_PUBLIC_FIREBASE_* env vars aren't set yet. Deferring to first actual use
// (the Google button's click handler, browser-only) keeps the build green either way.
export function getFirebaseAuth(): Auth {
  if (!app) app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  if (!auth) auth = getAuth(app);
  return auth;
}

export const googleProvider = new GoogleAuthProvider();
