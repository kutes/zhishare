import fs from "node:fs";
import path from "node:path";

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

const DIRECT_MAPPING_CANDIDATES = {
  title: ["title", "name"],
  slug: ["slug"],
  category: ["category_id", "category"],
  tags: ["tags"],
  short_description: ["summary"],
  long_description: ["description"],
  official_website: ["website_url"],
  pricing: ["pricing"],
  suitable_for: ["target_users"],
  not_suitable_for: ["cons"],
  key_features: ["features"],
  use_cases: ["use_cases"],
  caution_notes: ["risk_notice"],
  publish_ready: ["status"],
};

const UNMAPPED_STAGED_FIELDS = [
  "batch_id",
  "item_status",
  "team_tested_label",
  "tested_summary",
  "public_review_summary",
  "official_repository",
  "license",
  "platform",
  "risk_tags",
  "source_urls",
  "cover_image_prompt",
  "seo_title",
  "seo_description",
  "social_post_x",
  "social_post_xhs",
  "editor_notes",
];

const TOOL_FIELDS = [
  "title",
  "slug",
  "category_id",
  "tags",
  "summary",
  "description",
  "website_url",
  "download_url",
  "cover_url",
  "is_free",
  "is_open_source",
  "target_users",
  "use_cases",
  "pros",
  "cons",
  "risk_notice",
  "status",
  "pricing",
  "free_status",
  "open_source_status",
];

const HIGH_RISK_MARKERS = [
  "手机权限",
  "录屏",
  "录音",
  "摄像头",
  "文件访问",
  "局域网访问",
  "API Key",
  "外部供应商",
];

const REQUIRED_FIELDS = [
  "title",
  "slug",
  "category",
  "short_description",
  "long_description",
  "official_website",
  "source_urls",
  "suitable_for",
  "not_suitable_for",
  "caution_notes",
];

const PENDING_MARKERS = new Set(["待核验", "待真实观察后填写", "待填写", "待补充公开评论摘选"]);

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const inputPath = args.input ?? "docs/content/bulk-tools-staged-v1.csv";
  const reportPath = args.report ?? "docs/content/bulk-tools-import-dry-run-report-v1.json";

  const csvText = readTextFile(inputPath);
  const { header, rows } = parseCsv(csvText);

  validateHeader(header);
  validateRowCount(rows, 50);

  const seenSlugs = new Set();
  let readyToImportCount = 0;
  let needsReviewCount = 0;
  let highRiskCount = 0;

  const reportRows = rows.map((row, index) => {
    const warnings = [];
    const highRiskWarnings = [];

    if (row.item_status !== "copy_ready") {
      warnings.push("item_status_not_copy_ready");
    }

    if (row.publish_ready !== "no") {
      warnings.push("publish_ready_not_no");
    }

    if (!isNonEmpty(row.title)) {
      warnings.push("missing_title");
      highRiskWarnings.push("missing_title");
    }

    if (!isNonEmpty(row.slug)) {
      warnings.push("missing_slug");
      highRiskWarnings.push("missing_slug");
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(row.slug)) {
      warnings.push("invalid_slug_format");
      highRiskWarnings.push("invalid_slug_format");
    } else if (seenSlugs.has(row.slug)) {
      warnings.push("duplicate_slug");
      highRiskWarnings.push("duplicate_slug");
    } else {
      seenSlugs.add(row.slug);
    }

    for (const field of REQUIRED_FIELDS) {
      if (!isNonEmpty(row[field])) {
        warnings.push(`missing_${field}`);
        highRiskWarnings.push(`missing_${field}`);
      }
    }

    if (isPending(row.official_website)) {
      warnings.push("official_website_pending");
    } else if (!includesHttp(row.official_website)) {
      warnings.push("official_website_invalid");
      highRiskWarnings.push("official_website_invalid");
    }

    if (isPending(row.official_repository)) {
      warnings.push("official_repository_pending");
    }

    if (isPending(row.license)) {
      warnings.push("license_pending");
    }

    if (isPending(row.pricing)) {
      warnings.push("pricing_pending");
    }

    if (!includesHttp(row.source_urls)) {
      warnings.push("source_urls_missing_http");
      highRiskWarnings.push("source_urls_missing_http");
    }

    if (!isExact(row.public_review_summary, "待补充公开评论摘选")) {
      warnings.push("public_review_summary_unexpected");
    } else {
      warnings.push("public_review_summary_pending");
    }

    const riskTags = splitText(row.risk_tags);
    const matchedRiskMarkers = HIGH_RISK_MARKERS.filter((marker) =>
      riskTags.some((tag) => tag.includes(marker) || marker.includes(tag)),
    );

    if (matchedRiskMarkers.length > 0) {
      warnings.push(`risk_tags_sensitive:${matchedRiskMarkers.join("|")}`);
      highRiskWarnings.push(`risk_tags_sensitive:${matchedRiskMarkers.join("|")}`);
    }

    const riskLevel = highRiskWarnings.length > 0 ? "high" : warnings.length > 0 ? "medium" : "low";

    if (riskLevel === "low") {
      readyToImportCount += 1;
    } else if (riskLevel === "medium") {
      needsReviewCount += 1;
    } else {
      highRiskCount += 1;
    }

    return {
      title: row.title ?? "",
      slug: row.slug ?? "",
      category: row.category ?? "",
      publish_ready: row.publish_ready ?? "",
      risk_level: riskLevel,
      warnings,
      row_index: index + 1,
    };
  });

  const report = {
    status: "dry_run_completed",
    input: inputPath,
    row_count: rows.length,
    ready_to_import_count: readyToImportCount,
    needs_review_count: needsReviewCount,
    high_risk_count: highRiskCount,
    header,
    field_mapping: {
      staged_fields: header,
      likely_tool_fields: TOOL_FIELDS,
      direct_mapping_candidates: DIRECT_MAPPING_CANDIDATES,
      unmapped_staged_fields: UNMAPPED_STAGED_FIELDS,
    },
    rows: reportRows,
    next_step:
      highRiskCount > 0
        ? "Review the high-risk rows first, then prepare the backend import sheet after human approval."
        : "Prepare the backend import sheet after human review of the medium-risk rows and mapping gaps.",
  };

  writeTextFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);

  console.log("BULK_TOOLS_IMPORT_DRY_RUN_OK");
  console.log(`ROW_COUNT: ${rows.length}`);
  console.log(`READY_TO_IMPORT_COUNT: ${readyToImportCount}`);
  console.log(`NEEDS_REVIEW_COUNT: ${needsReviewCount}`);
  console.log(`HIGH_RISK_COUNT: ${highRiskCount}`);
  console.log(`REPORT: ${reportPath}`);
}

