import type { MockArticle } from "@/data/mock-articles";

type ArticleCardProps = {
  article: MockArticle;
};

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="glass-card soft-card-hover flex h-full flex-col p-5">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
        <span className="rounded-full border border-indigo-200 bg-indigo-50/80 px-3 py-1 text-indigo-800">
          {article.category}
        </span>
        <span className="text-slate-500">{article.date}</span>
        <span className="text-slate-500">{article.readTime}</span>
      </div>
      <h3 className="mt-5 text-lg font-black leading-7 text-ink">{article.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-500">{article.summary}</p>
      <a
        href="#"
        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-[14px] border border-white/70 bg-white/65 px-4 text-sm font-semibold text-ink shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
      >
        阅读文章
      </a>
    </article>
  );
}
