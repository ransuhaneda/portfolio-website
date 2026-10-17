import { Link, useLocation, useSearchParams } from "react-router-dom";
import { PretextText } from "../components/PretextText";
import { blogPosts } from "../content/blogContent";
import { filterBlogPosts } from "../content/blogFilters";
import sty from "./InternalPages.module.scss";

function formatDate(date: string) {
  return date
    .split("-")
    .map((part, index) => (index === 0 ? part : part.replace(/^0/, "")))
    .join(".");
}

export function BlogPage() {
  const [params] = useSearchParams();
  const location = useLocation();
  const filteredPosts = filterBlogPosts(blogPosts, params);

  return (
    <div className={sty.page}>
      <header className={sty.blogMasthead}>
        <div className="lg-wrapper">
          <h1 className={sty.blogTitle}>Notes</h1>
        </div>
      </header>

      <section className={sty.blogArchive}>
        <div className="lg-wrapper">
          <section className={sty.blogList} aria-labelledby="notes-list-title">
            <div className={sty.blogListHeader} id="notes-list-title">
              <span>Date</span>
              <span>Name</span>
            </div>
            {filteredPosts.length ? (
              filteredPosts.map((post) => (
                <Link
                  className={sty.postRow}
                  key={post.slug}
                  to={`/blog/${post.slug}${location.search}`}
                  state={{ from: `/blog${location.search}` }}
                >
                  <time className={sty.postMeta} dateTime={post.date} data-text-reveal="copy">
                    {formatDate(post.date)}
                  </time>
                  <PretextText as="h2" measure="heading" reveal="copy">
                    {post.title}
                  </PretextText>
                </Link>
              ))
            ) : (
              <p className={sty.blogEmpty}>No notes match these filters.</p>
            )}
          </section>
        </div>
      </section>
    </div>
  );
}
