import type { ArticleSection } from "@/components/articles/article-content";
import type { MockCategory } from "@/data/mock-tools";
import type { ArticleRow, CategoryRow, TagRow, ToolRow } from "@/types/database";
import type { PublishedArticle } from "@/types/article";
import type { ToolItem } from "@/types/tool";

const categoryAccents: MockCategory["accent"][] = ["cyan", "emerald", "blue", "amber"];

export function normalizeCategory(row: CategoryRow, index: number): MockCategory {
  return {
    name: row.name ?? row.slug ?? "未分类",
    description: row.description ?? "暂无分类说明。",
    count: 0,
    accent: categoryAccents[index % categoryAccents.length],
  };
}

export function normalizeTag(row: TagRow) {
  return {
    id: String(row.id),
    name: row.name ?? row.slug ?? "未命名标签",
    slug: row.slug ?? String(row.id),
  };
}

export function normalizeTool(
  row: ToolRow,
  options: {
    categoryName?: string;
    tags?: string[];
  } = {},
): ToolItem {
  const id = String(row.id);
  const title = firstText(row.title, row.name, row.slug, id);
  const summary = firstText(row.summary, row.description, "暂无一句话简介。");
  const description = firstText(row.description, row.summary, "暂无详细简介。");
  const targetUsers = toListItems(row.target_users);
  const useCases = toListItems(row.use_cases);
  const features = toListItems(row.features);
  const pros = toListItems(row.pros);
  const cons = toListItems(row.cons);
  const tags = options.tags?.length ? options.tags : readStringList(row.tags);
  const isFree = Boolean(row.is_free);
  const isOpenSource = Boolean(row.is_open_source);
  const categoryName = options.categoryName ?? row.category ?? "未分类";
  const riskNotice = firstText(row.risk_notice, "工具信息可能会变化，具体价格、功能、授权和下载方式请以官网为准。");

  return {
    id,
    slug: firstText(row.slug, id),
    name: title,
    tagline: summary,
    description,
    category: categoryName,
    tags,
    pricing: firstText(row.pricing, row.free_status, isFree ? "免费或免费起步" : "以官网为准"),
    website_url: row.website_url ?? undefined,
    download_url: row.download_url ?? undefined,
    downloadUrl: row.download_url ?? undefined,
    is_free: isFree,
    is_open_source: isOpenSource,
    free_status: firstText(row.free_status, isFree ? "免费" : "以官网为准"),
    open_source_status: firstText(row.open_source_status, isOpenSource ? "开源" : "非开源"),
    highlight: targetUsers[0] ?? summary,
    category_id: row.category_id ?? undefined,
    created_at: row.created_at ?? undefined,
    updated_at: row.updated_at ?? undefined,
    target_users: targetUsers,
    use_cases: useCases,
    risk_notice: riskNotice,
    detail: {
      introduction: [description],
      features: withFallback(features, ["核心功能请以官方网站或项目文档为准。"]),
      audience: withFallback(targetUsers, ["适合希望了解该工具用途和风险的用户。"]),
      scenarios: withFallback(useCases, ["适合在明确需求后作为备选工具进一步评估。"]),
      pros: withFallback(pros, ["来源清晰时，便于继续查看官网和文档。"]),
      cons: withFallback(cons, ["暂未整理足够缺点信息，使用前需要自行核对。"]),
      risks: [riskNotice],
    },
  };
}

export function normalizeArticle(
  row: ArticleRow,
  options: {
    categoryName?: string;
    tags?: string[];
  } = {},
): PublishedArticle {
  const id = String(row.id);
  const title = firstText(row.title, row.slug, id);
  const summary = firstText(row.summary, "暂无文章摘要。");
  const contentSections = readArticleSections(row.content, summary);
  const tags = options.tags?.length ? options.tags : readStringList(row.tags);

  return {
    id,
    slug: firstText(row.slug, id),
    title,
    summary,
    category: options.categoryName ?? row.category ?? "未分类",
    date: formatDate(row.updated_at ?? row.created_at),
    readTime: firstText(row.read_time, "5 分钟"),
    tags,
    sections: contentSections,
    category_id: row.category_id ?? undefined,
    created_at: row.created_at ?? undefined,
    updated_at: row.updated_at ?? undefined,
  };
}

