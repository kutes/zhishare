import type { MetadataRoute } from "next";
import { getPublishedArticles } from "@/lib/db/articles";
import { getPublishedTools } from "@/lib/db/tools";
import { getAbsoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseRoutes: MetadataRoute.Sitemap = [
    buildSitemapEntry("/", "daily", 1),
    buildSitemapEntry("/tools", "daily", 0.9),
    buildSitemapEntry("/articles", "daily", 0.9),
    buildSitemapEntry("/search", "weekly", 0.6),
    buildSitemapEntry("/submit", "monthly", 0.5),
    buildSitemapEntry("/copyright", "monthly", 0.4),
  ];

  try {
    const [tools, articles] = await Promise.all([getPublishedTools(), getPublishedArticles()]);
    const toolRoutes = tools.map((tool) =>
      buildSitemapEntry(`/tools/${tool.slug}`, "weekly", 0.8, tool.updated_at ?? tool.created_at),
    );
    const articleRoutes = articles.map((article) =>
      buildSitemapEntry(`/articles/${article.slug}`, "weekly", 0.8, article.updated_at ?? article.created_at),
    );

    return [...baseRoutes, ...toolRoutes, ...articleRoutes];
  } catch (error) {
    console.error("sitemap data error:", error);
    return baseRoutes;
  }
}

function buildSitemapEntry(
  path: string,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
  lastModified?: string,
): MetadataRoute.Sitemap[number] {
  return {
    url: getAbsoluteUrl(path),
    lastModified: toSafeDate(lastModified) ?? new Date(),
    changeFrequency,
    priority,
  };
}

function toSafeDate(value?: string) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
