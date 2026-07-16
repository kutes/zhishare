// Generic guarded bulk tool inserter, reused across P1 batches (docs/superpowers/plans/
// 2026-07-16-content-expansion-plan.md). Reads docs/content/tool-batches/{batch}.json
// (array of tool objects), validates each (mojibake gate, required fields, category
// exists, slug not already taken), uploads the matching cover screenshot from
// artifacts/tool-cover-shots/{slug}-final.jpg (must exist — produced by the ad-hoc
// Playwright capture step done before running this), then INSERTs published rows.
// Dry-run by default; --execute writes with readback verification per row.
// Usage: node ... --batch batch-a-office [--execute]

import fs from "node:fs";
import path from "node:path";
import { loadLocalEnv } from "./lib/load-local-env.mjs";

loadLocalEnv();

const batchIndex = process.argv.indexOf("--batch");
const BATCH = batchIndex !== -1 ? process.argv[batchIndex + 1] : "";
const executeMode = process.argv.includes("--execute");
if (!BATCH) {
  console.error("USAGE: node insert-tools-batch.mjs --batch <name> [--execute]");
  process.exit(1);
}

const INPUT_FILE = `docs/content/tool-batches/${BATCH}.json`;
const COVER_DIR = "artifacts/tool-cover-shots";
const REPORT = `docs/content/tool-batches/${BATCH}-report.json`;
const BUCKET = "tool-covers";

