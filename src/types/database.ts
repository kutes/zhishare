export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type CategoryRow = {
  id: string;
  name: string | null;
  slug: string | null;
  description: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type TagRow = {
  id: string;
  name: string | null;
  slug: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type ToolRow = {
  id: string;
  title: string | null;
  name: string | null;
  slug: string | null;
  summary: string | null;
  description: string | null;
  website_url: string | null;
  download_url: string | null;
  cover_url: string | null;
  category_id: string | null;
  category: string | null;
  tags: Json | null;
  is_free: boolean | null;
  is_open_source: boolean | null;
  pricing: string | null;
  free_status: string | null;
  open_source_status: string | null;
  target_users: Json | null;
  use_cases: Json | null;
  features: Json | null;
  pros: Json | null;
  cons: Json | null;
  risk_notice: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type ArticleRow = {
  id: string;
  title: string | null;
  slug: string | null;
  summary: string | null;
  content: Json | null;
  category_id: string | null;
  category: string | null;
  tags: Json | null;
  read_time: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type ToolTagRow = {
  tool_id: string | null;
  tag_id: string | null;
};

export type ArticleTagRow = {
  article_id: string | null;
  tag_id: string | null;
};

export type SubmissionRow = {
  id: string;
  tool_name: string;
  website_url: string;
  summary: string;
  reason: string | null;
  email: string | null;
  status: string;
  created_at: string | null;
  updated_at: string | null;
};

export type ReportRow = {
  id: string;
  owner_name: string;
  email: string;
  page_url: string;
  issue_type: string;
  proof: string | null;
  request: string;
  status: string;
  created_at: string | null;
  updated_at: string | null;
};

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: CategoryRow;
        Insert: Partial<CategoryRow>;
        Update: Partial<CategoryRow>;
        Relationships: [];
      };
      tags: {
        Row: TagRow;
        Insert: Partial<TagRow>;
        Update: Partial<TagRow>;
        Relationships: [];
      };
      tools: {
        Row: ToolRow;
        Insert: Partial<ToolRow>;
        Update: Partial<ToolRow>;
        Relationships: [];
      };
      articles: {
        Row: ArticleRow;
        Insert: Partial<ArticleRow>;
        Update: Partial<ArticleRow>;
        Relationships: [];
      };
      tool_tags: {
        Row: ToolTagRow;
        Insert: Partial<ToolTagRow>;
        Update: Partial<ToolTagRow>;
        Relationships: [];
      };
      article_tags: {
        Row: ArticleTagRow;
        Insert: Partial<ArticleTagRow>;
        Update: Partial<ArticleTagRow>;
        Relationships: [];
      };
      submissions: {
        Row: SubmissionRow;
        Insert: Omit<Partial<SubmissionRow>, "id" | "created_at" | "updated_at">;
        Update: Partial<SubmissionRow>;
        Relationships: [];
      };
      reports: {
        Row: ReportRow;
        Insert: Omit<Partial<ReportRow>, "id" | "created_at" | "updated_at">;
        Update: Partial<ReportRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
