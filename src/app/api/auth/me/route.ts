import { NextRequest, NextResponse } from 'next/server';
import { getSessionCustomer } from '@/lib/customerAuth';

export async function GET(req: NextRequest) {
  const customer = await getSessionCustomer(req);
  return NextResponse.json({ customer });
}
