// Validasi URL bukti pembayaran: hanya URL hasil upload Cloudinary (lihat src/lib/cloudinary.ts,
// bentuk: https://res.cloudinary.com/<cloud_name>/image/upload/...).
export function isValidPaymentProofUrl(value: string): boolean {
  let u: URL;
  try {
    u = new URL(value);
  } catch {
    return false;
  }
  if (u.protocol !== 'https:' || u.hostname !== 'res.cloudinary.com') return false;
  if (u.username || u.password || u.port) return false;
  const cloud = process.env.CLOUDINARY_CLOUD_NAME ?? '';
  if (cloud && !u.pathname.startsWith(`/${cloud}/`)) return false;
  return true;
}
