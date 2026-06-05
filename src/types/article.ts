import type { ArticleItem } from "@/components/articles/article-content";
import type { ArticleRow } from "@/types/database";

export type PublishedArticle = ArticleItem & {
  content?: ArticleRow["content"];
  cover_url?: string | null;
  category_id?: string;
  status?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type ArticleStatus = "draft" | "published";

export type AdminArticle = ArticleRow & {
  cover_url?: string | null;
};

export type AdminArticleInput = {
  title: string;
  slug: string;
  summary: string;
  content?: string;
  cover_url?: string | null;
  category_id?: string | null;
  status: ArticleStatus;
};

export type AdminArticleDbResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
