// Rewrites the free-ai-tools-safety article content to the article content standard
// (docs/ARTICLE_CONTENT_STANDARD.md markers). Source of truth for the new text:
// docs/content/free-ai-tools-safety-standard-v1.md.
// Dry-run by default (validates + reports, no writes); --execute updates the row and reads it back.

import fs from "node:fs";
import path from "node:path";
import { parseArticleSections } from "../../src/lib/db/article-parser.mjs";
import { loadLocalEnv } from "./lib/load-local-env.mjs";

loadLocalEnv();

const SLUG = "free-ai-tools-safety";
const CONTENT_FILE = "docs/content/free-ai-tools-safety-standard-v1.md";
const REPORT = "docs/content/update-free-ai-tools-safety-report-v1.json";
const executeMode = process.argv.includes("--execute");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY ?? "";

// 白名单判定与 src/lib/media/tool-media.ts 一致(脚本无法 import TS,这里只用于结构校验)
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

  // 反乱码门:必须含中文,不得含 "??" 连串
  if (!/[一-鿿]/.test(content)) {
    throw new Error("VALIDATION_FAILED: content has no CJK characters");
  }
  if (/\?\?+/.test(content)) {
    throw new Error("VALIDATION_FAILED: content contains mojibake '??' runs");
  }

  // 结构门:按标准解析并断言要素齐全
  const parsed = parseArticleSections(content, embedStub);
  const allBlocks = parsed.sections.flatMap((s) => s.blocks);
  const whyCount = allBlocks.filter((b) => b.kind === "why").length;
  const keyCount = allBlocks.filter((b) => b.kind === "keypoint").length;
  const structure = {
    sections: parsed.sections.length,
    tags: parsed.sections.map((s) => s.tag ?? null),
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
  if (structure.tldr_items < 3 || structure.tldr_items > 5) problems.push("tldr must have 3-5 items");
  if (!structure.has_source_note) problems.push("missing [来源] source note");
  if (structure.tags.some((tag) => !tag)) problems.push("every section needs a [标签]");
  if (whyCount !== 1) problems.push("exactly one [WHY] required");
  if (keyCount < 2 || keyCount > 4) problems.push("2-4 [KEY] blocks required");
  if (structure.first_section_weights?.[0] !== "lead" || structure.first_section_weights?.[1] !== "big") {
    problems.push("first section must open lead + big");
  }
  if (problems.length > 0) {
    throw new Error(`VALIDATION_FAILED: ${problems.join("; ")}`);
  }

  if (!executeMode) {
    writeReport({ status: "dry_run_completed", slug: SLUG, content_chars: content.length, structure });
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

  const { data: before, error: readError } = await client
    .from("articles")
    .select("id,slug,title")
    .eq("slug", SLUG);
  if (readError || !before?.[0]) {
    throw new Error(`READ_ARTICLE_FAILED: ${readError?.message ?? "not found"}`);
  }

  const { error: updateError } = await client
    .from("articles")
    .update({ content, updated_at: new Date().toISOString() })
    .eq("id", before[0].id);
  if (updateError) {
    throw new Error(`UPDATE_FAILED: ${updateError.message}`);
  }

  // 回读校验:内容一致 + 无乱码
  const { data: after, error: verifyError } = await client
    .from("articles")
    .select("content")
    .eq("id", before[0].id);
  const stored = after?.[0]?.content ?? "";
  if (verifyError || stored !== content) {
    throw new Error(`VERIFY_FAILED: ${verifyError?.message ?? "stored content differs from source"}`);
  }
  if (/\?\?+/.test(stored) || !/[一-鿿]/.test(stored)) {
    throw new Error("VERIFY_FAILED: stored content failed mojibake gate");
  }

  writeReport({ status: "execute_completed", slug: SLUG, content_chars: content.length, structure });
  console.log("UPDATE_ARTICLE_EXECUTE_OK");
  console.log(`REPORT: ${REPORT}`);
}

function writeReport(report) {
  const absolute = path.resolve(REPORT);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, `${JSON.stringify({ ...report, secret_values_printed: false }, null, 2)}\n`, "utf8");
}
