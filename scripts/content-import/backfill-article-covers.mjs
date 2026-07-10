// Backfills generated covers for articles whose cover_url is empty.
// Reuses the same deterministic generator as tools (generateToolCover is generic on
// {title, slug, category}); only the 16:9 cover is used, articles have no icon variant.
// Dry-run by default; --execute uploads + updates cover_url.

import fs from "node:fs";
import path from "node:path";
import { generateToolCover } from "../../src/lib/covers/tool-cover.mjs";
import { loadLocalEnv } from "./lib/load-local-env.mjs";

loadLocalEnv();

const BUCKET = "article-covers";
const REPORT = "docs/content/backfill-article-covers-report-v1.json";
const executeMode = process.argv.includes("--execute");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY ?? "";

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

async function main() {
  if (!supabaseUrl || !serviceKey) {
    if (executeMode) {
      console.error("MISSING_SUPABASE_ENV");
      process.exit(1);
    }
    console.log("BACKFILL_ARTICLE_COVERS_DRY_RUN_OK (offline)");
    writeReport({ status: "dry_run_offline", targets: [] });
    return;
  }

  const { createClient } = await import("@supabase/supabase-js");
  const client = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  const { data: rows, error } = await client
    .from("articles")
    .select("id,slug,title,cover_url,categories(slug,name)")
    .order("created_at", { ascending: true });
  if (error) {
    throw new Error(`READ_ARTICLES_FAILED: ${error.message}`);
  }

  const targets = (rows ?? []).filter((row) => !String(row.cover_url ?? "").trim());
  console.log(`TARGET_COUNT: ${targets.length}`);
  console.log(`TARGET_SLUGS: ${targets.map((row) => row.slug).join(",")}`);

  if (!executeMode) {
    writeReport({
      status: "dry_run_completed",
      targets: targets.map((row) => ({
        slug: row.slug,
        category: row.categories?.slug ?? row.categories?.name ?? "",
        will_upload: [`covers/${row.slug}.svg`],
      })),
    });
    console.log("BACKFILL_ARTICLE_COVERS_DRY_RUN_OK");
    console.log(`REPORT: ${REPORT}`);
    return;
  }

  const updated = [];
  const failed = [];
  for (const row of targets) {
    const category = row.categories?.slug ?? row.categories?.name ?? "";
    const { coverSvg } = generateToolCover({ title: row.title, slug: row.slug, category });
    const coverPath = `covers/${row.slug}.svg`;
    const upload = await client.storage
      .from(BUCKET)
      .upload(coverPath, coverSvg, { contentType: "image/svg+xml", upsert: true });
    if (upload.error) {
      failed.push({ slug: row.slug, error: upload.error.message });
      continue;
    }
    const { data: publicUrlData } = client.storage.from(BUCKET).getPublicUrl(coverPath);
    const coverUrl = publicUrlData?.publicUrl ?? "";
    if (!coverUrl) {
      failed.push({ slug: row.slug, error: "PUBLIC_URL_EMPTY" });
      continue;
    }
    const { data: after, error: updateError } = await client
      .from("articles")
      .update({ cover_url: coverUrl, updated_at: new Date().toISOString() })
      .eq("id", row.id)
      .select("slug,cover_url");
    if (updateError || !after?.[0]?.cover_url) {
      failed.push({ slug: row.slug, error: updateError?.message ?? "VERIFY_EMPTY" });
      continue;
    }
    updated.push(row.slug);
  }

  writeReport({ status: failed.length === 0 ? "execute_completed" : "execute_partial", updated, failed });
  console.log(failed.length === 0 ? "BACKFILL_ARTICLE_COVERS_EXECUTE_OK" : "BACKFILL_ARTICLE_COVERS_EXECUTE_PARTIAL");
  console.log(`UPDATED: ${updated.join(",")}`);
  console.log(`FAILED: ${failed.map((f) => f.slug).join(",")}`);
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
