// Generic guarded article rewrite updater.
// Reads docs/content/rewrites/{slug}.md (content) + {slug}.json (title/summary),
// validates structure (ARTICLE_CONTENT_STANDARD) and style gates (CONTENT_STYLE_STANDARD:
// no "我" in section headings), then updates the row. Dry-run by default; --execute writes
// with readback verification. Usage: node ... --slug free-ai-tools-safety [--execute]

import fs from "node:fs";
import path from "node:path";
import { parseArticleSections } from "../../src/lib/db/article-parser.mjs";
import { loadLocalEnv } from "./lib/load-local-env.mjs";

loadLocalEnv();

const slugIndex = process.argv.indexOf("--slug");
const SLUG = slugIndex !== -1 ? process.argv[slugIndex + 1] : "";
const executeMode = process.argv.includes("--execute");
if (!SLUG) {
  console.error("USAGE: node update-article-from-rewrite.mjs --slug <slug> [--execute]");
  process.exit(1);
}

const CONTENT_FILE = `docs/content/rewrites/${SLUG}.md`;
const META_FILE = `docs/content/rewrites/${SLUG}.json`;
const REPORT = `docs/content/rewrites/${SLUG}-report.json`;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY ?? "";

const embedStub = (url) => {
  try {
    const host = new URL(url).host;
    if (host === "player.bilibili.com") return "bilibili";
    if (host === "www.youtube.com" || host === "youtube.com") return "youtube";
  } catch {
    return null;
  }
  return null;
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

async function main() {
  const content = fs.readFileSync(path.resolve(CONTENT_FILE), "utf8").trim();
  const meta = JSON.parse(fs.readFileSync(path.resolve(META_FILE), "utf8"));
  if (!meta.title?.trim() || !meta.summary?.trim()) {
    throw new Error("VALIDATION_FAILED: meta json needs non-empty title and summary");
  }

  // 反乱码门
  for (const [label, text] of [["content", content], ["title", meta.title], ["summary", meta.summary]]) {
    if (!/[一-鿿]/.test(text)) throw new Error(`VALIDATION_FAILED: ${label} has no CJK`);
    if (/\?\?+/.test(text)) throw new Error(`VALIDATION_FAILED: ${label} contains mojibake '??'`);
  }

  // 结构门(ARTICLE_CONTENT_STANDARD)
  const parsed = parseArticleSections(content, embedStub);
  const allBlocks = parsed.sections.flatMap((s) => s.blocks);
  const whyCount = allBlocks.filter((b) => b.kind === "why").length;
  const keyCount = allBlocks.filter((b) => b.kind === "keypoint").length;
  const structure = {
    sections: parsed.sections.length,
    tags: parsed.sections.map((s) => s.tag ?? null),
    titles: parsed.sections.map((s) => s.title),
    tldr_items: parsed.tldr?.length ?? 0,
    has_source_note: Boolean(parsed.sourceNote),
    why_count: whyCount,
    keypoint_count: keyCount,
    first_section_weights: parsed.sections[0]?.blocks
      .filter((b) => b.kind === "paragraph")
      .map((b) => b.weight),
  };
  console.log(`STRUCTURE: ${JSON.stringify(structure)}`);

  const problems = [];
  if (structure.sections < 3 || structure.sections > 6) problems.push("3-6 sections required");
  if (structure.tldr_items < 3 || structure.tldr_items > 5) problems.push("tldr must have 3-5 items");
  if (!structure.has_source_note) problems.push("missing [来源] source note");
  if (structure.tags.some((tag) => !tag)) problems.push("every section needs a [标签]");
  if (whyCount !== 1) problems.push("exactly one [WHY] required");
  if (keyCount < 2 || keyCount > 4) problems.push("2-4 [KEY] blocks required");
  if (structure.first_section_weights?.[0] !== "lead" || structure.first_section_weights?.[1] !== "big") {
    problems.push("first section must open lead + big");
  }

  // 风格门(CONTENT_STYLE_STANDARD):小标题与文章主标题禁止出现"我"
  for (const title of [meta.title, ...structure.titles]) {
    if (title.includes("我")) problems.push(`style: heading contains 我 -> "${title}"`);
  }

  if (problems.length > 0) {
    throw new Error(`VALIDATION_FAILED: ${problems.join("; ")}`);
  }

  if (!executeMode) {
    writeReport({ status: "dry_run_completed", slug: SLUG, title: meta.title, content_chars: content.length, structure });
    console.log("UPDATE_ARTICLE_DRY_RUN_OK");
    console.log(`REPORT: ${REPORT}`);
    return;
  }

  if (!supabaseUrl || !serviceKey) {
    console.error("MISSING_SUPABASE_ENV");
    process.exit(1);
  }
  const { createClient } = await import("@supabase/supabase-js");
  const client = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  const { data: before, error: readError } = await client.from("articles").select("id,slug").eq("slug", SLUG);
  if (readError || !before?.[0]) throw new Error(`READ_ARTICLE_FAILED: ${readError?.message ?? "not found"}`);

  const payload = {
    title: meta.title.trim(),
    summary: meta.summary.trim(),
    content,
    updated_at: new Date().toISOString(),
  };
  const { error: updateError } = await client.from("articles").update(payload).eq("id", before[0].id);
  if (updateError) throw new Error(`UPDATE_FAILED: ${updateError.message}`);

  const { data: after, error: verifyError } = await client
    .from("articles")
    .select("title,summary,content")
    .eq("id", before[0].id);
  const row = after?.[0];
  if (verifyError || row?.content !== content || row?.title !== payload.title || row?.summary !== payload.summary) {
    throw new Error(`VERIFY_FAILED: ${verifyError?.message ?? "stored row differs from source"}`);
  }
  if (/\?\?+/.test(row.content) || !/[一-鿿]/.test(row.content)) {
    throw new Error("VERIFY_FAILED: stored content failed mojibake gate");
  }

  writeReport({ status: "execute_completed", slug: SLUG, title: meta.title, content_chars: content.length, structure });
  console.log("UPDATE_ARTICLE_EXECUTE_OK");
  console.log(`REPORT: ${REPORT}`);
}

function writeReport(report) {
  const absolute = path.resolve(REPORT);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, `${JSON.stringify({ ...report, secret_values_printed: false }, null, 2)}\n`, "utf8");
}
