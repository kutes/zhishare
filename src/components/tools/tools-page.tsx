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
  { label: "写作问答", keyword: "写作", hint: "ChatGPT / Perplexity" },
  { label: "做图设计", keyword: "设计", hint: "Canva / Figma" },
  { label: "图片处理", keyword: "图片", hint: "Photopea / remove.bg / TinyPNG" },
  { label: "视频剪辑", keyword: "视频", hint: "CapCut" },
  { label: "编程辅助", keyword: "编程", hint: "Cursor / Supabase" },
  { label: "笔记整理", keyword: "笔记", hint: "Notion / Obsidian" },
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

  const categoryCount = useMemo(
    () => categories.filter((category) => category !== allOption && category.trim().length > 0).length,
    [categories],
  );

  const tagCount = useMemo(() => tags.filter((tag) => tag !== allOption && tag.trim().length > 0).length, [tags]);

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
    <div className="min-h-screen overflow-hidden bg-[#f8fbff]">
      <SiteHeader />

      <main>
        <ToolsHero totalCount={tools.length} categoryCount={categoryCount} tagCount={tagCount} />

        <section className="py-2 sm:py-3">
          <div className="page-shell">
            <div className="glass-card-strong liquid-border relative overflow-hidden rounded-[22px] border border-white/75 bg-white/72 p-3 shadow-[0_14px_44px_rgba(15,23,42,0.06)] backdrop-blur-2xl sm:p-4">
              <div className="pointer-events-none absolute right-[-5rem] top-[-5rem] h-36 w-36 rounded-full bg-sky-100/55 blur-3xl" />
              <div className="pointer-events-none absolute bottom-[-5rem] left-[-5rem] h-36 w-36 rounded-full bg-cyan-100/45 blur-3xl" />

              <div className="relative flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold text-sky-700">快速任务入口</p>
                  <h2 className="mt-1 text-sm font-black text-[#0f172a] sm:text-base">按你现在要做的事，先缩小工具范围</h2>
                </div>
                <p className="max-w-xl text-xs leading-5 text-slate-500">
                  点一下就能直接套用现有搜索，先看最相关的工具，再继续展开筛选。
                </p>
              </div>

              <div className="relative mt-3 flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
                {quickTasks.map((task) => (
                  <button
                    key={task.label}
                    type="button"
                    onClick={() => applyQuickTask(task.keyword)}
                    className="min-w-[118px] shrink-0 rounded-[16px] border border-slate-200/70 bg-white/78 px-3 py-2 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50 hover:shadow-[0_12px_26px_rgba(14,165,233,0.12)]"
                  >
                    <span className="block text-sm font-black text-[#0f172a]">{task.label}</span>
                    <span className="mt-0.5 block text-[11px] leading-4 text-slate-500">{task.hint}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-3 sm:py-4">
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

        {hasFeatured && (
          <section className="py-4 sm:py-5">
            <div className="page-shell">
              <div className="mb-3 flex items-center gap-3 sm:mb-4">
                <span className="h-7 w-1 rounded-full bg-gradient-to-b from-[#2563eb] to-[#0ea5e9]" />
                <h2 className="text-base font-black text-[#0f172a] sm:text-lg">精选推荐</h2>
                <span className="text-xs font-semibold text-slate-400">共 {featuredTools.length} 个</span>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {featuredTools.map((tool) => (
                  <FeaturedToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="section-gradient-cyan py-5 sm:py-6 lg:py-8">
          <div className="page-shell">
            <div className="mb-3 flex items-center gap-3 sm:mb-4">
              <span className="h-7 w-1 rounded-full bg-gradient-to-b from-[#14b8a6] to-[#0ea5e9]" />
              <h2 className="text-base font-black text-[#0f172a] sm:text-lg">全部工具</h2>
              <span className="text-xs font-semibold text-slate-400">{hasTools ? `共 ${filteredTools.length} 个` : ""}</span>
            </div>

            <ToolsGrid tools={filteredTools} onClear={clearFilters} />
          </div>
        </section>

        <section className="py-6 sm:py-8 lg:py-10">
          <div className="page-shell">
            <SponsorBanner />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
