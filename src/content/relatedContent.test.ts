import { describe, expect, it } from 'vitest'
import { getRelatedEntries } from './relatedContent'

describe('getRelatedEntries', () => {
  const entries = [
    { slug: 'first' },
    { slug: 'second' },
    { slug: 'third' },
    { slug: 'fourth' },
  ]

  it('excludes the current entry and limits the result', () => {
    expect(getRelatedEntries(entries, 'second', 2)).toEqual([
      { slug: 'first' },
      { slug: 'third' },
    ])
  })
})