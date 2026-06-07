import Link from "next/link";
import type { PublishedArticle } from "@/types/article";
import { HomeArticleCard } from "./home-article-card";
import { homeShellClassName } from "./home-visual-utils";

type HomeLatestArticlesProps = {
  articles: PublishedArticle[];
};

export function HomeLatestArticles({ articles }: HomeLatestArticlesProps) {
  const latestArticles = articles.slice(0, 3);

  return (
    <section id="latest-articles" className="relative bg-[#f7fbf6]/70 py-6 sm:py-7 lg:py-8">
      <div className={homeShellClassName}>
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black text-[#34a987]">阅读预览</p>
            <h2 className="mt-1 text-2xl font-black text-[#0f172a] sm:text-3xl">最新文章</h2>
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[#64748b]">
              用简单易懂的方式整理工具选择、使用教程和避坑经验。
            </p>
          </div>
          <Link
            href="/articles"
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-[16px] border border-[#0f172a]/[0.10] bg-white px-4 text-sm font-black text-[#0f172a] shadow-[3px_3px_0_rgba(125,211,188,0.18)] transition hover:-translate-y-0.5 hover:border-[#5ecfb1] hover:bg-[#f7fbf6]"
          >
            查看全部文章
          </Link>
        </div>

        {latestArticles.length > 0 ? (
          <div className="mt-3.5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((article) => (
              <HomeArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="mt-3.5 rounded-[22px] border border-dashed border-[#0f172a]/14 bg-white/78 p-4 text-sm leading-7 text-[#64748b] shadow-[5px_5px_0_rgba(250,204,21,0.12)]">
            暂时还没有文章，正在整理中。
          </div>
        )}
      </div>
    </section>
  );
}
