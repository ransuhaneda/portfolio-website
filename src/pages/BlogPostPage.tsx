import { useRef } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { LuArrowLeft, LuArrowRight } from 'react-icons/lu'
import { InternalHero } from '../components/InternalHero'
import { PretextText } from '../components/PretextText'

import { parseBlogMarkdownBlocks, renderBlogInline } from '../content/blogMarkdown'
import { blogPosts, getBlogPostBySlug } from '../content/blogContent'
import { siteContent } from '../content/siteContent'
import { getRelatedEntries } from '../content/relatedContent'
import { readingMinutes } from '../content/publicUrl'
import { gsap, ScrollTrigger, useGSAP } from '../animations/gsap'
import sty from './InternalPages.module.scss'
const getInternalBackPath = (state: { from?: string } | null, fallback: string) => state?.from?.startsWith('/') && !state.from.startsWith('//') ? state.from : fallback

export function BlogPostPage() {
  const { slug } = useParams()
  const location = useLocation()
  const archivePath = `/blog${location.search}`
  const backPath = getInternalBackPath(location.state, archivePath)
  const post = slug ? getBlogPostBySlug(slug) : undefined
  const blogPostCopy = siteContent.blogPostPage
  const backLabel = backPath === '/' ? 'Back to home' : (blogPostCopy?.backToBlogLabel ?? 'Back to notes')
  const pageRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!post) return
    const progressBar = pageRef.current?.querySelector<HTMLElement>('[data-reading-progress]')
    const progressFill = pageRef.current?.querySelector<HTMLElement>('[data-reading-progress-fill]')
    const article = pageRef.current?.querySelector<HTMLElement>('[data-article]')
    if (!progressBar || !progressFill || !article) return

    gsap.set(progressFill, { scaleX: 0, transformOrigin: 'left center' })
    ScrollTrigger.create({
      trigger: article,
      start: 'top top',
      end: 'bottom bottom',
      invalidateOnRefresh: true,
      onUpdate: (self) => gsap.set(progressFill, { scaleX: self.progress }),
      onRefresh: (self) => gsap.set(progressFill, { scaleX: self.progress }),
    })
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }, { scope: pageRef, dependencies: [post?.slug], revertOnUpdate: true })

  if (!post) {
    return (
      <div className={sty.page}>
        <InternalHero title={blogPostCopy?.notFoundTitle ?? 'Post not found'} intro={blogPostCopy?.notFoundIntro ?? 'That post is missing, unpublished, or still in draft.'} actions={<Link className="button button--primary" to="/blog"><LuArrowLeft aria-hidden="true" focusable="false" />{blogPostCopy?.backToBlogLabel ?? 'Back to blog'}</Link>} />
      </div>
    )
  }

  const blocks = parseBlogMarkdownBlocks(post.body)
  const inline = (text: string) => ({ __html: renderBlogInline(text, `${siteContent.site.siteUrl}/blog/${post.slug}`, import.meta.env.BASE_URL) })
  const relatedPosts = getRelatedEntries(blogPosts, post.slug)

  return (
    <div className={sty.page} ref={pageRef} key={post.slug}>
      <InternalHero
        title={post.title}
        intro={post.excerpt ?? post.body.split('\n')[0]}
        beforeTitle={<Link className="backLink" to={backPath}><LuArrowLeft aria-hidden="true" focusable="false" />{backLabel}</Link>}
      />

      <div className={sty.readingProgress} data-reading-progress aria-label="Reading progress"><span className={sty.readingProgressFill} data-reading-progress-fill /></div>

      <article className={sty.article} data-article data-text-reveal-group="scrub">
        <div className="sm-wrapper">
          <p>{post.date} · {readingMinutes(post.body)} min read</p>
          <div className={sty.articleBody} data-text-reveal="copy">
            {blocks.map((block, index) => {
              if (block.type === 'code') return <pre className={sty.codeBlock} key={`${post.slug}-${index}`} data-language={block.language}><code>{block.code}</code></pre>
              if (block.type === 'list') return <ul key={`${post.slug}-${index}`}>{block.items.map((item) => <li key={item} dangerouslySetInnerHTML={inline(item)} />)}</ul>
              if (block.type === 'section') return <section key={`${post.slug}-${index}`}><PretextText as="h2" measure="heading" dangerouslySetInnerHTML={inline(block.heading)} />{block.paragraphs.map((paragraph) => <PretextText measure="prose" key={paragraph} dangerouslySetInnerHTML={inline(paragraph)} />)}</section>
              return <div key={`${post.slug}-${index}`}>{block.paragraphs.map((paragraph) => <PretextText measure="prose" key={paragraph} dangerouslySetInnerHTML={inline(paragraph)} />)}</div>
            })}
          </div>
        </div>
      </article>

      <section className={sty.relatedNotes} aria-labelledby="related-notes-title">
        <div className="lg-wrapper">
          <div className={sty.relatedNotesHeader} data-text-reveal-group="scrub">
            <div><p className="eyebrow" data-text-reveal="copy">[ MORE NOTES ]</p><PretextText as="h2" id="related-notes-title" measure="heading" reveal="heading">Read other notes</PretextText></div>
            <Link className="button button--ghost" to={archivePath}>View all notes<LuArrowRight aria-hidden="true" focusable="false" /></Link>
          </div>
          <div className={sty.relatedNotesList}>
            {relatedPosts.map((relatedPost) => (
              <Link className={sty.postRow} key={relatedPost.slug} to={`/blog/${relatedPost.slug}${location.search}`} state={{ from: archivePath }}>
                <div className={sty.postMeta}><span>{relatedPost.date}</span></div>
                <div><PretextText as="h3" measure="heading">{relatedPost.title}</PretextText><PretextText measure="prose">{relatedPost.excerpt ?? relatedPost.body.split('\n')[0]}</PretextText></div>
                <span aria-hidden="true"><LuArrowRight focusable="false" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
