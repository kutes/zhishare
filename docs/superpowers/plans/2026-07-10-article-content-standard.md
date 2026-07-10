# 文章内容标准落地 Implementation Plan

> **For agentic workers:** 执行本计划前必须先完整阅读 `docs/superpowers/specs/2026-07-10-article-content-standard-implementation-design.md`(下称 SPEC)——**所有代码、类型定义、CSS、正则都在 SPEC 里,本计划不重复**,只给任务边界、顺序与验证。SPEC 与本计划冲突时以 SPEC 为准并停下报告。

**Goal:** 把文章内容标准(速览框/来源披露/编号小节/lead+big 导语/WHY 框/KEY 高亮/图视频块)渲染出来,老文章零改动兼容。

**依赖顺序:** Task 1 → Task 2 → (Task 3、4、5 任意顺序) → Task 6 → Task 7 → Task 8

---

### Task 1: 类型与共享函数(SPEC「数据模型」+「其它调用点」节)

- Modify `src/components/articles/article-content.ts`:
  - [ ] 按 SPEC 替换 `ArticleSection` 为 `ArticleBlock` + 新 `ArticleSection`;`ArticleItem` 加 `tldr?: string[]`、`sourceNote?: string`(`cover_url` 已存在)
  - [ ] 新增 `getSectionPlainText`(SPEC 有完整代码)
  - [ ] 3 篇 mock 文章的 `sections` 重塑为新形状(文案原样照抄,只改包裹结构;段落全部 `weight:"normal"`)
- [ ] 此时 tsc 必然报错(其它文件还没跟上)——**属预期**,不用修,直接进 Task 2

### Task 2: 解析器重写(SPEC「解析器重写」节,11 步算法)

- Modify `src/lib/db/normalizers.ts`:
  - [ ] 重写 `parseArticleSections` 为状态机(严格按 SPEC 11 步;`getEmbedProvider` 从 `@/lib/media/tool-media` 具名导入)
  - [ ] `readArticleSections` 返回 `{ sections, tldr, sourceNote }`;`normalizeArticle` 解构赋值
- [ ] `npx tsc --noEmit` — 此时 articles-page/search-page/article-detail-page 仍会报错,进 Task 3/4

### Task 3: 渲染重写(SPEC「渲染组件重写」节,完整 JSX 在 SPEC)

- Modify `src/components/articles/article-detail-page.tsx`:
  - [ ] 补 `import type { ReactNode } from "react"`
  - [ ] 重写 `ArticleContentSection`,新增 `ArticleBlockView`、`renderBoldMarkup`
  - [ ] `.article-detail-sections` 之前插入速览框 + ⚑ 来源披露(SPEC 有 JSX)
  - [ ] 3 处文案修正:"共 N 个正文 section"→"共 N 节";侧栏"N 个 section"→"N 节";正文区头说明改为"按章节阅读，重点内容已用高亮框标出。"

### Task 4: 调用点同步(SPEC「其它调用点」节)

- [ ] `src/components/articles/articles-page.tsx` 与 `src/components/search/search-page.tsx` 的 section 摊平逻辑改用 `getSectionPlainText`

### Task 5: CSS(SPEC「CSS」节,完整代码在 SPEC)

- [ ] `src/app/globals.css` 在 `.article-detail-section-title` 附近追加 SPEC 全部新类(tldr/source-note/eyebrow/number/tag/lead/big/why/keypoint)
- [ ] `npx tsc --noEmit` 全绿 + 括号平衡检查
- [ ] Commit: `feat: implement article content standard rendering (types, parser, renderer, css)`

### Task 6: 解析器自检脚本

- Create `scripts/checks/check-article-parser.mjs`:
  - [ ] 由于解析器在 TS 文件里,自检走 HTTP:起 dev server 后 fetch 页面断言(老文章渲染出 lead/编号),另外用最小样例直接验证正则边界(速览收集、VIDEO 白名单拒绝、[来源] 仅文首)。**如实现时发现 node 无法直接 import TS,允许把纯解析函数抽到独立可测文件或改为页面级断言,二选一,不许跳过验证**
- [ ] 跑通后 Commit

### Task 7: 一篇真实文章按新标准重写(端到端验证)

- [ ] 重写 `free-ai-tools-safety` 的 content(加:速览 3-4 条、⚑ 来源披露、每节 [标签]、开篇 lead+big、1 个 [WHY]、2 个 [KEY]),中文过反乱码门
- [ ] 守门更新脚本(dry-run→execute,service key 环境变量)写回 DB
- [ ] Commit

### Task 8: 验证与记录

- [ ] `npm run capture:articles`,Read 双端截图核对:编号节/lead 加大/big 仅开篇/WHY/KEY/速览框/⚑ 披露视觉全部符合暖色编辑部
- [ ] 老文章(未重写的)页面正常、无重复标题
- [ ] COSMIC_REDESIGN_LOG 追加 Step 59;TASK_LOG 追加当日条目;Commit
