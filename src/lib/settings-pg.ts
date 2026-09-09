import { getSql, parseJsonb } from '@/lib/db';

// Versi Postgres dari dokumen tunggal `settings/main` (Tahap 15 migrasi Fase 2) — sama dengan
// karyaputra-admin/src/lib/settings-pg.ts (tabel yang sama), tapi storefront cuma perlu baca,
// tidak pernah menulis (pengaturan cuma diedit dari admin panel).
export async function getSettings(): Promise<Record<string, unknown>> {
  const sql = getSql();
  const [row] = await sql<{ data: unknown }[]>`select data from settings where id = 'main'`;
  return (parseJsonb(row?.data ?? null) as Record<string, unknown>) ?? {};
}
