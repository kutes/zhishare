// Replaces article covers with bright, xiaohu-style cards: a vivid solid
// background + a CC0 Open Doodles line illustration (opendoodles.com, public
// domain) matched to each article's theme. Composes a 1200x675 SVG per article.
// Dry-run by default (composes locally, no writes); --execute uploads to the
// article-covers bucket and updates cover_url, then verifies by readback.
// Doodle source files must already be downloaded (pass dir via DOODLE_DIR env).

import fs from "node:fs";
import path from "node:path";
import { loadLocalEnv } from "./lib/load-local-env.mjs";

loadLocalEnv();

const BUCKET = "article-covers";
const REPORT = "docs/content/adopt-doodle-covers-report-v1.json";
const executeMode = process.argv.includes("--execute");
const doodleDir = process.env.DOODLE_DIR ?? "";

// article slug -> { doodle file, bright background }. Palette follows the
// xiaohu reference: saturated-but-soft solids that read clearly at card size.
const COVERS = [
  { article: "file-transfer-without-netdisk", file: "5d5e30797662017855f689a6_unboxing.svg", bg: "#7BA7D7" },
  { article: "notion-vs-obsidian", file: "5da4a2a996a90ccc56796336_sitting-reading.svg", bg: "#C9C4DD" },
  { article: "free-image-tools-comparison", file: "5d5e30ba8983564552c60dc7_selfie.svg", bg: "#F2C879" },
  { article: "netdisk-resource-risks", file: "5d73852f7a6dfa5b3e1e829f_clumsy.svg", bg: "#E8A79E" },
  { article: "free-ai-tools-safety", file: "5d73855542881e5005f1a547_float.svg", bg: "#A8CDBA" },
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
// Storage/table writes are RLS-guarded; --execute needs the service key.
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY ?? "";

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

async function main() {
  if (!doodleDir || !fs.existsSync(doodleDir)) {
    console.error("MISSING_DOODLE_DIR: set DOODLE_DIR to the folder holding the downloaded SVGs");
    process.exit(1);
  }
  if (!supabaseUrl || !anonKey) {
    console.error("MISSING_SUPABASE_ENV");
    process.exit(1);
  }
  if (executeMode && !serviceKey) {
    console.error("MISSING_SERVICE_KEY: pass SUPABASE_SERVICE_ROLE_KEY via env for --execute");
    process.exit(1);
  }

  const composed = [];
  for (const item of COVERS) {
    const sourcePath = path.join(doodleDir, item.file);
    if (!fs.existsSync(sourcePath)) {
      composed.push({ article: item.article, status: "doodle_file_missing", file: item.file });
      continue;
    }
    const svg = composeCover(fs.readFileSync(sourcePath, "utf8"), item.bg);
    if (!svg) {
      composed.push({ article: item.article, status: "compose_failed", file: item.file });
      continue;
    }
    composed.push({ article: item.article, status: "ready", file: item.file, bg: item.bg, bytes: svg.length, svg });
  }

  const ready = composed.filter((c) => c.status === "ready");
  console.log(`PLAN: ${composed.map((c) => `${c.article}:${c.status}`).join(" | ")}`);

  if (!executeMode) {
    // Save local previews so the result can be eyeballed before any write.
    const previewDir = path.join(doodleDir, "composed");
    fs.mkdirSync(previewDir, { recursive: true });
    for (const c of ready) {
      fs.writeFileSync(path.join(previewDir, `${c.article}.svg`), c.svg, "utf8");
    }
    writeReport({ status: "dry_run_completed", plan: strip(composed) });
    console.log("ADOPT_DOODLE_COVERS_DRY_RUN_OK");
    console.log(`PREVIEWS: ${previewDir}`);
    return;
  }

  const { createClient } = await import("@supabase/supabase-js");
  const client = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  const updated = [];
  const failed = [];
  for (const c of ready) {
    try {
      const uploadPath = `doodles/${c.article}.svg`;
      const upload = await client.storage
        .from(BUCKET)
        .upload(uploadPath, c.svg, { contentType: "image/svg+xml", upsert: true });
      if (upload.error) {
        throw new Error(`UPLOAD_FAILED: ${upload.error.message}`);
      }
      const { data: publicUrlData } = client.storage.from(BUCKET).getPublicUrl(uploadPath);
      const coverUrl = publicUrlData?.publicUrl ? `${publicUrlData.publicUrl}?v=${Date.now()}` : "";
      if (!coverUrl) {
        throw new Error("PUBLIC_URL_EMPTY");
      }
      const { data: after, error: updateError } = await client
        .from("articles")
        .update({ cover_url: coverUrl, updated_at: new Date().toISOString() })
        .eq("slug", c.article)
        .select("slug,cover_url");
      if (updateError || !after?.[0]?.cover_url?.includes(uploadPath)) {
        throw new Error(`VERIFY_FAILED: ${updateError?.message ?? "readback mismatch"}`);
      }
      updated.push(c.article);
    } catch (error) {
      failed.push({ article: c.article, error: error instanceof Error ? error.message : String(error) });
    }
  }

  writeReport({
    status: failed.length === 0 ? "execute_completed" : "execute_partial",
    plan: strip(composed),
    updated,
    failed,
    license: "Open Doodles (opendoodles.com) — CC0 1.0 public domain",
  });
  console.log(failed.length === 0 ? "ADOPT_DOODLE_COVERS_EXECUTE_OK" : "ADOPT_DOODLE_COVERS_EXECUTE_PARTIAL");
  console.log(`UPDATED: ${updated.join(",")}`);
  console.log(`FAILED: ${failed.map((f) => `${f.article}(${f.error})`).join(",")}`);
  console.log(`REPORT: ${REPORT}`);
  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

// Wraps the doodle (1024x768 viewBox) centered on a 1200x675 bright card.
function composeCover(doodleSvg, bg) {
  const open = doodleSvg.indexOf(">", doodleSvg.indexOf("<svg"));
  const close = doodleSvg.lastIndexOf("</svg>");
  if (open < 0 || close < 0) {
    return null;
  }
  const inner = doodleSvg.slice(open + 1, close);
  // Fit the 1024x768 doodle to ~86% of the card height, centered.
  const scale = (675 * 0.86) / 768;
  const width = 1024 * scale;
  const x = (1200 - width) / 2;
  const y = (675 - 768 * scale) / 2;
  return [
    `<svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">`,
    `<rect width="1200" height="675" fill="${bg}"/>`,
    `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${scale.toFixed(4)})">${inner}</g>`,
    `</svg>`,
  ].join("");
}

function strip(list) {
  return list.map(({ svg: _svg, ...rest }) => rest);
}

function writeReport(report) {
  const absolute = path.resolve(REPORT);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, `${JSON.stringify({ ...report, secret_values_printed: false }, null, 2)}\n`, "utf8");
}
