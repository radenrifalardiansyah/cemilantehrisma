import { NextRequest, NextResponse } from 'next/server';
import { trackClick, ClickType } from '@/lib/services/analyticsService';

const VALID_TYPES: ClickType[] = ['menu', 'category', 'product', 'addcart'];

export async function POST(req: NextRequest) {
  try {
    const { type, key } = await req.json() as { type: string; key: string };
    if (!VALID_TYPES.includes(type as ClickType) || typeof key !== 'string' || !key) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    await trackClick(type as ClickType, key);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[analytics/click]', err);
    return NextResponse.json({ ok: false });
  }
}
