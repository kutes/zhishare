# 卡片重设计 + 生成式封面 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 工具卡换上确定性生成的暖色编辑部风格 SVG 封面(存 Supabase Storage),精选卡改杂志横幅式、紧凑卡改图标行内式,文章卡纯排版强化。

**Architecture:** 单一零依赖 ESM 模块 `tool-cover.mjs`(+ `.d.mts` 类型)同时服务 Node 脚本与浏览器;封面/图标两个 SVG 上传 `tool-covers` 公开桶,`cover_url` 写库,图标 URL 按路径约定推导;卡片组件消费 URL,空值回落现有首字母占位。

**Tech Stack:** Next.js 15 / TypeScript(allowJs=false,故用 .d.mts 声明)/ @supabase/supabase-js(已有)/ 无新增依赖 / 无测试框架——用 node 直跑的断言自检脚本当测试。

**Spec:** `docs/superpowers/specs/2026-07-05-card-redesign-covers-design.md`

**约定(全计划通用):**
- 调色板:底 `#171210→#120f0e`;琥珀主色三变体 `["#E3A75F","#D98E4A","#EDBD7E"]` 由 slug 哈希选取;纹理 `#F7F1EA` 低透明;辅助紫 `rgba(91,58,82,α)`。
- SVG 内衬线字体栈(SVG 在 `<img>` 里读不到页面 CSS 变量,必须写死):`Songti SC, Noto Serif SC, STSong, Source Han Serif SC, Georgia, SimSun, serif`。
- 所有含中文文件用 Write 工具或 `fs.writeFileSync(p, s, "utf8")` 写盘;禁止 PowerShell 重定向(见 docs 的 UTF-8 事故)。
- 每个 Task 结束提交一次 git。

---

### Task 1: 封面生成器模块(TDD)

**Files:**
- Create: `scripts/checks/check-tool-cover.mjs`(自检=测试)
- Create: `src/lib/covers/tool-cover.mjs`(实现)
- Create: `src/lib/covers/tool-cover.d.mts`(类型声明)
- Modify: `src/components/tools/tool-card-utils.ts`(initials 改为再导出,单一实现)

- [ ] **Step 1: 写失败的自检脚本**

```js
// scripts/checks/check-tool-cover.mjs
import assert from "node:assert/strict";
import { generateToolCover, getToolInitials } from "../../src/lib/covers/tool-cover.mjs";

const input = { title: "LocalSend", slug: "localsend", category: "效率软件" };
const a = generateToolCover(input);
const b = generateToolCover(input);

assert.equal(a.coverSvg, b.coverSvg, "cover must be deterministic");
assert.equal(a.iconSvg, b.iconSvg, "icon must be deterministic");
assert.ok(a.coverSvg.startsWith("<svg"), "coverSvg is svg");
assert.ok(a.coverSvg.includes('viewBox="0 0 1200 675"'), "cover viewBox 16:9");
assert.ok(a.iconSvg.includes('viewBox="0 0 256 256"'), "icon viewBox 1:1");
assert.ok(a.coverSvg.includes(">LS<"), "initials rendered");
assert.ok(!/\?\?+/.test(a.coverSvg), "no mojibake");

// 分类兜底:未知分类不许抛错
const c = generateToolCover({ title: "X", slug: "x", category: "不存在的分类" });
assert.ok(c.coverSvg.startsWith("<svg"), "unknown category falls back");

// slug 匹配与名称匹配等价
const bySlug = generateToolCover({ title: "T", slug: "t", category: "coding-tools" });
const byName = generateToolCover({ title: "T", slug: "t", category: "编程工具" });
assert.equal(bySlug.coverSvg, byName.coverSvg, "slug and name map to same motif");

assert.equal(getToolInitials("LocalSend"), "LS");
assert.equal(getToolInitials(""), "工");
console.log("CHECK_TOOL_COVER_OK");
```

- [ ] **Step 2: 跑一遍确认失败**

Run: `node scripts/checks/check-tool-cover.mjs`
Expected: FAIL,`Cannot find module ... tool-cover.mjs`

