"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const popularKeywords = ["AI 写作", "开源工具", "图片处理", "效率软件", "在线白板"];

export type HomeSearchItem = {
  slug: string;
  title: string;
};

type HomeSearchSectionProps = {
  tools: HomeSearchItem[];
  articles: HomeSearchItem[];
};

type ExactMatchResult =
  | {
      status: "none" | "multiple";
    }
  | {
      status: "unique";
      item: HomeSearchItem;
    };

export function HomeSearchSection({ tools, articles }: HomeSearchSectionProps) {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  function getSearchPath(value: string) {
    const trimmedKeyword = value.trim();

    if (!trimmedKeyword) {
      return "/search";
    }

    return `/search?q=${encodeURIComponent(trimmedKeyword)}`;
  }

  function resolveDestination(value: string) {
    const trimmedKeyword = value.trim();

    if (!trimmedKeyword) {
      return "/search";
    }

    const fallbackPath = getSearchPath(trimmedKeyword);
    const normalizedKeyword = normalizeExactText(trimmedKeyword);
    const toolMatch = findUniqueExactMatch(tools, normalizedKeyword);

    if (toolMatch.status === "multiple") {
      return fallbackPath;
    }

    if (toolMatch.status === "unique") {
      return `/tools/${toolMatch.item.slug}`;
    }

    const articleMatch = findUniqueExactMatch(articles, normalizedKeyword);

    if (articleMatch.status === "unique") {
      return `/articles/${articleMatch.item.slug}`;
    }

    return fallbackPath;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(resolveDestination(keyword));
  }

  return (
    <section id="search" className="section-gradient-soft py-10 sm:py-12">
      <div className="page-shell">
        <div className="glass-card-strong liquid-border p-4 sm:p-6 lg:p-7">
          <form
            action={getSearchPath(keyword)}
            method="get"
            className="grid gap-3 md:grid-cols-[1fr_auto]"
            onSubmit={handleSubmit}
          >
            <label className="sr-only" htmlFor="home-search">
              搜索工具
            </label>
            <input
              id="home-search"
              type="search"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="搜索工具、AI 应用、开源项目或使用技巧"
              className="min-h-14 w-full rounded-[20px] border border-white/80 bg-white/80 px-5 text-base text-ink shadow-inner outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:bg-white focus:ring-4 focus:ring-cyan-100 sm:min-h-16"
            />
            <button
              type="submit"
              className="min-h-14 rounded-[18px] bg-ink px-8 text-base font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-sky-800 hover:shadow-lg sm:min-h-16"
            >
              搜索
            </button>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
            <span className="mr-1 font-semibold text-slate-500">热门标签</span>
            {popularKeywords.map((keyword) => (
              <a
                key={keyword}
                href={getSearchPath(keyword)}
                className="rounded-full border border-white/80 bg-white/65 px-4 py-2 font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
              >
                {keyword}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function normalizeExactText(value: string) {
  return value.trim().toLowerCase();
}

function findUniqueExactMatch(items: HomeSearchItem[], normalizedKeyword: string): ExactMatchResult {
  const slugMatches = items.filter((item) => normalizeExactText(item.slug) === normalizedKeyword);

  if (slugMatches.length === 1) {
    return { status: "unique", item: slugMatches[0] };
  }

  if (slugMatches.length > 1) {
    return { status: "multiple" };
  }

  const titleMatches = items.filter((item) => normalizeExactText(item.title) === normalizedKeyword);

  if (titleMatches.length > 1) {
    return { status: "multiple" };
  }

  if (titleMatches.length === 1) {
    return { status: "unique", item: titleMatches[0] };
  }

  return { status: "none" };
}
