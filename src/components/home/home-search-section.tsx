"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const quickKeywords = ["AI", "设计", "效率", "开源"];

function DoodleSearchMark() {
  return (
    <svg viewBox="0 0 96 28" fill="none" className="h-5 w-20 text-[#5ecfb1]" aria-hidden="true">
      <path
        d="M4 18c15-8 30-11 45-9 14 2 27 7 43 3"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DoodleSpark() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="h-8 w-8 text-[#facc15]" aria-hidden="true">
      <path
        d="M22 4c2 10 7 16 18 18-11 2-16 8-18 22C20 30 14 24 4 22c10-2 16-8 18-18Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
    <section className="relative z-20 -mt-7 px-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1240px]">
        <form
          action="/search"
          method="get"
          onSubmit={handleSubmit}
          className="relative overflow-hidden rounded-[28px] border-2 border-[#0f172a]/[0.08] bg-white/92 p-3 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur"
        >
          <div className="pointer-events-none absolute left-7 top-0 h-2 w-24 rotate-[-2deg] rounded-full bg-[#fde68a]" />
          <div className="pointer-events-none absolute right-8 top-4 hidden sm:block">
            <DoodleSpark />
          </div>

          <div className="relative grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
            <div className="relative">
              <input
                id="home-search"
                name="q"
                type="search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="搜索 AI、设计、效率、开源工具..."
                className="h-12 w-full rounded-[20px] border border-[#0f172a]/[0.10] bg-[#f8fbff] px-5 pr-12 text-sm font-bold text-[#0f172a] outline-none transition placeholder:text-[#94a3b8] focus:border-[#5ecfb1]/70 focus:bg-white focus:ring-4 focus:ring-[#5ecfb1]/15"
              />

              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#93c5fd]">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                  <path
                    d="m20 20-4.5-4.5M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            <button
              type="submit"
              className="h-12 rounded-[20px] bg-[#0f172a] px-8 text-sm font-black text-white shadow-[0_12px_24px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-[#111827] md:min-w-[118px]"
            >
              搜索
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 pl-1">
            <span className="text-xs font-black text-[#94a3b8]">热门</span>

            {quickKeywords.map((item) => (
              <Link
                key={item}
                href={`/search?q=${encodeURIComponent(item)}`}
                className="inline-flex h-7 items-center rounded-full border border-[#0f172a]/[0.08] bg-white px-3 text-xs font-black text-[#475569] transition hover:-translate-y-0.5 hover:border-[#5ecfb1]/60 hover:text-[#20a27f]"
              >
                {item}
              </Link>
            ))}

            <div className="ml-auto hidden text-[#5ecfb1] sm:block">
              <DoodleSearchMark />
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
