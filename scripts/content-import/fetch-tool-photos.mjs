// Fetches each tool's official og:image / twitter:image and re-hosts it as the card photo.
// Dry-run by default (reports what would be fetched); --execute downloads, uploads to
// tool-covers/photos/{slug}.{ext} and points cover_url at the photo. Tools without a
// usable image keep their generated cover — the card never goes blank.
// --force re-fetches tools whose cover_url already points at photos/.

import fs from "node:fs";
import path from "node:path";
import { loadLocalEnv } from "./lib/load-local-env.mjs";

loadLocalEnv();

const BUCKET = "tool-covers";
const REPORT = "docs/content/fetch-tool-photos-report-v1.json";
const MAX_BYTES = 4 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 15000;
const DOWNLOAD_TIMEOUT_MS = 30000;
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) zhishare-cover-fetch/1.0";
const ALLOWED_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

const executeMode = process.argv.includes("--execute");
const forceMode = process.argv.includes("--force");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY ?? "";

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

async function main() {
  if (!supabaseUrl || !serviceKey) {
    console.error("MISSING_SUPABASE_ENV");
    process.exit(1);
  }

  const { createClient } = await import("@supabase/supabase-js");
  const client = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  const { data: rows, error } = await client
    .from("tools")
    .select("id,slug,title,website_url,cover_url")
    .order("created_at", { ascending: true });
  if (error) {
    throw new Error(`READ_TOOLS_FAILED: ${error.message}`);
  }

  const targets = (rows ?? []).filter((row) => {
    if (!String(row.website_url ?? "").trim()) {
      return false;
    }
    const cover = String(row.cover_url ?? "");
    return forceMode || !cover.includes("/tool-covers/photos/");
  });

  console.log(`TARGET_COUNT: ${targets.length}`);

  const results = [];
  for (const row of targets) {
    const result = await probeTool(row);
    results.push(result);
    console.log(`${result.status.padEnd(12)} ${row.slug}${result.image_url ? ` <- ${result.image_url}` : ""}`);
  }

  if (!executeMode) {
    writeReport({ status: "dry_run_completed", force: forceMode, results });
    console.log("FETCH_PHOTOS_DRY_RUN_OK");
    console.log(`FOUND: ${results.filter((r) => r.status === "found").length}/${results.length}`);
    console.log(`REPORT: ${REPORT}`);
    return;
  }

  const updated = [];
  const skipped = [];
  const failed = [];
  for (const result of results) {
    if (result.status !== "found") {
      skipped.push(result.slug);
      continue;
    }
    const outcome = await downloadAndStore(client, result);
    if (!outcome.ok) {
      // Unsupported formats/sizes are expected variance, not failures — the tool
      // simply keeps its generated cover.
      if (/^(UNSUPPORTED_TYPE|BAD_SIZE)/.test(outcome.error)) {
        skipped.push(`${result.slug}(${outcome.error})`);
      } else {
        failed.push({ slug: result.slug, error: outcome.error });
      }
      continue;
    }
    const { data: after, error: updateError } = await client
      .from("tools")
      .update({ cover_url: outcome.photoUrl, updated_at: new Date().toISOString() })
      .eq("id", result.id)
      .select("slug,cover_url");
    if (updateError || !String(after?.[0]?.cover_url ?? "").includes("/photos/")) {
      failed.push({ slug: result.slug, error: updateError?.message ?? "VERIFY_FAILED" });
      continue;
    }
    updated.push(result.slug);
  }

  writeReport({ status: failed.length === 0 ? "execute_completed" : "execute_partial", force: forceMode, results, updated, skipped, failed });
  console.log(failed.length === 0 ? "FETCH_PHOTOS_EXECUTE_OK" : "FETCH_PHOTOS_EXECUTE_PARTIAL");
  console.log(`UPDATED: ${updated.join(",")}`);
  console.log(`SKIPPED_NO_IMAGE: ${skipped.join(",")}`);
  console.log(`FAILED: ${failed.map((f) => f.slug).join(",")}`);
  console.log(`REPORT: ${REPORT}`);
  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

async function probeTool(row) {
  const base = { id: row.id, slug: row.slug, website_url: row.website_url };
  try {
    const html = await fetchText(row.website_url);
    const imageUrl = extractShareImage(html, row.website_url);
    if (!imageUrl) {
      return { ...base, status: "no_image", image_url: null };
    }
    return { ...base, status: "found", image_url: imageUrl };
  } catch (error) {
    return { ...base, status: "probe_failed", image_url: null, error: error instanceof Error ? error.message : String(error) };
  }
}

function extractShareImage(html, pageUrl) {
  const patterns = [
    /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/i,
    /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["']/i,
  ];
  for (const pattern of patterns) {
    const match = pattern.exec(html);
    if (match?.[1]) {
      const decoded = decodeHtmlEntities(match[1].trim());
      try {
        return new URL(decoded, pageUrl).toString();
      } catch {
        continue;
      }
    }
  }
  return null;
}

function decodeHtmlEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

async function downloadAndStore(client, result) {
  try {
    const response = await fetchWithTimeout(result.image_url, { redirect: "follow" }, DOWNLOAD_TIMEOUT_MS);
    if (!response.ok) {
      return { ok: false, error: `DOWNLOAD_HTTP_${response.status}` };
    }
    const contentType = String(response.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
    const ext = ALLOWED_TYPES.get(contentType);
    if (!ext) {
      return { ok: false, error: `UNSUPPORTED_TYPE: ${contentType || "unknown"}` };
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length === 0 || buffer.length > MAX_BYTES) {
      return { ok: false, error: `BAD_SIZE: ${buffer.length}` };
    }

    const photoPath = `photos/${result.slug}.${ext}`;
    const upload = await client.storage.from(BUCKET).upload(photoPath, buffer, { contentType, upsert: true });
    if (upload.error) {
      return { ok: false, error: `UPLOAD_FAILED: ${upload.error.message}` };
    }
    const { data } = client.storage.from(BUCKET).getPublicUrl(photoPath);
    const photoUrl = data?.publicUrl ?? "";
    if (!photoUrl) {
      return { ok: false, error: "PUBLIC_URL_EMPTY" };
    }
    return { ok: true, photoUrl };
  } catch (error) {
    return { ok: false, error: `DOWNLOAD_FAILED: ${error instanceof Error ? error.message : String(error)}` };
  }
}

async function fetchText(url) {
  const response = await fetchWithTimeout(url, { redirect: "follow" });
  if (!response.ok) {
    throw new Error(`HTTP_${response.status}`);
  }
  return await response.text();
}

function fetchWithTimeout(url, options, timeoutMs = FETCH_TIMEOUT_MS) {
  return fetch(url, {
    ...options,
    headers: { "user-agent": USER_AGENT, accept: "*/*" },
    signal: AbortSignal.timeout(timeoutMs),
  });
}

function writeReport(report) {
  const absolute = path.resolve(REPORT);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, `${JSON.stringify({ ...report, secret_values_printed: false }, null, 2)}\n`, "utf8");
}
