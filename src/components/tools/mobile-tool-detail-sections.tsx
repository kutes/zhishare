"use client";

import { useMemo, useState } from "react";
import { toListItems } from "@/lib/db/normalizers";
import type { ToolItem } from "@/types/tool";

type MobileToolDetailSectionsProps = {
  tool: ToolItem;
  className?: string;
};

type MobileSection = {
  id: string;
  title: string;
  label: string;
  items: string[];
  emptyText: string;
  accentClass: string;
};

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

function readTextArray(source: unknown, keys: string[]) {
  if (!source || typeof source !== "object") {
    return [];
  }

  const record = source as Record<string, unknown>;

  for (const key of keys) {
    const value = record[key];

    if (Array.isArray(value) || typeof value === "string") {
      return toListItems(value);
    }
  }

  return [];
}

function readDetail(tool: ToolItem) {
  return (tool as unknown as { detail?: Record<string, unknown> }).detail ?? {};
}

function getArray(tool: ToolItem, directKeys: string[], detailKeys: string[]) {
  const direct = readTextArray(tool, directKeys);

  if (direct.length > 0) {
    return direct;
  }

  return readTextArray(readDetail(tool), detailKeys);
}

function getRiskItems(tool: ToolItem) {
  const direct =
    readText(tool, ["risk_notice", "riskNotice"]) ||
    readText(readDetail(tool), ["risk_notice", "riskNotice", "risk"]);

  if (direct) {
    return [direct];
  }

  return ["工具信息可能会变化，具体价格、功能、授权和下载方式请以官网为准。"];
}

function getCompactSummary(items: string[], emptyText: string) {
  const first = items[0]?.trim() || emptyText;

  if (first.length > 26) {
    return `${first.slice(0, 26)}...`;
  }

  return first;
}

