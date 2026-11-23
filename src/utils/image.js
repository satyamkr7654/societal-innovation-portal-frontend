export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const MAX_SIDE = 1600;

/** Shrinks a photo to a JPEG, which also drops embedded GPS data before upload. */
export async function photoToJpeg(file) {
  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error('This photo could not be read. Please choose another image.');
  }
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff'; // JPEG has no transparency
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.8));
  if (!blob) throw new Error('This photo could not be processed. Please try another.');
  return blob;
}
