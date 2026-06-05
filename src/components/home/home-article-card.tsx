import Link from "next/link";
import type { PublishedArticle } from "@/types/article";

type HomeArticleCardProps = {
  article: PublishedArticle;
};

export function HomeArticleCard({ article }: HomeArticleCardProps) {
  return (
    <article className="glass-card soft-card-hover flex h-full flex-col p-5">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
        <span className="rounded-full border border-indigo-200/80 bg-indigo-50/80 px-3 py-1 text-indigo-800">
          {article.category}
        </span>
        <span className="text-slate-500">{article.date}</span>
        <span className="text-slate-500">{article.readTime}</span>
      </div>

      <h3 className="mt-5 text-lg font-black leading-7 text-ink">{article.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-500">{article.summary}</p>

      <Link
        href={`/articles/${article.slug}`}
        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-[14px] border border-white/75 bg-white/65 px-4 text-sm font-semibold text-ink shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
      >
        阅读全文
      </Link>
    </article>
  );
}
