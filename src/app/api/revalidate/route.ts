import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

// Called by the (separate) admin app right after it writes to Firestore, so the
// storefront's 5-min product/category cache doesn't have to expire on its own —
// admin edits show up on the next request instead of up to 5 min later.
const VALID_TAGS = ['products', 'categories', 'stats', 'payment-info'] as const;
type ValidTag = typeof VALID_TAGS[number];

function isAuthed(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET ?? '';
  if (!secret) return false;
  return req.headers.get('authorization') === `Bearer ${secret}`;
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  type Body = { tag?: string; tags?: string[] };
  const body: Body = await req.json().catch(() => ({}));
  const requested: string[] = Array.isArray(body.tags) ? body.tags : body.tag ? [body.tag] : [];
  const tags = requested.filter((t): t is ValidTag => VALID_TAGS.includes(t as ValidTag));

  if (tags.length === 0) {
    return NextResponse.json({ error: 'no_valid_tag', validTags: VALID_TAGS }, { status: 400 });
  }

  // { expire: 0 } = revalidate immediately (matches pre-v16 single-arg behavior);
  // a bare tag with no profile now only logs a deprecation warning in this Next version.
  tags.forEach(tag => revalidateTag(tag, { expire: 0 }));

  // The homepage and product-detail pages read Firestore directly under a 5-min
  // ISR window (not via unstable_cache), so they need revalidatePath too.
  if (tags.includes('products')) {
    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath('/products/[id]', 'page');
  }

  return NextResponse.json({ revalidated: true, tags });
}
