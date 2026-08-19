import { NextRequest, NextResponse } from 'next/server';
import { getSessionCustomer } from '@/lib/customerAuth';
import { uploadToCloudinary, cloudinaryConfigured } from '@/lib/cloudinary';

// Browser compresses before sending (max ~1200px, quality 0.82, lihat src/lib/imageCompress.ts)
// jadi upload normal hanya 80-200 KB. 900 KB adalah jaga-jaga kalau kompres di client gagal.
const MAX_BYTES = 900_000;

export async function POST(req: NextRequest) {
  const session = await getSessionCustomer(req);
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  if (!cloudinaryConfigured()) {
    return NextResponse.json(
      { error: 'Cloudinary belum dikonfigurasi. Tambahkan CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, dan CLOUDINARY_API_SECRET ke environment variables.' },
      { status: 500 },
    );
  }

  const form = await req.formData();
  const file = form.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());

  if (buffer.byteLength > MAX_BYTES) {
    return NextResponse.json(
      { error: `Gambar terlalu besar (${(buffer.byteLength / 1024).toFixed(0)} KB). Maks 900 KB.` },
      { status: 413 },
    );
  }

  try {
    const url = await uploadToCloudinary(buffer, file.name, 'payment-proofs', file.type || 'image/jpeg');
    return NextResponse.json({ url });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Upload gagal.' }, { status: 502 });
  }
}
