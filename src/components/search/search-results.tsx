import type { ReactNode } from "react";
import { AdPlaceholder } from "@/components/common/AdPlaceholder";
import { ArticleCard } from "@/components/articles/article-card";
import type { ArticleItem } from "@/components/articles/article-content";
import { ToolCard } from "@/components/tools/ToolCard";
import type { ToolItem } from "@/types/tool";
import type { SearchMode } from "./search-controls";

type SearchResultsProps = {
  mode: SearchMode;
  hasQuery: boolean;
  query: string;
  tools: ToolItem[];
  articles: ArticleItem[];
  onClear: () => void;
};

export function SearchResults({ mode, hasQuery, query, tools, articles, onClear }: SearchResultsProps) {
  const showTools = mode !== "articles";
  const showArticles = mode !== "tools";
  const visibleToolCount = showTools ? tools.length : 0;
  const visibleArticleCount = showArticles ? articles.length : 0;
  const totalCount = visibleToolCount + visibleArticleCount;
  const shouldShowBothSections = visibleToolCount > 0 && visibleArticleCount > 0;

  if (!hasQuery && totalCount === 0) {
    return (
      <section className="glass-card mt-8 p-8 text-center sm:p-10">
        <p className="text-sm font-bold text-sky-700">推荐起点</p>
        <h2 className="mt-3 text-2xl font-black text-ink">暂无可搜索内容</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
          发布工具或文章后，这里会显示推荐内容和搜索结果。
        </p>
      </section>
    );
  }

  if (hasQuery && totalCount === 0) {
    return <SearchEmptyState onClear={onClear} />;
  }

  return (
    <section className="mt-8" aria-label="搜索结果">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold text-sky-700">{hasQuery ? "搜索结果" : "推荐起点"}</p>
          <h2 className="mt-2 text-2xl font-black text-ink">
            {hasQuery ? `关于“${query.trim()}”的内容` : "你可以从这些内容开始"}
          </h2>
        </div>
        <p className="w-fit rounded-full border border-white/80 bg-white/62 px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
          工具 {visibleToolCount} 个 · 文章 {visibleArticleCount} 篇
        </p>
      </div>

      <div className="grid gap-8">
        {visibleToolCount > 0 ? (
          <ResultSection title="工具结果" count={`${visibleToolCount} 个工具`}>
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </ResultSection>
        ) : null}

        {shouldShowBothSections ? <SearchAd /> : null}

        {visibleArticleCount > 0 ? (
          <ResultSection title="文章结果" count={`${visibleArticleCount} 篇文章`}>
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </ResultSection>
        ) : null}

        {!shouldShowBothSections && totalCount > 0 ? <SearchAd /> : null}
      </div>
    </section>
  );
}

function ResultSection({
  title,
  count,
  children,
}: {
  title: string;
  count: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xl font-black text-ink">{title}</h3>
        <span className="w-fit rounded-full border border-white/80 bg-white/62 px-3 py-1.5 text-xs font-bold text-slate-500 shadow-sm">
          {count}
        </span>
      </div>
      <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}

function SearchAd() {
  return (
    <div className="col-span-full">
      <AdPlaceholder
        variant="banner"
        title="合作推广"
        description="这里可以展示赞助工具、精选服务或广告内容"
      />
    </div>
  );
}

function SearchEmptyState({ onClear }: { onClear: () => void }) {
  return (
    <section className="glass-card mt-8 p-8 text-center sm:p-10">
      <p className="text-sm font-bold text-sky-700">搜索结果</p>
      <h2 className="mt-3 text-2xl font-black text-ink">没有找到相关内容</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
        可以尝试换一个关键词，或减少筛选条件。
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-6 min-h-12 rounded-2xl bg-ink px-6 py-3 text-sm font-bold text-white shadow-[0_18px_45px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-[0_24px_60px_rgba(15,23,42,0.24)]"
      >
        清空搜索
      </button>
    </section>
  );
}
