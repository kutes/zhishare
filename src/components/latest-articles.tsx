import type { MockArticle } from "@/data/mock-articles";
import { ArticleCard } from "./article-card";

type LatestArticlesProps = {
  articles: MockArticle[];
};

export function LatestArticles({ articles }: LatestArticlesProps) {
  return (
    <section id="latest-articles" className="section-gradient-violet section-block">
      <div className="page-shell">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-cyan-700">最新文章</p>
            <h2 className="mt-2 text-2xl font-black text-ink sm:text-3xl">把工具用得更稳一点</h2>
          </div>
          <p id="content-rule" className="max-w-xl text-sm leading-6 text-slate-500">
            内容坚持合法来源、清楚说明用途和限制，不做破解、盗版或侵权资源导流。
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
