import type { TagRow } from "@/types/database";

export type AdminTag = Omit<TagRow, "name"> & {
  name: string;
};

export type AdminTagInput = {
  name: string;
  slug: string;
};

export type AdminTagDbResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
