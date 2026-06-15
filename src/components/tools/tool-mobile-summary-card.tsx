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
    .slice(0, 4);
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
  tone?: "default" | "gold" | "surface";
}) {
  const toneClass =
    tone === "gold"
      ? "tool-mobile-pill tool-mobile-pill-gold"
      : tone === "surface"
        ? "tool-mobile-pill tool-mobile-pill-surface"
        : "tool-mobile-pill tool-mobile-pill-default";

  return <span className={toneClass}>{children}</span>;
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
    <section className={`tool-mobile-summary ${className}`.trim()}>
      <div className="tool-mobile-summary-top">
        <StatusPill tone="gold">{category}</StatusPill>
        <StatusPill tone="surface">{freeLabel}</StatusPill>
        <StatusPill>{openSourceLabel}</StatusPill>
      </div>

      <h1 className="tool-mobile-title">{title}</h1>
      <p className="tool-mobile-tagline">{tagline}</p>

      {tags.length > 0 ? (
        <div className="tool-mobile-tags">
          {tags.map((tag) => (
            <span key={tag} className="tool-mobile-tag">
              {tag}
            </span>
          ))}
        </div>
      ) : (
        <div className="tool-mobile-tags">
          <span className="tool-mobile-tag tool-mobile-tag-empty">暂无标签</span>
        </div>
      )}

      <CollapsibleDescription title="这个工具是什么" content={description} className="mt-4" />
    </section>
  );
}
