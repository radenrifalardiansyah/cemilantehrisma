import { NextRequest, NextResponse } from 'next/server';

const REDIS_URL   = process.env.UPSTASH_REDIS_REST_URL   ?? '';
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN ?? '';

async function redisPipeline(commands: string[][]) {
  if (!REDIS_URL || !REDIS_TOKEN) return;
  await fetch(`${REDIS_URL}/pipeline`, {
    method:  'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
    body:    JSON.stringify(commands),
    cache:   'no-store',
  });
}

export async function POST(req: NextRequest) {
  try {
    const { path, device, sessionId } = await req.json() as {
      path: string; device: string; sessionId?: string;
    };

    const today  = new Date().toISOString().slice(0, 10);
    const devKey = device === 'mobile' ? 'mobile' : 'desktop';
    const TTL    = '2764800'; // 32 hari

    const cmds: string[][] = [
      ['incr', `analytics:views:${today}`],
      ['expire', `analytics:views:${today}`, TTL],
      ['incr', `analytics:page:${path ?? '/'}`],
      ['incr', `analytics:device:${devKey}`],
    ];

    if (sessionId) {
      cmds.push(['sadd', `analytics:visitors:${today}`, sessionId]);
      cmds.push(['expire', `analytics:visitors:${today}`, TTL]);
    }

    await redisPipeline(cmds);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
