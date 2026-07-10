"use client";

import { useMemo, useState } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSectionPlainText, type ArticleItem } from "@/components/articles/article-content";
import type { ToolItem } from "@/types/tool";
import { SearchHero } from "./search-hero";
import { SearchControls, type SearchMode } from "./search-controls";
import { SearchResults } from "./search-results";

type SearchPageProps = {
  tools: ToolItem[];
  articles: ArticleItem[];
  initialQuery?: string;
};

export function SearchPage({ tools, articles, initialQuery = "" }: SearchPageProps) {
  const [query, setQuery] = useState(initialQuery);
  const [mode, setMode] = useState<SearchMode>("all");
  const normalizedQuery = normalizeText(query);
  const hasQuery = normalizedQuery.length > 0;

  const toolResults = useMemo(() => {
    if (!hasQuery) {
      return tools.slice(0, 3);
    }

    return tools.filter((tool) => normalizeText(getToolSearchText(tool)).includes(normalizedQuery));
  }, [hasQuery, normalizedQuery, tools]);

  const articleResults = useMemo(() => {
    if (!hasQuery) {
      return articles.slice(0, 3);
    }

    return articles.filter((article) => normalizeText(getArticleSearchText(article)).includes(normalizedQuery));
  }, [articles, hasQuery, normalizedQuery]);

  const visibleToolCount = mode === "articles" ? 0 : toolResults.length;
  const visibleArticleCount = mode === "tools" ? 0 : articleResults.length;
  const totalCount = visibleToolCount + visibleArticleCount;

  function handleKeyword(keyword: string) {
    setQuery(keyword);
    setMode("all");
  }

  function handleClear() {
    setQuery("");
    setMode("all");
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#f8fbff]">
      <SiteHeader />

      <main>
        <SearchHero onKeywordClick={handleKeyword} />

        <section className="section-gradient-soft">
          <div className="page-shell section-block">
            <SearchControls
              query={query}
              mode={mode}
              totalCount={totalCount}
              hasQuery={hasQuery}
              onQueryChange={setQuery}
              onModeChange={setMode}
              onKeywordClick={handleKeyword}
              onClear={handleClear}
            />

            <SearchResults
              mode={mode}
              hasQuery={hasQuery}
              query={query}
              tools={toolResults}
              articles={articleResults}
              onClear={handleClear}
            />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function getToolSearchText(tool: ToolItem) {
  return [
    tool.name,
    tool.tagline,
    tool.description,
    tool.category,
    tool.highlight,
    ...tool.tags,
    ...tool.detail.audience,
    ...tool.detail.scenarios,
  ].join(" ");
}

function getArticleSearchText(article: ArticleItem) {
  const sectionText = article.sections.map(getSectionPlainText).join(" ");

  return [article.title, article.summary, article.category, ...article.tags, sectionText].join(" ");
}
