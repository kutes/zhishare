// Enriches one tool's detail page per docs/content/TOOL_DETAIL_RICH_STANDARD.md:
// reads docs/content/tool-detail-v2/{slug}.json (multi-paragraph description,
// features list, officialDownloadUrl, media items sourced ONLY from the tool's
// official site/repo), downloads + re-encodes each media image to the public
// `tool-media` bucket (tool-media/shots/{slug}-{n}.jpg, GIFs kept as-is),
// writes tool-media/{slug}.json (gallery + officialDownloadUrl), and updates
// the tools row (description, features) — with readback verification.
// Guarded-script pattern: dry-run by default, --execute for real writes,
// service key from env only (SUPABASE_SERVICE_ROLE_KEY), never written to disk.
// Usage: node scripts/content-import/enrich-tool-detail.mjs --slug kaobuddy [--execute]

import fs from "node:fs";
import path from "node:path";
import { loadLocalEnv } from "./lib/load-local-env.mjs";

loadLocalEnv();

const slugIndex = process.argv.indexOf("--slug");
const SLUG = slugIndex !== -1 ? process.argv[slugIndex + 1] : "";
const executeMode = process.argv.includes("--execute");
if (!SLUG) {
  console.error("USAGE: node enrich-tool-detail.mjs --slug <slug> [--execute]");
  process.exit(1);
}

const INPUT_FILE = `docs/content/tool-detail-v2/${SLUG}.json`;
const BUCKET = "tool-media";
const REPORT = `docs/content/tool-detail-v2/${SLUG}-report.json`;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY ?? "";

function hasMojibake(text) {
  return /�|\?{3,}/.test(text);
}

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
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`INPUT_MISSING: ${INPUT_FILE}`);
    process.exit(1);
  }

  const input = JSON.parse(fs.readFileSync(INPUT_FILE, "utf8"));
  const problems = [];
  if (input.slug !== SLUG) problems.push("slug_mismatch");
  if (typeof input.description !== "string" || input.description.split("\n\n").length < 2) {
    problems.push("description_not_multiparagraph");
  }
  if (!Array.isArray(input.features) || input.features.length < 3) problems.push("features_too_few");
  if (hasMojibake(JSON.stringify(input))) problems.push("mojibake");
  for (const item of input.media ?? []) {
    if (!/^https?:\/\//.test(item.source_url ?? "")) problems.push("media_bad_url");
    if (!item.caption) problems.push("media_missing_caption");
  }

  const { createClient } = await import("@supabase/supabase-js");
  const reader = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });
  const { data: rows, error: readError } = await reader
    .from("tools")
    .select("id,slug,status,description")
    .eq("slug", SLUG)
    .limit(1);
  if (readError) {
    console.error(`READ_ERROR: ${readError.message}`);
    process.exit(1);
  }
  if (!rows?.length) problems.push("tool_row_not_found");

  const plan = {
    slug: SLUG,
    problems,
    descriptionParagraphs: (input.description ?? "").split("\n\n").length,
    features: input.features?.length ?? 0,
    mediaImages: input.media?.length ?? 0,
    officialDownloadUrl: input.officialDownloadUrl ?? "",
  };
  console.log(`PLAN: ${JSON.stringify(plan)}`);

  if (problems.length) {
    fs.writeFileSync(REPORT, JSON.stringify({ mode: "dry-run", plan }, null, 2));
    console.log("ENRICH_TOOL_DETAIL_BLOCKED");
    process.exit(1);
  }
  if (!executeMode) {
    fs.writeFileSync(REPORT, JSON.stringify({ mode: "dry-run", plan }, null, 2));
    console.log("ENRICH_TOOL_DETAIL_DRY_RUN_OK");
    return;
  }

  const writer = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const sharp = (await import("sharp")).default;
  const publicBase = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/${BUCKET}`;

  const galleryItems = [];
  let index = 0;
  for (const item of input.media ?? []) {
    index += 1;
    const response = await fetch(item.source_url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
    });
    if (!response.ok) {
      console.error(`MEDIA_FETCH_FAILED: ${item.source_url} -> ${response.status}`);
      process.exit(1);
    }
    const raw = Buffer.from(await response.arrayBuffer());
    const isGif = /\.gif(\?|$)/i.test(item.source_url) || raw.subarray(0, 3).toString() === "GIF";
    let body;
    let objectPath;
    let contentType;
    if (isGif) {
      body = raw;
      objectPath = `shots/${SLUG}-${index}.gif`;
      contentType = "image/gif";
    } else {
      body = await sharp(raw).resize({ width: 1600, withoutEnlargement: true }).jpeg({ quality: 84 }).toBuffer();
      objectPath = `shots/${SLUG}-${index}.jpg`;
      contentType = "image/jpeg";
    }
    const { error: uploadError } = await writer.storage.from(BUCKET).upload(objectPath, body, {
      contentType,
      upsert: true,
    });
    if (uploadError) {
      console.error(`MEDIA_UPLOAD_FAILED: ${objectPath} -> ${uploadError.message}`);
      process.exit(1);
    }
    galleryItems.push({ type: "image", url: `${publicBase}/${objectPath}`, caption: item.caption });
  }

  // features 也存在这份 JSON 里（tools 表没有 features 列，前端从这里合并）
  const mediaJson = {
    officialDownloadUrl: input.officialDownloadUrl ?? "",
    features: input.features,
    items: galleryItems,
  };
  const { error: jsonError } = await writer.storage
    .from(BUCKET)
    .upload(`${SLUG}.json`, Buffer.from(JSON.stringify(mediaJson, null, 2)), {
      contentType: "application/json",
      upsert: true,
    });
  if (jsonError) {
    console.error(`MEDIA_JSON_UPLOAD_FAILED: ${jsonError.message}`);
    process.exit(1);
  }

  const { error: updateError } = await writer
    .from("tools")
    .update({ description: input.description })
    .eq("slug", SLUG);
  if (updateError) {
    console.error(`TOOL_UPDATE_FAILED: ${updateError.message}`);
    process.exit(1);
  }

  const { data: verifyRows } = await reader
    .from("tools")
    .select("description")
    .eq("slug", SLUG)
    .limit(1);
  const verified = verifyRows?.[0]?.description === input.description;
  const mediaCheck = await fetch(`${publicBase}/${SLUG}.json`, { cache: "no-store" });

  const report = {
    mode: "execute",
    plan,
    uploaded: galleryItems.map((item) => item.url),
    rowVerified: verified,
    mediaJsonStatus: mediaCheck.status,
  };
  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2));
  if (!verified || !mediaCheck.ok) {
    console.error("ENRICH_TOOL_DETAIL_VERIFY_FAILED");
    process.exit(1);
  }
  console.log("ENRICH_TOOL_DETAIL_EXECUTE_OK");
  console.log(`REPORT: ${REPORT}`);
}
