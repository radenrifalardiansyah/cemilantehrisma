import { NextResponse } from 'next/server';
import { getCachedBranding } from '@/lib/server/branding';
import { defaultLiveBranding } from '@/lib/branding';

export async function GET() {
  try {
    const branding = await getCachedBranding();
    return NextResponse.json(branding);
  } catch (err) {
    console.error('[api/branding]', err);
    return NextResponse.json(defaultLiveBranding());
  }
}
