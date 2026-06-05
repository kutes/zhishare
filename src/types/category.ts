import type { CategoryRow } from "@/types/database";

export type AdminCategory = Omit<CategoryRow, "name"> & {
  name: string;
};

export type AdminCategoryInput = {
  name: string;
  slug: string;
  description?: string | null;
};

export type AdminCategoryDbResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
