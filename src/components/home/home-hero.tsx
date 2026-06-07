import Link from "next/link";
import type { ToolItem } from "@/types/tool";

type HomeHeroProps = {
  tools: ToolItem[];
  toolCount: number;
  articleCount?: number;
};

type DoodleProps = {
  className?: string;
};

const heroChips = ["人工筛选", "持续更新", "来源清晰", "适合小白"];

function readText(source: unknown, keys: string[]) {
  if (!source || typeof source !== "object") {
    return "";
  }

  const record = source as Record<string, unknown>;

  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function getToolName(tool: ToolItem) {
  return readText(tool, ["name", "title"]) || "等待收录";
}

function getInitials(title: string) {
  const cleaned = title.trim();

  if (!cleaned) {
    return "KT";
  }

  const englishWords = cleaned.match(/[a-zA-Z0-9]+/g);

  if (englishWords?.length) {
    return englishWords
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  }

  return cleaned.slice(0, 2).toUpperCase();
}

function DoodleCloud({ className }: DoodleProps) {
  return (
    <svg className={className} viewBox="0 0 120 48" fill="none" aria-hidden="true">
      <path
        d="M22 33h71c11 0 19-6 19-15S103 5 93 7C89 2 82 0 75 2c-8 2-13 8-14 16-4-3-9-4-15-3-8 2-13 7-14 15H22c-8 0-14-5-14-12S14 6 22 6c6 0 11 3 14 8"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DoodlePlane({ className }: DoodleProps) {
  return (
    <svg className={className} viewBox="0 0 96 72" fill="none" aria-hidden="true">
      <path
        d="M8 34 86 7 59 64 45 41 8 34Z"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M45 41 86 7" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path
        d="M18 55c8 5 19 8 34 7"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="2 8"
      />
    </svg>
  );
}

function DoodleStars({ className }: DoodleProps) {
  return (
    <svg className={className} viewBox="0 0 96 52" fill="none" aria-hidden="true">
      <path
        d="M18 4c2 10 7 15 17 17-10 2-15 7-17 17C16 28 11 23 1 21c10-2 15-7 17-17Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M67 11c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M88 31c1 4 3 6 7 7-4 1-6 3-7 7-1-4-3-6-7-7 4-1 6-3 7-7Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DoodleUnderline({ className }: DoodleProps) {
  return (
    <svg className={className} viewBox="0 0 360 28" fill="none" aria-hidden="true">
      <path
        d="M8 18c54-8 108-11 162-9 58 2 116 8 182 2"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DoodleArrow({ className }: DoodleProps) {
  return (
    <svg className={className} viewBox="0 0 112 72" fill="none" aria-hidden="true">
      <path
        d="M5 48c22-24 47-31 76-23"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="2 9"
      />
      <path
        d="M75 7 95 30 65 36"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeroControlPanel({
  tools,
  toolCount,
  articleCount,
}: {
  tools: ToolItem[];
  toolCount: number;
  articleCount: number;
}) {
  const recentTools = tools.slice(0, 3).map(getToolName);
  const displayRecentTools = recentTools.length > 0 ? recentTools : ["等待收录"];

  return (
    <div className="relative hidden md:block">
      <div className="absolute -left-12 top-8 text-[#34a987]">
        <DoodleArrow className="h-16 w-24" />
      </div>

      <div className="relative w-full max-w-[470px] rotate-[-1deg] rounded-[34px] border-2 border-dashed border-[#0f172a]/15 bg-white/88 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur">
        <div className="absolute -right-8 -top-8 text-[#34a987]">
          <DoodlePlane className="h-16 w-20" />
        </div>

        <div className="absolute -left-5 top-6 h-7 w-20 rotate-[-4deg] rounded-full bg-[#fde68a]" />

        <div className="relative rounded-[26px] border border-[#0f172a]/10 bg-[#f8fbff] p-4">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black text-[#34a987]">知享控制台</p>
              <h2 className="mt-1 text-2xl font-black text-[#0f172a]">今日发现板</h2>
            </div>

            <span className="rounded-full border border-[#5ecfb1]/50 bg-[#eafff7] px-3 py-1 text-[11px] font-black text-[#20a27f]">
              LIVE
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[20px] border border-[#93c5fd]/30 bg-[#eaf6ff] p-4">
              <p className="text-xs font-bold text-[#475569]">已收录工具</p>
              <p className="mt-2 text-4xl font-black text-[#0f172a]">{toolCount}</p>
              <p className="mt-1 text-xs font-bold text-[#2563eb]">真实发布数据</p>
            </div>

            <div className="rounded-[20px] border border-[#5ecfb1]/25 bg-[#f4fbef] p-4">
              <p className="text-xs font-bold text-[#475569]">已发布文章</p>
              <p className="mt-2 text-4xl font-black text-[#0f172a]">{articleCount}</p>
              <p className="mt-1 text-xs font-bold text-[#34a987]">真实发布数据</p>
            </div>
          </div>

          <div className="mt-3 rounded-[20px] border border-[#0f172a]/10 bg-white px-4 py-3">
            <p className="mb-2 text-xs font-black text-[#0f172a]">最近更新</p>
            <div className="flex flex-wrap gap-2">
              {displayRecentTools.map((toolName, index) => (
                <span
                  key={`${toolName}-${index}`}
                  className="rounded-full border border-[#0f172a]/10 bg-[#fffdf4] px-3 py-1 text-xs font-black text-[#0f172a]"
                >
                  {toolName}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-end justify-between gap-3">
            <div className="flex -space-x-2">
              {displayRecentTools.slice(0, 3).map((toolName, index) => (
                <span
                  key={`${toolName}-${index}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#5ecfb1] text-xs font-black text-white shadow-sm"
                >
                  {getInitials(toolName)}
                </span>
              ))}
            </div>

            <div className="rotate-[-2deg] rounded-[16px] border border-[#facc15] bg-[#fff7cf] px-4 py-3 text-xs font-black leading-5 text-[#0f172a] shadow-sm">
              好工具，
              <br />
              让效率和灵感一起发生。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HomeHero({ tools, toolCount, articleCount = 0 }: HomeHeroProps) {
  const safeToolCount = Number.isFinite(toolCount) ? toolCount : 0;
  const safeArticleCount = Number.isFinite(articleCount) ? articleCount : 0;

  return (
    <section className="relative overflow-hidden border-b border-[#0f172a]/[0.06] bg-[linear-gradient(135deg,#f8fbff_0%,#edf8ff_48%,#f7fbf6_100%)]">
      <div className="pointer-events-none absolute inset-0 opacity-[0.42] [background-image:linear-gradient(rgba(15,23,42,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.055)_1px,transparent_1px)] [background-size:36px_36px]" />

      <div className="pointer-events-none absolute left-[6%] top-24 text-[#76b9ff]">
        <DoodleCloud className="h-12 w-28" />
      </div>

      <div className="pointer-events-none absolute right-[5%] top-20 hidden text-[#34a987] lg:block">
        <DoodlePlane className="h-16 w-24" />
      </div>

      <div className="pointer-events-none absolute bottom-12 right-[18%] hidden text-[#facc15] lg:block">
        <DoodleStars className="h-12 w-24" />
      </div>

      <div className="relative mx-auto grid min-h-[390px] w-full max-w-[1240px] items-center gap-6 px-5 py-8 sm:px-6 sm:py-10 lg:grid-cols-[minmax(0,1fr)_470px] lg:px-8 lg:py-12">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex rotate-[-1deg] rounded-full border border-[#5ecfb1]/45 bg-white/86 px-4 py-1.5 text-sm font-black text-[#20a27f] shadow-sm">
            人工筛选 · 适合小白
          </span>

          <div className="relative mt-5 inline-block max-w-full">
            <div className="pointer-events-none absolute -left-5 -top-4 h-8 w-20 rotate-[-7deg] rounded-full bg-[#e0f2fe]" />
            <div className="pointer-events-none absolute -right-8 top-1 h-7 w-16 rotate-[8deg] rounded-full bg-[#fde68a]" />

            <h1 className="relative z-10 inline-flex max-w-full items-end gap-2 text-[clamp(2.8rem,9vw,7.2rem)] font-black leading-[0.82] tracking-[-0.09em] text-[#0f172a] drop-shadow-[0_10px_0_rgba(94,207,177,0.16)]">
              <span className="relative inline-block">
                KT
                <span className="pointer-events-none absolute -right-2 -top-2 h-3 w-3 rounded-full bg-[#facc15]" />
              </span>
              <span className="relative inline-block tracking-[-0.12em]">
                严选
                <span className="pointer-events-none absolute -right-5 top-1 text-3xl text-[#facc15] sm:text-4xl">
                  ✦
                </span>
              </span>
            </h1>

            <div className="pointer-events-none relative z-0 mt-1 h-4.5 w-[88%] text-[#5ecfb1]">
              <DoodleUnderline className="h-full w-full" />
            </div>

            <p className="mt-1.5 inline-flex rotate-[-1deg] rounded-2xl border border-[#0f172a]/10 bg-[#fffdf4] px-4 py-2 text-sm font-black text-[#0f172a] shadow-sm">
              工具与知识发现站
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {heroChips.map((chip) => (
              <span
                key={chip}
                className="inline-flex items-center gap-2 rounded-full border border-[#5ecfb1]/35 bg-white/78 px-3.5 py-1.5 text-sm font-bold text-[#0f172a] shadow-sm"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#5ecfb1]" />
                {chip}
              </span>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/tools"
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#0f172a] px-6 text-sm font-black text-white shadow-[0_14px_28px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-[#111827]"
            >
              进入工具库
            </Link>

            <Link
              href="/articles"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-[#0f172a]/10 bg-white px-6 text-sm font-black text-[#0f172a] shadow-sm transition hover:-translate-y-0.5 hover:border-[#5ecfb1]/50"
            >
              阅读文章
            </Link>
          </div>

          <div className="mt-3 inline-flex rounded-full border border-[#93c5fd]/35 bg-white/72 px-4 py-2 text-xs font-bold text-[#64748b] shadow-sm md:hidden">
            已收录 {safeToolCount} 个工具 · 已发布 {safeArticleCount} 篇文章
          </div>
        </div>

        <HeroControlPanel tools={tools} toolCount={safeToolCount} articleCount={safeArticleCount} />
      </div>
    </section>
  );
}
