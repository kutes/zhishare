// Inserts the next batch of 7 tools from docs/content/next-7-tools-content-v1.json.
// Guarded: dry-run by default (validates content + checks slug conflicts, writes a report);
// --execute inserts. Refuses to run if content fails the anti-mojibake gate, if any slug
// already exists, or if a category id is unknown. Service key comes from env only.

import fs from "node:fs";
import path from "node:path";
import { loadLocalEnv } from "./lib/load-local-env.mjs";

loadLocalEnv();

const INPUT = "docs/content/next-7-tools-content-v1.json";
const REPORT = "docs/content/next-7-tools-import-report-v1.json";
const ALLOWED_SLUGS = ["openless", "plainapp", "autohotkey", "recordly", "droplock", "syncthing", "file-browser"];
const KNOWN_CATEGORY_IDS = new Set([
  "8d38cc91-c4c6-4a5c-8cdb-e3114db282dc",
  "fbfca01f-aa99-4762-97d9-e8c97d93b9aa",
  "be44b813-22b5-4e6a-bb10-64212dd3063e",
  "b4b7ee68-2263-4296-be59-b00b046905a7",
  "01fa2c8a-6f19-4d10-b3f8-0195aff57737",
  "7a6ba2af-1568-4af3-a8be-a14e70ccc3f6",
  "b51f9eca-f0bf-41db-b0e1-4cfab6d1fe64",
  "7d404bc0-ea1f-41b1-9675-7c51f98c26c5",
  "080aeb19-592c-46fe-baa1-0410ee1ac267",
  "4cfb5ba3-1b1b-4639-ab73-1435f5f8693c",
  "271c2af8-bc27-4116-8a5d-aad4c1e8f1a8",
  "8a954cde-d330-42af-8a26-a1e47bfa948d",
  "bc909c01-b83d-489a-a23f-592ed2992c0b",
  "6aef1b36-b030-4e53-b9b3-cb011daf3a88",
]);
const LIST_FIELDS = ["target_users", "use_cases", "pros", "cons"];
const TEXT_FIELDS = ["summary", "description", "risk_notice"];

const executeMode = process.argv.includes("--execute");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY ?? "";

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

async function main() {
  const content = JSON.parse(fs.readFileSync(path.resolve(INPUT), "utf8"));
  const blockers = validateContent(content);
  const payloads = ALLOWED_SLUGS.map((slug) => buildPayload(slug, content.tools[slug]));

  console.log(`TOOLS: ${payloads.length}`);
  for (const payload of payloads) {
    console.log(`  ${payload.slug.padEnd(13)} ${payload.title} -> ${payload.category_id.slice(0, 8)}… (${payload.status})`);
  }
  if (blockers.length > 0) {
    console.log(`CONTENT_BLOCKERS: ${blockers.join(",")}`);
  }

  if (!executeMode) {
    writeReport({ status: blockers.length ? "dry_run_blocked" : "dry_run_completed", input: INPUT, blockers, slugs: ALLOWED_SLUGS });
    console.log(blockers.length ? "IMPORT_NEXT7_DRY_RUN_BLOCKED" : "IMPORT_NEXT7_DRY_RUN_OK");
    console.log(`REPORT: ${REPORT}`);
    if (blockers.length) process.exitCode = 1;
    return;
  }

  if (blockers.length) {
    console.error("REFUSING_EXECUTE_WITH_BLOCKERS");
    process.exit(1);
  }
  if (!supabaseUrl || !serviceKey) {
    console.error("MISSING_SUPABASE_ENV");
    process.exit(1);
  }

  const { createClient } = await import("@supabase/supabase-js");
  const client = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  const { data: existing, error: conflictError } = await client.from("tools").select("slug").in("slug", ALLOWED_SLUGS);
  if (conflictError) {
    throw new Error(`SLUG_CONFLICT_QUERY_FAILED: ${conflictError.message}`);
  }
  if ((existing ?? []).length > 0) {
    const conflicts = existing.map((row) => row.slug).join(",");
    writeReport({ status: "execute_blocked_slug_conflict", conflicts });
    console.error(`SLUG_CONFLICT: ${conflicts}`);
    process.exit(1);
  }

  const { data: inserted, error: insertError } = await client
    .from("tools")
    .insert(payloads)
    .select("id,slug,summary");
  if (insertError) {
    writeReport({ status: "execute_failed", error: insertError.message });
    console.error(`INSERT_FAILED: ${insertError.message}`);
    process.exit(1);
  }

  const insertedSlugs = (inserted ?? []).map((row) => row.slug);
  const clean = (inserted ?? []).every((row) => !/\?\?+/.test(String(row.summary ?? "")) && /[一-鿿]/.test(String(row.summary ?? "")));
  const complete = insertedSlugs.length === ALLOWED_SLUGS.length;

  writeReport({
    status: complete && clean ? "execute_completed" : "execute_partial",
    inserted_slugs: insertedSlugs,
    verify_clean: clean,
  });
  console.log(complete && clean ? "IMPORT_NEXT7_EXECUTE_OK" : "IMPORT_NEXT7_EXECUTE_PARTIAL");
  console.log(`INSERTED: ${insertedSlugs.join(",")}`);
  console.log(`VERIFY_CLEAN: ${clean}`);
  console.log(`REPORT: ${REPORT}`);
  if (!(complete && clean)) process.exitCode = 1;
}

function validateContent(content) {
  const blockers = [];
  for (const slug of ALLOWED_SLUGS) {
    const tool = content.tools?.[slug];
    if (!tool) {
      blockers.push(`MISSING:${slug}`);
      continue;
    }
    const combined = [
      ...TEXT_FIELDS.map((field) => String(tool[field] ?? "")),
      ...LIST_FIELDS.flatMap((field) => (Array.isArray(tool[field]) ? tool[field] : [])),
    ].join(" ");
    if (/\?\?+/.test(combined)) blockers.push(`MOJIBAKE:${slug}`);
    if (!/[一-鿿]/.test(combined)) blockers.push(`NO_CJK:${slug}`);
    for (const field of TEXT_FIELDS) {
      if (!String(tool[field] ?? "").trim()) blockers.push(`EMPTY:${slug}.${field}`);
    }
    for (const field of LIST_FIELDS) {
      if (!Array.isArray(tool[field]) || tool[field].length === 0) blockers.push(`EMPTY_LIST:${slug}.${field}`);
    }
    if (!KNOWN_CATEGORY_IDS.has(tool.category_id)) blockers.push(`BAD_CATEGORY:${slug}`);
    if (!/^https?:\/\//.test(String(tool.website_url ?? ""))) blockers.push(`BAD_URL:${slug}`);
  }
  return blockers;
}

function buildPayload(slug, tool) {
  return {
    title: tool.title,
    slug,
    summary: tool.summary.trim(),
    description: tool.description.trim(),
    category_id: tool.category_id,
    website_url: tool.website_url,
    download_url: tool.download_url ?? null,
    cover_url: null,
    is_free: Boolean(tool.is_free),
    is_open_source: Boolean(tool.is_open_source),
    target_users: tool.target_users.join("\n"),
    use_cases: tool.use_cases.join("\n"),
    pros: tool.pros.join("\n"),
    cons: tool.cons.join("\n"),
    risk_notice: tool.risk_notice.trim(),
    status: tool.status === "published" ? "published" : "draft",
    updated_at: new Date().toISOString(),
  };
}

function writeReport(report) {
  const absolute = path.resolve(REPORT);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, `${JSON.stringify({ ...report, secret_values_printed: false }, null, 2)}\n`, "utf8");
}
