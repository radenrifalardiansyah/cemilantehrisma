import { getDb, FieldValue } from '@/lib/firebase';
import { getMessaging } from 'firebase-admin/messaging';

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
  const db = getDb();
  await db.collection('notifications').add({
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

  await sendPush(db, { title: opts.title, message: opts.message }).catch(err => {
    console.error('Failed to send push notification', err);
  });
}

// Fan-out ke device admin yang sudah "Aktifkan notifikasi HP" (koleksi `fcmTokens`, diisi dari sisi
// admin panel — repo ini tidak punya endpoint register-device karena customer storefront tidak
// dapat push, hanya baca collection yang sama di project Firestore yang sama).
async function sendPush(db: ReturnType<typeof getDb>, payload: { title: string; message: string }): Promise<void> {
  const snap = await db.collection('fcmTokens').get();
  if (snap.empty) return;
  const tokens = snap.docs.map(d => d.id);

  const res = await getMessaging().sendEachForMulticast({
    tokens,
    notification: { title: payload.title, body: payload.message },
    webpush: { notification: { icon: '/icon-192.png' } },
  });

  const stale: string[] = [];
  res.responses.forEach((r, i) => {
    if (!r.success && (r.error?.code === 'messaging/registration-token-not-registered' || r.error?.code === 'messaging/invalid-argument')) {
      stale.push(tokens[i]);
    }
  });
  await Promise.all(stale.map(t => db.collection('fcmTokens').doc(t).delete()));
}
