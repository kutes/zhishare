import type { PublishedArticle } from "@/types/article";
import type { ToolItem } from "@/types/tool";

export const homeShellClassName = "mx-auto w-full max-w-[1280px] px-4 sm:px-6 xl:px-8";

export function safeText(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

export function getToolTitle(tool: ToolItem) {
  const record = tool as ToolItem & { title?: string | null };
  return safeText(tool.name, record.title, tool.slug, "未命名工具");
}

export function getToolSummary(tool: ToolItem) {
  return safeText(tool.tagline, tool.description, tool.highlight, "暂无简介");
}

export function getToolCategory(tool: ToolItem) {
  return safeText(tool.category, "未分类");
}

export function getToolTags(tool: ToolItem, maxCount = 2) {
  return Array.isArray(tool.tags)
    ? tool.tags
        .map((tag) => safeText(tag))
        .filter(Boolean)
        .slice(0, maxCount)
    : [];
}

export function getToolAudience(tool: ToolItem) {
  if (Array.isArray(tool.target_users)) {
    const audience = tool.target_users.map((item) => safeText(item)).find(Boolean);

    if (audience) {
      return audience;
    }
  }

  return safeText(tool.highlight, "适合想先了解用途和风险的用户");
}

export function pickFeaturedTools(tools: ToolItem[], count: number) {
  const featuredTools = tools.filter((tool) => {
    const record = tool as ToolItem & {
      featured?: boolean;
      is_featured?: boolean;
    };

    return Boolean(record.featured ?? record.is_featured);
  });

  const source = featuredTools.length > 0 ? featuredTools : tools;
  return source.slice(0, count);
}

export function getToolInitials(title: string) {
  const compactTitle = title.replace(/\s+/g, "");

  if (!compactTitle) {
    return "知享";
  }

  const words = title.match(/[A-Za-z0-9]+/g);

  if (words && words.length >= 2) {
    return words
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  }

  if (words?.[0]) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return Array.from(compactTitle).slice(0, 2).join("");
}

export function getToolHref(tool: ToolItem) {
  const slug = safeText(tool.slug);
  return slug ? `/tools/${slug}` : "/tools";
}

export function getArticleTitle(article: PublishedArticle) {
  return safeText(article.title, article.slug, "未命名文章");
}

export function getArticleSummary(article: PublishedArticle) {
  return safeText(article.summary, "暂无摘要");
}

export function getArticleMeta(article: PublishedArticle) {
  return {
    category: safeText(article.category, "未分类"),
    date: safeText(article.date, article.updated_at?.slice(0, 10), article.created_at?.slice(0, 10), "最新发布"),
  };
}

export function getArticleHref(article: PublishedArticle) {
  const slug = safeText(article.slug);
  return slug ? `/articles/${slug}` : "/articles";
}
