// Uploads locally-captured official-homepage screenshots as real tool covers,
// replacing the generated big-letter SVG cover for tools whose og:image could
// not be auto-fetched (fetch-tool-photos.mjs found nothing usable for these).
// Screenshots were taken with scripts/tool-cover-shots ad-hoc capture + sharp
// crop to 1200x675 JPEG; this script only handles the guarded DB/storage write.
// Dry-run by default (validates files + DB rows, no writes); --execute uploads
// to tool-covers/photos/{slug}.jpg and updates cover_url with readback verify.

import fs from "node:fs";
import path from "node:path";
import { loadLocalEnv } from "./lib/load-local-env.mjs";

loadLocalEnv();

const BUCKET = "tool-covers";
const SHOT_DIR = "artifacts/tool-cover-shots";
const REPORT = "docs/content/upload-tool-cover-screenshots-report-v1.json";
const executeMode = process.argv.includes("--execute");

const TARGETS = ["canva", "capcut", "chatgpt", "figma", "file-browser", "photopea"];

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

  const plan = [];
  for (const slug of TARGETS) {
    const filePath = path.resolve(SHOT_DIR, `${slug}-final.jpg`);
    if (!fs.existsSync(filePath)) {
      plan.push({ slug, status: "screenshot_missing", filePath });
      continue;
    }
    const bytes = fs.statSync(filePath).size;
    if (bytes < 5 * 1024) {
      plan.push({ slug, status: "screenshot_too_small", bytes });
      continue;
    }
    const { data: rows, error } = await reader
      .from("tools")
      .select("id,slug,cover_url,status")
      .eq("slug", slug)
      .limit(1);
    if (error || !rows?.[0]) {
      plan.push({ slug, status: "tool_not_found" });
      continue;
    }
    if (rows[0].cover_url?.includes("/photos/")) {
      plan.push({ slug, status: "already_has_photo", cover_url: rows[0].cover_url });
      continue;
    }
    plan.push({ slug, status: "ready", id: rows[0].id, filePath, bytes, uploadPath: `photos/${slug}.jpg` });
  }

  const ready = plan.filter((p) => p.status === "ready");
  console.log(`PLAN: ${plan.map((p) => `${p.slug}:${p.status}`).join(" | ")}`);

  if (!executeMode) {
    writeReport({ status: "dry_run_completed", plan });
    console.log("UPLOAD_TOOL_COVER_SCREENSHOTS_DRY_RUN_OK");
    console.log(`REPORT: ${REPORT}`);
    return;
  }

  const writer = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const updated = [];
  const failed = [];
  for (const item of ready) {
    try {
      const bytes = fs.readFileSync(item.filePath);
      const upload = await writer.storage
        .from(BUCKET)
        .upload(item.uploadPath, bytes, { contentType: "image/jpeg", upsert: true });
      if (upload.error) {
        throw new Error(`UPLOAD_FAILED: ${upload.error.message}`);
      }
      const { data: publicUrlData } = writer.storage.from(BUCKET).getPublicUrl(item.uploadPath);
      const coverUrl = publicUrlData?.publicUrl ? `${publicUrlData.publicUrl}?v=${Date.now()}` : "";
      if (!coverUrl) {
        throw new Error("PUBLIC_URL_EMPTY");
      }
      const { data: after, error: updateError } = await writer
        .from("tools")
        .update({ cover_url: coverUrl, updated_at: new Date().toISOString() })
        .eq("id", item.id)
        .select("slug,cover_url");
      if (updateError || !after?.[0]?.cover_url?.includes(item.uploadPath)) {
        throw new Error(`VERIFY_FAILED: ${updateError?.message ?? "readback mismatch"}`);
      }
      updated.push(item.slug);
    } catch (error) {
      failed.push({ slug: item.slug, error: error instanceof Error ? error.message : String(error) });
    }
  }

  writeReport({
    status: failed.length === 0 ? "execute_completed" : "execute_partial",
    plan,
    updated,
    failed,
    source_note: "Screenshots of each tool's official homepage, captured with Playwright, cookie banners dismissed where present.",
  });
  console.log(failed.length === 0 ? "UPLOAD_TOOL_COVER_SCREENSHOTS_EXECUTE_OK" : "UPLOAD_TOOL_COVER_SCREENSHOTS_EXECUTE_PARTIAL");
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
