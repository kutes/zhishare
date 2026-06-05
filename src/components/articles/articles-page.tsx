"use client";

import { useMemo, useState } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { ArticleItem } from "./article-content";
import { ArticlesFilterPanel } from "./articles-filter-panel";
import { ArticlesGrid } from "./articles-grid";
import { ArticlesHero } from "./articles-hero";

type ArticlesPageProps = {
  articles: ArticleItem[];
};

const allOption = "全部";

export function ArticlesPage({ articles }: ArticlesPageProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(allOption);
  const [selectedTag, setSelectedTag] = useState(allOption);

  const categories = useMemo(
    () => [allOption, ...Array.from(new Set(articles.map((article) => article.category)))],
    [articles],
  );

  const tags = useMemo(
    () => [allOption, ...Array.from(new Set(articles.flatMap((article) => article.tags)))],
    [articles],
  );

  const filteredArticles = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return articles.filter((article) => {
      const sectionText = article.sections
        .map((section) => {
          if (section.type === "paragraphs") {
            return [section.title, ...section.paragraphs].join(" ");
          }

          return [section.title, ...section.items].join(" ");
        })
        .join(" ");
      const matchesQuery =
        keyword.length === 0 ||
        [article.title, article.summary, article.category, ...article.tags, sectionText]
          .join(" ")
          .toLowerCase()
          .includes(keyword);
      const matchesCategory = selectedCategory === allOption || article.category === selectedCategory;
      const matchesTag = selectedTag === allOption || article.tags.includes(selectedTag);

      return matchesQuery && matchesCategory && matchesTag;
    });
  }, [articles, query, selectedCategory, selectedTag]);

  const clearFilters = () => {
    setQuery("");
    setSelectedCategory(allOption);
    setSelectedTag(allOption);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#f8fbff]">
      <SiteHeader />
      <main>
        <ArticlesHero totalCount={articles.length} />
        <section className="section-gradient-soft py-10 sm:py-12 lg:py-14">
          <div className="page-shell">
            <ArticlesFilterPanel
              categories={categories}
              tags={tags}
              query={query}
              selectedCategory={selectedCategory}
              selectedTag={selectedTag}
              resultCount={filteredArticles.length}
              onQueryChange={setQuery}
              onCategoryChange={setSelectedCategory}
              onTagChange={setSelectedTag}
              onClear={clearFilters}
            />
          </div>
        </section>
        <section className="section-gradient-violet section-block">
          <div className="page-shell">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-indigo-700">文章列表</p>
                <h2 className="mt-2 text-2xl font-black text-ink sm:text-3xl">最新整理文章</h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-slate-500">
                当前显示 {filteredArticles.length} / {articles.length} 篇文章。
              </p>
            </div>
            <ArticlesGrid articles={filteredArticles} onClear={clearFilters} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
