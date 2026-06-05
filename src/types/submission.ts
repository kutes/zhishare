import type { SubmissionRow } from "@/types/database";

export type SubmissionInput = {
  tool_name: string;
  website_url: string;
  summary: string;
  reason?: string;
  email?: string;
};

export type SubmissionInsert = SubmissionInput & {
  status: "pending";
};

export type DbWriteResult = {
  success: boolean;
  error?: string;
};

export type AdminSubmissionStatus = "pending" | "reviewed" | "rejected";

export type AdminSubmission = SubmissionRow;

export type AdminSubmissionDbResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
