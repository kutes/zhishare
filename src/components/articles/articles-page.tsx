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
    <div className="articles-page min-h-screen overflow-hidden">
      <SiteHeader />
      <main>
        <ArticlesHero totalCount={articles.length} filteredCount={filteredArticles.length} />

        <section className="section-block">
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

        <section className="section-block pt-0">
          <div className="page-shell">
            <div className="articles-list-head mb-6 sm:mb-8">
              <div>
                <p className="articles-section-eyebrow">精选文章</p>
                <h2 className="articles-section-title mt-2">整理成型的工具实战与效率指南</h2>
              </div>
              <p className="articles-section-copy mt-3 max-w-2xl">
                当前显示 {filteredArticles.length} / {articles.length} 篇。通过标题、摘要、分类和标签继续缩小范围。
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
