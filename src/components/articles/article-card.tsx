import Link from "next/link";
import type { ArticleItem } from "./article-content";

type ArticleCardProps = {
  article: ArticleItem;
};

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="articles-card">
      <div className="articles-card-topline">
        <span className="articles-card-chip articles-card-chip-accent">{article.category}</span>
        <span className="articles-card-chip">{article.date}</span>
      </div>

      <h2 className="articles-card-title">{article.title}</h2>
      <p className="articles-card-summary">{article.summary}</p>

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
        阅读全文
      </Link>
    </article>
  );
}
