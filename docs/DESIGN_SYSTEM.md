# DESIGN_SYSTEM

## 用途

记录网站视觉与交互规则，确保前台和后台界面风格统一，并同时适配电脑端和手机端。

**本文件已于 2026-07-09 全文重写**，此前记录的"浅色液态玻璃"方向（`#f8fbff` 系背景、蓝青紫强调色）已被废弃，不再是当前标准。当前方向是"暖色编辑部"（Warm Editorial Portal），已覆盖全部公开页面。

## 设计方向：暖色编辑部（Warm Editorial Portal）

- 暖色深色调、极简、有质感、编辑部气质、工具分享导向。
- 暖金强调色、中文衬线大标题、朴素实用的搜索框、低透明度暖色卡片、克制的动效。
- 不用鲜艳多彩 UI，不用液态玻璃（Liquid Glass）实验，不用纯黑"宇宙"方向——这两个方向都已被明确否决，不要复活。

## 颜色令牌

CSS 变量集中定义在 `src/app/globals.css` 的 `:root`（跨页面通用）与各页面 wrapper class（如 `.warm-home-page`、`.zh-tools-page`）里，改色时改令牌，不要在组件里散写十六进制值。

| 用途 | 值 |
| --- | --- |
| 背景（深→浅→深渐变） | `#120F0E` → `#171210` → `#120F0E` |
| 强调色（暖金） | `#E3A75F`（生成封面额外用 `#D98E4A`、`#EDBD7E` 两个哈希微调变体） |
| 卡片表面 | `rgba(255, 247, 237, 0.04)` |
| 卡片表面 hover | `rgba(255, 247, 237, 0.07)` |
| 边框 | `rgba(255, 247, 237, 0.09)` |
| 正文文字 | `#F7F1EA` |
| 次级文字 | `rgba(247, 241, 234, 0.7)` 一带 |
| 弱文字（label/meta） | `rgba(175, 163, 153, 0.82)` |
| 辅助紫（点缀） | `rgba(91, 58, 82, ·)` 低透明度 |

## 字体

- **标题衬线**：`var(--zh-serif)`（`:root` 单点定义：`"Songti SC", "Noto Serif SC", "STSong", "Source Han Serif SC", Georgia, "SimSun", serif`）。只用在大标题（Hero、Section 标题、工具/文章卡标题），不要在正文用。
- **正文/UI 无衬线**：`"PingFang SC", "Microsoft YaHei", Arial, sans-serif`。
- **不要**在同一处引入第三套字体栈拼写——历史上出现过 4 种不同拼法的衬线栈，已于 2026-07-05 收口为单一令牌，新代码复用 `var(--zh-serif)`，不要再手写字体列表。

## 卡片规范（核心，2026-07-05/07-09 确立）

网站只有 **3 种卡片组件**，新内容一律复用，禁止再写一次性卡片标记：

- `FeaturedToolCard`（`src/components/tools/FeaturedToolCard.tsx`）：16:9 封面横幅杂志式，用于精选/首屏级工具展示。
- `CompactToolCard`（`src/components/tools/CompactToolCard.tsx`）：64px 图标行内式，用于列表/网格密集展示。
- `ArticleCard`（`src/components/articles/article-card.tsx`）：纯排版无配图（琥珀点 + 衬线标题 + 摘要 + meta 行）。

**整卡可点标准**：卡片容器 `position: relative`，内部一个可见的操作提示（箭头 `zh-tool-card-arrow` 或文字链），该链接元素加 `::after { position:absolute; inset:0 }` 撑满整卡（stretched-link 模式）。不要在卡片里放多个可点链接（会与 stretched-link 冲突产生嵌套/遮挡问题）。

**封面/图标兜底链**（三级，任何一级失败自动落到下一级，卡片永远不开天窗）：

1. 官方照片（`tool-covers/photos/{slug}.*`，抓自工具官网 og:image/twitter:image）
2. 生成式 SVG 封面（`tool-covers/covers/{slug}.svg`，`src/lib/covers/tool-cover.mjs` 按 slug 哈希确定性生成，14 个分类各配一个几何母题）
3. 首字母占位（`getToolInitials()`）

真实照片显示时必须叠一层暖色渐变遮罩（`.zh-tool-card-banner-photo::after`）让任意亮度的外部图片融入暗色主题；生成封面本身已按主题设计，不加遮罩。紧凑卡的图标位**永远用生成 SVG**，不用照片（64px 尺寸下照片会糊，品牌一致性优先）。

## 数据规范：真实数据，禁止假指标

**这是本文件最重要的一条规则**：首页在 2026-07-05 之前长期展示写死的演示数据（假工具、假阅读量"8.2K"、假分类计数"86+"），造成用户体验和实际收录内容严重不符。2026-07-09 已全部改为读取真实数据库内容。此后：

