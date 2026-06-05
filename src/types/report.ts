import type { ReportRow } from "@/types/database";

export type ReportInput = {
  owner_name: string;
  email: string;
  page_url: string;
  issue_type: string;
  proof?: string;
  request: string;
};

export type ReportInsert = ReportInput & {
  status: "pending";
};

export type ReportWriteResult = {
  success: boolean;
  error?: string;
};

export type AdminReportStatus = "pending" | "reviewed" | "resolved" | "rejected";

export type AdminReport = ReportRow;

export type AdminReportDbResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
