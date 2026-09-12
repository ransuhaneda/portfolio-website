type SluggedEntry = { slug: string }

export function getRelatedEntries<Entry extends SluggedEntry>(entries: Entry[], currentSlug: string, limit = 2): Entry[] {
  return entries.filter((entry) => entry.slug !== currentSlug).slice(0, limit)
}
