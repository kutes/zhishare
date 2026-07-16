// Publishes the 2 draft tools found via service-role query (not visible on the
// public site). raycast's existing draft copy already meets CONTENT_STYLE_STANDARD
// and already has a real photo cover — publish as-is. open-design's draft copy
// was generic/mismatched to the actual project (verified against the real
// GitHub repo: 78k+ stars, active, "open-source Claude Design alternative" —
// an AI design-generation tool for coding-agent CLIs, not a "design inspiration
// gallery" as the draft claimed) — rewritten here with verified facts, plus a
// real og:image cover fetched from the project's homepage.
// Dry-run by default; --execute writes with readback verification.

import fs from "node:fs";
import path from "node:path";
import { loadLocalEnv } from "./lib/load-local-env.mjs";

loadLocalEnv();

const BUCKET = "tool-covers";
const REPORT = "docs/content/publish-draft-tools-report-v1.json";
const executeMode = process.argv.includes("--execute");

const OPEN_DESIGN_COVER_SOURCE = "https://static.open-design.ai/landing/assets/og-card.png";

const OPEN_DESIGN_CONTENT = {
  summary:
    "让你已经在用的编程 Agent(Claude Code、Cursor、Codex 这些)兼职做设计——产出的是能导出的网页、PPT、视频文件,不是一张效果图。",
  description:
    "Open Design 不是一个「看灵感」的画廊,是一个本地跑的桌面应用:接上你已经在用的编程 Agent(Claude Code、Cursor、Codex、Gemini、Qwen 这些命令行工具)之后,它把这些 Agent 当成「设计引擎」来产出原型页、落地页、仪表盘、幻灯片,甚至一段 HTML 转的视频——导出的是 HTML/PDF/PPTX/MP4 真实文件,不是截图。\n\n它是 local-first:项目文件留在本地,不用把设计稿传到别人的服务器上。前提是 BYOK(bring your own key)——你得自己有 Claude Code / Cursor 之类工具的账号或 API 访问权限,Open Design 本身不含生成额度,只是调度层。GitHub 上 7 万+ 星、Apache-2.0 协议、更新很勤。",
  target_users: "已经在用 Claude Code / Cursor 等编程 Agent 的开发者\n想快速出原型页、落地页、演示 PPT 的独立开发者\n不想为设计稿单独学 Figma 的技术背景创作者",
  use_cases:
    "拿现成的编程 Agent 直接出一版落地页原型\n给项目做一份能导出 PPTX 的演示文稿\n把静态页面转成一段可分享的 HTML 视频\n在本地跑设计生成,不想把项目内容传去在线工具",
  pros: "开源 Apache-2.0,本地运行不用上传项目文件\n导出的是真实可用文件(HTML/PDF/PPTX/MP4),不是效果图\n兼容 20 多种编程 Agent CLI(Claude Code、Cursor、Codex、Gemini、Qwen 等)",
  cons: "BYOK 模式,本身不含 AI 额度,得先有编程 Agent 的账号或 API Key\n面向已经会用命令行编程 Agent 的人,纯设计背景用户上手门槛较高",
  risk_notice: "使用前需要自己具备 Claude Code / Cursor 等编程 Agent 的访问权限,产生的调用费用由对应平台计费,不是 Open Design 免费提供。",
};

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

  const { data: rows, error } = await client.from("tools").select("*").in("slug", ["raycast", "open-design"]);
  if (error) throw new Error(`READ_FAILED: ${error.message}`);

  const raycast = rows.find((r) => r.slug === "raycast");
  const openDesign = rows.find((r) => r.slug === "open-design");
  if (!raycast || !openDesign) throw new Error("MISSING_ROW: expected both raycast and open-design");

  // Mojibake gate on the rewritten Chinese copy.
  for (const [label, text] of Object.entries(OPEN_DESIGN_CONTENT)) {
    if (!/[一-鿿]/.test(text)) throw new Error(`VALIDATION_FAILED: ${label} has no CJK`);
    if (/\?\?+/.test(text)) throw new Error(`VALIDATION_FAILED: ${label} contains mojibake '??'`);
  }

  const plan = {
    raycast: { status: "publish_as_is", current_status: raycast.status },
    "open-design": {
      status: "rewrite_and_publish",
      current_status: openDesign.status,
      cover_source: OPEN_DESIGN_COVER_SOURCE,
    },
  };
  console.log(`PLAN: ${JSON.stringify(plan)}`);

  if (!executeMode) {
    writeReport({ status: "dry_run_completed", plan });
    console.log("PUBLISH_DRAFT_TOOLS_DRY_RUN_OK");
    console.log(`REPORT: ${REPORT}`);
    return;
  }

  const results = { updated: [], failed: [] };

  // 1. Raycast: publish as-is.
  try {
    const { error: updateError } = await client
      .from("tools")
      .update({ status: "published", updated_at: new Date().toISOString() })
      .eq("id", raycast.id);
    if (updateError) throw new Error(updateError.message);
    const { data: after } = await client.from("tools").select("status").eq("id", raycast.id).single();
    if (after?.status !== "published") throw new Error("VERIFY_FAILED: status not published");
    results.updated.push("raycast");
  } catch (err) {
    results.failed.push({ slug: "raycast", error: err instanceof Error ? err.message : String(err) });
  }

  // 2. Open Design: fetch real cover, rewrite copy, publish.
  try {
    const response = await fetch(OPEN_DESIGN_COVER_SOURCE, {
      headers: { "user-agent": "Mozilla/5.0 zhishare-cover-fetch/1.0" },
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) throw new Error(`COVER_DOWNLOAD_HTTP_${response.status}`);
    const contentType = String(response.headers.get("content-type") ?? "").split(";")[0].trim();
    if (contentType !== "image/png") throw new Error(`UNSUPPORTED_TYPE: ${contentType}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length < 1024) throw new Error(`COVER_TOO_SMALL: ${buffer.length}B`);

    const coverPath = "photos/open-design.png";
    const upload = await client.storage.from(BUCKET).upload(coverPath, buffer, { contentType: "image/png", upsert: true });
    if (upload.error) throw new Error(`UPLOAD_FAILED: ${upload.error.message}`);
    const { data: publicUrlData } = client.storage.from(BUCKET).getPublicUrl(coverPath);
    const coverUrl = publicUrlData?.publicUrl ? `${publicUrlData.publicUrl}?v=${Date.now()}` : "";
    if (!coverUrl) throw new Error("PUBLIC_URL_EMPTY");

    const payload = { ...OPEN_DESIGN_CONTENT, cover_url: coverUrl, status: "published", updated_at: new Date().toISOString() };
    const { error: updateError } = await client.from("tools").update(payload).eq("id", openDesign.id);
    if (updateError) throw new Error(`UPDATE_FAILED: ${updateError.message}`);

    const { data: after, error: verifyError } = await client
      .from("tools")
      .select("status,cover_url,summary,description")
      .eq("id", openDesign.id)
      .single();
    if (verifyError) throw new Error(`VERIFY_FAILED: ${verifyError.message}`);
    if (after.status !== "published") throw new Error("VERIFY_FAILED: status not published");
    if (!after.cover_url?.includes(coverPath)) throw new Error("VERIFY_FAILED: cover_url mismatch");
    if (after.summary !== OPEN_DESIGN_CONTENT.summary) throw new Error("VERIFY_FAILED: summary mismatch");
    results.updated.push("open-design");
  } catch (err) {
    results.failed.push({ slug: "open-design", error: err instanceof Error ? err.message : String(err) });
  }

  writeReport({ status: results.failed.length === 0 ? "execute_completed" : "execute_partial", plan, ...results });
  console.log(results.failed.length === 0 ? "PUBLISH_DRAFT_TOOLS_EXECUTE_OK" : "PUBLISH_DRAFT_TOOLS_EXECUTE_PARTIAL");
  console.log(`UPDATED: ${results.updated.join(",")}`);
  console.log(`FAILED: ${results.failed.map((f) => `${f.slug}(${f.error})`).join(",")}`);
  console.log(`REPORT: ${REPORT}`);
  if (results.failed.length > 0) process.exitCode = 1;
}

function writeReport(report) {
  const absolute = path.resolve(REPORT);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, `${JSON.stringify({ ...report, secret_values_printed: false }, null, 2)}\n`, "utf8");
}
