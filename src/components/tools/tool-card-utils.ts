import type { ToolItem } from "@/types/tool";

const categoryGradients: Record<string, string> = {
  "AI 工具": "from-cyan-400 via-emerald-500 to-slate-900",
  "在线工具": "from-sky-300 via-cyan-400 to-teal-500",
  "开源项目": "from-blue-500 via-cyan-500 to-emerald-500",
  "效率软件": "from-violet-500 via-indigo-500 to-slate-900",
  "设计工具": "from-pink-400 via-violet-500 to-orange-400",
  "开发工具": "from-blue-500 via-slate-700 to-slate-950",
  "知识管理": "from-cyan-500 via-teal-500 to-emerald-500",
};

const categoryAccentColors: Record<string, string> = {
  "AI 工具": "bg-violet-100 text-violet-700 border-violet-200",
  "在线工具": "bg-sky-100 text-sky-700 border-sky-200",
  "开源项目": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "效率软件": "bg-amber-100 text-amber-700 border-amber-200",
  "设计工具": "bg-pink-100 text-pink-700 border-pink-200",
  "开发工具": "bg-blue-100 text-blue-700 border-blue-200",
  "知识管理": "bg-cyan-100 text-cyan-700 border-cyan-200",
};

const defaultGradient = "from-sky-300 via-cyan-200 to-slate-700";
const defaultAccent = "bg-slate-100 text-slate-700 border-slate-200";

export function getToolInitials(title: string): string {
  if (!title || title.trim().length === 0) {
    return "工";
  }

  const text = title.trim();

  // English: take first 2 uppercase letters
  const upperChars = text.replace(/[^A-Z]/g, "");
  if (upperChars.length >= 2) {
    return upperChars.slice(0, 2);
  }
  if (upperChars.length === 1 && text.length > 1) {
    const secondChar = text.replace(/[^a-zA-Z]/g, "").charAt(1);
    return upperChars + (secondChar || text.charAt(1).toUpperCase());
  }

  // Chinese or mixed: take first 2 characters
  return text.slice(0, 2);
}

export function getCategoryGradient(categoryName: string): string {
  if (!categoryName) {
    return defaultGradient;
  }

  const trimmed = categoryName.trim();
  return categoryGradients[trimmed] ?? defaultGradient;
}

export function getCategoryAccentClass(categoryName: string): string {
  if (!categoryName) {
    return defaultAccent;
  }

  const trimmed = categoryName.trim();
  return categoryAccentColors[trimmed] ?? defaultAccent;
}

export function getToolSummary(tool: ToolItem): string {
  // ToolItem.name = display name, ToolItem.tagline = one-liner, ToolItem.description = full text
  return tool.tagline || tool.description || "暂无简介";
}

export function getToolCoverUrl(tool: ToolItem): string | null {
  const cover = tool.cover_url;
  if (typeof cover === "string" && cover.trim().length > 0) {
    return cover.trim();
  }
  return null;
}

export function getToolCardTitle(tool: ToolItem): string {
  // normalizeTool stores the DB title as `name`
  return tool.name || tool.slug || "未命名工具";
}

export function getToolSlug(tool: ToolItem): string {
  return tool.slug || tool.id || "";
}

export function getVisibleTags(tool: ToolItem, maxCount = 4): string[] {
  const tagList = tool.tags;
  if (!Array.isArray(tagList)) {
    return [];
  }

  return tagList.map((tag) => tag.trim()).filter(Boolean).slice(0, maxCount);
}
