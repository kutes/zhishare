import fs from "node:fs";
import path from "node:path";

const DEFAULT_INPUT = "docs/content/first-3-tools-ready-to-import-v1.csv";
const DEFAULT_REPORT = "docs/content/first-3-tools-import-dry-run-report-v1.json";
const ALLOWED_SLUGS = ["localsend", "stirling-pdf", "cyberchef"];
const EXPECTED_SLUGS = [...ALLOWED_SLUGS];
const EXPECTED_HEADER = [
  "batch_id",
  "item_status",
  "title",
  "slug",
  "category",
  "tags",
  "short_description",
  "long_description",
  "team_tested_label",
  "tested_summary",
  "public_review_summary",
  "official_website",
  "official_repository",
  "license",
  "platform",
  "pricing",
  "risk_tags",
  "suitable_for",
  "not_suitable_for",
  "key_features",
  "use_cases",
  "caution_notes",
  "source_urls",
  "cover_image_prompt",
  "seo_title",
  "seo_description",
  "social_post_x",
  "social_post_xhs",
  "editor_notes",
  "publish_ready",
];

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const input = args.input ?? DEFAULT_INPUT;
  const reportPath = args.report ?? DEFAULT_REPORT;
  // Real write mode is only enabled when `--execute` is passed.
  const executeMode = args.execute === "true";

  const csvText = readText(input);
  const table = parseCsv(csvText);
  assertHeader(table.header);
  assertRows(table.rows);
  assertAllowedSlugSet(table.rows);

  const previewRows = table.rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    item_status: row.item_status,
    publish_ready: row.publish_ready,
    official_website: row.official_website,
    source_urls: row.source_urls,
  }));

  const report = executeMode
    ? await buildExecuteReport({
        input,
        previewRows,
      })
    : buildDryRunReport({
        input,
        previewRows,
      });

  writeText(reportPath, `${JSON.stringify(report, null, 2)}\n`);

  if (executeMode) {
    console.log(
      report.status === "execute_completed"
        ? "FIRST_3_TOOLS_IMPORT_EXECUTE_OK"
        : "FIRST_3_TOOLS_IMPORT_EXECUTE_BLOCKED_OR_FAILED",
    );
    console.log(`ATTEMPTED_COUNT: ${report.attempted_count}`);
    console.log(`INSERTED_COUNT: ${report.inserted_count}`);
    console.log(`INSERTED_SLUGS: ${(report.inserted_slugs ?? []).join(",")}`);
    console.log(`FAILED_SLUGS: ${(report.failed_slugs ?? []).join(",")}`);
    console.log(`REPORT: ${reportPath}`);

    if (report.status !== "execute_completed") {
      process.exitCode = 1;
    }

    return;
  }

  console.log("FIRST_3_TOOLS_IMPORT_DRY_RUN_OK");
  console.log(`ROW_COUNT: ${table.rows.length}`);
  console.log(`PAYLOAD_PREVIEW_COUNT: ${previewRows.length}`);
  console.log(`EXECUTE_MODE: ${String(executeMode)}`);
  console.log(`SAFE_TO_EXECUTE: ${String(report.safe_to_execute)}`);
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

  return fs.readFileSync(absolute, "utf8").replace(/^\uFEFF/, "");
}

function writeText(filePath, text) {
  const absolute = path.resolve(filePath);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, text, "utf8");
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);

  if (lines.length === 0) {
    throw new Error("CSV_EMPTY");
  }

  const header = parseCsvLine(lines[0]);
  const rows = lines.slice(1).map((line, index) => {
    const values = parseCsvLine(line);

    if (values.length !== header.length) {
      throw new Error(`CSV_COLUMN_MISMATCH: line ${index + 2}`);
    }

    return Object.fromEntries(header.map((field, position) => [field, values[position] ?? ""]));
  });

  return { header, rows };
}

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
}

function assertHeader(header) {
  if (header.join(",") !== EXPECTED_HEADER.join(",")) {
    throw new Error("HEADER_MISMATCH");
  }
}

