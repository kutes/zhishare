// Regenerates the deterministic cover for tools that currently use a GENERATED cover
// (cover_url contains /covers/). Use after changing the cover generator so existing
// generated covers pick up the new design. Uploads (upsert) to the same path and updates
// cover_url with a cache-busting ?v= so the new art shows immediately. Photos are left alone.
// Dry-run by default; --execute writes.

import fs from "node:fs";
import path from "node:path";
import { generateToolCover } from "../../src/lib/covers/tool-cover.mjs";
import { loadLocalEnv } from "./lib/load-local-env.mjs";
import { uploadToolCoverPair } from "./lib/tool-cover-upload.mjs";

loadLocalEnv();

const REPORT = "docs/content/regenerate-generated-covers-report.json";
const executeMode = process.argv.includes("--execute");

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
    .select("id,slug,title,cover_url,categories(slug,name)")
    .eq("status", "published")
    .order("slug");
  if (error) throw new Error(`READ_TOOLS_FAILED: ${error.message}`);

  const targets = (rows ?? []).filter((r) => String(r.cover_url ?? "").includes("/covers/"));
  console.log(`GENERATED_COVER_TOOLS: ${targets.length}`);
  console.log(`SLUGS: ${targets.map((r) => r.slug).join(",")}`);

  if (!executeMode) {
    writeReport({ status: "dry_run_completed", slugs: targets.map((r) => r.slug) });
    console.log("REGEN_COVERS_DRY_RUN_OK");
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
    const bustedUrl = `${upload.coverUrl}?v=${Date.now()}`;
    const { data: after, error: updErr } = await client
      .from("tools")
      .update({ cover_url: bustedUrl, updated_at: new Date().toISOString() })
      .eq("id", row.id)
      .select("cover_url");
    if (updErr || !after?.[0]?.cover_url) {
      failed.push({ slug: row.slug, error: updErr?.message ?? "verify empty" });
      continue;
    }
    updated.push(row.slug);
  }

  writeReport({ status: failed.length ? "execute_partial" : "execute_completed", updated, failed });
  console.log(failed.length ? "REGEN_COVERS_EXECUTE_PARTIAL" : "REGEN_COVERS_EXECUTE_OK");
  console.log(`UPDATED: ${updated.join(",")}`);
  if (failed.length) console.log(`FAILED: ${failed.map((f) => f.slug).join(",")}`);
  console.log(`REPORT: ${REPORT}`);
  if (failed.length) process.exitCode = 1;
}

function writeReport(report) {
  const absolute = path.resolve(REPORT);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, `${JSON.stringify({ ...report, secret_values_printed: false }, null, 2)}\n`, "utf8");
}
