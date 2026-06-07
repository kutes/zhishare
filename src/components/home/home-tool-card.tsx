import Link from "next/link";
import type { ToolItem } from "@/types/tool";
import {
  getToolAudience,
  getToolCategory,
  getToolHref,
  getToolInitials,
  getToolSummary,
  getToolTags,
  getToolTitle,
} from "./home-visual-utils";

type HomeToolCardProps = {
  tool: ToolItem;
  index?: number;
};

const cardTones = [
  {
    paper: "bg-[#f8fcff]",
    sketch: "bg-[#eaf6ff]",
    tape: "bg-[#fde68a]",
    accent: "text-[#2563eb]",
    dot: "bg-[#5ecfb1]",
  },
  {
    paper: "bg-[#fbfff7]",
    sketch: "bg-[#f3fbef]",
    tape: "bg-[#bfdbfe]",
    accent: "text-[#20a27f]",
    dot: "bg-[#93c5fd]",
  },
  {
    paper: "bg-[#fffdf6]",
    sketch: "bg-[#fff8db]",
    tape: "bg-[#d9f99d]",
    accent: "text-[#d69e00]",
    dot: "bg-[#facc15]",
  },
];

function DoodleCardArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 120" fill="none" className={className} aria-hidden="true">
      <path
        d="M24 80c24-18 49-25 75-20 22 5 40 17 68 7"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="3 10"
      />
      <path
        d="M48 84c23 0 42 1 58 6"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M142 28c2 10 8 16 19 18-11 2-17 8-19 20-2-12-8-18-19-20 11-2 17-8 19-18Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <rect
        x="28"
        y="34"
        width="56"
        height="42"
        rx="14"
        stroke="currentColor"
        strokeWidth="3"
        strokeDasharray="5 8"
      />
      <path
        d="M104 40h46M104 56h34"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MobileToolItem({
  tool,
  index = 0,
}: {
  tool: ToolItem;
  index?: number;
}) {
  const title = getToolTitle(tool);
  const summary = getToolSummary(tool);
  const category = getToolCategory(tool);
  const tags = getToolTags(tool, 2);
  const href = getToolHref(tool);
  const initials = getToolInitials(title);
  const tone = cardTones[index % cardTones.length];

  return (
    <article className="group relative flex min-h-[100px] items-center gap-3 overflow-hidden rounded-[22px] border border-[#0f172a]/[0.08] bg-white p-3.5 shadow-[0_10px_20px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(15,23,42,0.09)] md:hidden">
      <span
        aria-hidden="true"
        className={`absolute left-4 top-0 h-2 w-12 -translate-y-1/2 -rotate-3 rounded-full ${tone.tape}`}
      />
      <div className="flex h-14 w-14 shrink-0 rotate-[-2deg] items-center justify-center rounded-[18px] border-2 border-white bg-[#5ecfb1] text-base font-black text-white shadow-sm">
        {initials}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-full border border-[#5ecfb1]/40 bg-[#f7fbf6] px-2 py-0.5 text-[10px] font-black text-[#20a27f]">
            {category}
          </span>
          {tags.slice(0, 1).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[#0f172a]/[0.08] bg-[#f8fbff] px-2 py-0.5 text-[10px] font-black text-[#64748b]"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="mt-1 truncate text-base font-black tracking-[-0.03em] text-[#0f172a]">
          {title}
        </h3>

        <p className="mt-0.5 line-clamp-1 text-xs leading-5 text-[#64748b]">
          {summary}
        </p>

        <div className="mt-1 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[#0f172a]/[0.08] bg-white px-2 py-0.5 text-[10px] font-bold text-[#64748b]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <Link
        href={href}
        className="inline-flex h-8 shrink-0 items-center justify-center rounded-[14px] bg-[#0f172a] px-3 text-xs font-black text-white shadow-[0_8px_16px_rgba(15,23,42,0.14)] transition hover:bg-[#111827]"
      >
        详情
      </Link>
    </article>
  );
}

function DesktopToolCard({
  tool,
  index = 0,
}: {
  tool: ToolItem;
  index?: number;
}) {
  const title = getToolTitle(tool);
  const summary = getToolSummary(tool);
  const category = getToolCategory(tool);
  const tags = getToolTags(tool, 2);
  const audience = getToolAudience(tool);
  const href = getToolHref(tool);
  const initials = getToolInitials(title);
  const tone = cardTones[index % cardTones.length];

  return (
    <article
      className={`group relative hidden min-h-[330px] flex-col overflow-hidden rounded-[28px] border-2 border-[#0f172a]/[0.08] ${tone.paper} p-4 shadow-[0_14px_34px_rgba(15,23,42,0.07)] transition hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(15,23,42,0.11)] md:flex`}
    >
      <span
        aria-hidden="true"
        className={`absolute left-7 top-0 h-2 w-16 rotate-[-3deg] rounded-full ${tone.tape}`}
      />

      <div className={`relative mb-4 overflow-hidden rounded-[22px] border border-[#0f172a]/[0.08] ${tone.sketch} p-4`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-14 w-14 rotate-[-2deg] items-center justify-center rounded-2xl border-2 border-white bg-[#5ecfb1] text-base font-black text-white shadow-sm">
            {initials}
          </div>

          <span className="rounded-full border border-[#5ecfb1]/40 bg-white/80 px-3 py-1 text-xs font-black text-[#20a27f] shadow-sm">
            {category}
          </span>
        </div>

        <DoodleCardArt className={`mt-2 h-20 w-full ${tone.accent} opacity-75`} />

        <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/45" />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[#0f172a]/[0.08] bg-white/82 px-2.5 py-1 text-[11px] font-black text-[#64748b]"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="mt-3 text-xl font-black tracking-[-0.04em] text-[#0f172a]">
          {title}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-[#475569]">
          {summary}
        </p>

        <div className="mt-4 rounded-[18px] border border-[#0f172a]/[0.08] bg-[#fffdf4] px-3 py-2">
          <p className="text-[11px] font-black text-[#20a27f]">适合谁</p>
          <p className="mt-1 line-clamp-1 text-xs font-bold text-[#475569]">
            {audience}
          </p>
        </div>

        <Link
          href={href}
          className="mt-auto inline-flex h-11 items-center justify-center rounded-2xl bg-[#0f172a] px-4 text-sm font-black text-white shadow-[0_12px_24px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:bg-[#111827]"
        >
          查看详情
        </Link>
      </div>

      <div className={`pointer-events-none absolute bottom-5 right-5 h-2 w-2 rounded-full ${tone.dot}`} />
    </article>
  );
}

export function HomeToolCard({ tool, index = 0 }: HomeToolCardProps) {
  return (
    <>
      <MobileToolItem tool={tool} index={index} />
      <DesktopToolCard tool={tool} index={index} />
    </>
  );
}
