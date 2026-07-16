// Populates the (currently empty) article_tags join table so the articles-page
// tag filter has real options instead of only "全部". Uses only tags that
// already exist in the tags table — does not invent new tags.
// Dry-run by default (resolves ids, reports the plan); --execute inserts rows
// with upsert-safe dedupe and verifies by readback.

import fs from "node:fs";
import path from "node:path";
import { loadLocalEnv } from "./lib/load-local-env.mjs";

loadLocalEnv();

const REPORT = "docs/content/assign-article-tags-report-v1.json";
const executeMode = process.argv.includes("--execute");

// article slug -> tag names (must already exist in `tags`)
const ASSIGNMENTS = {
  "free-ai-tools-safety": ["免费", "AI写作"],
  "netdisk-resource-risks": ["免费", "效率软件"],
  "free-image-tools-comparison": ["免费", "图片处理"],
  "file-transfer-without-netdisk": ["免费", "开源"],
  "notion-vs-obsidian": ["效率软件", "中文"],
};

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

  const { createClient } = await import("@supabase/supabase-js");
  const reader = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });

  const { data: articles, error: articleError } = await reader.from("articles").select("id,slug");
  if (articleError) throw new Error(`READ_ARTICLES_FAILED: ${articleError.message}`);
  const { data: tags, error: tagError } = await reader.from("tags").select("id,name");
  if (tagError) throw new Error(`READ_TAGS_FAILED: ${tagError.message}`);

  const articleBySlug = new Map(articles.map((a) => [a.slug, a.id]));
  const tagByName = new Map(tags.map((t) => [t.name, t.id]));

  const plan = [];
  for (const [slug, tagNames] of Object.entries(ASSIGNMENTS)) {
    const articleId = articleBySlug.get(slug);
    if (!articleId) {
      plan.push({ slug, status: "article_not_found" });
      continue;
    }
    const resolved = [];
    const missing = [];
    for (const name of tagNames) {
      const tagId = tagByName.get(name);
      if (tagId) resolved.push({ name, tagId });
      else missing.push(name);
    }
    if (missing.length > 0) {
      plan.push({ slug, status: "tag_not_found", missing });
      continue;
    }
    plan.push({ slug, status: "ready", articleId, tags: resolved });
  }

  const ready = plan.filter((p) => p.status === "ready");
  console.log(`PLAN: ${plan.map((p) => `${p.slug}:${p.status}`).join(" | ")}`);

  if (!executeMode) {
    writeReport({ status: "dry_run_completed", plan });
    console.log("ASSIGN_ARTICLE_TAGS_DRY_RUN_OK");
    console.log(`REPORT: ${REPORT}`);
    return;
  }

  const writer = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const updated = [];
  const failed = [];
  for (const item of ready) {
    try {
      const rows = item.tags.map((t) => ({ article_id: item.articleId, tag_id: t.tagId }));
      const insert = await writer.from("article_tags").upsert(rows, { onConflict: "article_id,tag_id" });
      if (insert.error) throw new Error(`INSERT_FAILED: ${insert.error.message}`);

      const { data: after, error: verifyError } = await writer
        .from("article_tags")
        .select("tag_id")
        .eq("article_id", item.articleId);
      if (verifyError) throw new Error(`VERIFY_FAILED: ${verifyError.message}`);
      const gotIds = new Set((after ?? []).map((r) => r.tag_id));
      const wantIds = item.tags.map((t) => t.tagId);
      if (!wantIds.every((id) => gotIds.has(id))) {
        throw new Error("VERIFY_FAILED: readback missing expected tag ids");
      }
      updated.push(item.slug);
    } catch (error) {
      failed.push({ slug: item.slug, error: error instanceof Error ? error.message : String(error) });
    }
  }

  writeReport({ status: failed.length === 0 ? "execute_completed" : "execute_partial", plan, updated, failed });
  console.log(failed.length === 0 ? "ASSIGN_ARTICLE_TAGS_EXECUTE_OK" : "ASSIGN_ARTICLE_TAGS_EXECUTE_PARTIAL");
  console.log(`UPDATED: ${updated.join(",")}`);
  console.log(`FAILED: ${failed.map((f) => `${f.slug}(${f.error})`).join(",")}`);
  console.log(`REPORT: ${REPORT}`);
  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

function writeReport(report) {
  const absolute = path.resolve(REPORT);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, `${JSON.stringify({ ...report, secret_values_printed: false }, null, 2)}\n`, "utf8");
}
