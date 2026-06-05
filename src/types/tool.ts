import type { MockTool } from "@/data/mock-tools";
import type { ToolRow } from "@/types/database";

export type ToolItem = MockTool & {
  category_id?: string;
  created_at?: string;
  updated_at?: string;
  target_users?: string[];
  use_cases?: string[];
  risk_notice?: string;
};

export type ToolStatus = "draft" | "published";

export type AdminTool = ToolRow & {
  cover_url?: string | null;
};

export type AdminToolInput = {
  title: string;
  slug: string;
  summary: string;
  description?: string;
  website_url?: string;
  cover_url?: string | null;
  category_id?: string;
  is_free: boolean;
  is_open_source: boolean;
  target_users?: string;
  use_cases?: string;
  pros?: string;
  cons?: string;
  risk_notice?: string;
  status: ToolStatus;
};

export type AdminDbResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type AdminCategoryOption = {
  id: string;
  name: string;
};
