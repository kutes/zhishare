// Sets a tool's official download page URL, stored in tool-media/{slug}.json under
// `officialDownloadUrl` (no schema change). Reads the existing JSON first so media items
// are preserved. Dry-run by default; --execute uploads + reads back.
// Usage: node ... --slug obsidian --url https://obsidian.md/download [--execute]

import fs from "node:fs";
import path from "node:path";
import { loadLocalEnv } from "./lib/load-local-env.mjs";

loadLocalEnv();

const BUCKET = "tool-media";
const REPORT = "docs/content/set-tool-official-download-report.json";

const slugIndex = process.argv.indexOf("--slug");
const urlIndex = process.argv.indexOf("--url");
const slug = slugIndex !== -1 ? process.argv[slugIndex + 1] : "";
const officialUrl = urlIndex !== -1 ? process.argv[urlIndex + 1] : "";
const executeMode = process.argv.includes("--execute");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY ?? "";

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

async function main() {
  if (!slug || !officialUrl) {
    console.error("USAGE: node set-tool-official-download.mjs --slug <slug> --url <https-url> [--execute]");
    process.exit(1);
  }
  if (!/^https?:\/\//.test(officialUrl)) {
    console.error(`VALIDATION_FAILED: url must be http(s): ${officialUrl}`);
    process.exit(1);
  }
  if (!supabaseUrl) {
    console.error("MISSING_SUPABASE_ENV");
    process.exit(1);
  }

  // Preserve any existing media items in the same JSON.
  const publicUrl = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/${BUCKET}/${encodeURIComponent(slug)}.json`;
  let existing = {};
  try {
    const res = await fetch(publicUrl, { cache: "no-store" });
    if (res.ok) existing = (await res.json()) ?? {};
  } catch {
    existing = {};
  }
  const items = Array.isArray(existing.items) ? existing.items : [];
  const merged = { slug, items, officialDownloadUrl: officialUrl };

  console.log(`SLUG: ${slug}`);
  console.log(`OFFICIAL_DOWNLOAD_URL: ${officialUrl}`);
  console.log(`PRESERVED_MEDIA_ITEMS: ${items.length}`);

  if (!executeMode) {
    writeReport({ status: "dry_run_completed", slug, officialUrl, preserved_items: items.length });
    console.log("SET_OFFICIAL_DOWNLOAD_DRY_RUN_OK");
    console.log(`REPORT: ${REPORT}`);
    return;
  }

  if (!serviceKey) {
    console.error("MISSING_SERVICE_KEY_FOR_EXECUTE");
    process.exit(1);
  }
  const { createClient } = await import("@supabase/supabase-js");
  const client = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  const body = JSON.stringify(merged, null, 2);
  const { error } = await client.storage
    .from(BUCKET)
    .upload(`${slug}.json`, body, { contentType: "application/json", upsert: true });
  if (error) throw new Error(`UPLOAD_FAILED: ${error.message}`);

  // Read back and verify.
  const verify = await fetch(publicUrl, { cache: "no-store" });
  const stored = verify.ok ? await verify.json() : {};
  if (stored?.officialDownloadUrl !== officialUrl) {
    throw new Error("VERIFY_FAILED: stored officialDownloadUrl does not match");
  }

  writeReport({ status: "execute_completed", slug, officialUrl, preserved_items: items.length });
  console.log("SET_OFFICIAL_DOWNLOAD_EXECUTE_OK");
  console.log(`REPORT: ${REPORT}`);
}

function writeReport(report) {
  const absolute = path.resolve(REPORT);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, `${JSON.stringify({ ...report, secret_values_printed: false }, null, 2)}\n`, "utf8");
}
