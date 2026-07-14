import Link from "next/link";
import type { ArticleItem } from "./article-content";

type ArticleCardProps = {
  article: ArticleItem;
};

// Minimal, image-free editorial card: just category/date + title. The whole card is the link.
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

      <span className="articles-card-go" aria-hidden="true">
        阅读全文 →
      </span>
    </Link>
  );
}