function DetailList({ section }: { section: MobileSection }) {
  const visibleItems = section.items.length > 0 ? section.items : [section.emptyText];

  return (
    <div className="bg-[#f8fbff] px-4 pb-4 pt-1">
      <ul className="space-y-2.5 rounded-[18px] border border-[#0f172a]/[0.06] bg-white/82 p-3">
        {visibleItems.map((item, index) => (
          <li key={`${section.id}-${index}-${item.slice(0, 24)}`} className="flex gap-2.5 text-sm font-medium leading-6 text-[#475569]">
            <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${section.accentClass}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InfoTableRow({
  section,
  open,
  onToggle,
}: {
  section: MobileSection;
  open: boolean;
  onToggle: () => void;
}) {
  const count = section.items.length || 1;

  return (
    <div className="border-t border-[#0f172a]/[0.06] first:border-t-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="grid w-full grid-cols-[auto_1fr_auto_auto] items-center gap-3 px-4 py-3.5 text-left transition hover:bg-[#f8fbff]"
      >
        <span className={`h-2.5 w-2.5 rounded-full ${section.accentClass}`} />

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-black text-[#0f172a]">{section.title}</p>
            <span className="rounded-full bg-[#f1f5f9] px-2 py-0.5 text-[10px] font-black text-[#64748b]">
              {section.label}
            </span>
          </div>

          <p className="mt-1 line-clamp-1 text-xs font-medium leading-5 text-[#64748b]">
            {getCompactSummary(section.items, section.emptyText)}
          </p>
        </div>

        <span className="rounded-full border border-[#0f172a]/10 bg-white px-2 py-1 text-[11px] font-black text-[#64748b] shadow-sm">
          {count}
        </span>

        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#0f172a]/10 bg-white text-base font-black text-[#0f172a] shadow-sm">
          {open ? "-" : "+"}
        </span>
      </button>

      {open ? <DetailList section={section} /> : null}
    </div>
  );
}

export function MobileToolDetailSections({ tool, className = "" }: MobileToolDetailSectionsProps) {
  const [showTable, setShowTable] = useState(false);
  const [openSectionId, setOpenSectionId] = useState<string | null>(null);

  const sections = useMemo<MobileSection[]>(() => {
    const detail = readDetail(tool);
    const description = readText(tool, ["description"]) || readText(detail, ["description"]);

    const features = getArray(
      tool,
      ["features", "core_features", "coreFeatures"],
      ["features", "core_features", "coreFeatures", "mainFeatures"],
    );

    const targetUsers = getArray(
      tool,
      ["target_users", "targetUsers", "audience"],
      ["target_users", "targetUsers", "audience", "suitableFor"],
    );

    const useCases = getArray(tool, ["use_cases", "useCases", "scenarios"], ["use_cases", "useCases", "scenarios"]);
    const pros = getArray(tool, ["pros", "advantages"], ["pros", "advantages"]);
    const cons = getArray(tool, ["cons", "limitations"], ["cons", "limitations"]);

    return [
      {
        id: "features",
        title: "核心功能",
        label: "功能",
        items: features.length > 0 ? features : description ? [description] : [],
        emptyText: "暂无内容",
        accentClass: "bg-[#60a5fa]",
      },
      {
        id: "target-users",
        title: "适合人群",
        label: "人群",
        items: targetUsers,
        emptyText: "适合想快速判断这个工具是否值得尝试的用户。",
        accentClass: "bg-[#5ecfb1]",
      },
      {
        id: "use-cases",
        title: "使用场景",
        label: "场景",
        items: useCases,
        emptyText: "适合在访问官网前，先了解功能、用途和基本风险。",
        accentClass: "bg-[#93c5fd]",
      },
      {
        id: "pros",
        title: "优点",
        label: "优势",
        items: pros,
        emptyText: "暂无内容",
        accentClass: "bg-[#84cc16]",
      },
      {
        id: "cons",
        title: "缺点",
        label: "避坑",
        items: cons,
        emptyText: "暂无内容",
        accentClass: "bg-[#fb923c]",
      },
      {
        id: "risk",
        title: "风险提醒",
        label: "注意",
        items: getRiskItems(tool),
        emptyText: "工具信息可能会变化，具体价格、功能、授权和下载方式请以官网为准。",
        accentClass: "bg-[#facc15]",
      },
    ];
  }, [tool]);

  const totalCount = sections.reduce((sum, section) => sum + Math.max(section.items.length, 1), 0);

  function handleToggleTable() {
    setShowTable((current) => {
      const next = !current;

      if (!next) {
        setOpenSectionId(null);
      }

      return next;
    });
  }

  return (
    <section className={`md:hidden ${className}`}>
      <div className="rounded-[28px] border border-[#0f172a]/[0.08] bg-white/90 shadow-[0_16px_42px_rgba(15,23,42,0.08)]">
        <div className="px-4 py-4">
          <p className="text-xs font-black text-[#20a27f]">移动端速览</p>

          <div className="mt-1 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-xl font-black tracking-[-0.04em] text-[#0f172a]">重点信息</h2>
              <p className="mt-1 text-xs font-medium leading-5 text-[#64748b]">先看摘要，想看细节再展开分类，减少无效滑动。</p>
            </div>

            <button
              type="button"
              onClick={handleToggleTable}
              aria-expanded={showTable}
              className="shrink-0 rounded-full border border-[#5ecfb1]/35 bg-[#f2fffa] px-3 py-1.5 text-[11px] font-black text-[#20a27f] shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
            >
              {showTable ? "收起分类" : "展开分类"}
            </button>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="rounded-[16px] border border-[#0f172a]/[0.06] bg-[#f8fbff] px-3 py-2">
              <p className="text-[10px] font-black text-[#94a3b8]">分类</p>
              <p className="mt-1 text-sm font-black text-[#0f172a]">{sections.length} 项</p>
            </div>

            <div className="rounded-[16px] border border-[#0f172a]/[0.06] bg-[#f8fbff] px-3 py-2">
              <p className="text-[10px] font-black text-[#94a3b8]">信息</p>
              <p className="mt-1 text-sm font-black text-[#0f172a]">{totalCount} 条</p>
            </div>

            <div className="rounded-[16px] border border-[#0f172a]/[0.06] bg-[#f8fbff] px-3 py-2">
              <p className="text-[10px] font-black text-[#94a3b8]">模式</p>
              <p className="mt-1 text-sm font-black text-[#0f172a]">折叠</p>
            </div>
          </div>
        </div>

        {showTable ? (
          <div className="border-t border-[#0f172a]/[0.06]">
            {sections.map((section) => (
              <InfoTableRow
                key={section.id}
                section={section}
                open={openSectionId === section.id}
                onToggle={() => setOpenSectionId((current) => (current === section.id ? null : section.id))}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
