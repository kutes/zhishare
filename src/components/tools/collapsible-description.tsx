"use client";

import { useState } from "react";

type CollapsibleDescriptionProps = {
  title?: string;
  content?: string | null;
  className?: string;
};

export function CollapsibleDescription({
  title = "这个工具是什么",
  content,
  className = "",
}: CollapsibleDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const safeContent = typeof content === "string" ? content.trim() : "";

  if (!safeContent) {
    return null;
  }

  return (
    <section
      className={`relative rounded-[22px] border border-[#0f172a]/[0.08] bg-white/72 p-3.5 shadow-sm md:border-0 md:bg-transparent md:p-0 md:shadow-none ${className}`}
    >
      {title ? (
        <div className="mb-2 flex items-center justify-between gap-3 md:block">
          <p className="text-sm font-black text-[#0f172a] md:text-base">{title}</p>

          <span className="rounded-full border border-[#5ecfb1]/35 bg-[#f2fffa] px-2.5 py-1 text-[10px] font-black text-[#20a27f] md:hidden">
            简介
          </span>
        </div>
      ) : null}

      <div className="relative">
        <p
          className={[
            "whitespace-pre-line text-sm font-medium leading-7 text-[#475569] md:text-base md:leading-8",
            expanded
              ? "max-h-none"
              : "max-h-[5.4rem] overflow-hidden md:max-h-none md:overflow-visible",
          ].join(" ")}
        >
          {safeContent}
        </p>

        {!expanded ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white via-white/90 to-transparent md:hidden"
          />
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="mt-2.5 inline-flex w-full items-center justify-center rounded-2xl border border-[#5ecfb1]/45 bg-[#f8fffc] px-4 py-2 text-xs font-black text-[#20a27f] shadow-sm transition hover:-translate-y-0.5 hover:border-[#20a27f]/50 hover:bg-white md:hidden"
        aria-expanded={expanded}
      >
        {expanded ? "收起全文" : "展开全文"}
      </button>
    </section>
  );
}
