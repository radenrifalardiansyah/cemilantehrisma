export async function compressImage(file: File, maxPx = 1200, quality = 0.82): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const scale  = Math.min(1, maxPx / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, w, h);
  return new Promise(resolve =>
    canvas.toBlob(
      blob => resolve(new File([blob!], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' })),
      'image/jpeg', quality,
    ),
  );
}
