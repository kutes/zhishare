import Link from "next/link";
import type { ArticleItem } from "./article-content";

type ArticleCardProps = {
  article: ArticleItem;
};

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="glass-card soft-card-hover flex h-full min-h-[24rem] flex-col p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
        <span className="rounded-full border border-indigo-200/80 bg-indigo-50/80 px-3 py-1 text-indigo-800">
          {article.category}
        </span>
        <span className="rounded-full border border-white/75 bg-white/60 px-3 py-1 text-slate-500">
          {article.date}
        </span>
      </div>

      <h2 className="mt-5 text-xl font-black leading-7 text-ink">{article.title}</h2>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-slate-600">{article.summary}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {article.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-white/80 bg-white/62 px-2.5 py-1 text-xs font-semibold text-slate-600">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 text-xs font-semibold text-slate-500">
        <span>更新时间：{article.date}</span>
        <span>{article.readTime}</span>
      </div>

      <Link
        href={`/articles/${article.slug}`}
        className="mt-5 inline-flex min-h-12 items-center justify-center rounded-[14px] bg-ink px-4 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-800 hover:shadow-lg"
      >
        阅读全文
      </Link>
    </article>
  );
}