- [ ] **Step 3: 写实现**

```js
// src/lib/covers/tool-cover.mjs
// Deterministic warm-editorial SVG covers for tools. Zero deps; runs in Node and browser.
// Palette and motifs are locked to the site's warm editorial theme.

const BG_TOP = "#171210";
const BG_BOTTOM = "#120f0e";
const CREAM = "#F7F1EA";
const ACCENTS = ["#E3A75F", "#D98E4A", "#EDBD7E"];
const SERIF = "Songti SC, Noto Serif SC, STSong, Source Han Serif SC, Georgia, SimSun, serif";

export function getToolInitials(title) {
  if (!title || title.trim().length === 0) {
    return "工";
  }
  const text = title.trim();
  const upperChars = text.replace(/[^A-Z]/g, "");
  if (upperChars.length >= 2) {
    return upperChars.slice(0, 2);
  }
  if (upperChars.length === 1 && text.length > 1) {
    const secondChar = text.replace(/[^a-zA-Z]/g, "").charAt(1);
    return upperChars + (secondChar || text.charAt(1).toUpperCase());
  }
  return text.slice(0, 2);
}

function hashString(value) {
  let hash = 5381;
  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) + hash + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

// One geometric motif per category family; keyed by BOTH slug and display name.
const MOTIFS = {
  brackets: (a) =>
    `<g stroke="${a}" stroke-width="10" fill="none" opacity="0.5">` +
    `<path d="M-40 80 L60 180 L-40 280"/><path d="M1240 395 L1140 495 L1240 595"/></g>`,
  ripples: (a) =>
    `<g stroke="${a}" fill="none" opacity="0.45">` +
    [90, 150, 210, 270].map((r) => `<circle cx="1050" cy="120" r="${r}" stroke-width="3"/>`).join("") +
    `</g>`,
  grid: (a) => {
    let dots = "";
    for (let x = 60; x <= 420; x += 72) {
      for (let y = 420; y <= 620; y += 66) {
        dots += `<circle cx="${x}" cy="${y}" r="5" fill="${a}"/>`;
      }
    }
    return `<g opacity="0.4">${dots}</g>`;
  },
  starburst: (a) => {
    let rays = "";
    for (let i = 0; i < 12; i += 1) {
      const ang = (Math.PI * 2 * i) / 12;
      const x1 = 1080 + Math.cos(ang) * 70;
      const y1 = 140 + Math.sin(ang) * 70;
      const x2 = 1080 + Math.cos(ang) * 150;
      const y2 = 140 + Math.sin(ang) * 150;
      rays += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
    }
    return `<g stroke="${a}" stroke-width="6" opacity="0.5">${rays}</g>`;
  },
  branches: (a) =>
    `<g stroke="${a}" stroke-width="6" fill="none" opacity="0.5">` +
    `<path d="M80 620 L80 460 M80 520 L200 420 M80 560 L220 560"/>` +
    `<circle cx="80" cy="440" r="14" fill="${a}"/><circle cx="214" cy="410" r="14" fill="${a}"/>` +
    `<circle cx="236" cy="560" r="14" fill="${a}"/></g>`,
  rings: (a) =>
    `<g stroke="${a}" fill="none" opacity="0.5">` +
    `<circle cx="150" cy="150" r="90" stroke-width="14"/><circle cx="150" cy="150" r="40" stroke-width="6"/></g>`,
  viewfinder: (a) =>
    `<g stroke="${a}" stroke-width="10" fill="none" opacity="0.5">` +
    `<path d="M950 60 h90 M950 60 v90 M1140 615 h-90 M1140 615 v-90"/>` +
    `<circle cx="1045" cy="337" r="46" stroke-width="6"/></g>`,
  timeline: (a) => {
    let marks = "";
    for (let x = 80; x <= 560; x += 60) {
      const tall = ((x / 60) | 0) % 2 === 0;
      marks += `<line x1="${x}" y1="${tall ? 540 : 560}" x2="${x}" y2="600"/>`;
    }
    return `<g stroke="${a}" stroke-width="6" opacity="0.5"><line x1="60" y1="600" x2="580" y2="600"/>${marks}</g>`;
  },
  ruled: (a) =>
    `<g stroke="${a}" stroke-width="4" opacity="0.4">` +
    [480, 520, 560, 600].map((y) => `<line x1="70" y1="${y}" x2="430" y2="${y}"/>`).join("") +
    `</g>`,
  hazard: (a) => {
    let stripes = "";
    for (let x = 880; x <= 1220; x += 56) {
      stripes += `<line x1="${x}" y1="675" x2="${x + 120}" y2="555"/>`;
    }
    return `<g stroke="${a}" stroke-width="12" opacity="0.4">${stripes}</g>`;
  },
  mosaic: (a) => {
    let cells = "";
    for (let x = 0; x < 3; x += 1) {
      for (let y = 0; y < 3; y += 1) {
        cells += `<rect x="${970 + x * 78}" y="${420 + y * 78}" width="58" height="58" rx="12"/>`;
      }
    }
    return `<g stroke="${a}" stroke-width="5" fill="none" opacity="0.45">${cells}</g>`;
  },
};

const CATEGORY_MOTIF = {
  "coding-tools": "brackets", "编程工具": "brackets",
  "online-tools": "ripples", "在线工具": "ripples",
  "productivity": "grid", "效率软件": "grid",
  "productivity-tools": "grid", "效率工具": "grid",
  "ai-tools": "starburst", "AI工具": "starburst",
  "ai-basics": "starburst", "AI 入门": "starburst",
  "open-source": "branches", "开源项目": "branches",
  "design-tools": "rings", "设计工具": "rings",
  "image-tools": "viewfinder", "图片工具": "viewfinder",
  "image-processing": "viewfinder", "图片处理": "viewfinder",
  "video-editing": "timeline", "视频剪辑": "timeline",
  "productivity-notes": "ruled", "效率笔记": "ruled",
  "software-risks": "hazard", "软件避坑": "hazard",
  "tool-collections": "mosaic", "工具合集": "mosaic",
};

function resolveMotif(category) {
  const key = String(category ?? "").trim();
  return MOTIFS[CATEGORY_MOTIF[key] ?? "grid"];
}

export function generateToolCover({ title, slug, category }) {
  const hash = hashString(String(slug ?? ""));
  const accent = ACCENTS[hash % ACCENTS.length];
  const initials = getToolInitials(String(title ?? ""));
  const motif = resolveMotif(category);
  const glowX = 300 + (hash % 600);

  const coverSvg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" role="img">` +
    `<defs>` +
    `<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0" stop-color="${BG_TOP}"/><stop offset="1" stop-color="${BG_BOTTOM}"/>` +
    `</linearGradient>` +
    `<radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">` +
    `<stop offset="0" stop-color="${accent}" stop-opacity="0.28"/>` +
    `<stop offset="1" stop-color="${accent}" stop-opacity="0"/>` +
    `</radialGradient>` +
    `</defs>` +
    `<rect width="1200" height="675" fill="url(#bg)"/>` +
    `<ellipse cx="${glowX}" cy="180" rx="460" ry="300" fill="url(#glow)"/>` +
    `<ellipse cx="1050" cy="620" rx="380" ry="240" fill="rgba(91,58,82,0.18)"/>` +
    motif(accent) +
    `<text x="600" y="337" dy="0.36em" text-anchor="middle" fill="${CREAM}" ` +
    `font-family="${SERIF}" font-size="230" font-weight="600" letter-spacing="8">${initials}</text>` +
    `<rect x="0.5" y="0.5" width="1199" height="674" fill="none" stroke="rgba(247,241,234,0.1)"/>` +
    `</svg>`;

  const iconSvg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img">` +
    `<defs>` +
    `<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0" stop-color="${BG_TOP}"/><stop offset="1" stop-color="${BG_BOTTOM}"/>` +
    `</linearGradient>` +
    `</defs>` +
    `<rect width="256" height="256" rx="28" fill="url(#bg)"/>` +
    `<circle cx="200" cy="56" r="64" fill="${accent}" opacity="0.22"/>` +
    `<text x="128" y="128" dy="0.36em" text-anchor="middle" fill="${CREAM}" ` +
    `font-family="${SERIF}" font-size="92" font-weight="600" letter-spacing="2">${initials}</text>` +
    `<rect x="1" y="1" width="254" height="254" rx="27" fill="none" stroke="rgba(227,167,95,0.4)" stroke-width="2"/>` +
    `</svg>`;

  return { coverSvg, iconSvg };
}
```

```ts
// src/lib/covers/tool-cover.d.mts
export type ToolCoverInput = {
  title: string;
  slug: string;
  /** category slug 或中文名,均可;未知值回落默认母题 */
  category: string;
};

