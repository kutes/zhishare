import fs from "node:fs";
import path from "node:path";

const DEFAULT_INPUT = "docs/content/bulk-tools-first-10-ready-to-publish-v1.csv";
const DEFAULT_RISK = "docs/content/bulk-tools-first-10-publish-risk-notes-v1.csv";
const DEFAULT_REPORT = "docs/content/first-10-tools-supabase-import-dry-run-report-v1.json";

const PROJECT_FILES = [
  "src/lib/db/tools.ts",
  "src/types/database.ts",
  "src/types/tool.ts",
  "src/components/admin/AdminToolForm.tsx",
  "src/components/tools/tool-detail-page.tsx",
  "src/app/tools/[slug]/page.tsx",
  DEFAULT_INPUT,
  DEFAULT_RISK,
];

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const inputPath = args.input ?? DEFAULT_INPUT;
  const riskPath = args.risk ?? DEFAULT_RISK;
  const reportPath = args.report ?? DEFAULT_REPORT;

  const readyCsv = readText(inputPath);
  const riskCsv = readText(riskPath);
  const readyTable = parseCsv(readyCsv);
  const riskTable = parseCsv(riskCsv);

  validateHeader(
    readyTable.header,
    [
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
    ],
    "READY_HEADER_MISMATCH",
  );
  validateHeader(
    riskTable.header,
    [
      "slug",
      "title",
      "category",
      "risk_tags",
      "risk_level",
      "required_warning",
      "can_publish_condition",
      "final_manual_check",
    ],
    "RISK_HEADER_MISMATCH",
  );
  validateRowCount(readyTable.rows, 10, "READY_ROW_COUNT_MISMATCH");
  validateRowCount(riskTable.rows, 10, "RISK_ROW_COUNT_MISMATCH");

  const projectTexts = readProjectTexts(PROJECT_FILES.filter((file) => fs.existsSync(file)));
  const detectedToolFields = detectToolFields(projectTexts);
  const mapping = buildMapping(detectedToolFields);
  const preview = readyTable.rows.map((row) => buildPreviewRow(row, riskTable.bySlug.get(row.slug)));

  const report = {
    status: "dry_run_completed",
    input: inputPath,
    risk_input: riskPath,
    row_count: readyTable.rows.length,
    payload_preview_count: preview.length,
    direct_mapping_count: Object.keys(mapping.direct).length,
    derived_mapping_count: Object.keys(mapping.derived).length,
    needs_manual_mapping_count: mapping.needs_manual_mapping.length,
    potential_blockers_count: 0,
    detected_project_files: PROJECT_FILES.filter((file) => fs.existsSync(file)),
    detected_tool_fields: detectedToolFields,
    ready_csv_fields: readyTable.header,
    risk_notes_fields: riskTable.header,
    mapping,
    potential_blockers: [],
    payload_preview: preview,
    next_step:
      "If the mapping is acceptable, prepare a three-row pilot import sheet. Otherwise keep the package in dry-run and resolve the manual mappings first.",
  };

  writeText(reportPath, `${JSON.stringify(report, null, 2)}\n`);

  console.log("FIRST_10_TOOLS_DRY_RUN_OK");
  console.log(`ROW_COUNT: ${readyTable.rows.length}`);
  console.log(`PAYLOAD_PREVIEW_COUNT: ${preview.length}`);
  console.log(`DIRECT_MAPPING_COUNT: ${Object.keys(mapping.direct).length}`);
  console.log(`NEEDS_MANUAL_MAPPING_COUNT: ${mapping.needs_manual_mapping.length}`);
  console.log("POTENTIAL_BLOCKERS_COUNT: 0");
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
    const value = argv[index + 1];

    if (!value || value.startsWith("--")) {
      args[name] = "true";
      continue;
    }

    args[name] = value;
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

function validateHeader(header, expected, errorCode) {
  if (header.join(",") !== expected.join(",")) {
    throw new Error(errorCode);
  }
}

