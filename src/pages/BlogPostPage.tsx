import { useRef } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { LuArrowLeft, LuArrowRight } from 'react-icons/lu'
import { InternalHero } from '../components/InternalHero'
import { parseBlogMarkdownBlocks } from '../content/blogMarkdown'
import { blogPosts, getBlogPostBySlug } from '../content/blogContent'
import { siteContent } from '../content/siteContent'
import { getRelatedEntries } from '../content/relatedContent'
import { gsap, ScrollTrigger, useGSAP } from '../animations/gsap'
import sty from './InternalPages.module.scss'
const getInternalBackPath = (state: { from?: string } | null, fallback: string) => state?.from?.startsWith('/') ? state.from : fallback

export function BlogPostPage() {
  const { slug } = useParams()
  const location = useLocation()
  const backPath = getInternalBackPath(location.state, '/blog')
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
  const relatedPosts = getRelatedEntries(blogPosts, post.slug)

  return (
    <div className={sty.page} ref={pageRef} key={post.slug}>
      <InternalHero
        title={post.title}
        intro={post.excerpt ?? post.body.split('\n')[0]}
        beforeTitle={<Link className="backLink" to={backPath}><LuArrowLeft aria-hidden="true" focusable="false" />{backLabel}</Link>}
      />

      {post.coverImage ? (
        <section className={sty.articleCover}>
          <div className="lg-wrapper"><figure><img src={post.coverImage} alt={post.coverAlt ?? post.title} /><figcaption>Cover image: {post.title}</figcaption></figure></div>
        </section>
      ) : null}
      <div className={sty.readingProgress} data-reading-progress aria-label="Reading progress"><span className={sty.readingProgressFill} data-reading-progress-fill /></div>

      <article className={sty.article} data-article data-text-reveal-group="scrub">
        <div className="sm-wrapper">
          <div className={sty.articleBody} data-text-reveal="copy">
            {blocks.map((block, index) => {
              if (block.type === 'code') return <pre className={sty.codeBlock} key={`${post.slug}-${index}`} data-language={block.language}><code>{block.code}</code></pre>
              if (block.type === 'list') return <ul key={`${post.slug}-${index}`}>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>
              if (block.type === 'section') return <section key={`${post.slug}-${index}`}><h2>{block.heading}</h2>{block.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>
              return <div key={`${post.slug}-${index}`}>{block.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
            })}
          </div>
        </div>
      </article>

      <section className={sty.relatedNotes} aria-labelledby="related-notes-title">
        <div className="lg-wrapper">
          <div className={sty.relatedNotesHeader} data-text-reveal-group="scrub">
            <div><p className="eyebrow" data-text-reveal="copy">[ MORE NOTES ]</p><h2 id="related-notes-title" data-text-reveal="heading">Read other notes</h2></div>
            <Link className="button button--ghost" to="/blog">View all notes<LuArrowRight aria-hidden="true" focusable="false" /></Link>
          </div>
          <div className={sty.relatedNotesList}>
            {relatedPosts.map((relatedPost) => (
              <Link className={sty.postRow} key={relatedPost.slug} to={`/blog/${relatedPost.slug}`} state={{ from: location.pathname }}>
                <div className={sty.postMeta}><span>{relatedPost.date}</span></div>
                <div><h3>{relatedPost.title}</h3><p>{relatedPost.excerpt ?? relatedPost.body.split('\n')[0]}</p></div>
                <span aria-hidden="true"><LuArrowRight focusable="false" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
