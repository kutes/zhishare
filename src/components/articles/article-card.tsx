import Link from "next/link";
import type { ArticleItem } from "./article-content";

type ArticleCardProps = {
  article: ArticleItem;
};

const VISIBLE_TAGS = 2;

// Cover-led editorial card: 16:9 cover on top (category chip overlaid), then
// title + 2-line summary, footer with tags left / date right. Whole card is the link.
// Covers are guaranteed by the backfill pipeline; the fallback block keeps the
// media slot non-empty if a cover_url is ever missing.
export function ArticleCard({ article }: ArticleCardProps) {
  const coverUrl = article.cover_url?.trim() ?? "";

  return (
    <Link href={`/articles/${article.slug}`} className="articles-card">
      <span className="articles-card-accent" aria-hidden="true" />

      <div className="articles-card-media">
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="articles-card-cover" src={coverUrl} alt="" loading="lazy" />
        ) : (
          <span className="articles-card-media-fallback" aria-hidden="true">
            {article.title.trim().charAt(0)}
          </span>
        )}
        <span className="articles-card-chip articles-card-chip-accent articles-card-media-chip">
          {article.category}
        </span>
      </div>

      <div className="articles-card-body">
        <h2 className="articles-card-title">{article.title}</h2>
        <p className="articles-card-summary">{article.summary}</p>

        <div className="articles-card-footer">
          {article.tags.length > 0 && (
            <div className="articles-card-tags">
              {article.tags.slice(0, VISIBLE_TAGS).map((tag) => (
                <span key={tag} className="articles-card-chip">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <span className="articles-card-date">{article.date}</span>
        </div>
      </div>
    </Link>
  );
}