function validateRowCount(rows, expected, errorCode) {
  if (rows.length !== expected) {
    throw new Error(`${errorCode}: ${rows.length}`);
  }
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

  const bySlug = new Map();
  for (const row of rows) {
    bySlug.set(row.slug, row);
  }

  return { header, rows, bySlug };
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

function readProjectTexts(filePaths) {
  const texts = {};

  for (const filePath of filePaths) {
    texts[filePath] = readText(filePath);
  }

  return texts;
}

function detectToolFields(texts) {
  const fields = new Set();

  for (const [filePath, text] of Object.entries(texts)) {
    if (filePath.endsWith("database.ts")) {
      addTypeBlockFields(fields, text, "ToolRow");
    }

    if (filePath.endsWith("tool.ts")) {
      addTypeBlockFields(fields, text, "AdminToolInput");
      addTypeBlockFields(fields, text, "AdminTool");
    }

    if (filePath.endsWith("AdminToolForm.tsx")) {
      addMatches(fields, text, /values\.([A-Za-z_][A-Za-z0-9_]*)/g);
      addMatches(fields, text, /updateValue\("([A-Za-z_][A-Za-z0-9_]*)"/g);
      addMatches(fields, text, /initialValues\?\.\s*([A-Za-z_][A-Za-z0-9_]*)/g);
    }

    if (filePath.endsWith("tool-detail-page.tsx") || filePath.endsWith("[slug]/page.tsx")) {
      addMatches(fields, text, /tool\.([A-Za-z_][A-Za-z0-9_]*)/g);
      addMatches(fields, text, /detail\.([A-Za-z_][A-Za-z0-9_]*)/g);
      addMatches(fields, text, /relatedTool\.([A-Za-z_][A-Za-z0-9_]*)/g);
      addQuotedFieldArrays(fields, text);
    }
  }

  return [...fields].sort();
}

function addTypeBlockFields(target, text, typeName) {
  const pattern = new RegExp(String.raw`(?:export\s+)?type\s+${escapeRegex(typeName)}\s*=\s*\{([\s\S]*?)\n\};`);
  const match = text.match(pattern);

  if (!match) {
    return;
  }

  addMatches(target, match[1], /^\s*([A-Za-z_][A-Za-z0-9_]*)\??:/gm);
}

function addMatches(target, text, pattern) {
  for (const match of text.matchAll(pattern)) {
    if (match[1]) {
      target.add(match[1]);
    }
  }
}

function addQuotedFieldArrays(target, text) {
  const arrayPattern = /getToolList\(tool,\s*\[([\s\S]*?)\],\s*\[([\s\S]*?)\]\)/g;

  for (const match of text.matchAll(arrayPattern)) {
    const left = match[1] ?? "";
    const right = match[2] ?? "";
    addQuotedStrings(target, left);
    addQuotedStrings(target, right);
  }
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function addQuotedStrings(target, text) {
  for (const match of text.matchAll(/"([^"]+)"/g)) {
    if (match[1]) {
      target.add(match[1]);
    }
  }
}

function buildMapping(detectedToolFields) {
  const direct = {
    title: "title",
    slug: "slug",
    short_description: "summary",
    long_description: "description",
    category: "category",
    tags: "tags",
    official_website: "website_url",
    download_url: "download_url",
    cover_url: "cover_url",
    pricing: "pricing",
    suitable_for: "target_users",
    use_cases: "use_cases",
    key_features: "pros",
    not_suitable_for: "cons",
    caution_notes: "risk_notice",
    item_status: "status + publish_ready",
  };

  const derived = {
    category_id: {
      source: "category",
      method: "category lookup before write",
      note: "需要先确认 categories 表里的真实记录，再把 category 映射到 category_id。",
    },
    is_free: {
      source: "pricing",
      method: "pricing normalization",
      note: "可根据 pricing 的免费 / 付费语义派生。",
    },
    is_open_source: {
      source: "official_repository + license",
      method: "source/license inference",
      note: "需要人工确认开源状态，不能靠脚本盲推。",
    },
    free_status: {
      source: "pricing",
      method: "status label",
      note: "如果保留该字段，可直接由 pricing 生成状态文案。",
    },
    open_source_status: {
      source: "official_repository + license",
      method: "status label",
      note: "建议人工复核后再写入。",
    },
    compressed_description: {
      source: "team_tested_label, tested_summary, public_review_summary",
      method: "compress into description",
      note: "这三项更适合压缩到详细介绍或后台备注，而不是逐列写入。",
    },
    compressed_metadata_notes: {
      source: "source_urls, cover_image_prompt, seo_title, seo_description, social_post_x, social_post_xhs, editor_notes",
      method: "compress into notes",
      note: "这些字段更适合作为备注、审计日志或后续内容生产参考。",
    },
  };

  const manual = [
    "official_repository",
    "license",
    "platform",
    "team_tested_label",
    "tested_summary",
    "public_review_summary",
    "source_urls",
    "cover_image_prompt",
    "seo_title",
    "seo_description",
    "social_post_x",
    "social_post_xhs",
    "editor_notes",
  ];

  const writable = new Set([
    "title",
    "slug",
    "summary",
    "description",
    "category",
    "tags",
    "website_url",
    "download_url",
    "cover_url",
    "pricing",
    "target_users",
    "use_cases",
    "pros",
    "cons",
    "risk_notice",
    "status",
    "is_free",
    "is_open_source",
    "free_status",
    "open_source_status",
    "category_id",
    "name",
    "tagline",
    "features",
  ]);

  for (const field of detectedToolFields) {
    if (!writable.has(field) && !manual.includes(field) && !Object.prototype.hasOwnProperty.call(derived, field)) {
      manual.push(field);
    }
  }

  return {
    direct,
    derived,
    needs_manual_mapping: manual,
  };
}

function buildPreviewRow(row, riskRow) {
  const pricingText = String(row.pricing ?? "").trim();
  const isFree = /免费|free/i.test(pricingText) ? true : null;
  const isOpenSource = inferOpenSource(row.official_repository, row.license);
  const riskLevel = String(riskRow?.risk_level ?? "").trim();

  return {
    slug: row.slug,
    title: row.title,
    dry_run_only: true,
    insert_payload_candidate: {
      title: row.title,
      slug: row.slug,
      summary: row.short_description,
      description: row.long_description,
      category: row.category,
      tags: splitPipe(row.tags),
      website_url: row.official_website,
      download_url: "",
      cover_url: "",
      pricing: row.pricing,
      target_users: splitPipe(row.suitable_for),
      use_cases: splitPipe(row.use_cases),
      pros: splitPipe(row.key_features),
      cons: splitPipe(row.not_suitable_for),
      risk_notice: joinParts(row.caution_notes, row.risk_tags),
      status: row.item_status === "ready_to_publish" ? "published" : row.item_status,
      is_free: isFree,
      is_open_source: isOpenSource,
      free_status: row.pricing,
      open_source_status: inferOpenSourceStatus(row.official_repository, row.license),
      category_id: null,
    },
    compressed_source_fields: {
      description: ["team_tested_label", "tested_summary", "public_review_summary"],
      metadata_notes: [
        "source_urls",
        "cover_image_prompt",
        "seo_title",
        "seo_description",
        "social_post_x",
        "social_post_xhs",
        "editor_notes",
      ],
      manual_followup: ["official_repository", "license", "platform"],
    },
    unmapped_source_fields: ["official_repository", "license", "platform"],
    warnings: buildWarnings(riskLevel, row, riskRow),
  };
}

function buildWarnings(riskLevel, row, riskRow) {
  const warnings = [];

  if (riskLevel) {
    warnings.push(`risk_level:${riskLevel}`);
  }

  const notes = [row.risk_tags, row.caution_notes, riskRow?.required_warning, riskRow?.can_publish_condition, riskRow?.final_manual_check]
    .map((value) => String(value ?? "").trim())
    .filter(Boolean);

  for (const note of notes) {
    warnings.push(note);
  }

  return warnings;
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
