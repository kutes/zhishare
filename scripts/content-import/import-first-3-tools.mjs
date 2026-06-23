import fs from "node:fs";
import path from "node:path";

const DEFAULT_INPUT = "docs/content/first-3-tools-ready-to-import-v1.csv";
const DEFAULT_REPORT = "docs/content/first-3-tools-import-dry-run-report-v1.json";
const EXPECTED_SLUGS = ["cyberchef", "stirling-pdf", "localsend"];
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
  const executeMode = args.execute === "true";

  const csvText = readText(input);
  const table = parseCsv(csvText);
  assertHeader(table.header);
  assertRows(table.rows);

  const previewRows = table.rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    item_status: row.item_status,
    publish_ready: row.publish_ready,
    official_website: row.official_website,
    source_urls: row.source_urls,
  }));

  const report = await buildReport({
    executeMode,
    input,
    previewRows,
  });

  writeText(reportPath, `${JSON.stringify(report, null, 2)}\n`);

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

async function buildReport({ executeMode, input, previewRows }) {
  const selectedSlugs = executeMode ? previewRows.map((row) => row.slug) : [];
  const executeBlockers = [];
  const preview = executeMode ? previewRows : [];

  if (executeMode) {
    const blockers = validateExecuteEnv();
    executeBlockers.push(...blockers);

    const tableName = detectToolsTable();
    if (!tableName) {
      executeBlockers.push("FAILED_UNKNOWN_TOOLS_TABLE");
    }

    if (executeBlockers.length === 0) {
      const conflictSlugs = await findSlugConflicts(tableName, previewRows.map((row) => row.slug));
      if (conflictSlugs.length > 0) {
        executeBlockers.push(`FAILED_SLUG_CONFLICT: ${conflictSlugs.join(",")}`);
      } else {
        executeBlockers.push("EXECUTE_MODE_NOT_IMPLEMENTED");
      }
    }
  }

  return {
    status: "dry_run_completed",
    execute_mode: false,
    safe_to_execute: false,
    input,
    row_count: 3,
    payload_preview_count: previewRows.length,
    selected_slugs: executeMode ? selectedSlugs : [],
    detected_tools_table: null,
    required_env: {
      supabase_url_present: false,
      service_key_present: false,
    },
    execute_blockers: executeBlockers,
    payload_preview: preview,
    next_step: "",
  };
}

function validateExecuteEnv() {
  const blockers = [];
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY ?? "";

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

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY ?? "";

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
