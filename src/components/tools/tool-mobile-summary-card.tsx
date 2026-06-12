import { CollapsibleDescription } from "./collapsible-description";
import type { ToolItem } from "@/types/tool";

type ToolMobileSummaryCardProps = {
  tool: ToolItem;
  className?: string;
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

function readBoolean(source: unknown, keys: string[]) {
  if (!source || typeof source !== "object") {
    return null;
  }

  const record = source as Record<string, unknown>;

  for (const key of keys) {
    const value = record[key];

    if (typeof value === "boolean") {
      return value;
    }
  }

  return null;
}

function readTags(tool: ToolItem) {
  const rawTags = (tool as unknown as { tags?: unknown }).tags;

  if (!Array.isArray(rawTags)) {
    return [];
  }

  return rawTags
    .map((tag) => {
      if (typeof tag === "string") {
        return tag.trim();
      }

      if (tag && typeof tag === "object") {
        const record = tag as Record<string, unknown>;
        const name = record.name || record.title || record.label;

        return typeof name === "string" ? name.trim() : "";
      }

      return "";
    })
    .filter(Boolean)
    .slice(0, 3);
}

function getTitle(tool: ToolItem) {
  return readText(tool, ["name", "title"]) || "未命名工具";
}

function getTagline(tool: ToolItem) {
  return readText(tool, ["tagline", "summary"]) || readText(tool, ["description"]) || "暂无简介";
}

function getDescription(tool: ToolItem) {
  const detail = (tool as unknown as { detail?: Record<string, unknown> }).detail ?? {};

  return readText(tool, ["description"]) || readText(detail, ["description"]) || readText(tool, ["tagline", "summary"]);
}

function getCategory(tool: ToolItem) {
  return readText(tool, ["category"]) || "未分类";
}

function getFreeLabel(tool: ToolItem) {
  const freeStatus = readText(tool, ["free_status", "freeStatus", "pricing", "price"]);

  if (freeStatus) {
    return freeStatus;
  }

  const isFree = readBoolean(tool, ["is_free", "isFree"]);

  if (isFree === true) {
    return "免费";
  }

  if (isFree === false) {
    return "付费";
  }

  return "未标注";
}

function getOpenSourceLabel(tool: ToolItem) {
  const openSourceStatus = readText(tool, ["open_source_status", "openSourceStatus", "license"]);

  if (openSourceStatus) {
    return openSourceStatus;
  }

  const isOpenSource = readBoolean(tool, ["is_open_source", "isOpenSource"]);

  if (isOpenSource === true) {
    return "开源";
  }

  if (isOpenSource === false) {
    return "非开源";
  }

  return "未标注";
}

function StatusPill({
  children,
  tone = "default",
}: {
  children: string;
  tone?: "default" | "green" | "blue";
}) {
  const toneClass =
    tone === "green"
      ? "border-[#5ecfb1]/45 bg-[#f2fffa] text-[#0f766e]"
      : tone === "blue"
        ? "border-[#93c5fd]/50 bg-[#eff6ff] text-[#2563eb]"
        : "border-[#0f172a]/10 bg-white text-[#475569]";

  return (
    <span className={`inline-flex h-7 items-center rounded-full border px-2.5 text-[11px] font-black ${toneClass}`}>
      {children}
    </span>
  );
}

export function ToolMobileSummaryCard({ tool, className = "" }: ToolMobileSummaryCardProps) {
  const title = getTitle(tool);
  const tagline = getTagline(tool);
  const description = getDescription(tool);
  const category = getCategory(tool);
  const freeLabel = getFreeLabel(tool);
  const openSourceLabel = getOpenSourceLabel(tool);
  const tags = readTags(tool);

  return (
    <section
      className={`rounded-[28px] border border-[#0f172a]/[0.08] bg-white/90 p-4 shadow-[0_16px_42px_rgba(15,23,42,0.08)] md:hidden ${className}`}
    >
      <div className="flex flex-wrap gap-2">
        <StatusPill tone="blue">{category}</StatusPill>
        <StatusPill tone="green">{freeLabel}</StatusPill>
        <StatusPill>{openSourceLabel}</StatusPill>
      </div>

      <h1 className="mt-4 text-[2rem] font-black leading-[1.05] tracking-[-0.06em] text-[#0f172a]">{title}</h1>

      <p className="mt-3 line-clamp-2 text-base font-black leading-7 text-[#1e293b]">{tagline}</p>

      {tags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex h-7 items-center rounded-full border border-[#0f172a]/[0.08] bg-[#f8fbff] px-2.5 text-[11px] font-black text-[#64748b]"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : (
        <div className="mt-3">
          <span className="inline-flex h-7 items-center rounded-full border border-[#0f172a]/[0.08] bg-[#f8fbff] px-2.5 text-[11px] font-black text-[#64748b]">
            暂无标签
          </span>
        </div>
      )}

      <CollapsibleDescription title="这个工具是什么" content={description} className="mt-4" />
    </section>
  );
}
