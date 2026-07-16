// Swaps generated article covers for the real tool photos already fetched into
// the tool-covers bucket, for articles that are about a specific tool.
// The photo is copied into the article-covers bucket (not referenced in place)
// so later changes to the tool cover cannot break the article.
// Dry-run by default (validates mappings via anon key); --execute needs
// SUPABASE_SERVICE_ROLE_KEY in env and uploads + updates cover_url + verifies.

import fs from "node:fs";
import path from "node:path";
import { loadLocalEnv } from "./lib/load-local-env.mjs";

loadLocalEnv();

const BUCKET = "article-covers";
const REPORT = "docs/content/adopt-article-covers-report-v1.json";
const executeMode = process.argv.includes("--execute");

// article slug -> tool slug whose real photo becomes the article cover.
// Only tools with a real /photos/ cover qualify; validated below.
const MAPPINGS = [
  { article: "file-transfer-without-netdisk", tool: "localsend" },
  { article: "notion-vs-obsidian", tool: "notion" },
  { article: "free-image-tools-comparison", tool: "remove-bg" },
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
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

  const plan = [];
  for (const { article, tool } of MAPPINGS) {
    const { data: toolRows, error: toolError } = await reader
      .from("tools")
      .select("slug,cover_url")
      .eq("slug", tool)
      .limit(1);
    if (toolError || !toolRows?.[0]) {
      plan.push({ article, tool, status: "tool_not_found" });
      continue;
    }
    const photoUrl = String(toolRows[0].cover_url ?? "");
    if (!photoUrl.includes("/photos/")) {
      plan.push({ article, tool, status: "tool_cover_not_a_photo", photoUrl });
      continue;
    }
    const { data: articleRows, error: articleError } = await reader
      .from("articles")
      .select("id,slug,cover_url")
      .eq("slug", article)
      .limit(1);
    if (articleError || !articleRows?.[0]) {
      plan.push({ article, tool, status: "article_not_found" });
      continue;
    }
    const ext = extensionOf(photoUrl);
    plan.push({
      article,
      tool,
      status: "ready",
      articleId: articleRows[0].id,
      photoUrl,
      uploadPath: `photos/${article}.${ext}`,
    });
  }

  const ready = plan.filter((p) => p.status === "ready");
  console.log(`PLAN: ${plan.map((p) => `${p.article}<=${p.tool}:${p.status}`).join(" | ")}`);

  if (!executeMode) {
    writeReport({ status: "dry_run_completed", plan });
    console.log("ADOPT_ARTICLE_COVERS_DRY_RUN_OK");
    console.log(`REPORT: ${REPORT}`);
    return;
  }

  const writer = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const updated = [];
  const failed = [];
  for (const item of ready) {
    try {
      const response = await fetch(item.photoUrl);
      if (!response.ok) {
        throw new Error(`DOWNLOAD_FAILED: ${response.status}`);
      }
      const contentType = response.headers.get("content-type") ?? "image/png";
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.length < 1024) {
        throw new Error(`DOWNLOAD_TOO_SMALL: ${bytes.length}B`);
      }
      const upload = await writer.storage
        .from(BUCKET)
        .upload(item.uploadPath, bytes, { contentType, upsert: true });
      if (upload.error) {
        throw new Error(`UPLOAD_FAILED: ${upload.error.message}`);
      }
      const { data: publicUrlData } = writer.storage.from(BUCKET).getPublicUrl(item.uploadPath);
      const coverUrl = publicUrlData?.publicUrl ?? "";
      if (!coverUrl) {
        throw new Error("PUBLIC_URL_EMPTY");
      }
      const { data: after, error: updateError } = await writer
        .from("articles")
        .update({ cover_url: coverUrl, updated_at: new Date().toISOString() })
        .eq("id", item.articleId)
        .select("slug,cover_url");
      if (updateError || !after?.[0]?.cover_url?.includes(item.uploadPath)) {
        throw new Error(`VERIFY_FAILED: ${updateError?.message ?? "readback mismatch"}`);
      }
      updated.push(item.article);
    } catch (error) {
      failed.push({ article: item.article, error: error instanceof Error ? error.message : String(error) });
    }
  }

  writeReport({ status: failed.length === 0 ? "execute_completed" : "execute_partial", plan, updated, failed });
  console.log(failed.length === 0 ? "ADOPT_ARTICLE_COVERS_EXECUTE_OK" : "ADOPT_ARTICLE_COVERS_EXECUTE_PARTIAL");
  console.log(`UPDATED: ${updated.join(",")}`);
  console.log(`FAILED: ${failed.map((f) => `${f.article}(${f.error})`).join(",")}`);
  console.log(`REPORT: ${REPORT}`);
  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

function extensionOf(url) {
  const clean = url.split("?")[0];
  const ext = path.extname(clean).replace(".", "").toLowerCase();
  return ext || "png";
}

function writeReport(report) {
  const absolute = path.resolve(REPORT);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, `${JSON.stringify({ ...report, secret_values_printed: false }, null, 2)}\n`, "utf8");
}
