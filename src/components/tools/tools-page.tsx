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

type QuickTask = {
  label: string;
  keyword: string;
  hint: string;
};

const allOption = "全部";
const FEATURED_COUNT = 2;

const quickTasks: QuickTask[] = [
  { label: "AI 写作", keyword: "写作", hint: "ChatGPT / Perplexity" },
  { label: "设计制图", keyword: "设计", hint: "Canva / Figma" },
  { label: "图片处理", keyword: "图片", hint: "Photopea / remove.bg / TinyPNG" },
  { label: "视频剪辑", keyword: "视频", hint: "CapCut" },
  { label: "编程助手", keyword: "编程", hint: "Cursor / Supabase" },
  { label: "笔记管理", keyword: "笔记", hint: "Notion / Obsidian" },
];

function normalizeOptions(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

export function ToolsPage({ tools }: ToolsPageProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(allOption);
  const [selectedTag, setSelectedTag] = useState(allOption);

  const categories = useMemo(
    () => [allOption, ...normalizeOptions(tools.map((tool) => tool.category))],
    [tools],
  );

  const tags = useMemo(
    () => [allOption, ...normalizeOptions(tools.flatMap((tool) => tool.tags))],
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

  const applyQuickTask = (keyword: string) => {
    setQuery(keyword);
    setSelectedCategory(allOption);
    setSelectedTag(allOption);
  };

  const featuredTools = filteredTools.slice(0, FEATURED_COUNT);
  const hasFeatured = featuredTools.length > 0;
  const hasTools = filteredTools.length > 0;

  return (
    <div className="zh-tools-page min-h-screen overflow-hidden">
      <SiteHeader />

      <main className="relative">
        <div className="zh-tools-ambient" aria-hidden="true" />
        <ToolsHero totalCount={tools.length} />

        <section className="py-3 sm:py-4 zh-tools-quick-section">
          <div className="page-shell zh-tools-shell">
            <div className="zh-tools-quick-panel">
              <div className="zh-tools-section-head">
                <div>
                  <p className="zh-tools-eyebrow">QUICK START</p>
                  <h2 className="zh-tools-subtitle">先按用途缩小范围，再进入筛选</h2>
                </div>
                <p className="zh-tools-section-copy">
                  点击一个方向，工具库会自动切换关键词，帮助你更快定位写作、设计、视频、编程等常用场景。
                </p>
              </div>

              <div className="zh-tools-quick-grid">
                {quickTasks.map((task) => (
                  <button
                    key={task.label}
                    type="button"
                    onClick={() => applyQuickTask(task.keyword)}
                    className="zh-tools-quick-card"
                  >
                    <span className="zh-tools-quick-title">{task.label}</span>
                    <span className="zh-tools-quick-hint">{task.hint}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-3 sm:py-4">
          <div className="page-shell zh-tools-shell">
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

        {hasFeatured && (
          <section className="py-4 sm:py-5">
            <div className="page-shell zh-tools-shell">
              <div className="zh-tools-section-head">
                <div>
                  <p className="zh-tools-eyebrow">FEATURED</p>
                  <h2 className="zh-tools-section-title">精选工具与开源项目</h2>
                </div>
                <span className="zh-tools-count">{featuredTools.length} items</span>
              </div>

              <div className="zh-tools-feature-grid">
                {featuredTools.map((tool) => (
                  <FeaturedToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-5 sm:py-6 lg:py-8">
          <div className="page-shell zh-tools-shell">
            <div className="zh-tools-section-head">
              <div>
                <p className="zh-tools-eyebrow">BROWSE</p>
                <h2 className="zh-tools-section-title">全部工具</h2>
              </div>
              <span className="zh-tools-count">{hasTools ? `${filteredTools.length} items` : "0 items"}</span>
            </div>

            <ToolsGrid tools={filteredTools} onClear={clearFilters} />
          </div>
        </section>

        <section className="py-6 sm:py-8 lg:py-10">
          <div className="page-shell zh-tools-shell">
            <SponsorBanner />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
