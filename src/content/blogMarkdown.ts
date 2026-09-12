export type ParsedBlogBlock =
  | { type: 'list'; items: string[] }
  | { type: 'section'; heading: string; paragraphs: string[] }
  | { type: 'paragraphs'; paragraphs: string[] }
  | { type: 'code'; language?: string; code: string }

export function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

export function safeBlogUrl(value: string, baseUrl: string): string | undefined {
  if ([...value].some((character) => character.charCodeAt(0) <= 32 || character.charCodeAt(0) === 127)) return undefined
  try {
    const url = new URL(value, baseUrl)
    return ['https:', 'http:', 'mailto:'].includes(url.protocol) ? url.href : undefined
  } catch {
    return undefined
  }
}

// Raw HTML is always text. Only these Markdown tokens can create markup.
export function renderBlogInline(text: string, baseUrl: string, localBase?: string): string {
  const tokens = /`([^`\n]+)`|\[([^\]\n]+)\]\(([^\s)]+)\)|\*\*([^*\n]+)\*\*|\*([^*\n]+)\*/g
  let html = ''
  let cursor = 0
  for (const match of text.matchAll(tokens)) {
    html += escapeHtml(text.slice(cursor, match.index))
    if (match[1]) html += `<code>${escapeHtml(match[1])}</code>`
    else if (match[2]) {
      let href = safeBlogUrl(match[3], baseUrl)
      if (href && localBase && new URL(href).origin === new URL(baseUrl).origin) {
        const url = new URL(href)
        href = `${localBase}${url.pathname.slice(1)}${url.search}${url.hash}`
      }
      html += href ? `<a href="${escapeHtml(href)}">${escapeHtml(match[2])}</a>` : escapeHtml(match[2])
    } else if (match[4]) html += `<strong>${escapeHtml(match[4])}</strong>`
    else html += `<em>${escapeHtml(match[5])}</em>`
    cursor = match.index + match[0].length
  }
  return html + escapeHtml(text.slice(cursor))
}

export function renderBlogHtml(body: string, baseUrl: string): string {
  const inline = (text: string) => renderBlogInline(text, baseUrl)
  const paragraphs = (items: string[]) => items.map((text) => `<p>${inline(text)}</p>`).join('\n')
  return parseBlogMarkdownBlocks(body).map((block) => {
    if (block.type === 'code') return `<pre><code>${escapeHtml(block.code)}</code></pre>`
    if (block.type === 'list') return `<ul>${block.items.map((item) => `<li>${inline(item)}</li>`).join('')}</ul>`
    if (block.type === 'section') return `<section><h2>${inline(block.heading)}</h2>${paragraphs(block.paragraphs)}</section>`
    return `<div>${paragraphs(block.paragraphs)}</div>`
  }).join('\n')
}

export function parseBlogMarkdownBlocks(body: string): ParsedBlogBlock[] {
  const blocks: ParsedBlogBlock[] = []
  const lines = body.replace(/\r\n/g, '\n').split('\n')
  let proseLines: string[] = []
  let codeLines: string[] = []
  let codeLanguage: string | undefined
  let inCode = false

  const flushProse = () => {
    const prose = proseLines.join('\n').trim()
    proseLines = []
    if (!prose) return
    const parsed: Array<ParsedBlogBlock | null> = prose.split(/\n\s*\n/).map((block) => {
      const lines = block
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)

      if (!lines.length) return null

      if (lines.every((line) => line.startsWith('- '))) {
        return {
          type: 'list',
          items: lines.map((line) => line.slice(2)),
        } satisfies ParsedBlogBlock
      }

      if (lines[0].startsWith('## ')) {
        return {
          type: 'section',
          heading: lines[0].slice(3),
          paragraphs: lines.slice(1),
        } satisfies ParsedBlogBlock
      }

      return {
        type: 'paragraphs',
        paragraphs: lines,
      } satisfies ParsedBlogBlock
    })
    blocks.push(...parsed.filter((block): block is ParsedBlogBlock => block !== null))
  }

  lines.forEach((line) => {
    const fence = line.match(/^```\s*([\w+-]*)\s*$/)
    if (fence && !inCode) {
      flushProse()
      codeLanguage = fence[1] || undefined
      codeLines = []
      inCode = true
      return
    }
    if (line.trim() === '```' && inCode) {
      blocks.push({ type: 'code', language: codeLanguage, code: codeLines.join('\n') })
      codeLines = []
      codeLanguage = undefined
      inCode = false
      return
    }
    if (inCode) codeLines.push(line)
    else proseLines.push(line)
  })

  if (inCode) proseLines.push('```' + (codeLanguage ? codeLanguage : ''), ...codeLines)
  flushProse()
  return blocks
}
