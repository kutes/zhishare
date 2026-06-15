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

  if (first.length > 28) {
    return `${first.slice(0, 28)}...`;
  }

  return first;
}

function DetailList({ section }: { section: MobileSection }) {
  const visibleItems = section.items.length > 0 ? section.items : [section.emptyText];

  return (
    <div className="tool-mobile-section-panel">
      <ul className="tool-mobile-section-list">
        {visibleItems.map((item, index) => (
          <li key={`${section.id}-${index}-${item.slice(0, 24)}`} className="tool-mobile-section-item">
            <span className={`tool-mobile-section-dot ${section.accentClass}`} />
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
    <div className="tool-mobile-section-row">
      <button type="button" onClick={onToggle} aria-expanded={open} className="tool-mobile-section-toggle">
        <span className={`tool-mobile-section-dot ${section.accentClass}`} />

        <div className="tool-mobile-section-copy">
          <div className="tool-mobile-section-title-row">
            <p className="tool-mobile-section-title">{section.title}</p>
            <span className="tool-mobile-section-label">{section.label}</span>
          </div>

          <p className="tool-mobile-section-summary">{getCompactSummary(section.items, section.emptyText)}</p>
        </div>

        <span className="tool-mobile-section-count">{count}</span>
        <span className="tool-mobile-section-chevron">{open ? "−" : "+"}</span>
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
        accentClass: "bg-[#e3a75f]",
      },
      {
        id: "target-users",
        title: "适合人群",
        label: "人群",
        items: targetUsers,
        emptyText: "适合想快速判断这款工具是否值得继续了解的用户。",
        accentClass: "bg-[#8bd3c7]",
      },
      {
        id: "use-cases",
        title: "使用场景",
        label: "场景",
        items: useCases,
        emptyText: "适合在访问官网前，先了解功能、用途和基本风险。",
        accentClass: "bg-[#9cc1ff]",
      },
      {
        id: "pros",
        title: "优点",
        label: "优势",
        items: pros,
        emptyText: "暂无内容",
        accentClass: "bg-[#a4d65e]",
      },
      {
        id: "cons",
        title: "缺点",
        label: "短板",
        items: cons,
        emptyText: "暂无内容",
        accentClass: "bg-[#f1a46b]",
      },
      {
        id: "risk",
        title: "风险提醒",
        label: "注意",
        items: getRiskItems(tool),
        emptyText: "工具信息可能会变化，具体价格、功能、授权和下载方式请以官网为准。",
        accentClass: "bg-[#f7d560]",
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
    <section className={`tool-mobile-sections md:hidden ${className}`.trim()}>
      <div className="tool-mobile-sections-shell">
        <div className="tool-mobile-sections-head">
          <div className="min-w-0">
            <p className="tool-detail-kicker">移动端速览</p>
            <h2 className="tool-mobile-sections-title">重点信息</h2>
            <p className="tool-mobile-sections-copy">先看摘要，再展开分类，可以减少无效滑动。</p>
          </div>

          <button type="button" onClick={handleToggleTable} aria-expanded={showTable} className="tool-mobile-sections-toggle">
            {showTable ? "收起分类" : "展开分类"}
          </button>
        </div>

        <div className="tool-mobile-sections-stats">
          <div className="tool-mobile-sections-stat">
            <p className="tool-mobile-sections-stat-label">分类</p>
            <p className="tool-mobile-sections-stat-value">{sections.length} 项</p>
          </div>
          <div className="tool-mobile-sections-stat">
            <p className="tool-mobile-sections-stat-label">信息</p>
            <p className="tool-mobile-sections-stat-value">{totalCount} 条</p>
          </div>
          <div className="tool-mobile-sections-stat">
            <p className="tool-mobile-sections-stat-label">模式</p>
            <p className="tool-mobile-sections-stat-value">折叠</p>
          </div>
        </div>
      </div>

      {showTable ? (
        <div className="tool-mobile-sections-list-wrap">
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
    </section>
  );
}
