import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/lib/db';
import { getSessionCustomer } from '@/lib/customerAuth';
import { computeVoucherDiscount, normalizeVoucherCode, voucherDiscountLabel } from '@/lib/voucher';
import { voucherProblem, voucherRule, customerVoucherUses, type VoucherRow } from '@/lib/server/vouchers';

// Pratinjau voucher di checkout — hanya untuk pelanggan yang login (cegah tebak-tebak kode
// anonim). Pengecekan yang mengikat diulang di /api/checkout saat pesanan disimpan.
export async function POST(req: NextRequest) {
  const session = await getSessionCustomer(req);
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  const body = await req.json().catch(() => ({})) as { code?: string; subtotal?: number };
  const code = normalizeVoucherCode(body.code);
  const subtotal = Number(body.subtotal) || 0;
  if (!code) return NextResponse.json({ error: 'Masukkan kode voucher.' }, { status: 400 });
  const sql = getSql();
  const [row] = await sql<VoucherRow[]>`select * from vouchers where code = ${code}`;
  const uses = row ? await customerVoucherUses(sql, code, { customerId: session.id, phone: session.phone }) : 0;
  const problem = voucherProblem(row, subtotal, new Date(), uses);
  if (problem) return NextResponse.json({ error: problem }, { status: 400 });
  return NextResponse.json({ code, amount: computeVoucherDiscount(voucherRule(row), subtotal), label: voucherDiscountLabel(code) });
}
