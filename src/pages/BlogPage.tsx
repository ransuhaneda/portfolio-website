import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { LuArrowRight } from 'react-icons/lu'
import { InternalHero } from '../components/InternalHero'
import { blogCategories, blogPosts, type BlogPost } from '../content/blogContent'
import { filterBlogPosts, getBlogFilters, updateBlogFilters } from '../content/blogFilters'
import { siteContent } from '../content/siteContent'
import { readingMinutes } from '../content/publicUrl'
import sty from './InternalPages.module.scss'

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${date}T00:00:00`))
}


export function BlogPage() {
  const [params, setParams] = useSearchParams()
  const location = useLocation()
  const { query, category } = getBlogFilters(params)
  const copy = siteContent.blogPage
  const filteredPosts = filterBlogPosts(blogPosts, params)
  const groups = filteredPosts.reduce<Array<{ year: string; posts: BlogPost[] }>>((result, post) => {
    const year = post.date.slice(0, 4)
    const group = result.find((entry) => entry.year === year)
    if (group) group.posts.push(post)
    else result.push({ year, posts: [post] })
    return result
  }, [])

  return (
    <div className={sty.page}>
      <InternalHero
        title={siteContent.blogPage?.title ?? 'Build notes and frontend delivery posts.'}
        intro={siteContent.blogPage?.intro ?? 'Short posts about implementation, content systems, and frontend delivery work.'}
      />

      <section className={sty.blogArchive}>
        <div className="lg-wrapper">
          <div className={sty.blogFilters}>
            <label>{copy?.searchLabel}<input type="search" value={query} onChange={(event) => setParams(updateBlogFilters(params, 'q', event.target.value), { preventScrollReset: true })} /></label>
            <label>{copy?.categoryLabel}<select value={category} onChange={(event) => setParams(updateBlogFilters(params, 'category', event.target.value), { preventScrollReset: true })}>
              <option value="">{copy?.allLabel}</option>
              {blogCategories.map((entry) => <option key={entry.id} value={entry.id}>{entry.label}</option>)}
            </select></label>
            <button className="button button--ghost" type="button" onClick={() => setParams(updateBlogFilters(updateBlogFilters(params, 'q', ''), 'category', ''), { preventScrollReset: true })}>{copy?.resetLabel}</button>
            <a href={`${import.meta.env.BASE_URL}rss.xml`}>{copy?.rssLabel}</a>
          </div>
          <div role="status" aria-live="polite">{filteredPosts.length ? `${filteredPosts.length} ${filteredPosts.length === 1 ? 'note' : 'notes'}` : copy?.emptyMessage}</div>
          {groups.map((group) => (
            <div className={sty.yearGroup} key={group.year}>
              {group.posts.map((post) => (
                <Link className={sty.postRow} key={post.slug} to={`/blog/${post.slug}${location.search}`} state={{ from: `/blog${location.search}` }}>
                  <div className={sty.postMeta} data-text-reveal="copy"><span>{formatDate(post.date)}</span><span>{readingMinutes(post.body)} min read</span></div>
                  <div><h2 data-text-reveal="copy">{post.title}</h2><p data-text-reveal="copy">{post.excerpt ?? post.body.split('\n')[0]}</p></div>
                  <span aria-hidden="true"><LuArrowRight focusable="false" /></span>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