function parseArgs(argv) {
  const result = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (!token.startsWith("--")) {
      continue;
    }

    const key = token.slice(2);
    const value = argv[index + 1];

    if (!value || value.startsWith("--")) {
      result[key] = "true";
      continue;
    }

    result[key] = value;
    index += 1;
  }

  return result;
}

function readTextFile(filePath) {
  const absolute = path.resolve(filePath);

  if (!fs.existsSync(absolute)) {
    throw new Error(`INPUT_NOT_FOUND: ${filePath}`);
  }

  return fs.readFileSync(absolute, "utf8").replace(/^\uFEFF/, "");
}

function writeTextFile(filePath, contents) {
  const absolute = path.resolve(filePath);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, contents, "utf8");
}

function validateHeader(header) {
  const actual = header.join(",");
  const expected = EXPECTED_HEADER.join(",");

  if (actual !== expected) {
    throw new Error(`HEADER_MISMATCH: ${actual}`);
  }
}

function validateRowCount(rows, expected) {
  if (rows.length !== expected) {
    throw new Error(`ROW_COUNT_MISMATCH: ${rows.length}`);
  }
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);

  if (lines.length === 0) {
    throw new Error("CSV_EMPTY");
  }

  const header = parseCsvLine(lines[0]);
  const rows = lines.slice(1).filter(Boolean).map((line, lineIndex) => {
    const values = parseCsvLine(line);

    if (values.length !== header.length) {
      throw new Error(`CSV_COLUMN_MISMATCH: line ${lineIndex + 2}`);
    }

    return Object.fromEntries(header.map((field, index) => [field, values[index] ?? ""]));
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

function splitText(value) {
  return String(value ?? "")
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);
}

function isNonEmpty(value) {
  return String(value ?? "").trim().length > 0;
}

function isExact(value, expected) {
  return String(value ?? "").trim() === expected;
}

function isPending(value) {
  return PENDING_MARKERS.has(String(value ?? "").trim());
}

function includesHttp(value) {
  return /https?:\/\//i.test(String(value ?? ""));
}
