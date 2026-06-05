"use client";

import { useMemo, useState } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { ToolItem } from "@/types/tool";
import { FeaturedToolCard } from "./FeaturedToolCard";
import { SponsorBanner } from "./SponsorBanner";
import { ToolsFilterPanel } from "./ToolsFilterPanel";
import { ToolsGrid } from "./tools-grid";
import { ToolsHero } from "./ToolsHero";

type ToolsPageProps = {
  tools: ToolItem[];
};

const allOption = "全部";
const FEATURED_COUNT = 2;

export function ToolsPage({ tools }: ToolsPageProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(allOption);
  const [selectedTag, setSelectedTag] = useState(allOption);

  const categories = useMemo(
    () => [allOption, ...Array.from(new Set(tools.map((tool) => tool.category)))],
    [tools],
  );

  const tags = useMemo(
    () => [allOption, ...Array.from(new Set(tools.flatMap((tool) => tool.tags)))],
    [tools],
  );

  const categoryCount = useMemo(
    () => categories.filter((category) => category !== allOption && category.trim().length > 0).length,
    [categories],
  );

  const tagCount = useMemo(
    () => tags.filter((tag) => tag !== allOption && tag.trim().length > 0).length,
    [tags],
  );

  const filteredTools = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return tools.filter((tool) => {
      const matchesQuery =
        keyword.length === 0 ||
        [
          tool.name,
          tool.tagline,
          tool.description,
          tool.category,
          tool.highlight,
          ...tool.tags,
          ...tool.detail.audience,
          ...tool.detail.scenarios,
        ]
          .join(" ")
          .toLowerCase()
          .includes(keyword);

      const matchesCategory = selectedCategory === allOption || tool.category === selectedCategory;
      const matchesTag = selectedTag === allOption || tool.tags.includes(selectedTag);

      return matchesQuery && matchesCategory && matchesTag;
    });
  }, [query, selectedCategory, selectedTag, tools]);

  const clearFilters = () => {
    setQuery("");
    setSelectedCategory(allOption);
    setSelectedTag(allOption);
  };

  const featuredTools = filteredTools.slice(0, FEATURED_COUNT);
  const hasFeatured = featuredTools.length > 0;
  const hasTools = filteredTools.length > 0;

  return (
    <div className="min-h-screen overflow-hidden bg-[#f8fbff]">
      <SiteHeader />

      <main>
        {/* 1. Hero */}
        <ToolsHero totalCount={tools.length} categoryCount={categoryCount} tagCount={tagCount} />

        {/* 2. Search & Filter */}
        <section className="py-4 sm:py-5">
          <div className="page-shell">
            <ToolsFilterPanel
              categories={categories}
              tags={tags}
              query={query}
              selectedCategory={selectedCategory}
              selectedTag={selectedTag}
              resultCount={filteredTools.length}
              onQueryChange={setQuery}
              onCategoryChange={setSelectedCategory}
              onTagChange={setSelectedTag}
              onClear={clearFilters}
            />
          </div>
        </section>

        {/* 3. Featured Section */}
        {hasFeatured && (
          <section className="py-5 sm:py-6">
            <div className="page-shell">
              <div className="mb-4 flex items-center gap-3 sm:mb-5">
                <span className="h-8 w-1 rounded-full bg-gradient-to-b from-[#2563eb] to-[#0ea5e9]" />
                <h2 className="text-lg font-black text-[#0f172a] sm:text-xl">精选推荐</h2>
                <span className="text-xs font-semibold text-slate-400">
                  共 {featuredTools.length} 个
                </span>
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {featuredTools.map((tool) => (
                  <FeaturedToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 4. All Tools Grid */}
        <section className="section-gradient-cyan py-6 sm:py-8 lg:py-10">
          <div className="page-shell">
            <div className="mb-4 flex items-center gap-3 sm:mb-5">
              <span className="h-8 w-1 rounded-full bg-gradient-to-b from-[#14b8a6] to-[#0ea5e9]" />
              <h2 className="text-lg font-black text-[#0f172a] sm:text-xl">
                全部工具
              </h2>
              <span className="text-xs font-semibold text-slate-400">
                {hasTools ? `共 ${filteredTools.length} 个` : ""}
              </span>
            </div>

            <ToolsGrid tools={filteredTools} onClear={clearFilters} />
          </div>
        </section>

        {/* 5. Sponsor Banner */}
        <section className="py-8 sm:py-10 lg:py-12">
          <div className="page-shell">
            <SponsorBanner />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
