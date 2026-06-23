import { NextRequest, NextResponse } from 'next/server';
import { trackPageView } from '@/lib/services/analyticsService';

export async function POST(req: NextRequest) {
  try {
    const { path, device, sessionId } = await req.json() as {
      path: string; device: string; sessionId?: string;
    };
    await trackPageView(path, device, sessionId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[analytics/pageview]', err);
    return NextResponse.json({ ok: false });
  }
}
