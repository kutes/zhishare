import type { ArticleSection } from "@/components/articles/article-content";

export type ParsedArticleContent = {
  sections: ArticleSection[];
  tldr?: string[];
  sourceNote?: string;
};

export function parseArticleSections(
  markdown: string,
  getEmbedProvider: (url: string) => "bilibili" | "youtube" | null,
): ParsedArticleContent;
