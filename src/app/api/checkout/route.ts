import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { getSql } from '@/lib/db';
import { notify } from '@/lib/notifications';
import { getSessionCustomer } from '@/lib/customerAuth';
import { getMergedProduct } from '@/lib/server/getProduct';
import { products as staticProducts } from '@/lib/products';
import { computeVoucherDiscount, normalizeVoucherCode, voucherDiscountLabel } from '@/lib/voucher';
import { voucherProblem, voucherRule, customerVoucherUses, type VoucherRow } from '@/lib/server/vouchers';

interface CheckoutItem { productId?: string; name: string; weight: string; qty: number; price: number; subtotal: number; }
interface CheckoutBody {
  customerName: string;
  deliveryMethod?: 'pickup' | 'delivery'; address?: string; note?: string;
  items: CheckoutItem[]; voucherCode?: string;
}

const MAX_ITEMS = 100;

class VoucherError extends Error {}

// Merekam pesanan dari checkout website (portal) ke tabel Postgres `orders` yang sama dengan yang
// dipakai admin panel (Tahap 12 migrasi Fase 2 — lihat plan gleaming-wondering-quokka.md), supaya
// masuk ke menu Pesanan bertanda source: 'portal'. Wajib login (lihat /login) — order selalu
// terikat ke akun customer. Insert biasa (tanpa transaksi) — stok belum disentuh di titik checkout
// (baru dipotong belakangan oleh admin saat pesanan ditandai "selesai").
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionCustomer(req);
    if (!session) {
      return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
    }

    const body = await req.json() as Partial<CheckoutBody>;
    const customerName  = (body.customerName ?? '').toString().trim();
    // Nomor HP selalu dari akun yang login, bukan dari input client — supaya
    // pesanan tidak bisa dipalsukan mengatasnamakan nomor orang lain.
    const customerPhone = session.phone;
    const items          = Array.isArray(body.items) ? body.items : [];

    if (!customerName || items.length === 0 || items.length > MAX_ITEMS) {
      return NextResponse.json({ error: 'Data pesanan tidak lengkap.' }, { status: 400 });
    }

    // Cek stok live (langsung ke Postgres, bukan lewat cache /api/products) sebelum
    // pesanan disimpan — mencegah order untuk item yang admin sudah tandai habis.
    // Harga SELALU dari katalog live (bukan dari browser) — harga/subtotal/total kiriman klien
    // tidak dipercaya, supaya pesanan tidak bisa dibuat dengan harga yang diubah-ubah.
    const livePrice = new Map<string, number>();
    const stockIssues: { name: string; reason: 'habis' | 'insufficient' | 'unknown'; available?: number }[] = [];
    for (const it of items) {
      const productId = (it.productId ?? '').toString().trim();
      if (!productId) continue;
      const qty = Math.max(1, Math.floor(Number(it.qty)) || 1);
      const live = await getMergedProduct(productId, staticProducts);
      if (!live) {
        stockIssues.push({ name: it.name || productId, reason: 'unknown' });
      } else if (live.stock === 'habis') {
        stockIssues.push({ name: live.name, reason: 'habis' });
      } else if (live.stock === 'ready' && typeof live.stockQty === 'number' && qty > live.stockQty) {
        stockIssues.push({ name: live.name, reason: 'insufficient', available: live.stockQty });
      }
      if (live) livePrice.set(productId, Number(live.price) || 0);
    }
    if (stockIssues.length > 0) {
      return NextResponse.json({ error: 'stock_issue', items: stockIssues }, { status: 409 });
    }

    const cleanItems = items.slice(0, MAX_ITEMS).map(it => {
      const productId = (it.productId ?? '').toString().trim();
      const qty = Math.max(1, Math.floor(Number(it.qty)) || 1);
      // Item tanpa productId (sesi lama) tidak punya harga katalog — hanya itu yang memakai harga klien.
      const price = productId && livePrice.has(productId) ? livePrice.get(productId)! : Math.max(0, Number(it.price) || 0);
      return {
        // productId dipakai admin untuk memotong stok gudang saat pesanan ditandai selesai —
        // fallback ke pencarian by-name kalau kosong (mis. item dari sesi lama sebelum field ini ada).
        productId,
        name: (it.name ?? '').toString().slice(0, 200),
        weight: (it.weight ?? '').toString().slice(0, 50),
        qty, price, subtotal: price * qty,
      };
    });
    const itemsSubtotal = cleanItems.reduce((s, it) => s + it.subtotal, 0);
    if (itemsSubtotal <= 0) {
      return NextResponse.json({ error: 'Data pesanan tidak lengkap.' }, { status: 400 });
    }

    const now   = new Date();
    const pad   = (n: number) => n.toString().padStart(2, '0');
    const rand  = Math.floor(Math.random() * 900 + 100);
    const invoiceNo = `WEB-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}-${rand}`;
    const date  = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    const sql = getSql();
    const id = randomUUID();
    const voucherCode = normalizeVoucherCode(body.voucherCode);
    let orderSubtotal = itemsSubtotal;
    let orderTotal = itemsSubtotal;
    let discount: { amount: number; label: string } | null = null;
    try {
      // Voucher dihitung ulang di server dari item pesanan; kuotanya diambil atomik bersama
      // pembuatan pesanan (baris voucher dikunci), jadi kuota terakhir tidak bisa terpakai dua kali.
      await sql.begin(async tx => {
        if (voucherCode) {
          const [voucher] = await tx<VoucherRow[]>`select * from vouchers where code = ${voucherCode} for update`;
          const uses = voucher ? await customerVoucherUses(tx, voucherCode, { customerId: session.id, phone: session.phone }) : 0;
          const problem = voucherProblem(voucher, itemsSubtotal, new Date(), uses);
          if (problem) throw new VoucherError(problem);
          const amount = computeVoucherDiscount(voucherRule(voucher), itemsSubtotal);
          if (itemsSubtotal - amount <= 0) throw new VoucherError('Total pesanan setelah voucher tidak boleh nol.');
          orderSubtotal = itemsSubtotal;
          orderTotal = itemsSubtotal - amount;
          discount = { amount, label: voucherDiscountLabel(voucherCode) };
          await tx`update vouchers set used_count = used_count + 1, updated_at = now() where code = ${voucherCode}`;
        }
        await tx`
          insert into orders (
            id, invoice_no, date, customer_name, customer_phone, customer_id,
            delivery_method, address, note, items, subtotal, discount, total, status, source, payment_status, created_at
            ${voucherCode ? tx`, voucher_code` : tx``}
          ) values (
            ${id}, ${invoiceNo}, ${date}, ${customerName}, ${customerPhone}, ${session.id},
            ${body.deliveryMethod === 'delivery' ? 'delivery' : 'pickup'},
            ${(body.address ?? '').toString().slice(0, 500)}, ${(body.note ?? '').toString().slice(0, 500)},
            ${JSON.stringify(cleanItems)}, ${orderSubtotal}, ${discount ? JSON.stringify(discount) : null}, ${orderTotal},
            'baru', 'portal', 'belum_lunas', now()
            ${voucherCode ? tx`, ${voucherCode}` : tx``}
          )
        `;
      });
    } catch (err) {
      if (err instanceof VoucherError) return NextResponse.json({ error: 'voucher_invalid', message: err.message }, { status: 400 });
      throw err;
    }

    try {
      await notify({
        type: 'order_new',
        title: 'Pesanan online baru',
        message: `Pesanan ${invoiceNo} senilai Rp${orderTotal.toLocaleString('id-ID')} — oleh ${customerName} (Online).`,
        link: 'orders',
        entityCollection: 'orders', entityId: id,
        actorUsername: customerName,
      });
    } catch (err) {
      console.error('[api/checkout] Failed to write notification', err);
    }

    return NextResponse.json({ id, invoiceNo });
  } catch (err) {
    console.error('[api/checkout]', err);
    return NextResponse.json({ error: 'Gagal menyimpan pesanan.' }, { status: 500 });
  }
}