- 任何展示"数量、热度、阅读量、评分"等指标的 UI，要么接真实统计，要么不展示——**禁止编造占位数字**。
- 新页面/新区块默认从 `getPublishedTools()` / `getPublishedArticles()` 等真实数据源取数；确需占位演示（如空状态设计稿）也要在代码里明确标注 `// DEMO ONLY, do not ship`。
- `src/components/home/cosmic-home-data.ts` 现在**只允许**存放非内容性的静态配置（导航热词、广告位文案、分类图标映射），不允许再放任何模拟"工具/文章/榜单"内容。

## 内容资产标准：生成优先、守门写入

**2026-07-10 更新**：文章卡此前"纯排版、不配图"的规则已作废——文章现在也走和工具一样的封面机制：`generateToolCover()`（通用函数，不局限于工具）按标题/slug/分类生成确定性 SVG，存 `article-covers` 公开桶的 `covers/{slug}.svg`，`articles.cover_url` 写库，`ArticleCard` 用与 `CompactToolCard` 视觉一致的 cover-on-top 布局。文章没有官网，因此只有两级兜底（生成封面 → 首字母），没有工具那样的官方照片层。后台文章表单保存时同样自动生成兜底。

工具封面、图标、详情页富媒体统一走"零数据库改动 + Supabase Storage + 守门脚本"模式，不要为图文需求新增数据库表/列（要用户去控制台跑 SQL，违反本项目"用户不做任何运维操作"的约定）：

- 结构化元数据存 Storage 里的公开 JSON 文件（如 `tool-media/{slug}.json`），前端 `fetch(..., { cache: "no-store" })` 服务端读取，解析失败一律返回空，页面不因缺媒体而报错。
- 任何写 Supabase 的脚本必须遵循**守门脚本模式**（见 `scripts/content-import/` 下现有脚本）：默认 dry-run（离线或只读，输出报告 JSON）；`--execute` 才真正写入；service key 只从环境变量读（`SUPABASE_SERVICE_ROLE_KEY`），绝不写入文件、绝不打印；执行后读回验证。
- 视频一律用 **白名单域名 iframe 嵌入**（当前仅 bilibili / youtube），不自托管视频文件；嵌入 URL 必须经域名白名单校验，防止任意 iframe 注入。
- 含中文的文件写盘只用 Write 工具或 Node `fs.writeFileSync(path, text, "utf8")`；**禁止 PowerShell 默认重定向写中文文件**（历史事故：曾导致全部中文被写成字面 `?`，详见 `docs/TASK_LOG.md` 2026-07-03 条目）。

## 响应式规则

- 所有页面必须兼容手机端和电脑端。
- 手机端优先保证阅读和点击舒适；电脑端优先保证信息浏览效率。
- 不使用固定宽度导致横向滚动。
- 移动端按钮/可点区域高度不低于 `44px`。
- 断点沿用 Tailwind 默认：手机端默认布局，`md` 平板，`lg` 及以上电脑端；卡片网格常见断点为 1024px/900px/640-760px 三档收窄。

## 组件与目录约定

- 页面级组件放 `src/components/<page>/`；共享导航/页脚用 `SiteHeader`/`SiteFooter`（`src/components/site-header.tsx`、`site-footer.tsx`），**不要**再给某个页面写私有的 Header/Footer——2026-07-05 之前首页曾有一套独立的 `HomeNav`/`HomeFooter`，导致跳页时导航"跳变"，已删除统一。
- CSS 全部集中在 `src/app/globals.css`，用 `@layer components` 分区块、区块头尾用注释标出版本号（如 `/* Warm editorial homepage v1 */` ... `/* End ... */`），方便日后定位与整体删除。
- 类名前缀：全局结构用 `zh-`，页面专属样式用页面名前缀（`tool-detail-`、`articles-`、`search-warm-`、`submit-`、`copyright-`、`not-found-`）。
- 新增/删除组件后，**必须**同步 grep 确认关联 CSS 选择器是否变成死代码（`grep -rl 类名 src --include=*.tsx`，零匹配即可删），不要让样式规则比组件寿命更长——本文件所述的暖色编辑部方向已发生过一次这样的清理（2026-07-09，删除约 300 行死 CSS）。

## 验证标准

任何可视化改动收尾前必须：

1. `npx tsc --noEmit` 通过。
2. 起 dev server，用 Playwright 截图脚本（`scripts/capture-*.mjs`）对改动页面出桌面 + 移动截图，Read 工具查看确认。
3. 有数据结构改动时，用 node 直接 fetch 页面 HTML 做 DOM 断言（类名出现次数、乱码检测 `/\?{2,}/`、关键文案是否出现），比截图更适合做机器验证。
4. CSS 删除类改动，删前后各截一次图对比，确保零视觉回归（不能只凭 grep 判断死代码就直接删,要跑起来看）。
