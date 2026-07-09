// Uploads per-tool media JSON to the public tool-media bucket from a seed file.
// Dry-run by default (validates + reports); --execute writes tool-media/{slug}.json.
// Media items: { type:"image", url, caption } or { type:"embed", url, caption }.
// Embed URLs are restricted to an allowlist (bilibili / youtube) to prevent unsafe iframes.

import fs from "node:fs";
import path from "node:path";
import { loadLocalEnv } from "./lib/load-local-env.mjs";

loadLocalEnv();

const DEFAULT_INPUT = "docs/content/tool-media-seed-v1.json";
const REPORT = "docs/content/tool-media-import-report-v1.json";
const BUCKET = "tool-media";

const EMBED_HOSTS = new Set(["player.bilibili.com", "www.youtube.com", "youtube.com", "www.youtube-nocookie.com"]);

const inputArgIndex = process.argv.indexOf("--input");
const input = inputArgIndex !== -1 ? process.argv[inputArgIndex + 1] : DEFAULT_INPUT;
const executeMode = process.argv.includes("--execute");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY ?? "";

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

async function main() {
  const seed = JSON.parse(fs.readFileSync(path.resolve(input), "utf8"));
  const entries = Object.entries(seed.tools ?? {});
  const validated = entries.map(([slug, value]) => validateTool(slug, value));
  const blockers = validated.flatMap((entry) => entry.blockers);

  console.log(`TOOLS: ${entries.length}`);
  for (const entry of validated) {
    console.log(`  ${entry.slug}: ${entry.items.length} items${entry.blockers.length ? ` BLOCKERS:${entry.blockers.join(",")}` : ""}`);
  }

  if (!executeMode) {
    writeReport({ status: blockers.length ? "dry_run_blocked" : "dry_run_completed", input, blockers, tools: validated.map((e) => ({ slug: e.slug, item_count: e.items.length })) });
    console.log(blockers.length ? "IMPORT_MEDIA_DRY_RUN_BLOCKED" : "IMPORT_MEDIA_DRY_RUN_OK");
    console.log(`REPORT: ${REPORT}`);
    if (blockers.length) process.exitCode = 1;
    return;
  }

  if (blockers.length) {
    console.error(`REFUSING_EXECUTE_WITH_BLOCKERS: ${blockers.join(",")}`);
    process.exit(1);
  }
  if (!supabaseUrl || !serviceKey) {
    console.error("MISSING_SUPABASE_ENV");
    process.exit(1);
  }

  const { createClient } = await import("@supabase/supabase-js");
  const client = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  const uploaded = [];
  const failed = [];
  for (const entry of validated) {
    const body = JSON.stringify({ slug: entry.slug, items: entry.items }, null, 2);
    const { error } = await client.storage
      .from(BUCKET)
      .upload(`${entry.slug}.json`, body, { contentType: "application/json", upsert: true });
    if (error) {
      failed.push({ slug: entry.slug, error: error.message });
      continue;
    }
    uploaded.push(entry.slug);
  }

  writeReport({ status: failed.length ? "execute_partial" : "execute_completed", input, uploaded, failed });
  console.log(failed.length ? "IMPORT_MEDIA_EXECUTE_PARTIAL" : "IMPORT_MEDIA_EXECUTE_OK");
  console.log(`UPLOADED: ${uploaded.join(",")}`);
  console.log(`FAILED: ${failed.map((f) => f.slug).join(",")}`);
  console.log(`REPORT: ${REPORT}`);
  if (failed.length) process.exitCode = 1;
}

function validateTool(slug, value) {
  const blockers = [];
  const rawItems = Array.isArray(value?.items) ? value.items : [];
  const items = [];
  rawItems.forEach((item, index) => {
    const caption = typeof item?.caption === "string" ? item.caption.trim() : "";
    if (item?.type === "image") {
      if (typeof item.url === "string" && /^https?:\/\//.test(item.url)) {
        items.push({ type: "image", url: item.url, caption });
      } else {
        blockers.push(`${slug}[${index}]:BAD_IMAGE_URL`);
      }
      return;
    }
    if (item?.type === "embed") {
      let host = "";
      try {
        host = new URL(item.url).host.toLowerCase();
      } catch {
        host = "";
      }
      if (EMBED_HOSTS.has(host)) {
        items.push({ type: "embed", url: item.url, caption });
      } else {
        blockers.push(`${slug}[${index}]:EMBED_HOST_NOT_ALLOWED`);
      }
      return;
    }
    blockers.push(`${slug}[${index}]:UNKNOWN_TYPE`);
  });
  if (items.length === 0) {
    blockers.push(`${slug}:NO_VALID_ITEMS`);
  }
  return { slug, items, blockers };
}

function writeReport(report) {
  const absolute = path.resolve(REPORT);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, `${JSON.stringify({ ...report, secret_values_printed: false }, null, 2)}\n`, "utf8");
}
