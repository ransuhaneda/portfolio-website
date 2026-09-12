// Router Links own their basename; use this for content assets and plain anchors.
export function publicUrl(path: string, base = import.meta.env.BASE_URL): string {
  return path.startsWith('/') && !path.startsWith('//') ? `${base}${path.slice(1)}` : path
}

export function readingMinutes(body: string): number {
  return Math.max(1, Math.ceil(body.trim().split(/\s+/).filter(Boolean).length / 200))
}
