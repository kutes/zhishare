// Backfills generated covers for existing tools whose cover_url is empty.
// Dry-run by default; --execute uploads + updates cover_url.

import fs from "node:fs";
import path from "node:path";
import { generateToolCover } from "../../src/lib/covers/tool-cover.mjs";
import { loadLocalEnv } from "./lib/load-local-env.mjs";
import { uploadToolCoverPair } from "./lib/tool-cover-upload.mjs";

loadLocalEnv();

const REPORT = "docs/content/backfill-tool-covers-report-v1.json";
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
    console.log("BACKFILL_COVERS_DRY_RUN_OK (offline)");
    console.log("NOTE: 提供 env 后 dry-run 可列出目标行;--execute 需要 service key。");
    writeReport({ status: "dry_run_offline", targets: [] });
    return;
  }

  const { createClient } = await import("@supabase/supabase-js");
  const client = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  const { data: rows, error } = await client
    .from("tools")
    .select("id,slug,title,cover_url,categories(slug,name)")
    .order("created_at", { ascending: true });
  if (error) {
    throw new Error(`READ_TOOLS_FAILED: ${error.message}`);
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
        will_upload: [`covers/${row.slug}.svg`, `icons/${row.slug}.svg`],
      })),
    });
    console.log("BACKFILL_COVERS_DRY_RUN_OK");
    console.log(`REPORT: ${REPORT}`);
    return;
  }

  const updated = [];
  const failed = [];
  for (const row of targets) {
    const category = row.categories?.slug ?? row.categories?.name ?? "";
    const pair = generateToolCover({ title: row.title, slug: row.slug, category });
    const upload = await uploadToolCoverPair(client, row.slug, pair);
    if (!upload.ok) {
      failed.push({ slug: row.slug, error: upload.error });
      continue;
    }
    const { data: after, error: updateError } = await client
      .from("tools")
      .update({ cover_url: upload.coverUrl, updated_at: new Date().toISOString() })
      .eq("id", row.id)
      .select("slug,cover_url");
    if (updateError || !after?.[0]?.cover_url) {
      failed.push({ slug: row.slug, error: updateError?.message ?? "VERIFY_EMPTY" });
      continue;
    }
    updated.push(row.slug);
  }

  writeReport({ status: failed.length === 0 ? "execute_completed" : "execute_partial", updated, failed });
  console.log(failed.length === 0 ? "BACKFILL_COVERS_EXECUTE_OK" : "BACKFILL_COVERS_EXECUTE_PARTIAL");
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