export type ToolCoverOutput = {
  coverSvg: string;
  iconSvg: string;
};

export function generateToolCover(input: ToolCoverInput): ToolCoverOutput;
export function getToolInitials(title: string): string;
```

- [ ] **Step 4: 跑自检确认通过**

Run: `node scripts/checks/check-tool-cover.mjs`
Expected: `CHECK_TOOL_COVER_OK`

- [ ] **Step 5: initials 单一实现——tool-card-utils 改为再导出**

在 `src/components/tools/tool-card-utils.ts`:删除本文件里的 `getToolInitials` 函数体(第 26-43 行),顶部加:

```ts
export { getToolInitials } from "@/lib/covers/tool-cover.mjs";
```

- [ ] **Step 6: 类型检查**

Run: `npx tsc --noEmit`
Expected: 无输出(通过)

- [ ] **Step 7: Commit**

```bash
git add scripts/checks/check-tool-cover.mjs src/lib/covers/tool-cover.mjs src/lib/covers/tool-cover.d.mts src/components/tools/tool-card-utils.ts
git commit -m "feat: deterministic warm-editorial tool cover generator"
```

---

### Task 2: Storage 桶创建脚本(守门式)

**Files:**
- Create: `scripts/content-import/create-tool-covers-bucket.mjs`

- [ ] **Step 1: 写脚本**

```js
// scripts/content-import/create-tool-covers-bucket.mjs
// Creates the public "tool-covers" storage bucket. Dry-run by default; --execute creates.
// Requires NEXT_PUBLIC_SUPABASE_URL/SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY/SUPABASE_SERVICE_KEY at execute.

