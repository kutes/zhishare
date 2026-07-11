// Auto-inserts [IMG] media markers into published articles per the article content standard.
// Layer 1 (official): if an article mentions a published tool that already has an official photo
// in tool-covers/photos/, insert that photo at the end of the section where the tool is first
// mentioned (max 2 per article). Layer 2 (CC0): articles with zero tool matches get one CC0 image
// from the Openverse API, downloaded and re-hosted in the public article-media bucket (no hotlinking).
// Articles that already contain [IMG] or [VIDEO] markers are skipped entirely.
// Dry-run by default; --execute writes content back with readback verification.

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { loadLocalEnv } from "./lib/load-local-env.mjs";

loadLocalEnv();

const BUCKET = "article-media";
const REPORT = "docs/content/insert-article-media-report-v1.json";
const MAX_OFFICIAL_PER_ARTICLE = 2;
const executeMode = process.argv.includes("--execute");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}

async function main() {
  const readKey = executeMode ? serviceKey : serviceKey || anonKey;
  if (!supabaseUrl || !readKey) {
    console.error("MISSING_SUPABASE_ENV");
    process.exit(1);
  }

  const headers = { apikey: readKey, Authorization: `Bearer ${readKey}` };
  const articles = await restGet(
    `${supabaseUrl}/rest/v1/articles?status=eq.published&select=id,slug,title,content`,
    headers,
  );
  const tools = await restGet(
    `${supabaseUrl}/rest/v1/tools?status=eq.published&select=title,slug,cover_url`,
    headers,
  );
  const photoTools = tools.filter((tool) => String(tool.cover_url ?? "").includes("/tool-covers/photos/"));
  console.log(`ARTICLES: ${articles.length}  PHOTO_TOOLS: ${photoTools.length}`);

  const plans = [];
  for (const article of articles) {
    const content = String(article.content ?? "");
    if (/^\[(IMG|VIDEO)\]/m.test(content)) {
      plans.push({ slug: article.slug, action: "skip", reason: "already_has_media" });
      continue;
    }
    if (!content.trim()) {
      plans.push({ slug: article.slug, action: "skip", reason: "empty_content" });
      continue;
    }

    const sections = splitSections(content);
    if (sections.length === 0) {
      plans.push({ slug: article.slug, action: "skip", reason: "no_sections" });
      continue;
    }

    // Layer 1: official photos of mentioned tools
    const inserts = [];
    const lowerSectionTexts = sections.map((s) => s.text.toLowerCase());
    for (const tool of photoTools) {
      if (inserts.length >= MAX_OFFICIAL_PER_ARTICLE) break;
      const name = String(tool.title ?? "").trim();
      if (name.length < 3) continue;
      const idx = lowerSectionTexts.findIndex((t) => t.includes(name.toLowerCase()));
      if (idx === -1) continue;
      inserts.push({
        sectionIndex: idx,
        sectionTitle: sections[idx].title,
        source: `official:${tool.slug}`,
        line: `[IMG] ${tool.cover_url} | 「${name}」官网视觉素材，来源：${name}官方`,
      });
    }

    if (inserts.length > 0) {
      plans.push({ slug: article.slug, action: "insert", layer: "official", inserts });
      continue;
    }

    // Layer 2: CC0 via Openverse。查询词用英文 slug(空格分词),中文标题在 Openverse 搜不到结果
    const query = String(article.slug ?? "").replace(/-/g, " ").trim() || String(article.title ?? "").slice(0, 20);
    const cc0 = await findOpenverseImage(query);
    if (!cc0) {
      plans.push({ slug: article.slug, action: "skip", reason: `no_cc0_result_for:${query}` });
      continue;
    }
    plans.push({
      slug: article.slug,
      action: "insert",
      layer: "cc0",
      inserts: [
        {
          sectionIndex: 0,
          sectionTitle: sections[0].title,
          source: `openverse:${cc0.id}`,
          downloadUrl: cc0.url,
          line: `[IMG] {{CC0_URL}} | 示意图，来源：Openverse（CC0）`,
        },
      ],
    });
  }

  const inserting = plans.filter((p) => p.action === "insert");
  console.log(`PLAN: insert=${inserting.length} skip=${plans.length - inserting.length}`);
  for (const plan of plans) {
    console.log(
      `  ${plan.slug}: ${plan.action}${plan.layer ? ` (${plan.layer})` : ""}${plan.reason ? ` [${plan.reason}]` : ""}` +
        (plan.inserts ? ` -> ${plan.inserts.map((i) => `第${i.sectionIndex + 1}节「${i.sectionTitle}」`).join(", ")}` : ""),
    );
  }

  if (!executeMode) {
    writeReport({ status: "dry_run_completed", plans });
    console.log("INSERT_ARTICLE_MEDIA_DRY_RUN_OK");
    console.log(`REPORT: ${REPORT}`);
    return;
  }

  if (!serviceKey) {
    console.error("MISSING_SERVICE_KEY_FOR_EXECUTE");
    process.exit(1);
  }
  const { createClient } = await import("@supabase/supabase-js");
  const client = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  // Ensure the article-media bucket exists (public) before any CC0 upload.
  if (inserting.some((p) => p.layer === "cc0")) {
    const { data: buckets } = await client.storage.listBuckets();
    if (!buckets?.some((b) => b.name === BUCKET)) {
      const { error } = await client.storage.createBucket(BUCKET, { public: true });
      if (error) throw new Error(`CREATE_BUCKET_FAILED: ${error.message}`);
      console.log(`BUCKET_CREATED: ${BUCKET}`);
    }
  }

  const updated = [];
  const failed = [];
  for (const plan of inserting) {
    try {
      const article = articles.find((a) => a.slug === plan.slug);
      let content = String(article.content);

      for (const insert of plan.inserts) {
        let line = insert.line;
        if (insert.downloadUrl) {
          const hosted = await rehostImage(client, insert.downloadUrl, plan.slug);
          line = line.replace("{{CC0_URL}}", hosted);
        }
        content = insertLineAtSectionEnd(content, insert.sectionIndex, line);
      }

      if (!/[一-鿿]/.test(content) || /\?\?\?+/.test(content)) {
        throw new Error("mojibake gate failed");
      }

      const { error: updateError } = await client
        .from("articles")
        .update({ content, updated_at: new Date().toISOString() })
        .eq("id", article.id);
      if (updateError) throw new Error(updateError.message);

      const { data: after } = await client.from("articles").select("content").eq("id", article.id);
      if ((after?.[0]?.content ?? "") !== content) throw new Error("readback mismatch");
      updated.push(plan.slug);
    } catch (error) {
      failed.push({ slug: plan.slug, error: error instanceof Error ? error.message : String(error) });
    }
  }

  writeReport({ status: failed.length === 0 ? "execute_completed" : "execute_partial", plans, updated, failed });
  console.log(failed.length === 0 ? "INSERT_ARTICLE_MEDIA_EXECUTE_OK" : "INSERT_ARTICLE_MEDIA_EXECUTE_PARTIAL");
  console.log(`UPDATED: ${updated.join(",")}`);
  if (failed.length > 0) {
    console.log(`FAILED: ${failed.map((f) => `${f.slug}(${f.error})`).join("; ")}`);
    process.exitCode = 1;
  }
  console.log(`REPORT: ${REPORT}`);
}

