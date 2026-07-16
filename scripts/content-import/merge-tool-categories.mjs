// Category dedupe for the tools filter (10 -> 7 tool-bearing categories).
// categories is a SHARED table (articles.category_id also points into it), so
// this script only deletes a category row when it ends up with zero tools AND
// zero articles after the moves — never touches a category an article still uses.
//
// Moves:
//   图片工具(image-tools)      -> 图片处理(image-processing)
//   效率工具(productivity-tools) -> 效率软件(productivity)
//   效率笔记(productivity-notes) 's tool -> 效率软件(productivity)  [category itself
//     survives: still holds 1 article, just becomes tool-empty]
// Deletes (already/becomes 0 tools + 0 articles):
//   图片工具, 效率工具, 开源项目(open-source, already fully unused)
// Renames (prep for P1 batch B: OBS/HandBrake/Audacity don't fit "剪辑"):
//   视频剪辑(video-editing) -> 音视频(video-audio)
//
// Dry-run by default; --execute writes with readback verification.

import fs from "node:fs";
import path from "node:path";
import { loadLocalEnv } from "./lib/load-local-env.mjs";

loadLocalEnv();

const REPORT = "docs/content/merge-tool-categories-report-v1.json";
const executeMode = process.argv.includes("--execute");

const MOVES = [
  { fromSlug: "image-tools", toSlug: "image-processing" },
  { fromSlug: "productivity-tools", toSlug: "productivity" },
  { fromSlug: "productivity-notes", toSlug: "productivity" },
];
const RENAME = { slug: "video-editing", newName: "音视频", newSlug: "video-audio" };

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY ?? "";

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

