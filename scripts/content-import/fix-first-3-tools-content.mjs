import fs from "node:fs";
import path from "node:path";

// Repairs the 3 already-imported tools whose Chinese text fields were stored as
// "????" mojibake. It performs UPDATE-only writes, keyed by slug, on the exact
// set of corrupted text columns. It never inserts, upserts, or deletes.
//
// Default mode is dry-run (offline, no DB connection, no secrets needed).
// `--execute` connects to Supabase using a server-side service key and updates.

const DEFAULT_INPUT = "docs/content/first-3-tools-content-fix-v1.json";
const DEFAULT_REPORT = "docs/content/first-3-tools-content-fix-report-v1.json";
const ALLOWED_SLUGS = ["localsend", "stirling-pdf", "cyberchef"];
const TEXT_FIELDS = ["summary", "description", "risk_notice"];
const LIST_FIELDS = ["target_users", "use_cases", "pros", "cons"];
const LIST_JOIN = "\n";
// The columns this script is allowed to write. Structural fields (category_id,
// is_free, is_open_source, website_url, status, title) are intentionally NOT
// touched because they survived the original corruption.
const WRITABLE_COLUMNS = [...TEXT_FIELDS, ...LIST_FIELDS, "updated_at"];

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const input = args.input ?? DEFAULT_INPUT;
  const reportPath = args.report ?? DEFAULT_REPORT;
  const executeMode = args.execute === "true";

  const content = loadContent(input);
  const contentBlockers = validateContent(content);

  const payloads = ALLOWED_SLUGS.map((slug) => ({
    slug,
    payload: buildUpdatePayload(content.tools[slug]),
  }));

  const report = executeMode
    ? await buildExecuteReport({ input, payloads, contentBlockers })
    : buildDryRunReport({ input, payloads, contentBlockers });

  writeText(reportPath, `${JSON.stringify(report, null, 2)}\n`);

  if (executeMode) {
    console.log(
      report.status === "execute_completed"
        ? "FIX_FIRST_3_TOOLS_EXECUTE_OK"
        : "FIX_FIRST_3_TOOLS_EXECUTE_BLOCKED_OR_FAILED",
    );
    console.log(`UPDATED_COUNT: ${report.updated_count}`);
    console.log(`UPDATED_SLUGS: ${(report.updated_slugs ?? []).join(",")}`);
    console.log(`FAILED_SLUGS: ${(report.failed_slugs ?? []).join(",")}`);
    console.log(`VERIFY_CLEAN: ${String(report.verify_clean)}`);
    console.log(`REPORT: ${reportPath}`);
    if (report.status !== "execute_completed") {
      process.exitCode = 1;
    }
    return;
  }

  console.log("FIX_FIRST_3_TOOLS_DRY_RUN_OK");
  console.log(`SLUGS: ${payloads.map((entry) => entry.slug).join(",")}`);
  console.log(`WRITABLE_COLUMNS: ${WRITABLE_COLUMNS.join(",")}`);
  console.log(`CONTENT_CLEAN: ${String(contentBlockers.length === 0)}`);
  console.log(`SAFE_TO_EXECUTE: ${String(report.safe_to_execute)}`);
  if (contentBlockers.length > 0) {
    console.log(`CONTENT_BLOCKERS: ${contentBlockers.join(",")}`);
  }
  console.log(`REPORT: ${reportPath}`);
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    if (!current.startsWith("--")) {
      continue;
    }
    const name = current.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      args[name] = "true";
      continue;
    }
    args[name] = next;
    index += 1;
  }
  return args;
}

function readText(filePath) {
  const absolute = path.resolve(filePath);
  if (!fs.existsSync(absolute)) {
    throw new Error(`INPUT_NOT_FOUND: ${filePath}`);
  }
  return fs.readFileSync(absolute, "utf8").replace(/^﻿/, "");
}

function writeText(filePath, text) {
  const absolute = path.resolve(filePath);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, text, "utf8");
}

function loadContent(input) {
  const parsed = JSON.parse(readText(input));
  if (!parsed || typeof parsed !== "object" || !parsed.tools) {
    throw new Error("CONTENT_SHAPE_INVALID");
  }
  return parsed;
}

// The anti-corruption gate: refuse to run if the replacement content is itself
// missing, empty, still contains mojibake runs, or has no Chinese characters.
function validateContent(content) {
  const blockers = [];

  for (const slug of ALLOWED_SLUGS) {
    const tool = content.tools[slug];
    if (!tool) {
      blockers.push(`MISSING_TOOL:${slug}`);
      continue;
    }

    for (const field of TEXT_FIELDS) {
      const value = typeof tool[field] === "string" ? tool[field].trim() : "";
      if (!value) {
        blockers.push(`EMPTY_FIELD:${slug}.${field}`);
      }
    }

    for (const field of LIST_FIELDS) {
      const list = Array.isArray(tool[field]) ? tool[field].map((item) => String(item).trim()).filter(Boolean) : [];
      if (list.length === 0) {
        blockers.push(`EMPTY_LIST:${slug}.${field}`);
      }
    }

    const combined = collectText(tool);
    if (/\?\?+/.test(combined)) {
      blockers.push(`MOJIBAKE_DETECTED:${slug}`);
    }
    if (!/[一-鿿]/.test(combined)) {
      blockers.push(`NO_CJK:${slug}`);
    }
  }

  return blockers;
}

function collectText(tool) {
  const parts = [];
  for (const field of TEXT_FIELDS) {
    parts.push(String(tool[field] ?? ""));
  }
  for (const field of LIST_FIELDS) {
    const list = Array.isArray(tool[field]) ? tool[field] : [];
    parts.push(list.map((item) => String(item)).join(" "));
  }
  return parts.join(" ");
}

