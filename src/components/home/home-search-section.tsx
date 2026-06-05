"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const quickKeywords = ["AI 工具", "在线工具", "效率软件", "开源项目"];

export function HomeSearchSection() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  function getSearchPath(value: string) {
    const trimmedKeyword = value.trim();
    return trimmedKeyword ? `/search?q=${encodeURIComponent(trimmedKeyword)}` : "/search";
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(getSearchPath(keyword));
  }

  return (
    <section id="search" className="section-gradient-soft py-6 sm:py-8">
      <div className="page-shell">
        <div className="glass-card-strong liquid-border relative overflow-hidden rounded-[28px] border border-white/75 bg-white/72 p-4 shadow-[0_22px_70px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:p-5 lg:p-6">
          <div className="pointer-events-none absolute right-[-6rem] top-[-7rem] h-44 w-44 rounded-full bg-sky-100/76 blur-3xl" />
          <div className="pointer-events-none absolute bottom-[-7rem] left-[-8rem] h-44 w-44 rounded-full bg-cyan-100/66 blur-3xl" />

          <div className="relative mb-4 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="inline-flex rounded-full border border-sky-100 bg-sky-50/70 px-3 py-1 text-xs font-bold text-sky-700">
                全站搜索
              </p>
              <h2 className="mt-2 text-lg font-black leading-snug text-[#0f172a] sm:text-xl">
                快速找到你需要的工具或文章
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748b]">
                输入关键词，搜索工具名称、简介、文章标题和内容。
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="relative grid gap-2.5 sm:grid-cols-[1fr_auto]">
            <label className="sr-only" htmlFor="home-search">
              搜索工具或文章
            </label>
            <input
              id="home-search"
              type="search"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="搜索 AI 工具、在线工具、效率软件、开源项目..."
              className="h-12 w-full rounded-[18px] border border-white/90 bg-white/86 px-4 text-sm font-semibold text-[#0f172a] shadow-[inset_0_2px_12px_rgba(15,23,42,0.05)] outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:bg-white focus:ring-4 focus:ring-cyan-100 sm:h-14 sm:text-base"
            />
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center rounded-[16px] bg-[#0f172a] px-7 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-800 hover:shadow-lg sm:h-14"
            >
              搜索
            </button>
          </form>

          <div className="relative mt-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-bold text-slate-400">快速入口</span>
            {quickKeywords.map((item) => (
              <a
                key={item}
                href={getSearchPath(item)}
                className="rounded-full border border-slate-200/70 bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50 hover:text-[#0f172a]"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
