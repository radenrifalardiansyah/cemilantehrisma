import postgres from 'postgres';

let sql: ReturnType<typeof postgres> | undefined;

// Singleton pooled connection ke Supabase Postgres (transaction-mode pooler, port 6543) — sama
// persis dengan cemilantehrisma-admin/src/lib/db.ts (database yang sama, dua deployment Vercel
// terpisah). Reuse across warm serverless invocations supaya tidak buka koneksi baru tiap request.
export function getSql() {
  if (!sql) {
    sql = postgres(process.env.DATABASE_URL!, {
      prepare: false, // pgbouncer transaction mode tidak support prepared statements
      // Lihat catatan panjang di cemilantehrisma-admin/src/lib/db.ts: `max: 1` terbukti bikin
      // request hang tanpa batas waktu lewat PgBouncer transaction-mode Supabase (pipelining
      // postgres.js macet total). `max: 5` terbukti aman & jauh lebih hemat dibanding default 10.
      max: 5,
    });
  }
  return sql;
}

// Lewat Supabase pooler (pgbouncer transaction mode), kolom jsonb kadang balik sebagai string JSON
// mentah alih-alih object/array ter-parse otomatis (quirk pooler, bukan hal yang bisa diandalkan) —
// dipakai di setiap tempat yang baca kolom jsonb (mis. `products.details`/`products.image_urls`).
export function parseJsonb<T>(value: T | string | null): T | null {
  if (value === null) return null;
  return typeof value === 'string' ? JSON.parse(value) as T : value;
}
