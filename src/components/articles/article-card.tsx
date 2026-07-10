import Link from "next/link";
import { getToolInitials } from "@/lib/covers/tool-cover.mjs";
import type { ArticleItem } from "./article-content";

type ArticleCardProps = {
  article: ArticleItem;
};

export function ArticleCard({ article }: ArticleCardProps) {
  const coverUrl = article.cover_url?.trim() || null;

  return (
    <article className="articles-card articles-card-cover">
      {coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="articles-card-banner" src={coverUrl} alt="" loading="lazy" />
      ) : (
        <div className="articles-card-cover-fallback">
          <span>{getToolInitials(article.title)}</span>
        </div>
      )}

      <div className="articles-card-topline">
        <span className="articles-card-dot" aria-hidden="true" />
        <span className="articles-card-chip articles-card-chip-accent">{article.category}</span>
        <span className="articles-card-chip">{article.date}</span>
      </div>

      <h2 className="articles-card-title">{article.title}</h2>
      <p className="articles-card-summary articles-card-summary-clamp">{article.summary}</p>

      <div className="articles-card-tags">
        {article.tags.map((tag) => (
          <span key={tag} className="articles-card-chip articles-card-chip-soft">
            {tag}
          </span>
        ))}
      </div>

      <div className="articles-card-meta">
        <span>更新于 {article.date}</span>
        <span>{article.readTime}</span>
      </div>

      <Link href={`/articles/${article.slug}`} className="articles-card-link">
        阅读全文 <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
