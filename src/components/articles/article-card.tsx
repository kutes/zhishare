import Link from "next/link";
import type { ArticleItem } from "./article-content";

type ArticleCardProps = {
  article: ArticleItem;
};

// Image-free editorial card. The whole card is the link (robust whole-card click),
// leaning on typography + a faint serif watermark instead of a cover image.
export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/articles/${article.slug}`} className="articles-card">
      <span className="articles-card-accent" aria-hidden="true" />

      <div className="articles-card-topline">
        <span className="articles-card-dot" aria-hidden="true" />
        <span className="articles-card-chip articles-card-chip-accent">{article.category}</span>
        <span className="articles-card-chip">{article.date}</span>
      </div>

      <h2 className="articles-card-title">{article.title}</h2>
      <p className="articles-card-summary articles-card-summary-clamp">{article.summary}</p>

      {article.tags.length > 0 ? (
        <div className="articles-card-tags">
          {article.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="articles-card-chip articles-card-chip-soft">
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="articles-card-foot">
        <span className="articles-card-readtime">{article.readTime}</span>
        <span className="articles-card-cta">
          阅读全文 <span aria-hidden="true">→</span>
        </span>
      </div>

      <span className="articles-card-watermark" aria-hidden="true">
        &#8220;
      </span>
    </Link>
  );
}