function assertRows(rows) {
  if (rows.length !== 3) {
    throw new Error(`ROW_COUNT_MISMATCH: ${rows.length}`);
  }

  const slugs = rows.map((row) => row.slug);

  for (const slug of EXPECTED_SLUGS) {
    if (!slugs.includes(slug)) {
      throw new Error(`MISSING_EXPECTED_SLUG: ${slug}`);
    }
  }
}

function assertAllowedSlugSet(rows) {
  const actual = rows.map((row) => row.slug);

  if (!hasExactSlugSet(actual, ALLOWED_SLUGS)) {
    throw new Error(`FAILED_UNEXPECTED_SLUG_SET: ${actual.join(",")}`);
  }
}

function hasExactSlugSet(actualSlugs, allowedSlugs) {
  const actual = [...new Set(actualSlugs)].sort();
  const expected = [...new Set(allowedSlugs)].sort();

  return actual.length === expected.length && actual.every((slug, index) => slug === expected[index]);
}

function buildDryRunReport({ input, previewRows }) {
  return {
    status: "dry_run_completed",
    execute_mode: false,
    safe_to_execute: false,
    input,
    row_count: 3,
    payload_preview_count: previewRows.length,
    selected_slugs: [],
    detected_tools_table: null,
    required_env: {
      supabase_url_present: false,
      service_key_present: false,
    },
    execute_blockers: [],
    payload_preview: [],
    next_step: "",
  };
}