const BUCKET = "tool-covers";
const executeMode = process.argv.includes("--execute");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY ?? "";

if (!executeMode) {
  console.log("CREATE_BUCKET_DRY_RUN_OK");
  console.log(`BUCKET: ${BUCKET} (public read)`);
  console.log(`ENV_READY: ${String(Boolean(supabaseUrl && serviceKey))}`);
  process.exit(0);
}

if (!supabaseUrl || !serviceKey) {
  console.error("MISSING_SUPABASE_ENV");
  process.exit(1);
}

const { createClient } = await import("@supabase/supabase-js");
const client = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

const { data: existing } = await client.storage.getBucket(BUCKET);
if (existing) {
  console.log("BUCKET_ALREADY_EXISTS");
  process.exit(0);
}

const { error } = await client.storage.createBucket(BUCKET, { public: true });
if (error) {
  console.error(`CREATE_BUCKET_FAILED: ${error.message}`);
  process.exit(1);
}
console.log("CREATE_BUCKET_OK");
```

- [ ] **Step 2: dry-run 验证**

Run: `node scripts/content-import/create-tool-covers-bucket.mjs`
Expected: `CREATE_BUCKET_DRY_RUN_OK`,`ENV_READY: false`(本地无 service key 属正常)

- [ ] **Step 3(用户参与): execute 建桶**

由用户提供 service key 后运行(key 只进环境变量,不落盘):
Run: `SUPABASE_SERVICE_ROLE_KEY=*** node scripts/content-import/create-tool-covers-bucket.mjs --execute`
Expected: `CREATE_BUCKET_OK`(或 `BUCKET_ALREADY_EXISTS`)

后台表单直传还需一条一次性 SQL(Supabase 控制台 SQL Editor 执行;不执行则后台走兜底、封面由脚本补):

```sql
create policy "authenticated can upload tool covers"
on storage.objects for insert to authenticated
with check (bucket_id = 'tool-covers');