export function firstText(...values: Array<string | null | undefined>) {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return "";
}

export function readStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => (typeof item === "string" ? [item] : []))
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value !== "string") {
    return [];
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return readStringList(parsed);
    }
  } catch {
    // Plain text fallback below.
  }

  return trimmed
    .split(/\r?\n|,|，/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function toListItems(value: unknown): string[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .flatMap((item) => toListItems(item))
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value !== "string") {
    return [];
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(trimmed);

    if (Array.isArray(parsed)) {
      return toListItems(parsed);
    }
  } catch {
    // Plain text fallback below.
  }

  return trimmed
    .split(/\r?\n/)
    .map((line) => line.trim())
    .map((line) => line.replace(/^[-•*]\s*/, "").trim())
    .filter((line) => line && line !== "-" && line !== "•" && line !== "*");
}

export function toRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return {};
}

export function toRecordArray(value: unknown): Array<Record<string, unknown>> {
  return Array.isArray(value) ? value.map(toRecord) : [];
}

export function readNestedName(value: unknown): string | undefined {
  const record = Array.isArray(value) ? toRecord(value[0]) : toRecord(value);
  const name = record.name;
  const slug = record.slug;

  if (typeof name === "string" && name.trim()) {
    return name.trim();
  }

  if (typeof slug === "string" && slug.trim()) {
    return slug.trim();
  }

  return undefined;
}

export function buildCategoryNameMap(categories: CategoryRow[]) {
  return new Map(categories.map((category) => [String(category.id), category.name ?? category.slug ?? "未分类"]));
}

function withFallback(items: string[], fallback: string[]) {
  return items.length > 0 ? items : fallback;
}

function readArticleSections(content: unknown, summary: string): ArticleSection[] {
  const markdown = normalizeArticleContent(content);
  const sections = parseArticleSections(markdown);

  if (sections.length > 0) {
    return sections;
  }

  return [{ type: "paragraphs", title: "文章说明", paragraphs: [summary] }];
}

function normalizeArticleContent(content: unknown) {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .flatMap((item) => (typeof item === "string" ? [item] : []))
      .join("\n");
  }

  return "";
}

function parseArticleSections(markdown: string): ArticleSection[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const sections: ArticleSection[] = [];

  let currentTitle = "正文内容";
  let paragraphLines: string[] = [];
  let listItems: string[] = [];
  let inCodeBlock = false;

  const flushParagraphs = () => {
    if (paragraphLines.length === 0) {
      return;
    }

    sections.push({
      type: "paragraphs",
      title: currentTitle,
      paragraphs: paragraphLines.map((line) => line.trim()).filter(Boolean),
    });
    paragraphLines = [];
  };

  const flushList = () => {
    if (listItems.length === 0) {
      return;
    }

    sections.push({
      type: "list",
      title: currentTitle,
      items: listItems,
    });
    listItems = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) {
      if (line) {
        paragraphLines.push(line);
      }
      continue;
    }

    if (!line) {
      flushParagraphs();
      flushList();
      continue;
    }

    const headingMatch = line.match(/^#{1,3}\s+(.+)$/);
    if (headingMatch) {
      flushParagraphs();
      flushList();
      currentTitle = headingMatch[1].trim();
      continue;
    }

    const listMatch = line.match(/^(?:[-*•]|\d+[.)])\s+(.+)$/);
    if (listMatch) {
      flushParagraphs();
      listItems.push(listMatch[1].trim());
      continue;
    }

    if (line === "---") {
      flushParagraphs();
      flushList();
      continue;
    }

    paragraphLines.push(line.replace(/^>\s?/, ""));
  }

  flushParagraphs();
  flushList();

  return sections;
}

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  return value.slice(0, 10);
}