async function restGet(url, headers) {
  const response = await fetch(url, { headers });
  const data = await response.json();
  if (!response.ok) throw new Error(`REST_GET_FAILED ${response.status}: ${JSON.stringify(data)}`);
  return data;
}

// 与解析器同源的小节切分:返回每节 {title, text}(text 含该节所有行,不含标题行)
export function splitSections(content) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const sections = [];
  let current = null;
  for (const raw of lines) {
    const line = raw.trim();
    const heading = line.match(/^#{1,3}\s*(?:\[[^\]]+\])?\s*(.+)$/);
    if (heading && line.startsWith("#")) {
      if (current) sections.push(current);
      current = { title: heading[1].trim(), text: "" };
      continue;
    }
    if (current) current.text += line + "\n";
  }
  if (current) sections.push(current);
  return sections;
}

// 把一行插到第 sectionIndex 节的最后一行之后(下一个 ## 之前),前后留空行
export function insertLineAtSectionEnd(content, sectionIndex, lineToInsert) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  let seen = -1;
  let insertAt = lines.length;
  for (let i = 0; i < lines.length; i++) {
    if (/^#{1,3}\s/.test(lines[i].trim()) || /^#{1,3}\[/.test(lines[i].trim())) {
      seen += 1;
      if (seen === sectionIndex + 1) {
        insertAt = i;
        break;
      }
    }
  }
  // 回退掉小节结尾的空行,让插入行紧贴正文
  while (insertAt > 0 && lines[insertAt - 1].trim() === "") insertAt -= 1;
  lines.splice(insertAt, 0, "", lineToInsert);
  return lines.join("\n");
}

async function findOpenverseImage(query) {
  try {
    const url = `https://api.openverse.org/v1/images/?license=cc0&page_size=3&q=${encodeURIComponent(query)}`;
    const response = await fetch(url, { headers: { "User-Agent": "zhishare-content-bot/1.0" } });
    if (!response.ok) return null;
    const data = await response.json();
    const hit = (data.results ?? []).find((r) => r.url && /\.(jpe?g|png|webp)(\?|$)/i.test(r.url));
    return hit ? { id: hit.id, url: hit.url } : null;
  } catch {
    return null;
  }
}

async function rehostImage(client, sourceUrl, articleSlug) {
  const response = await fetch(sourceUrl, { headers: { "User-Agent": "zhishare-content-bot/1.0" } });
  if (!response.ok) throw new Error(`CC0_DOWNLOAD_FAILED ${response.status}`);
  const contentType = response.headers.get("content-type") ?? "image/jpeg";
  if (!contentType.startsWith("image/")) throw new Error(`CC0_NOT_IMAGE ${contentType}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length > 8 * 1024 * 1024) throw new Error("CC0_TOO_LARGE");
  const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
  const storagePath = `cc0/${articleSlug}.${ext}`;
  const upload = await client.storage.from(BUCKET).upload(storagePath, buffer, { contentType, upsert: true });
  if (upload.error) throw new Error(`CC0_UPLOAD_FAILED: ${upload.error.message}`);
  const { data } = client.storage.from(BUCKET).getPublicUrl(storagePath);
  if (!data?.publicUrl) throw new Error("CC0_PUBLIC_URL_EMPTY");
  return data.publicUrl;
}

function writeReport(report) {
  const absolute = path.resolve(REPORT);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, `${JSON.stringify({ ...report, secret_values_printed: false }, null, 2)}\n`, "utf8");
}