create policy "authenticated can update tool covers"
on storage.objects for update to authenticated
using (bucket_id = 'tool-covers');
```

- [ ] **Step 4: Commit**

```bash
git add scripts/content-import/create-tool-covers-bucket.mjs
git commit -m "feat: guarded tool-covers bucket creation script"
```

---

### Task 3: 封面上传助手 + 存量工具补跑脚本(守门式)

**Files:**
- Create: `scripts/content-import/lib/tool-cover-upload.mjs`(未来批量导入脚本复用同一函数)
- Create: `scripts/content-import/backfill-tool-covers.mjs`

- [ ] **Step 1: 写上传助手**

```js
// scripts/content-import/lib/tool-cover-upload.mjs
// Uploads a generated cover pair to the tool-covers bucket. Returns the public cover URL.

const BUCKET = "tool-covers";

export async function uploadToolCoverPair(client, slug, { coverSvg, iconSvg }) {
  const coverPath = `covers/${slug}.svg`;
  const iconPath = `icons/${slug}.svg`;
  const options = { contentType: "image/svg+xml", upsert: true };

  const coverResult = await client.storage.from(BUCKET).upload(coverPath, coverSvg, options);
  if (coverResult.error) {
    return { ok: false, error: `COVER_UPLOAD_FAILED:${slug}:${coverResult.error.message}` };
  }

  const iconResult = await client.storage.from(BUCKET).upload(iconPath, iconSvg, options);
  if (iconResult.error) {
    return { ok: false, error: `ICON_UPLOAD_FAILED:${slug}:${iconResult.error.message}` };
  }

  const { data } = client.storage.from(BUCKET).getPublicUrl(coverPath);
  const coverUrl = data?.publicUrl ?? "";
  if (!coverUrl) {
    return { ok: false, error: `PUBLIC_URL_EMPTY:${slug}` };
  }
  return { ok: true, coverUrl };
}
```

- [ ] **Step 2: 写补跑脚本**

```js
// scripts/content-import/backfill-tool-covers.mjs
// Backfills generated covers for existing tools whose cover_url is empty.
// Dry-run by default (no DB/storage access needed beyond read); --execute uploads + updates cover_url.