async function main() {
  if (!supabaseUrl || !serviceKey) {
    console.error("MISSING_SUPABASE_ENV_OR_SERVICE_KEY");
    process.exit(1);
  }

  const { createClient } = await import("@supabase/supabase-js");
  const client = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  const { data: categories, error: catError } = await client.from("categories").select("id,name,slug");
  if (catError) throw new Error(`READ_CATEGORIES_FAILED: ${catError.message}`);
  const { data: tools, error: toolError } = await client.from("tools").select("id,slug,category_id");
  if (toolError) throw new Error(`READ_TOOLS_FAILED: ${toolError.message}`);
  const { data: articles, error: artError } = await client.from("articles").select("id,slug,category_id");
  if (artError) throw new Error(`READ_ARTICLES_FAILED: ${artError.message}`);

  const catBySlug = new Map(categories.map((c) => [c.slug, c]));

  const plan = { moves: [], deletes: [], rename: null };
  for (const move of MOVES) {
    const from = catBySlug.get(move.fromSlug);
    const to = catBySlug.get(move.toSlug);
    if (!from || !to) {
      plan.moves.push({ ...move, status: "category_not_found" });
      continue;
    }
    const affectedTools = tools.filter((t) => t.category_id === from.id).map((t) => t.slug);
    plan.moves.push({ ...move, status: "ready", fromId: from.id, toId: to.id, affectedTools });
  }

  // Simulate post-move counts to decide what's safe to delete.
  const movedAwayFrom = new Set(plan.moves.filter((m) => m.status === "ready").map((m) => m.fromId));
  for (const slug of ["image-tools", "productivity-tools", "open-source"]) {
    const cat = catBySlug.get(slug);
    if (!cat) {
      plan.deletes.push({ slug, status: "category_not_found" });
      continue;
    }
    const toolCountAfter = movedAwayFrom.has(cat.id) ? 0 : tools.filter((t) => t.category_id === cat.id).length;
    const articleCount = articles.filter((a) => a.category_id === cat.id).length;
    if (toolCountAfter === 0 && articleCount === 0) {
      plan.deletes.push({ slug, status: "ready", id: cat.id });
    } else {
      plan.deletes.push({ slug, status: "not_empty", toolCountAfter, articleCount });
    }
  }

  const renameCat = catBySlug.get(RENAME.slug);
  plan.rename = renameCat
    ? { ...RENAME, status: "ready", id: renameCat.id, currentName: renameCat.name }
    : { ...RENAME, status: "category_not_found" };

  console.log(`PLAN: ${JSON.stringify(plan)}`);

  if (!executeMode) {
    writeReport({ status: "dry_run_completed", plan });
    console.log("MERGE_TOOL_CATEGORIES_DRY_RUN_OK");
    console.log(`REPORT: ${REPORT}`);
    return;
  }

  const results = { moved: [], deleted: [], renamed: null, failed: [] };

  for (const move of plan.moves.filter((m) => m.status === "ready")) {
    try {
      const { error: updateError } = await client
        .from("tools")
        .update({ category_id: move.toId, updated_at: new Date().toISOString() })
        .eq("category_id", move.fromId);
      if (updateError) throw new Error(updateError.message);
      const { data: after, error: verifyError } = await client
        .from("tools")
        .select("id")
        .eq("category_id", move.fromId);
      if (verifyError) throw new Error(verifyError.message);
      if ((after ?? []).length !== 0) throw new Error("VERIFY_FAILED: tools still reference old category");
      results.moved.push({ fromSlug: move.fromSlug, toSlug: move.toSlug, tools: move.affectedTools });
    } catch (err) {
      results.failed.push({ step: `move:${move.fromSlug}->${move.toSlug}`, error: err instanceof Error ? err.message : String(err) });
    }
  }

  for (const del of plan.deletes.filter((d) => d.status === "ready")) {
    try {
      const { error: deleteError } = await client.from("categories").delete().eq("id", del.id);
      if (deleteError) throw new Error(deleteError.message);
      const { data: after } = await client.from("categories").select("id").eq("id", del.id);
      if ((after ?? []).length !== 0) throw new Error("VERIFY_FAILED: category row still present");
      results.deleted.push(del.slug);
    } catch (err) {
      results.failed.push({ step: `delete:${del.slug}`, error: err instanceof Error ? err.message : String(err) });
    }
  }

  if (plan.rename.status === "ready") {
    try {
      const { error: updateError } = await client
        .from("categories")
        .update({ name: plan.rename.newName, slug: plan.rename.newSlug })
        .eq("id", plan.rename.id);
      if (updateError) throw new Error(updateError.message);
      const { data: after, error: verifyError } = await client
        .from("categories")
        .select("name,slug")
        .eq("id", plan.rename.id)
        .single();
      if (verifyError || after?.name !== plan.rename.newName || after?.slug !== plan.rename.newSlug) {
        throw new Error("VERIFY_FAILED: rename readback mismatch");
      }
      results.renamed = { from: RENAME.slug, to: plan.rename.newSlug };
    } catch (err) {
      results.failed.push({ step: "rename:video-editing", error: err instanceof Error ? err.message : String(err) });
    }
  }

  writeReport({ status: results.failed.length === 0 ? "execute_completed" : "execute_partial", plan, ...results });
  console.log(results.failed.length === 0 ? "MERGE_TOOL_CATEGORIES_EXECUTE_OK" : "MERGE_TOOL_CATEGORIES_EXECUTE_PARTIAL");
  console.log(`MOVED: ${results.moved.map((m) => `${m.fromSlug}->${m.toSlug}`).join(",")}`);
  console.log(`DELETED: ${results.deleted.join(",")}`);
  console.log(`RENAMED: ${results.renamed ? `${results.renamed.from}->${results.renamed.to}` : "none"}`);
  console.log(`FAILED: ${results.failed.map((f) => `${f.step}(${f.error})`).join(",")}`);
  console.log(`REPORT: ${REPORT}`);
  if (results.failed.length > 0) process.exitCode = 1;
}

function writeReport(report) {
  const absolute = path.resolve(REPORT);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, `${JSON.stringify({ ...report, secret_values_printed: false }, null, 2)}\n`, "utf8");
}
