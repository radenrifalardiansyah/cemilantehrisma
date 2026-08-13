import { getDb, FieldValue } from '@/lib/firebase';

// Menulis ke koleksi `notifications` yang sama dengan admin panel (lihat
// cemilantehrisma-admin/src/lib/notifications.ts) — dibaca realtime oleh bell notifikasi admin.
// Endpoint checkout ini publik/tanpa auth, jadi actor-nya nama pelanggan, bukan AuthUser admin.
export async function notify(opts: {
  type: 'order_new';
  title: string;
  message: string;
  link?: string;
  entityCollection?: string;
  entityId?: string;
  actorUsername: string;
}): Promise<void> {
  await getDb().collection('notifications').add({
    type: opts.type,
    title: opts.title,
    message: opts.message,
    link: opts.link ?? null,
    entityCollection: opts.entityCollection ?? null,
    entityId: opts.entityId ?? null,
    actorUsername: opts.actorUsername,
    actorRole: 'customer',
    readBy: [] as string[],
    createdAt: FieldValue.serverTimestamp(),
  });
}