import fs from "node:fs";
import path from "node:path";
import { generateToolCover } from "../../src/lib/covers/tool-cover.mjs";
import { uploadToolCoverPair } from "./lib/tool-cover-upload.mjs";

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
    console.log("NOTE: 提供只读 env 后 dry-run 可列出目标行;--execute 需要 service key。");
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
```

- [ ] **Step 3: 离线 dry-run**

Run: `node scripts/content-import/backfill-tool-covers.mjs`
Expected: `BACKFILL_COVERS_DRY_RUN_OK (offline)`,生成报告文件

- [ ] **Step 4(用户参与): 带 env dry-run → execute**

Run: `SUPABASE_SERVICE_ROLE_KEY=*** node scripts/content-import/backfill-tool-covers.mjs`
Expected: `TARGET_COUNT: 3`,`TARGET_SLUGS: localsend,stirling-pdf,cyberchef`
人工过目报告后:
Run: `SUPABASE_SERVICE_ROLE_KEY=*** node scripts/content-import/backfill-tool-covers.mjs --execute`
Expected: `BACKFILL_COVERS_EXECUTE_OK`,`UPDATED: localsend,stirling-pdf,cyberchef`

- [ ] **Step 5: Commit**

```bash
git add scripts/content-import/lib/tool-cover-upload.mjs scripts/content-import/backfill-tool-covers.mjs docs/content/backfill-tool-covers-report-v1.json
git commit -m "feat: guarded cover backfill with shared upload helper"
```

---

### Task 4: 后台表单保存时自动生成封面

**Files:**
- Modify: `src/components/admin/AdminToolForm.tsx:66-91`(handleSubmit)

- [ ] **Step 1: 实现自动生成**

在 `AdminToolForm.tsx` 顶部加 import:

```ts
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { generateToolCover } from "@/lib/covers/tool-cover.mjs";
```

`handleSubmit` 里,在 `setIsSubmitting(true);` 之后、`onSubmit` 之前插入(失败不阻塞保存):

```ts
    let coverUrl = values.cover_url?.trim() ?? "";
    if (!coverUrl && values.slug.trim()) {
      try {
        const categoryName = categories.find((item) => item.id === values.category_id)?.name ?? "";
        const { coverSvg, iconSvg } = generateToolCover({
          title: values.title.trim(),
          slug: values.slug.trim(),
          category: categoryName,
        });
        const client = getSupabaseBrowserClient();
        if (client) {
          const bucket = client.storage.from("tool-covers");
          const options = { contentType: "image/svg+xml", upsert: true };
          const slug = values.slug.trim();
          const coverResult = await bucket.upload(`covers/${slug}.svg`, new Blob([coverSvg]), options);
          const iconResult = await bucket.upload(`icons/${slug}.svg`, new Blob([iconSvg]), options);
          if (!coverResult.error && !iconResult.error) {
            coverUrl = bucket.getPublicUrl(`covers/${slug}.svg`).data.publicUrl ?? "";
          } else {
            console.warn("[covers] upload failed, saving without cover", coverResult.error ?? iconResult.error);
          }
        }
      } catch (error) {
        console.warn("[covers] generation failed, saving without cover", error);
      }
    }
```

并把 `onSubmit({...values, ...})` 调用里补一行字段:`cover_url: coverUrl,`。

- [ ] **Step 2: 类型检查**

Run: `npx tsc --noEmit`
Expected: 通过

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/AdminToolForm.tsx
git commit -m "feat: auto-generate cover on admin tool save"
```

---

### Task 5: 精选大卡改杂志横幅式

**Files:**
- Modify: `src/components/tools/FeaturedToolCard.tsx`
- Modify: `src/components/tools/tool-card-utils.ts`(加 `getToolIconUrl`)
- Modify: `src/app/globals.css`(tools 页区块,`.zh-tool-card` 附近)

- [ ] **Step 1: 加图标 URL 推导(单点实现)**

`tool-card-utils.ts` 末尾追加:

```ts
export function getToolIconUrl(tool: ToolItem): string | null {
  const cover = getToolCoverUrl(tool);
  if (!cover || !cover.includes("/tool-covers/covers/")) {
    return null;
  }
  return cover.replace("/tool-covers/covers/", "/tool-covers/icons/");
}
```

- [ ] **Step 2: 改 FeaturedToolCard 结构**

`FeaturedToolCard.tsx` 的 return 整体替换为:

```tsx
  return (
    <article className="zh-tool-card zh-tool-card-featured">
      {coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="zh-tool-card-banner" src={coverUrl} alt="" loading="lazy" />
      ) : (
        <div className="zh-tool-feature-visual">
          <span className="zh-tool-card-initials zh-tool-card-initials-large">{initials}</span>
        </div>
      )}

      <div className="zh-tool-feature-body">
        <div className="zh-tool-card-meta">
          <span className="zh-tool-badge">{tool.category || "未分类"}</span>
          {tool.is_free && <span className="zh-tool-badge zh-tool-badge-soft">免费</span>}
          {tool.is_open_source && <span className="zh-tool-badge zh-tool-badge-soft">开源</span>}
        </div>

        <h3 className="zh-tool-card-title zh-tool-card-title-lg">{title}</h3>
        <p className="zh-tool-card-desc zh-tool-card-desc-lg">{summary}</p>
        <p className="zh-tool-card-focus zh-tool-card-focus-lg">
          <span>适合</span>
          {focusText}
        </p>

        <div className="zh-tool-card-bottom">
          {visibleTags.length > 0 ? (
            <div className="zh-tool-tag-row zh-tool-tag-row-wide">
              {visibleTags.map((tag) => (
                <span key={tag} className="zh-tool-tag">
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <span />
          )}
          <Link href={`/tools/${slug}`} className="zh-tool-link zh-tool-card-arrow" aria-label={`查看 ${title} 详情`}>
            →
          </Link>
        </div>
      </div>
    </article>
  );
```