const REQUIRED_FIELDS = [
  "title",
  "slug",
  "category_slug",
  "summary",
  "description",
  "website_url",
  "target_users",
  "use_cases",
  "pros",
  "cons",
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY ?? "";

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

async function main() {
  if (!supabaseUrl || !anonKey) {
    console.error("MISSING_SUPABASE_ENV");
    process.exit(1);
  }
  if (executeMode && !serviceKey) {
    console.error("MISSING_SERVICE_KEY: pass SUPABASE_SERVICE_ROLE_KEY via env for --execute");
    process.exit(1);
  }

  const items = JSON.parse(fs.readFileSync(path.resolve(INPUT_FILE), "utf8"));
  if (!Array.isArray(items) || items.length === 0) throw new Error("BATCH_FILE_EMPTY_OR_INVALID");

  const { createClient } = await import("@supabase/supabase-js");
  const reader = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });

  const { data: categories, error: catError } = await reader.from("categories").select("id,slug,name");
  if (catError) throw new Error(`READ_CATEGORIES_FAILED: ${catError.message}`);
  const catBySlug = new Map(categories.map((c) => [c.slug, c]));

  const { data: existingTools, error: toolError } = await reader.from("tools").select("slug");
  if (toolError) throw new Error(`READ_TOOLS_FAILED: ${toolError.message}`);
  const existingSlugs = new Set(existingTools.map((t) => t.slug));

  const seenSlugs = new Set();
  const plan = items.map((item) => {
    const problems = [];
    for (const field of REQUIRED_FIELDS) {
      if (!String(item[field] ?? "").trim()) problems.push(`missing_${field}`);
    }
    if (item.slug) {
      if (existingSlugs.has(item.slug)) problems.push("slug_already_exists");
      if (seenSlugs.has(item.slug)) problems.push("duplicate_slug_in_batch");
      seenSlugs.add(item.slug);
    }
    const category = item.category_slug ? catBySlug.get(item.category_slug) : undefined;
    if (item.category_slug && !category) problems.push(`category_not_found:${item.category_slug}`);

    // 反乱码门:摘要/描述是中文正文必须含中文(标题多为英文品牌名,不做此要求);
    // 全部三项都过 mojibake 占位符检查。
    for (const [label, text] of [["title", item.title], ["summary", item.summary], ["description", item.description]]) {
      const value = String(text ?? "");
      if (label !== "title" && value && !/[一-鿿]/.test(value)) problems.push(`${label}_no_cjk`);
      if (/\?\?+/.test(value)) problems.push(`${label}_mojibake`);
    }
    // 风格门:摘要/描述禁"我"作骨架(简单零容忍检查,工具介绍不需要第一人称)
    for (const [label, text] of [["summary", item.summary], ["description", item.description]]) {
      if (String(text ?? "").includes("我")) problems.push(`style_contains_wo:${label}`);
    }

    const coverPath = path.resolve(COVER_DIR, `${item.slug}-final.jpg`);
    const hasCoverFile = item.slug ? fs.existsSync(coverPath) : false;
    if (item.slug && !hasCoverFile) problems.push("cover_screenshot_missing");

    return {
      slug: item.slug,
      title: item.title,
      status: problems.length === 0 ? "ready" : "blocked",
      problems,
      categoryId: category?.id,
      coverPath: hasCoverFile ? coverPath : null,
    };
  });

  const ready = plan.filter((p) => p.status === "ready");
  console.log(`PLAN: ${plan.map((p) => `${p.slug}:${p.status}${p.problems.length ? `(${p.problems.join(",")})` : ""}`).join(" | ")}`);

  if (!executeMode) {
    writeReport({ status: "dry_run_completed", batch: BATCH, plan });
    console.log(plan.every((p) => p.status === "ready") ? "INSERT_TOOLS_BATCH_DRY_RUN_OK" : "INSERT_TOOLS_BATCH_DRY_RUN_HAS_BLOCKED");
    console.log(`REPORT: ${REPORT}`);
    if (plan.some((p) => p.status !== "ready")) process.exitCode = 1;
    return;
  }

  if (plan.some((p) => p.status !== "ready")) {
    console.error("REFUSING_EXECUTE: one or more items blocked, fix and re-run dry-run first");
    writeReport({ status: "execute_refused_blocked_items", batch: BATCH, plan });
    process.exit(1);
  }

  const writer = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const itemBySlug = new Map(items.map((i) => [i.slug, i]));
  const inserted = [];
  const failed = [];

  for (const p of ready) {
    const item = itemBySlug.get(p.slug);
    try {
      const coverBytes = fs.readFileSync(p.coverPath);
      const coverStoragePath = `photos/${p.slug}.jpg`;
      const upload = await writer.storage.from(BUCKET).upload(coverStoragePath, coverBytes, {
        contentType: "image/jpeg",
        upsert: true,
      });
      if (upload.error) throw new Error(`COVER_UPLOAD_FAILED: ${upload.error.message}`);
      const { data: publicUrlData } = writer.storage.from(BUCKET).getPublicUrl(coverStoragePath);
      const coverUrl = publicUrlData?.publicUrl ? `${publicUrlData.publicUrl}?v=${Date.now()}` : "";
      if (!coverUrl) throw new Error("PUBLIC_URL_EMPTY");

      const payload = {
        title: item.title.trim(),
        slug: item.slug.trim(),
        summary: item.summary.trim(),
        description: item.description.trim(),
        website_url: item.website_url.trim(),
        download_url: item.download_url?.trim() || null,
        cover_url: coverUrl,
        category_id: p.categoryId,
        is_free: Boolean(item.is_free),
        is_open_source: Boolean(item.is_open_source),
        target_users: item.target_users.trim(),
        use_cases: item.use_cases.trim(),
        pros: item.pros.trim(),
        cons: item.cons.trim(),
        risk_notice: item.risk_notice?.trim() || null,
        status: "published",
      };
      const { data: row, error: insertError } = await writer.from("tools").insert(payload).select("id,slug").single();
      if (insertError || !row) throw new Error(`INSERT_FAILED: ${insertError?.message ?? "no row"}`);

      const { data: after, error: verifyError } = await writer
        .from("tools")
        .select("slug,status,cover_url,summary")
        .eq("id", row.id)
        .single();
      if (verifyError) throw new Error(`VERIFY_FAILED: ${verifyError.message}`);
      if (after.status !== "published") throw new Error("VERIFY_FAILED: status not published");
      if (!after.cover_url?.includes(coverStoragePath)) throw new Error("VERIFY_FAILED: cover_url mismatch");
      if (after.summary !== payload.summary) throw new Error("VERIFY_FAILED: summary mismatch");
      inserted.push(item.slug);
    } catch (err) {
      failed.push({ slug: p.slug, error: err instanceof Error ? err.message : String(err) });
    }
  }

  writeReport({ status: failed.length === 0 ? "execute_completed" : "execute_partial", batch: BATCH, plan, inserted, failed });
  console.log(failed.length === 0 ? "INSERT_TOOLS_BATCH_EXECUTE_OK" : "INSERT_TOOLS_BATCH_EXECUTE_PARTIAL");
  console.log(`INSERTED: ${inserted.join(",")}`);
  console.log(`FAILED: ${failed.map((f) => `${f.slug}(${f.error})`).join(",")}`);
  console.log(`REPORT: ${REPORT}`);
  if (failed.length > 0) process.exitCode = 1;
}

function writeReport(report) {
  const absolute = path.resolve(REPORT);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, `${JSON.stringify({ ...report, secret_values_printed: false }, null, 2)}\n`, "utf8");
}
