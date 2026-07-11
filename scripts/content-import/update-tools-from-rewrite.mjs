// Guarded batch tool copy updater (CONTENT_STYLE_STANDARD).
// Reads a JSON map {slug: {summary, description, pros, cons}} and updates those four fields.
// Gates per tool: CJK present, no mojibake, AI-flavor phrase blacklist, no template summary.
// Dry-run by default; --execute writes with per-field readback verification.
// Usage: node ... --file docs/content/rewrites/tools-batch1.json [--execute]

import fs from "node:fs";
import path from "node:path";
import { loadLocalEnv } from "./lib/load-local-env.mjs";

loadLocalEnv();

const fileIndex = process.argv.indexOf("--file");
const FILE = fileIndex !== -1 ? process.argv[fileIndex + 1] : "";
const executeMode = process.argv.includes("--execute");
if (!FILE) {
  console.error("USAGE: node update-tools-from-rewrite.mjs --file <json> [--execute]");
  process.exit(1);
}
const REPORT = FILE.replace(/\.json$/, "-report.json");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY ?? "";

// CONTENT_STYLE_STANDARD 黑名单(全站现有内容里实际出现过的 AI 味句式)
const BLACKLIST = ["对小白来说", "最大的价值不是", "它也不是没有坑", "它也不是万能", "我觉得", "我建议"];
// 每个工具条目只更新它提供了的字段(P1 全量四字段,P2 只 summary+description)
const ALL_FIELDS = ["summary", "description", "pros", "cons"];
const fieldsOf = (entry) => ALL_FIELDS.filter((f) => entry[f] !== undefined);

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

async function main() {
  const batch = JSON.parse(fs.readFileSync(path.resolve(FILE), "utf8"));
  const slugs = Object.keys(batch);
  const problems = [];

  for (const slug of slugs) {
    const entry = batch[slug];
    if (fieldsOf(entry).length === 0) {
      problems.push(`${slug}: no updatable fields`);
    }
    for (const field of fieldsOf(entry)) {
      const text = entry[field];
      if (!text?.trim()) {
        problems.push(`${slug}.${field}: empty`);
        continue;
      }
      if (!/[一-鿿]/.test(text)) problems.push(`${slug}.${field}: no CJK`);
      if (/\?\?+/.test(text)) problems.push(`${slug}.${field}: mojibake '??'`);
      for (const phrase of BLACKLIST) {
        if (text.includes(phrase)) problems.push(`${slug}.${field}: blacklist phrase "${phrase}"`);
      }
    }
    if (/适合.{0,30}但不(适合|能)/.test(entry.summary ?? "")) {
      problems.push(`${slug}.summary: template pattern 适合…但不…`);
    }
  }

  console.log(`TOOLS: ${slugs.length}  PROBLEMS: ${problems.length}`);
  if (problems.length > 0) {
    for (const p of problems) console.log("  " + p);
    throw new Error("VALIDATION_FAILED");
  }

  if (!executeMode) {
    writeReport({ status: "dry_run_completed", slugs });
    console.log("UPDATE_TOOLS_DRY_RUN_OK");
    console.log(`REPORT: ${REPORT}`);
    return;
  }

  if (!supabaseUrl || !serviceKey) {
    console.error("MISSING_SUPABASE_ENV");
    process.exit(1);
  }
  const { createClient } = await import("@supabase/supabase-js");
  const client = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  const updated = [];
  const failed = [];
  for (const slug of slugs) {
    try {
      const entry = batch[slug];
      const { data: before, error: readError } = await client.from("tools").select("id,slug").eq("slug", slug);
      if (readError || !before?.[0]) throw new Error(readError?.message ?? "not found");

      const payload = { updated_at: new Date().toISOString() };
      for (const field of fieldsOf(entry)) {
        payload[field] = entry[field].trim();
      }
      const { error: updateError } = await client.from("tools").update(payload).eq("id", before[0].id);
      if (updateError) throw new Error(updateError.message);

      const { data: after, error: verifyError } = await client
        .from("tools")
        .select("summary,description,pros,cons")
        .eq("id", before[0].id);
      const row = after?.[0];
      if (verifyError) throw new Error(verifyError.message);
      for (const field of fieldsOf(entry)) {
        if (row?.[field] !== payload[field]) throw new Error(`readback mismatch on ${field}`);
      }
      updated.push(slug);
    } catch (error) {
      failed.push({ slug, error: error instanceof Error ? error.message : String(error) });
    }
  }

  writeReport({ status: failed.length === 0 ? "execute_completed" : "execute_partial", updated, failed });
  console.log(failed.length === 0 ? "UPDATE_TOOLS_EXECUTE_OK" : "UPDATE_TOOLS_EXECUTE_PARTIAL");
  console.log(`UPDATED: ${updated.join(",")}`);
  if (failed.length > 0) {
    console.log(`FAILED: ${failed.map((f) => `${f.slug}(${f.error})`).join("; ")}`);
    process.exitCode = 1;
  }
  console.log(`REPORT: ${REPORT}`);
}

function writeReport(report) {
  const absolute = path.resolve(REPORT);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, `${JSON.stringify({ ...report, secret_values_printed: false }, null, 2)}\n`, "utf8");
}