function buildUpdatePayload(tool) {
  return {
    summary: String(tool.summary).trim(),
    description: String(tool.description).trim(),
    target_users: tool.target_users.map((item) => String(item).trim()).filter(Boolean).join(LIST_JOIN),
    use_cases: tool.use_cases.map((item) => String(item).trim()).filter(Boolean).join(LIST_JOIN),
    pros: tool.pros.map((item) => String(item).trim()).filter(Boolean).join(LIST_JOIN),
    cons: tool.cons.map((item) => String(item).trim()).filter(Boolean).join(LIST_JOIN),
    risk_notice: String(tool.risk_notice).trim(),
    updated_at: new Date().toISOString(),
  };
}

function buildDryRunReport({ input, payloads, contentBlockers }) {
  return {
    status: "dry_run_completed",
    execute_mode: false,
    safe_to_execute: contentBlockers.length === 0,
    input,
    allowed_slugs: ALLOWED_SLUGS,
    writable_columns: WRITABLE_COLUMNS,
    content_blockers: contentBlockers,
    required_env: {
      supabase_url_present: false,
      service_key_present: false,
    },
    preview: payloads.map((entry) => ({
      slug: entry.slug,
      summary_preview: entry.payload.summary.slice(0, 40),
      description_length: entry.payload.description.length,
      target_users_count: entry.payload.target_users.split(LIST_JOIN).length,
      use_cases_count: entry.payload.use_cases.split(LIST_JOIN).length,
      pros_count: entry.payload.pros.split(LIST_JOIN).length,
      cons_count: entry.payload.cons.split(LIST_JOIN).length,
    })),
    secret_values_printed: false,
    dry_run_only: true,
  };
}

async function buildExecuteReport({ input, payloads, contentBlockers }) {
  const tableName = detectToolsTable();
  const envBlockers = validateExecuteEnv();
  const blockers = [...contentBlockers, ...envBlockers];

  const report = {
    status: "execute_blocked_or_failed",
    execute_mode: true,
    input,
    table: tableName ?? "tools",
    allowed_slugs: ALLOWED_SLUGS,
    writable_columns: WRITABLE_COLUMNS,
    attempted_count: payloads.length,
    updated_count: 0,
    updated_slugs: [],
    failed_slugs: ALLOWED_SLUGS,
    before_state: [],
    verify_clean: false,
    errors: [],
    secret_values_printed: false,
    dry_run_only: false,
  };

  if (!tableName) {
    blockers.push("FAILED_UNKNOWN_TOOLS_TABLE");
  }

  if (blockers.length > 0) {
    report.errors.push(...blockers);
    return report;
  }

  const { supabaseUrl, serviceKey } = getExecuteConfig();
  const { createClient } = await import("@supabase/supabase-js");
  const client = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  const updatedSlugs = [];
  const failedSlugs = [];

  for (const entry of payloads) {
    const { data: existing, error: readError } = await client
      .from(tableName)
      .select("id,slug,status,summary")
      .eq("slug", entry.slug)
      .maybeSingle();

    if (readError) {
      report.errors.push(`READ_FAILED:${entry.slug}`);
      failedSlugs.push(entry.slug);
      continue;
    }

    if (!existing) {
      report.errors.push(`ROW_NOT_FOUND:${entry.slug}`);
      failedSlugs.push(entry.slug);
      continue;
    }

    report.before_state.push({
      slug: entry.slug,
      status: existing.status ?? null,
      was_corrupted: /\?\?+/.test(String(existing.summary ?? "")),
    });

    const { data: updated, error: updateError } = await client
      .from(tableName)
      .update(entry.payload)
      .eq("slug", entry.slug)
      .select("id,slug,summary,description,target_users,use_cases,pros,cons,risk_notice,updated_at");

    if (updateError) {
      report.errors.push(`UPDATE_FAILED:${entry.slug}`);
      failedSlugs.push(entry.slug);
      continue;
    }

    if (!Array.isArray(updated) || updated.length !== 1) {
      report.errors.push(`UPDATE_ROW_COUNT_UNEXPECTED:${entry.slug}:${updated?.length ?? 0}`);
      failedSlugs.push(entry.slug);
      continue;
    }

    if (!isRowClean(updated[0])) {
      report.errors.push(`VERIFY_STILL_CORRUPTED:${entry.slug}`);
      failedSlugs.push(entry.slug);
      continue;
    }

    updatedSlugs.push(entry.slug);
  }

  report.updated_count = updatedSlugs.length;
  report.updated_slugs = updatedSlugs;
  report.failed_slugs = failedSlugs;
  report.verify_clean = failedSlugs.length === 0 && updatedSlugs.length === ALLOWED_SLUGS.length;

  if (report.verify_clean) {
    report.status = "execute_completed";
    report.errors = [];
  }

  return report;
}

function isRowClean(row) {
  const fields = ["summary", "description", "target_users", "use_cases", "pros", "cons", "risk_notice"];
  const combined = fields.map((field) => String(row[field] ?? "")).join(" ");
  return !/\?\?+/.test(combined) && /[一-鿿]/.test(combined);
}

function validateExecuteEnv() {
  const blockers = [];
  const { supabaseUrl, serviceKey } = getExecuteConfig();
  if (!supabaseUrl) {
    blockers.push("MISSING_SUPABASE_URL");
  }
  if (!serviceKey) {
    blockers.push("MISSING_SUPABASE_SERVICE_KEY");
  }
  return blockers;
}

function detectToolsTable() {
  const file = "src/lib/db/tools.ts";
  if (!fs.existsSync(file)) {
    return null;
  }
  const text = readText(file);
  const match = text.match(/from\(["']([^"']+)["']\)/);
  return match?.[1] ?? null;
}

function getExecuteConfig() {
  return {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "",
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY ?? "",
  };
}
