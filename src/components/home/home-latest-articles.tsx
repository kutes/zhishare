import type { PublishedArticle } from "@/types/article";
import { HomeArticleCard } from "./home-article-card";

type HomeLatestArticlesProps = {
  articles: PublishedArticle[];
};

export function HomeLatestArticles({ articles }: HomeLatestArticlesProps) {
  return (
    <section id="latest-articles" className="section-gradient-violet section-block">
      <div className="page-shell">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-indigo-700">知识整理</p>
            <h2 className="mt-2 text-2xl font-black text-ink sm:text-3xl">最新整理文章</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-500">
            围绕工具使用、效率技巧、AI 应用和开源项目做持续整理。
          </p>
        </div>

        {articles.length > 0 ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {articles.map((article) => (
              <HomeArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="glass-card mt-8 p-6 text-sm leading-7 text-slate-500">
            暂无已发布文章。发布文章后，这里会显示最新整理内容。
          </div>
        )}
      </div>
    </section>
  );
}
