const decodedImages = new Map<string, Promise<void>>();

/** Load and decode an image once so a later swap can paint it without a gap. */
export function preloadImage(src: string): Promise<void> {
  const cached = decodedImages.get(src);
  if (cached) return cached;

  const image = new Image();
  image.decoding = "async";
  image.src = src;
  const promise = image.decode();
  // Forget failures so a later navigation can retry the request.
  promise.catch(() => decodedImages.delete(src));
  decodedImages.set(src, promise);
  return promise;
}
