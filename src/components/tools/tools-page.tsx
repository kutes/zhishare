"use client";

import { useMemo, useState } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { ToolItem } from "@/types/tool";
import { ToolsFilterPanel } from "./ToolsFilterPanel";
import { ToolsGrid } from "./tools-grid";
import { ToolsGridHeader } from "./ToolsGridHeader";
import { ToolsHero } from "./ToolsHero";

type ToolsPageProps = {
  tools: ToolItem[];
};

const allOption = "全部";

export function ToolsPage({ tools }: ToolsPageProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(allOption);
  const [selectedTag, setSelectedTag] = useState(allOption);

  const categories = useMemo(() => [allOption, ...Array.from(new Set(tools.map((tool) => tool.category)))], [tools]);

  const tags = useMemo(
    () => [allOption, ...Array.from(new Set(tools.flatMap((tool) => tool.tags)))],
    [tools],
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

  return (
    <div className="min-h-screen overflow-hidden bg-[#f8fbff]">
      <SiteHeader />
      <main>
        <ToolsHero totalCount={tools.length} />
        <section className="section-gradient-soft py-10 sm:py-12 lg:py-14">
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
        <section className="section-gradient-cyan section-block">
          <div className="page-shell">
            <ToolsGridHeader resultCount={filteredTools.length} totalCount={tools.length} />
            <ToolsGrid tools={filteredTools} onClear={clearFilters} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
