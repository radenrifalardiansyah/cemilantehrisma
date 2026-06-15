import { NextRequest, NextResponse } from 'next/server';
import { getDb, FieldValue } from '@/lib/firebase';

export async function POST(req: NextRequest) {
  try {
    const { path, device, sessionId } = await req.json() as {
      path: string; device: string; sessionId?: string;
    };

    const today  = new Date().toISOString().slice(0, 10);
    const devKey = device === 'mobile' ? 'mobile' : 'desktop';
    // Firestore field names can't contain '/' — convert path to safe key
    const pageKey = path === '/' ? 'home' : path.replace(/^\//, '').replace(/\//g, '_');

    const update: Record<string, unknown> = {
      views:            FieldValue.increment(1),
      [devKey]:         FieldValue.increment(1),
      [`pages.${pageKey}`]: FieldValue.increment(1),
    };

    if (sessionId) {
      update['visitors'] = FieldValue.arrayUnion(sessionId);
    }

    await getDb().collection('analytics').doc(today).set(update, { merge: true });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[analytics/pageview]', err);
    return NextResponse.json({ ok: false });
  }
}
