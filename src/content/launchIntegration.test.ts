import { describe, expect, it } from 'vitest'
import { onRequest } from '../../functions/[[path]]'
import { getRouteMetadata, metadataTags } from './routeMetadata'
import { publicUrl, readingMinutes } from './publicUrl'

describe('public launch boundaries', () => {
  it('keeps route metadata truthful and preview unindexed', () => {
    expect(getRouteMetadata('/resume/').canonical).toBe('https://384721.xyz/resume')
    expect(getRouteMetadata('/blog/missing').found).toBe(false)
    expect(getRouteMetadata('/blog/missing').canonical).toBeUndefined()
    expect(metadataTags('/resume', true)).toContain('noindex, nofollow')
    expect(metadataTags('/resume', false)).toContain('index, follow')
    expect(publicUrl('/files/resume.pdf', '/portfolio-website/')).toBe('/portfolio-website/files/resume.pdf')
    expect(publicUrl('https://example.org/image.png', '/preview/')).toBe('https://example.org/image.png')
    expect(readingMinutes('word '.repeat(401))).toBe(3)
  })

  it('rejects disabled or incompletely configured admin without assets or network', async () => {
    for (const path of ['/admin', '/admin/', '/admin/index.html', '/api/admin', '/api/admin/auth/start', '/api/admin/projects']) {
      for (const method of ['GET', 'HEAD', 'POST', 'PUT', 'DELETE']) {
        const response = await onRequest({ request: new Request(`https://example.org${path}`, { method }), env: { ADMIN_ENABLED: 'true', ASSETS: { fetch: async () => { throw new Error('Admin must not reach assets') } } } })
        expect(response.status).toBe(404)
        expect(response.headers.get('cache-control')).toBe('no-store')
        if (method === 'HEAD') expect(await response.text()).toBe('')
      }
    }
  })

  it('negotiates Markdown GET/HEAD/trailing slash without trusting HTML fallback', async () => {
    for (const method of ['GET', 'HEAD']) {
      for (const path of ['/blog', '/blog/']) {
        const response = await onRequest({ request: new Request(`https://example.org${path}`, { method, headers: { Accept: 'text/markdown' } }), env: { ASSETS: { fetch: async (request) => {
          expect(new URL(request.url).pathname).toBe('/blog.md')
          return new Response(method === 'HEAD' ? null : '# Blog', { headers: { 'Content-Type': 'text/plain', Vary: 'Origin' } })
        } } } })
        expect(response.status).toBe(200)
        expect(response.headers.get('content-type')).toBe('text/markdown; charset=utf-8')
        expect(response.headers.get('vary')).toContain('Accept')
        expect(response.headers.get('vary')).toContain('Origin')
        expect(await response.text()).toBe(method === 'HEAD' ? '' : '# Blog')
      }
      const missing = await onRequest({ request: new Request('https://example.org/blog/missing', { method, headers: { Accept: 'text/markdown' } }), env: { ASSETS: { fetch: async () => new Response('<html>SPA</html>', { headers: { 'Content-Type': 'text/html' } }) } } })
      expect(missing.status).toBe(404)
      expect(missing.headers.get('vary')).toContain('Accept')
      if (method === 'HEAD') expect(await missing.text()).toBe('')
    }
  })
})