(文件顶部 `getToolCoverUrl` 已在现有 import 列表中;`coverUrl` 变量已存在。)

- [ ] **Step 3: 补 CSS**

`globals.css` 中 `.zh-tool-link::after`(stretched-link 规则)之后追加:

```css
  .zh-tool-card-banner {
    display: block;
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: 16px;
    object-fit: cover;
    border: 1px solid rgba(247, 241, 234, 0.08);
    transition: filter 180ms ease;
  }

  .zh-tool-card:hover .zh-tool-card-banner {
    filter: brightness(1.08);
  }

  .zh-tool-card-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-top: auto;
  }

  .zh-tool-card-arrow {
    display: inline-flex;
    width: 2.4rem;
    height: 2.4rem;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(227, 167, 95, 0.35);
    border-radius: 999px;
    color: #e3a75f;
    font-size: 1.1rem;
    transition: background-color 180ms ease, transform 180ms ease;
  }

  .zh-tool-card:hover .zh-tool-card-arrow {
    background: rgba(227, 167, 95, 0.14);
    transform: translateX(2px);
  }
```

同区块里删除整条 `.zh-tool-link { margin-top: auto; }` 规则(`.zh-tool-card-bottom` 的 `margin-top: auto` 接管布局);**保留** 紧随其后的 `.zh-tool-link::after` stretched-link 规则不动。

- [ ] **Step 4: 类型检查 + Commit**

Run: `npx tsc --noEmit` → 通过

```bash
git add src/components/tools/FeaturedToolCard.tsx src/components/tools/tool-card-utils.ts src/app/globals.css
git commit -m "feat: magazine banner layout for featured tool cards"
```

---

### Task 6: 紧凑卡改图标行内式

**Files:**
- Modify: `src/components/tools/CompactToolCard.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: 改 CompactToolCard 结构**

import 行补 `getToolIconUrl`;组件内加 `const iconUrl = getToolIconUrl(tool);`;return 替换为:

```tsx
  return (
    <article className="zh-tool-card zh-tool-card-compact">
      <div className="zh-tool-card-top">
        {iconUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="zh-tool-card-icon" src={iconUrl} alt="" loading="lazy" />
        ) : (
          <div className="zh-tool-card-visual">
            <span className="zh-tool-card-initials">{initials}</span>
          </div>
        )}

        <div className="zh-tool-card-copy">
          <div className="zh-tool-card-meta">
            <span className="zh-tool-badge">{tool.category || "未分类"}</span>
            {tool.is_free && <span className="zh-tool-badge zh-tool-badge-soft">免费</span>}
            {tool.is_open_source && <span className="zh-tool-badge zh-tool-badge-soft">开源</span>}
          </div>

          <h3 className="zh-tool-card-title">{title}</h3>
          <p className="zh-tool-card-desc">{summary}</p>
        </div>
      </div>

      <div className="zh-tool-card-bottom">
        <p className="zh-tool-card-focus">
          <span>适合</span>
          {focusText}
        </p>
        <Link href={`/tools/${slug}`} className="zh-tool-link zh-tool-card-arrow" aria-label={`查看 ${title} 详情`}>
          →
        </Link>
      </div>
    </article>
  );
```

(标签行整个移除——紧凑卡以密度优先,标签信息详情页有。`visibleTags` 相关 import/变量一并删除。)

- [ ] **Step 2: 补 CSS**

`.zh-tool-card-arrow` 规则后追加:

```css
  .zh-tool-card-icon {
    display: block;
    width: 64px;
    height: 64px;
    flex-shrink: 0;
    border-radius: 16px;
    object-fit: cover;
  }
