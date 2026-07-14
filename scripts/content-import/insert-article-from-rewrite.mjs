// Guarded NEW-article inserter. Reads docs/content/rewrites/{slug}.md (content) +
// {slug}.json (title, summary, slug, category_slug). Runs the same gates as the update
// script (structure per ARTICLE_CONTENT_STANDARD, style per CONTENT_STYLE_STANDARD: no 我
// in headings, mojibake gate), resolves category, generates+uploads a cover, then INSERTs a
// published row. Refuses if the slug already exists (use update-article-from-rewrite instead).
// Dry-run by default; --execute writes with readback verification.
// Usage: node ... --slug notion-vs-obsidian [--execute]

import fs from "node:fs";
import path from "node:path";
import { parseArticleSections } from "../../src/lib/db/article-parser.mjs";
import { generateToolCover } from "../../src/lib/covers/tool-cover.mjs";
import { loadLocalEnv } from "./lib/load-local-env.mjs";

loadLocalEnv();

const slugIndex = process.argv.indexOf("--slug");
const SLUG = slugIndex !== -1 ? process.argv[slugIndex + 1] : "";
const executeMode = process.argv.includes("--execute");
if (!SLUG) {
  console.error("USAGE: node insert-article-from-rewrite.mjs --slug <slug> [--execute]");
  process.exit(1);
}

const CONTENT_FILE = `docs/content/rewrites/${SLUG}.md`;
const META_FILE = `docs/content/rewrites/${SLUG}.json`;
const REPORT = `docs/content/rewrites/${SLUG}-insert-report.json`;
const COVER_BUCKET = "article-covers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

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
  if (meta.slug !== SLUG) throw new Error(`meta.slug (${meta.slug}) must match --slug (${SLUG})`);
  if (!meta.title?.trim() || !meta.summary?.trim() || !meta.category_slug?.trim()) {
    throw new Error("meta json needs non-empty title, summary, category_slug");
  }

  // 反乱码门
  for (const [label, text] of [["content", content], ["title", meta.title], ["summary", meta.summary]]) {
    if (!/[一-鿿]/.test(text)) throw new Error(`VALIDATION_FAILED: ${label} has no CJK`);
    if (/\?\?+/.test(text)) throw new Error(`VALIDATION_FAILED: ${label} contains mojibake '??'`);
  }

  // 结构门
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
    first_section_weights: parsed.sections[0]?.blocks.filter((b) => b.kind === "paragraph").map((b) => b.weight),
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
  // 风格门:标题禁"我"
  for (const title of [meta.title, ...structure.titles]) {
    if (title.includes("我")) problems.push(`style: heading contains 我 -> "${title}"`);
  }
  if (problems.length > 0) throw new Error(`VALIDATION_FAILED: ${problems.join("; ")}`);

  // 校验 slug 未占用 + 解析分类(读用 anon 亦可)
  const readKey = serviceKey || anonKey;
  if (!supabaseUrl || !readKey) {
    console.error("MISSING_SUPABASE_ENV");
    process.exit(1);
  }
  const headers = { apikey: readKey, Authorization: `Bearer ${readKey}` };
  const existing = await restGet(`${supabaseUrl}/rest/v1/articles?slug=eq.${SLUG}&select=id`, headers);
  if (existing.length > 0) throw new Error(`SLUG_EXISTS: ${SLUG} already present — use update-article-from-rewrite`);
  const cats = await restGet(
    `${supabaseUrl}/rest/v1/categories?slug=eq.${encodeURIComponent(meta.category_slug)}&select=id,slug,name`,
    headers,
  );
  if (cats.length === 0) throw new Error(`CATEGORY_NOT_FOUND: ${meta.category_slug}`);
  const category = cats[0];
  console.log(`CATEGORY: ${category.name} (${category.id})`);

  if (!executeMode) {
    writeReport({ status: "dry_run_completed", slug: SLUG, title: meta.title, category: category.slug, structure });
    console.log("INSERT_ARTICLE_DRY_RUN_OK");
    console.log(`REPORT: ${REPORT}`);
    return;
  }

  if (!serviceKey) {
    console.error("MISSING_SERVICE_KEY_FOR_EXECUTE");
    process.exit(1);
  }
  const { createClient } = await import("@supabase/supabase-js");
  const client = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  // 生成并上传封面(与 backfill-article-covers 同款,失败不阻塞)
  let coverUrl = "";
  try {
    const { coverSvg } = generateToolCover({ title: meta.title, slug: SLUG, category: category.slug });
    const coverPath = `covers/${SLUG}.svg`;
    const up = await client.storage.from(COVER_BUCKET).upload(coverPath, coverSvg, {
      contentType: "image/svg+xml",
      upsert: true,
    });
    if (!up.error) {
      coverUrl = client.storage.from(COVER_BUCKET).getPublicUrl(coverPath).data?.publicUrl ?? "";
    }
  } catch {
    coverUrl = "";
  }

  const payload = {
    slug: SLUG,
    title: meta.title.trim(),
    summary: meta.summary.trim(),
    content,
    category_id: category.id,
    status: "published",
    cover_url: coverUrl || null,
  };
  const { data: inserted, error: insertError } = await client.from("articles").insert(payload).select("id,slug");
  if (insertError || !inserted?.[0]) throw new Error(`INSERT_FAILED: ${insertError?.message ?? "no row"}`);

  const { data: after } = await client
    .from("articles")
    .select("title,summary,content,status")
    .eq("id", inserted[0].id);
  const row = after?.[0];
  if (row?.content !== content || row?.title !== payload.title || row?.status !== "published") {
    throw new Error("VERIFY_FAILED: stored row differs from source");
  }
  if (/\?\?+/.test(row.content) || !/[一-鿿]/.test(row.content)) {
    throw new Error("VERIFY_FAILED: stored content failed mojibake gate");
  }

  writeReport({ status: "execute_completed", slug: SLUG, title: meta.title, category: category.slug, cover: Boolean(coverUrl), structure });
  console.log("INSERT_ARTICLE_EXECUTE_OK");
  console.log(`COVER: ${coverUrl || "(none)"}`);
  console.log(`REPORT: ${REPORT}`);
}

async function restGet(url, headers) {
  const response = await fetch(url, { headers });
  const data = await response.json();
  if (!response.ok) throw new Error(`REST_GET_FAILED ${response.status}: ${JSON.stringify(data)}`);
  return data;
}

function writeReport(report) {
  const absolute = path.resolve(REPORT);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, `${JSON.stringify({ ...report, secret_values_printed: false }, null, 2)}\n`, "utf8");
}
