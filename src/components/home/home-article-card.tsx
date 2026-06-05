import Link from "next/link";
import type { PublishedArticle } from "@/types/article";

type HomeArticleCardProps = {
  article: PublishedArticle;
};

export function HomeArticleCard({ article }: HomeArticleCardProps) {
  const title = article.title || "未命名文章";
  const summary = article.summary || "暂无摘要";
  const category = article.category || "未分类";
  const date = article.date || "最新发布";

  return (
    <Link href={`/articles/${article.slug}`} className="group block h-full">
      <article className="glass-card soft-card-hover flex h-full min-h-60 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="rounded-full border border-indigo-200/80 bg-indigo-50/80 px-3 py-1 text-indigo-800">
            {category}
          </span>
          <span className="text-slate-500">{date}</span>
        </div>

        <h3 className="mt-5 line-clamp-2 text-lg font-black leading-7 text-[#0f172a]">{title}</h3>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-slate-500">{summary}</p>

        <span className="mt-5 inline-flex min-h-11 items-center justify-center rounded-[14px] border border-white/75 bg-white/65 px-4 text-sm font-bold text-[#0f172a] shadow-sm transition group-hover:-translate-y-0.5 group-hover:border-indigo-200 group-hover:bg-indigo-50 group-hover:text-indigo-700">
          阅读全文
        </span>
      </article>
    </Link>
  );
}
