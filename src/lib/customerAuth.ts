import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { NextRequest } from 'next/server';
import { getDb } from '@/lib/firebase';

export const SESSION_COOKIE_NAME = 'customer_session';
export const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 hari

export interface CustomerSession {
  id: string;
  name: string;
  phone: string;
}

// Nomor HP dipakai sebagai id akun & identitas login (aplikasi ini tidak pernah
// mengumpulkan email) — dinormalisasi ke format 62xxxx supaya "0812..." dan
// "+62812..." dianggap akun yang sama.
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('0')) return `62${digits.slice(1)}`;
  if (digits.startsWith('62')) return digits;
  return `62${digits}`;
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, 'hex');
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

function sign(value: string): string {
  return createHmac('sha256', process.env.SESSION_SECRET ?? '').update(value).digest('hex');
}

export function createSessionCookieValue(customerId: string): string {
  return `${customerId}.${sign(customerId)}`;
}

function verifySessionCookieValue(cookieValue: string | undefined): string | null {
  if (!cookieValue) return null;
  const dot = cookieValue.lastIndexOf('.');
  if (dot < 0) return null;
  const id = cookieValue.slice(0, dot);
  const sig = Buffer.from(cookieValue.slice(dot + 1));
  const expected = Buffer.from(sign(id));
  if (sig.length !== expected.length || !timingSafeEqual(sig, expected)) return null;
  return id;
}

// Server-only: resolves the logged-in customer from the request's session cookie,
// re-reading Firestore so a since-deleted/edited account can't stay "logged in".
export async function getSessionCustomer(req: NextRequest): Promise<CustomerSession | null> {
  const id = verifySessionCookieValue(req.cookies.get(SESSION_COOKIE_NAME)?.value);
  if (!id) return null;

  const doc = await getDb().collection('customers').doc(id).get();
  if (!doc.exists) return null;
  const data = doc.data() as { name?: string; phone?: string };
  return { id, name: data.name ?? '', phone: data.phone ?? id };
}