async function buildExecuteReport({ input, previewRows }) {
  const tableName = detectToolsTable();
  const executeBlockers = validateExecuteEnv();
  const allowedSlugs = [...ALLOWED_SLUGS];

  const report = {
    status: "execute_blocked_or_failed",
    execute_mode: true,
    input,
    table: tableName ?? "tools",
    attempted_count: previewRows.length,
    inserted_count: 0,
    allowed_slugs: allowedSlugs,
    inserted_slugs: [],
    failed_slugs: allowedSlugs,
    errors: [],
    secret_values_printed: false,
    dry_run_only: false,
  };

  if (!tableName) {
    executeBlockers.push("FAILED_UNKNOWN_TOOLS_TABLE");
  }

  if (!hasExactSlugSet(previewRows.map((row) => row.slug), allowedSlugs)) {
    executeBlockers.push("FAILED_UNEXPECTED_SLUG_SET");
  }

  if (executeBlockers.length > 0) {
    report.errors.push(...executeBlockers);
    return report;
  }

  const conflictSlugs = await findSlugConflicts(tableName, allowedSlugs);

  if (conflictSlugs.length > 0) {
    report.failed_slugs = conflictSlugs;
    report.errors.push(`SLUG_CONFLICT:${conflictSlugs.join(",")}`);
    return report;
  }

  const insertResult = await insertExecuteRows(tableName, previewRows);

  if (!insertResult.ok) {
    report.errors.push(`INSERT_FAILED:${insertResult.error}`);
    return report;
  }

  const insertedSlugs = insertResult.insertedSlugs;
  const missingSlugs = allowedSlugs.filter((slug) => !insertedSlugs.includes(slug));

  if (insertedSlugs.length !== allowedSlugs.length || missingSlugs.length > 0) {
    report.errors.push(`INSERT_COUNT_MISMATCH:${insertedSlugs.length}`);
    report.failed_slugs = missingSlugs.length > 0 ? missingSlugs : allowedSlugs;
    return report;
  }

  return {
    ...report,
    status: "execute_completed",
    inserted_count: insertedSlugs.length,
    inserted_slugs: insertedSlugs,
    failed_slugs: [],
    errors: [],
  };
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

async function findSlugConflicts(tableName, slugs) {
  if (!tableName || slugs.length === 0) {
    return [];
  }

  const { supabaseUrl, serviceKey } = getExecuteConfig();

  if (!supabaseUrl || !serviceKey) {
    return [];
  }

  const { createClient } = await import("@supabase/supabase-js");
  const client = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  const { data, error } = await client.from(tableName).select("slug").in("slug", slugs);

  if (error) {
    throw new Error(`SLUG_CONFLICT_QUERY_FAILED: ${error.message}`);
  }

  return (data ?? []).map((row) => String(row.slug ?? "")).filter(Boolean);
}

async function insertExecuteRows(tableName, previewRows) {
  const { supabaseUrl, serviceKey } = getExecuteConfig();

  if (!supabaseUrl || !serviceKey) {
    return { ok: false, error: "MISSING_SUPABASE_SERVICE_KEY" };
  }

  const { createClient } = await import("@supabase/supabase-js");
  const client = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  const payload = previewRows.map((row) => buildExecutePayload(row));
  const { data, error } = await client.from(tableName).insert(payload).select("slug");

  if (error) {
    return { ok: false, error: error.message || "UNKNOWN_INSERT_ERROR" };
  }

  const insertedSlugs = [...new Set((data ?? []).map((row) => String(row.slug ?? "")).filter(Boolean))];

  return { ok: true, insertedSlugs };
}

function buildExecutePayload(row) {
  const title = String(row.title ?? "").trim();
  const slug = String(row.slug ?? "").trim();
  const summary = String(row.short_description ?? "").trim();
  const description = String(row.long_description ?? "").trim();
  const category = optionalText(row.category);
  const tags = splitPipe(row.tags);
  const websiteUrl = optionalText(row.official_website);
  const repository = optionalText(row.official_repository);
  const license = optionalText(row.license);
  const pricing = optionalText(row.pricing);
  const sourceUrls = splitPipe(row.source_urls);
  const cautionNotes = joinParts(row.caution_notes, row.risk_tags);

  return {
    title,
    name: title,
    slug,
    summary,
    description,
    category,
    category_id: null,
    tags,
    website_url: websiteUrl,
    download_url: null,
    cover_url: null,
    is_free: inferIsFree(pricing),
    is_open_source: inferOpenSource(repository, license),
    pricing,
    free_status: pricing,
    open_source_status: inferOpenSourceStatus(repository, license),
    target_users: splitPipe(row.suitable_for),
    use_cases: splitPipe(row.use_cases),
    features: splitPipe(row.key_features),
    pros: splitPipe(row.key_features),
    cons: splitPipe(row.not_suitable_for),
    risk_notice: joinParts(cautionNotes, sourceUrls.join(" | ")),
    status: String(row.item_status ?? "").trim() === "ready_to_publish" || normalizeYes(row.publish_ready) ? "published" : "draft",
  };
}

function splitPipe(value) {
  return String(value ?? "")
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);
}

function joinParts(...parts) {
  return parts
    .map((part) => String(part ?? "").trim())
    .filter(Boolean)
    .join(" | ");
}

function optionalText(value) {
  const trimmed = String(value ?? "").trim();
  return trimmed ? trimmed : null;
}

function normalizeYes(value) {
  return /^(yes|true|1)$/i.test(String(value ?? "").trim());
}

function inferIsFree(pricing) {
  return /free|免费/i.test(String(pricing ?? ""));
}

function inferOpenSource(repository, license) {
  const repo = String(repository ?? "").trim().toLowerCase();
  const lic = String(license ?? "").trim().toLowerCase();

  if (!repo || !lic) {
    return null;
  }

  if (repo.includes("github.com") && lic !== "proprietary") {
    return true;
  }

  return lic.includes("mit") || lic.includes("apache") || lic.includes("gpl") ? true : null;
}

function inferOpenSourceStatus(repository, license) {
  const inferred = inferOpenSource(repository, license);

  if (inferred === true) {
    return "open";
  }

  if (inferred === false) {
    return "closed";
  }

  return "pending_manual_review";
}

function getExecuteConfig() {
  return {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "",
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY ?? "",
  };
}
