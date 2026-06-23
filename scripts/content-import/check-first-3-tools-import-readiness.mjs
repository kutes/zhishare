import fs from "node:fs";
import path from "node:path";

const DEFAULT_INPUT = "docs/content/first-3-tools-ready-to-import-v1.csv";
const DEFAULT_REPORT = "docs/content/first-3-tools-import-readiness-report-v1.json";
const EXPECTED_SLUGS = ["localsend", "stirling-pdf", "cyberchef"];
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

  const csvText = readText(input);
  const table = parseCsv(csvText);
  assertHeader(table.header);
  assertRowCount(table.rows, 3);

  const selectedSlugs = table.rows.map((row) => row.slug);
  assertSelectedSlugs(selectedSlugs);

  const env = {
    supabase_url_present: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? ""),
    service_key_present: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY ?? ""),
    anon_key_present: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""),
  };

  const blockers = [];

  if (!env.supabase_url_present) {
    blockers.push("MISSING_SUPABASE_URL");
  }

  if (!env.service_key_present && !env.anon_key_present) {
    blockers.push("MISSING_SUPABASE_READ_KEY");
  }

  const detectedToolsTable = detectToolsTableName();

  if (!detectedToolsTable) {
    blockers.push("FAILED_UNKNOWN_TOOLS_TABLE");
  }

  const existingSlugs = [];
  let queryError = "";

  if (blockers.length === 0 && detectedToolsTable) {
    const client = createReadClient();
    if (!client) {
      blockers.push("MISSING_SUPABASE_READ_CLIENT");
    } else {
      const result = await queryExistingSlugs(client, detectedToolsTable, selectedSlugs);
      if (result.ok) {
        existingSlugs.push(...result.existingSlugs);
      } else {
        queryError = result.error;
        blockers.push(`SELECT_QUERY_FAILED:${result.error}`);
      }
    }
  }

  for (const slug of existingSlugs) {
    blockers.push(`EXISTING_SLUG:${slug}`);
  }

  const missingSlugs = selectedSlugs.filter((slug) => !existingSlugs.includes(slug));
  const readyForExecuteReview = blockers.length === 0 && existingSlugs.length === 0;

  const report = {
    status: "readiness_check_completed",
    select_only: true,
    input,
    row_count: table.rows.length,
    selected_slugs: selectedSlugs,
    env,
    detected_tools_table: detectedToolsTable,
    existing_slugs: existingSlugs,
    missing_slugs: missingSlugs,
    blockers,
    ready_for_execute_review: readyForExecuteReview,
    next_step: "",
  };

  writeText(reportPath, `${JSON.stringify(report, null, 2)}\n`);

  console.log("FIRST_3_TOOLS_IMPORT_READINESS_CHECK_OK");
  console.log(`ROW_COUNT: ${table.rows.length}`);
  console.log("SELECT_ONLY: true");
  console.log(`EXISTING_SLUG_COUNT: ${existingSlugs.length}`);
  console.log(`BLOCKERS_COUNT: ${blockers.length}`);
  console.log(`READY_FOR_EXECUTE_REVIEW: ${String(readyForExecuteReview)}`);
  console.log(`REPORT: ${reportPath}`);

  if (queryError) {
    console.log(`SELECT_QUERY_ERROR: ${queryError}`);
  }
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
  const rows = [];

  for (let index = 1; index < lines.length; index += 1) {
    const values = parseCsvLine(lines[index]);

    if (values.length !== header.length) {
      throw new Error(`CSV_COLUMN_MISMATCH: line ${index + 1}`);
    }

    rows.push(Object.fromEntries(header.map((field, position) => [field, values[position] ?? ""])));
  }

  return { header, rows };
}

function parseCsvLine(line) {
  const result = [];
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
      result.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  result.push(current);
  return result;
}

function assertHeader(header) {
  if (header.join(",") !== EXPECTED_HEADER.join(",")) {
    throw new Error("HEADER_MISMATCH");
  }
}

function assertRowCount(rows, expected) {
  if (rows.length !== expected) {
    throw new Error(`ROW_COUNT_MISMATCH: ${rows.length}`);
  }
}

function assertSelectedSlugs(selectedSlugs) {
  if (selectedSlugs.length !== EXPECTED_SLUGS.length) {
    throw new Error(`SELECTED_SLUG_COUNT_MISMATCH: ${selectedSlugs.length}`);
  }

  for (const slug of EXPECTED_SLUGS) {
    if (!selectedSlugs.includes(slug)) {
      throw new Error(`MISSING_EXPECTED_SLUG: ${slug}`);
    }
  }
}

function detectToolsTableName() {
  const filePath = "src/lib/db/tools.ts";

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const text = readText(filePath);
  const match = text.match(/\.from\(["']tools["']\)/);

  return match ? "tools" : null;
}

function createReadClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  const selectedKey = serviceKey || anonKey;

  if (!supabaseUrl || !selectedKey) {
    return null;
  }

  return { supabaseUrl, selectedKey };
}

async function queryExistingSlugs(clientConfig, tableName, slugs) {
  const { createClient } = await import("@supabase/supabase-js");
  const client = createClient(clientConfig.supabaseUrl, clientConfig.selectedKey, {
    auth: { persistSession: false },
  });

  const attempts = ["slug", "id,slug"];
  let lastError = "";

  for (const columns of attempts) {
    const { data, error } = await client.from(tableName).select(columns).in("slug", slugs);

    if (!error) {
      const existingSlugs = [...new Set((data ?? []).map((row) => String(row.slug ?? "")).filter(Boolean))];
      return { ok: true, existingSlugs };
    }

    lastError = error.message;
  }

  return { ok: false, error: lastError || "UNKNOWN_SELECT_ERROR" };
}
