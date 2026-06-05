import Link from "next/link";
import type { PublishedArticle } from "@/types/article";
import { HomeArticleCard } from "./home-article-card";

type HomeLatestArticlesProps = {
  articles: PublishedArticle[];
};

export function HomeLatestArticles({ articles }: HomeLatestArticlesProps) {
  return (
    <section id="latest-articles" className="section-gradient-violet py-8 sm:py-10 lg:py-12">
      <div className="page-shell">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-indigo-700">最新文章</p>
            <h2 className="mt-2 text-2xl font-black text-[#0f172a] sm:text-3xl">从工具选择到上手实践</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              从工具选择、使用方法到实用教程，帮助你更快上手。
            </p>
          </div>
          <Link
            href="/articles"
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-[14px] border border-white/80 bg-white/70 px-4 text-sm font-bold text-[#0f172a] shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
          >
            查看全部文章
          </Link>
        </div>

        {articles.length > 0 ? (
          <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <HomeArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="glass-card mt-5 p-6 text-sm leading-7 text-slate-500">
            暂无已发布文章。发布文章后，这里会显示最新内容。
          </div>
        )}
      </div>
    </section>
  );
}