```

- [ ] **Step 3: 类型检查 + Commit**

Run: `npx tsc --noEmit` → 通过

```bash
git add src/components/tools/CompactToolCard.tsx src/app/globals.css
git commit -m "feat: inline icon layout for compact tool cards"
```

---

### Task 7: 文章卡纯排版强化

**Files:**
- Modify: `src/components/articles/article-card.tsx:11-14, 32-34`
- Modify: `src/app/globals.css`(articles 区块)

- [ ] **Step 1: 调整卡片标记**

topline 加琥珀点(纯装饰 span),按钮改文字链:

```tsx
      <div className="articles-card-topline">
        <span className="articles-card-dot" aria-hidden="true" />
        <span className="articles-card-chip articles-card-chip-accent">{article.category}</span>
        <span className="articles-card-chip">{article.date}</span>
      </div>
```

```tsx
      <Link href={`/articles/${article.slug}`} className="articles-card-link">
        阅读全文 <span aria-hidden="true">→</span>
      </Link>
```

- [ ] **Step 2: 样式精修**

`globals.css` 中 `.articles-card-link::after`(stretched-link)规则之前追加:

```css
  .articles-card-dot {
    width: 8px;
    height: 8px;
    flex-shrink: 0;
    border-radius: 999px;
    background: #e3a75f;
    box-shadow: 0 0 12px rgba(227, 167, 95, 0.5);
  }
```

并将现有 `.articles-card-link` 规则体替换为文字链样式(去按钮底、去边框):

```css
  .articles-card-link {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    margin-top: 1rem;
    color: #e3a75f;
    font-size: 0.9rem;
    font-weight: 700;
    letter-spacing: 0.04em;
  }
```

(`.articles-card-title` 已用 `var(--zh-serif)`,不动。)

- [ ] **Step 3: 类型检查 + Commit**

Run: `npx tsc --noEmit` → 通过

```bash
git add src/components/articles/article-card.tsx src/app/globals.css
git commit -m "feat: editorial typography pass for article cards"
```

---

### Task 8: 端到端验证与记录

**Files:**
- Modify: `docs/COSMIC_REDESIGN_LOG.md`(追加 Step 48)
- Modify: `docs/TASK_LOG.md`(追加当日条目)

- [ ] **Step 1: 全量自检**

Run: `node scripts/checks/check-tool-cover.mjs && npx tsc --noEmit && echo ALL_OK`
Expected: `CHECK_TOOL_COVER_OK` + `ALL_OK`

- [ ] **Step 2: 视觉验证(dev server)**

Run: 启动 dev server(preview 工具或 `npm run dev`),检查:
- /tools 精选卡出现 16:9 生成封面(补跑执行前是首字母兜底,执行后是封面)
- /tools 紧凑卡为 64px 图标行内式,无"查看详情"按钮,整卡可点
- /articles 卡片有琥珀点 + 文字链,整卡可点
- 移动端(375px)三种卡不溢出

- [ ] **Step 3: 记录 + Commit**

`COSMIC_REDESIGN_LOG.md` 追加:

```markdown
### Step 48 - Card redesign with generated covers

Status: completed

- Added a deterministic warm-editorial SVG cover generator (16:9 banner + 1:1 icon) shared by Node scripts and the admin form.
- Created the public tool-covers storage bucket flow and a guarded backfill script; cover_url now set for published tools.
- Featured tool cards use a magazine banner layout; compact cards use a 64px icon inline layout; the detail button was replaced by an arrow affordance (whole card remains clickable).
- Article cards received an editorial typography pass (amber dot, serif title, text link).
- Did not modify data flow, routes, backend queries, or dependencies.
```

`TASK_LOG.md` 按既有格式追加当日条目(要点同上,中文)。

```bash
git add docs/COSMIC_REDESIGN_LOG.md docs/TASK_LOG.md
git commit -m "docs: record card redesign and cover system rollout"
```

---

## 依赖顺序

Task 1 → (2, 3, 4 可并行,均依赖 1)→ 5 → 6 → 7 → 8。Task 3 Step 4 与 Task 2 Step 3 需用户提供 service key(与既有导入流程相同,key 不落盘)。
