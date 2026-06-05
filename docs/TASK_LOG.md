# TASK_LOG

## 2026-06-04

任务：修复首页搜索框与 `/search` URL 参数联动。

改动文件：
- `src/components/home/home-search-section.tsx`
- `src/app/search/page.tsx`
- `src/components/search/search-page.tsx`
- `docs/TASK_LOG.md`

检查与修复：
- 开发前已阅读 `docs/PROJECT_RULES.md`、`docs/DESIGN_SYSTEM.md`、`docs/DATABASE_SCHEMA.md`、`docs/ANTI_ENTROPY.md`、`docs/TASK_LOG.md`。
- 修复首页搜索区：输入关键词后提交会跳转到 `/search?q=关键词`。
- 首页搜索关键词使用 `encodeURIComponent` 生成查询参数。
- 首页搜索区空关键词提交会跳转到 `/search`。
- 首页搜索表单增加 `action` 和 `method="get"` 作为原生表单兜底，避免提交到 `/?q=...`。
- 首页热门标签从页面内锚点改为 `/search?q=...` 链接。
- `/search` 页面读取 URL 参数 `q`，例如 `/search?q=published` 会自动填充搜索框并展示匹配结果。
- `/search` 页面保留现有手动输入搜索、热门关键词、筛选和搜索结果卡片逻辑。
- 未修改搜索数据来源、后台、数据库结构、Supabase RLS、工具详情页和文章详情页。
- 已运行 `npm run lint`，通过。
- 已运行 `npm run build`，通过。
- 已清理 `.next` 并重新启动 `npm run dev -- -p 3000`。
- 已用浏览器检查首页搜索表单：空关键词点击搜索后跳转 `/search`，无错误页。
- 已用浏览器检查首页热门标签链接均为编码后的 `/search?q=...`，旧的 `#featured-tools` 链接已移除。
- 已用浏览器检查 `/search?q=published`：搜索框自动显示 `published`，并显示 `Published Test Tool`，工具结果按钮为“查看详情”。
- 已确认 `/search?q=published` 未出现“查看官网”或“访问官方网站”，页面无横向滚动。

下一步：
- 手动在首页搜索框输入 `published`，点击“搜索”或按 Enter，确认地址变为 `/search?q=published` 且结果正常显示。

## 2026-06-04

任务：检查并修复文章前台数据联动与搜索页数据联动。

改动文件：
- `src/app/articles/page.tsx`
- `src/app/articles/[slug]/page.tsx`
- `src/app/search/page.tsx`
- `src/lib/db/articles.ts`
- `src/types/article.ts`
- `docs/TASK_LOG.md`

检查与修复：
- 开发前已阅读 `docs/PROJECT_RULES.md`、`docs/DESIGN_SYSTEM.md`、`docs/DATABASE_SCHEMA.md`、`docs/ANTI_ENTROPY.md`、`docs/TASK_LOG.md`。
- 确认 `/articles` 使用 `getPublishedArticles()` 读取 Supabase `articles` 表数据。
- 确认 `/articles/[slug]` 使用 `getArticleBySlug(slug)` 读取 Supabase `articles` 表数据。
- 确认 `/search` 同时使用 `getPublishedTools()` 和 `getPublishedArticles()`，不是纯 mock 数据。
- 将 `/articles`、`/articles/[slug]`、`/search` 标记为 `dynamic = "force-dynamic"`，避免构建时把 Supabase 数据静态固化，确保后台新增或编辑 published 内容后前台能按请求更新。
- 移除 `/articles/[slug]` 的 `generateStaticParams()`，让后台新增的 published 文章 slug 能直接打开详情页。
- `getPublishedArticles()` 继续只查询 `status = "published"`，排序改为优先 `updated_at` 倒序，再按 `created_at` 倒序。
- `getPublishedArticles()` 查询失败时输出 `console.error("getPublishedArticles error:", error)`，并返回空数组。
- `getArticleBySlug(slug)` 查询时同时要求 `slug` 和 `status = "published"`，查询失败时输出 `console.error("getArticleBySlug error:", error)`，查不到时返回 `null`。
- `getRelatedArticles(categoryId, currentArticleId)` 在 `categoryId` 为空时返回空数组，查询失败时输出错误并返回空数组。
- 文章详情页相关推荐只传 `article.category_id`，避免把“未分类”等展示文案当作 uuid 查询。
- 补充 `PublishedArticle` 类型兼容字段：`content`、`cover_url`、`status`，继续兼容 `category_id`、`created_at`、`updated_at` 可选。
- 已使用匿名 Supabase 客户端只读检查当前环境：`articles` 共 2 篇，published 2 篇，draft 0 篇；`tools` 共 3 个，published 3 个，draft 0 个。
- 已运行 `npm run lint`，通过。
- 已运行 `npm run build`，通过；构建结果确认 `/articles`、`/articles/[slug]`、`/search` 均为动态渲染。
- 已清理 `.next` 并重新启动 `npm run dev -- -p 3000`。
- 已用浏览器检查 `/articles` 显示 Supabase published 文章：“如何判断一个 AI 工具是否值得使用？”和“在线工具站适合收录哪些内容？”。
- 已用浏览器检查 `/articles/how-to-choose-ai-tools` 可打开，正文、广告位和版权声明正常显示。
- 已用浏览器检查 `/articles/not-public-or-missing` 显示“没有找到这篇文章”和“返回文章列表”，没有错误页。
- 已用浏览器检查 `/search` 初始状态显示 Supabase published 工具和文章。
- 已用浏览器检查 `/search` 搜索 `AI` 可匹配 published 工具 `ChatGPT` 和 published 文章“如何判断一个 AI 工具是否值得使用？”。
- 已确认 `/search` 工具结果按钮为“查看详情”，文章结果按钮为“阅读全文”，未出现“查看官网”或“访问官方网站”。
- 已确认 `/articles`、`/articles/[slug]`、`/search` 未发现横向滚动。

下一步：
- 如需继续验收 draft 排除效果，可在后台新增一篇 `status = draft` 的文章，确认 `/articles`、`/articles/[slug]`、`/search` 均不展示该文章。

## 2026-06-04

任务：前后台数据联动验收与修复。

改动文件：
- `src/lib/db/tools.ts`
- `src/lib/db/articles.ts`
- `src/components/home/home-article-card.tsx`
- `docs/TASK_LOG.md`

检查与修复：
- 开发前已阅读 `docs/PROJECT_RULES.md`、`docs/DESIGN_SYSTEM.md`、`docs/DATABASE_SCHEMA.md`、`docs/ADMIN_RULES.md`、`docs/ANTI_ENTROPY.md`、`docs/TASK_LOG.md`。
- 检查前台页面与组件链路：`/`、`/tools`、`/tools/[slug]`、`/articles`、`/articles/[slug]`、`/search`。
- 修复前台 Supabase 数据读取策略：缺少 Supabase 配置时仍保留 mock 兜底；一旦 Supabase 已配置但查询失败，不再回退到 mock，改为返回空数组或 `null`，避免后台删除、草稿状态或查询错误被假数据掩盖。
- 确认 `getPublishedTools()`、`getToolBySlug(slug)`、`getRelatedTools(categoryId, currentToolId)` 的前台读取仍限定 `status = "published"`。
- 确认 `getPublishedArticles()`、`getArticleBySlug(slug)`、`getRelatedArticles(categoryId, currentArticleId)` 的前台读取仍限定 `status = "published"`。
- 修复首页最新文章卡片链接：从 `/articles/${article.id}` 改为 `/articles/${article.slug}`，避免后台文章的 uuid `id` 被误当作详情页 slug。
- 文本检查确认前台工具列表、首页工具卡片和搜索工具结果使用“查看详情”，未出现“查看官网”。
- 文本检查确认“访问官方网站”只出现在工具详情组件，且官网链接带 `target="_blank"` 与 `rel="nofollow noopener noreferrer"`。
- 检查工具详情页和文章详情页仍包含 `AdPlaceholder` 与 `CopyrightNotice`，相关推荐为空时不会崩溃。
- 已使用匿名 Supabase 客户端只读 count 检查当前环境：`tools` 总数 0、`articles` 总数 0，因此当前前台显示友好空状态是正常结果。
- 已运行 `npm run lint`，通过。
- 已运行 `npm run build`，通过。
- build 后发现当前 dev 服务缓存被覆盖导致首页请求缺失 chunk，已停止本项目 dev 进程、删除 `.next`、重新启动 `npm run dev -- -p 3000`。
- 已检查 `/`、`/tools`、`/articles`、`/search` 均可打开，无错误页、无横向滚动，并显示空状态或广告位。

下一步：
- 在后台新增一条 `status = published` 的工具和文章后，前台 `/tools`、`/articles`、首页和 `/search` 应显示；新增 `status = draft` 的工具和文章后，前台不应显示。
- 如果 published 内容仍不显示，优先检查 Supabase RLS 是否允许匿名用户读取 `tools`、`articles`、`categories`、`tags` 及关系表。

## 2026-06-04

任务：后台功能统一验收与修复。

改动文件：
- `src/app/admin/login/page.tsx`
- `src/app/admin/page.tsx`
- `src/app/admin/tools/page.tsx`
- `src/app/admin/tools/new/page.tsx`
- `src/app/admin/tools/[id]/edit/page.tsx`
- `src/app/admin/articles/page.tsx`
- `src/app/admin/articles/new/page.tsx`
- `src/app/admin/articles/[id]/edit/page.tsx`
- `src/app/admin/categories/page.tsx`
- `src/app/admin/tags/page.tsx`
- `src/components/admin/AdminShell.tsx`
- `src/lib/db/admin-errors.ts`
- `src/lib/db/tools.ts`
- `src/lib/db/articles.ts`
- `src/lib/db/categories.ts`
- `src/lib/db/tags.ts`
- `src/lib/db/submissions.ts`
- `src/lib/db/reports.ts`
- `src/lib/supabase/client.ts`
- `docs/ADMIN_RULES.md`
- `docs/TASK_LOG.md`

检查与修复：
- 开发前已阅读 `docs/PROJECT_RULES.md`、`docs/DESIGN_SYSTEM.md`、`docs/DATABASE_SCHEMA.md`、`docs/ADMIN_RULES.md`、`docs/ANTI_ENTROPY.md`、`docs/TASK_LOG.md`。
- 检查后台页面：`/admin/login`、`/admin`、`/admin/tools`、`/admin/articles`、`/admin/categories`、`/admin/tags`、`/admin/submissions`、`/admin/reports`。
- 确认后台跳转使用相对路径，没有硬编码 `localhost:3000` 或 `localhost:3001`。
- 给后台登录检查增加超时兜底，避免页面永久停留在“正在检查登录状态”或“正在验证登录状态”。
- 正常未登录时不再把 `Auth session missing` 当作页面错误展示；未登录访问后台管理页会跳转到 `/admin/login?next=admin`。
- 新增 `src/lib/db/admin-errors.ts`，统一处理后台友好错误提示。
- Supabase RLS 或权限类错误统一显示：`权限不足，请检查 Supabase RLS 配置。`
- 工具、文章、分类、标签、投稿、投诉的后台数据函数保留真实错误 `console.error`，页面显示友好中文提示。
- 工具、文章、分类、标签后台数据层改为复用统一 Supabase browser client，避免重复创建 GoTrueClient。
- 后台首页菜单移除已完成入口上的误导性“待开放”标记。
- 已运行 `npm run lint`，通过。
- 已运行 `npm run build`，通过。
- 已清理 `.next` 并重启 `npm run dev -- -p 3000`。
- 已检查后台 8 个页面在 `http://localhost:3000` 均返回 200。
- 已用浏览器确认 `/admin/login` 显示登录表单，未登录访问 `/admin/reports` 会跳转到 `/admin/login?next=admin`，且不会卡在验证状态。

下一步：
- 使用真实管理员账号登录后，逐页测试新增、编辑、删除、状态切换是否受 Supabase RLS policy 正确允许；如果后台写入或管理失败，优先检查对应表的 authenticated `select`、`insert`、`update`、`delete` policy。

## 2026-06-04

任务：制作后台投诉管理 `/admin/reports`。

改动文件：
- `src/app/admin/reports/page.tsx`
- `src/components/admin/AdminShell.tsx`
- `src/lib/db/reports.ts`
- `src/types/report.ts`
- `docs/ADMIN_RULES.md`
- `docs/TASK_LOG.md`

检查方式：

- 开发前已阅读 `docs/PROJECT_RULES.md`、`docs/DESIGN_SYSTEM.md`、`docs/DATABASE_SCHEMA.md`、`docs/ADMIN_RULES.md`、`docs/ANTI_ENTROPY.md`、`docs/TASK_LOG.md`。
- 本次只做 `reports` 表后台管理，不修改前台页面、`/copyright` 页面、`/submit` 页面、工具后台、文章后台、分类后台、标签后台、投稿后台、数据库结构、邮件通知、复杂工单系统、自动下架内容和复杂权限。
- 新增 `/admin/reports` 投诉管理页。
- 页面包含投诉管理标题、说明、全部投诉数量、`pending` 数量、`reviewed` 数量、`resolved` 数量、`rejected` 数量。
- 投诉列表读取 Supabase `reports` 表真实数据，并按 `created_at` 倒序显示。
- 投诉列表显示权利人或机构、联系邮箱、涉及页面、问题类型、证明材料摘要、处理要求摘要、状态、提交时间和操作按钮。
- 支持页面内展开查看详情，不创建单独详情页。
- 涉及页面链接如为 `http` 或 `https` 链接，会新窗口打开，并带 `rel="nofollow noopener noreferrer"`。
- 联系邮箱显示为 `mailto:` 链接。
- 状态兼容显示数据库里的其他值，但后台按钮只允许更新为 `pending`、`reviewed`、`resolved`、`rejected`。
- `pending` 显示为“待处理”，`reviewed` 显示为“已查看”，`resolved` 显示为“已处理”，`rejected` 显示为“已拒绝”。
- 列表中长文本 `proof` 和 `request` 只显示摘要，详情展开后完整展示。
- `src/lib/db/reports.ts` 新增 `getAdminReports()`、`updateReportStatus(id, status)`、`deleteReport(id)`。
- `updateReportStatus` 只更新 `status` 字段，不更新投诉内容字段。
- `deleteReport` 只根据 `id` 删除。
- 更新状态和删除投诉出错时，会在控制台输出真实 Supabase 错误，页面只显示友好提示。
- 删除投诉前会二次确认。
- `AdminShell` 中“投诉管理”入口改为已开放。
- 未使用、未暴露、未打印 `service_role_key`。
- 已运行 `npm run lint`，通过。
- 已运行 `npm run build`，通过。

下一步：

- 在 Supabase 中确认 `reports` 表允许已登录用户执行 `select`、`update`、`delete`；如果后台读取或操作失败，需要检查对应 RLS policy。

## 2026-06-04

任务：制作后台投稿管理 `/admin/submissions`。

改动文件：
- `src/app/admin/submissions/page.tsx`
- `src/components/admin/AdminShell.tsx`
- `src/lib/db/submissions.ts`
- `src/types/submission.ts`
- `docs/ADMIN_RULES.md`
- `docs/TASK_LOG.md`

检查方式：

- 开发前已阅读 `docs/PROJECT_RULES.md`、`docs/DESIGN_SYSTEM.md`、`docs/DATABASE_SCHEMA.md`、`docs/ADMIN_RULES.md`、`docs/ANTI_ENTROPY.md`、`docs/TASK_LOG.md`。
- 本次只做 `submissions` 表后台管理，不修改前台页面、`/submit` 页面、工具后台、文章后台、分类后台、标签后台、数据库结构、一键转工具、邮件通知、批量操作和复杂权限。
- 新增 `/admin/submissions` 投稿管理页。
- 页面包含投稿管理标题、说明、全部投稿数量、`pending` 数量、`reviewed` 数量、`rejected` 数量。
- 投稿列表读取 Supabase `submissions` 表真实数据，并按 `created_at` 倒序显示。
- 投稿列表显示工具名称、官网地址、工具简介、推荐理由、推荐人邮箱、状态、提交时间和操作按钮。
- 支持页面内展开查看详情，不创建单独详情页。
- 官网地址如为 `http` 或 `https` 链接，会新窗口打开，并带 `rel="nofollow noopener noreferrer"`。
- 状态兼容显示数据库里的其他值，但后台按钮只允许更新为 `pending`、`reviewed`、`rejected`。
- `pending` 显示为“待处理”，`reviewed` 显示为“已查看”，`rejected` 显示为“已拒绝”。
- `src/lib/db/submissions.ts` 新增 `getAdminSubmissions()`、`updateSubmissionStatus(id, status)`、`deleteSubmission(id)`。
- `updateSubmissionStatus` 只更新 `status` 字段，不更新投稿内容字段。
- `deleteSubmission` 只根据 `id` 删除。
- 更新状态和删除投稿出错时，会在控制台输出真实 Supabase 错误，页面只显示友好提示。
- 删除投稿前会二次确认。
- `AdminShell` 中“投稿管理”入口改为已开放。
- 未使用、未暴露、未打印 `service_role_key`。
- 已运行 `npm run lint`，通过。
- 已运行 `npm run build`，通过。

下一步：

- 在 Supabase 中确认 `submissions` 表允许已登录用户执行 `select`、`update`、`delete`；如果后台读取或操作失败，需要检查对应 RLS policy。

## 2026-06-04

任务：制作后台标签管理 `/admin/tags`。

改动文件：
- `src/app/admin/tags/page.tsx`
- `src/components/admin/AdminShell.tsx`
- `src/lib/db/tags.ts`
- `src/types/tag.ts`
- `docs/ADMIN_RULES.md`
- `docs/TASK_LOG.md`

检查方式：

- 开发前已阅读 `docs/PROJECT_RULES.md`、`docs/DESIGN_SYSTEM.md`、`docs/DATABASE_SCHEMA.md`、`docs/ADMIN_RULES.md`、`docs/ANTI_ENTROPY.md`、`docs/TASK_LOG.md`。
- 本次只做 `tags` 表后台管理，不修改前台页面、工具后台、文章后台、分类后台、投稿审核、数据库结构、多角色权限和路由结构。
- 新增 `/admin/tags` 标签管理页。
- 页面包含标签管理标题、说明、新增标签区域、标签列表、编辑标签和删除标签功能。
- 标签列表读取 Supabase `tags` 表真实数据，并按创建时间倒序展示。
- 标签表单字段包含 `name` 和 `slug`。
- 新增和编辑标签时，`name` 与 `slug` 必填。
- slug 自动生成规则：英文转小写、空格转短横线、去掉特殊符号；中文名称无法生成稳定 slug 时 fallback 为 `tag-${Date.now()}`。
- slug 重复时返回友好错误：“slug 已存在，请换一个 slug。”
- 新增或编辑成功后会清空表单或退出编辑状态，并刷新标签列表。
- 删除标签前会二次确认。
- 如果标签正在被工具或文章使用，删除失败时显示：“该标签可能正在被工具或文章使用，请先调整相关内容后再删除。”
- `src/lib/db/tags.ts` 新增 `getAdminTags()`、`createTag(data)`、`updateTag(id, data)`、`deleteTag(id)`。
- 保存 payload 只包含 `name` 和 `slug`，不传 `id`、`created_at` 或数据库不存在字段。
- `createTag` / `updateTag` / `deleteTag` 出错时会在控制台输出真实 Supabase 错误。
- `AdminShell` 中“标签管理”入口改为已开放，其它未实现后台入口继续显示“待开放”。
- 未使用、未暴露、未打印 `service_role_key`。
- 已运行 `npm run lint`，通过。
- 已运行 `npm run build`，通过。

下一步：

- 在 Supabase 中确认 `tags` 表允许已登录用户执行 `select`、`insert`、`update`、`delete`；如果后台写入失败，需要检查对应 RLS policy。

## 2026-06-04

任务：制作后台分类管理 `/admin/categories`。

改动文件：
- `src/app/admin/categories/page.tsx`
- `src/components/admin/AdminShell.tsx`
- `src/lib/db/categories.ts`
- `src/types/category.ts`
- `docs/ADMIN_RULES.md`
- `docs/TASK_LOG.md`

检查方式：

- 开发前已阅读 `docs/PROJECT_RULES.md`、`docs/DESIGN_SYSTEM.md`、`docs/DATABASE_SCHEMA.md`、`docs/ADMIN_RULES.md`、`docs/ANTI_ENTROPY.md`、`docs/TASK_LOG.md`。
- 本次只做 `categories` 表后台管理，不修改前台页面、工具后台、文章后台、标签后台、投稿审核、数据库结构、多角色权限和路由结构。
- 新增 `/admin/categories` 分类管理页。
- 页面包含分类管理标题、说明、新增分类区域、分类列表、编辑分类和删除分类功能。
- 分类列表读取 Supabase `categories` 表真实数据，并按 `created_at` 倒序显示。
- 分类表单字段包含 `name`、`slug`、`description`。
- 新增和编辑分类时，`name` 与 `slug` 必填，`description` 可选。
- slug 自动生成规则：英文转小写、空格转短横线、去掉特殊符号；中文名称无法生成稳定 slug 时 fallback 为 `category-${Date.now()}`。
- slug 重复时返回友好错误：“slug 已存在，请换一个 slug。”。
- 新增或编辑成功后会清空表单或退出编辑状态，并刷新分类列表。
- 删除分类前会二次确认。
- 如果分类正在被工具或文章使用，删除失败时显示：“该分类可能正在被工具或文章使用，请先调整相关内容后再删除。”。
- `src/lib/db/categories.ts` 新增 `createCategory(data)`、`updateCategory(id, data)`、`deleteCategory(id)`，并完善 `getAdminCategories()`。
- 保存 payload 只包含 `name`、`slug`、`description`；`description` 为空时写入 `null`。
- `createCategory` / `updateCategory` / `deleteCategory` 出错时会在控制台输出真实 Supabase 错误。
- `AdminShell` 中“分类管理”入口改为已开放，其它未实现后台入口继续显示“待开放”。
- 未使用、未暴露、未打印 `service_role_key`。
- 已运行 `npm run lint`，通过。
- 已运行 `npm run build`，通过。

下一步：

- 在 Supabase 中确认 `categories` 表允许已登录用户执行 `select`、`insert`、`update`、`delete`；如果后台写入失败，需要检查对应 RLS policy。

## 2026-06-04

任务：制作后台文章管理 `/admin/articles`。

改动文件：
- `src/app/admin/articles/page.tsx`
- `src/app/admin/articles/new/page.tsx`
- `src/app/admin/articles/[id]/edit/page.tsx`
- `src/components/admin/AdminArticleForm.tsx`
- `src/components/admin/AdminShell.tsx`
- `src/lib/db/articles.ts`
- `src/types/article.ts`
- `docs/ADMIN_RULES.md`
- `docs/TASK_LOG.md`

检查方式：

- 开发前已阅读 `docs/PROJECT_RULES.md`、`docs/DESIGN_SYSTEM.md`、`docs/DATABASE_SCHEMA.md`、`docs/ADMIN_RULES.md`、`docs/ANTI_ENTROPY.md`、`docs/TASK_LOG.md`。
- 本次只做 `articles` 表后台管理，不修改前台页面、工具后台、分类后台、标签后台、投稿审核、数据库结构、多角色权限和路由结构。
- 新增 `/admin/articles` 文章列表页，从 Supabase `articles` 表读取真实数据，按 `updated_at` 倒序显示。
- 文章列表显示文章标题、slug、分类、状态、更新时间和编辑/删除操作。
- 删除文章前会二次确认，删除失败显示友好提示。
- 新增 `/admin/articles/new`，支持新增文章并写入 `articles` 表。
- 新增 `/admin/articles/[id]/edit`，支持按 id 读取文章并更新 `articles` 表。
- 新增 `AdminArticleForm`，复用新增/编辑表单，并提供必填校验、封面图 URL 校验、状态校验、loading 状态和友好错误提示。
- 表单字段包含 title、slug、summary、content、cover_url、category_id、status。
- 正文内容当前使用 textarea，不做富文本编辑器、Markdown 预览、图片上传或标签绑定。
- `src/lib/db/articles.ts` 新增 `getAdminArticles()`、`getAdminArticleById(id)`、`createArticle(data)`、`updateArticle(id, data)`、`deleteArticle(id)`。
- insert/update 前会清理 payload：`category_id` 空值写入 `null`，`cover_url` 空值写入 `null`，`status` 异常时默认 `draft`。
- `createArticle` / `updateArticle` / `deleteArticle` 出错时会在控制台输出真实 Supabase 错误。
- slug 自动生成规则：英文转小写、空格转短横线、去掉特殊符号；中文标题无法生成稳定 slug 时 fallback 为 `article-${Date.now()}`。
- slug 重复时返回友好错误：“slug 已存在，请换一个 slug。”。
- `AdminShell` 中“文章管理”入口改为已开放，其它未实现后台入口继续显示“待开放”。
- 未使用、未暴露、未打印 `service_role_key`。
- 已运行 `npm run lint`，通过。
- 已运行 `npm run build`，通过。

下一步：

- 在 Supabase 中确认 `articles` 表允许已登录用户执行 `select`、`insert`、`update`、`delete`；如果后台写入失败，需要检查对应 RLS policy。

## 2026-06-04

任务：修复后台 `/admin/tools/new` 新增工具失败时无法定位真实原因的问题。

改动文件：
- `src/lib/db/tools.ts`
- `src/types/tool.ts`
- `src/types/database.ts`
- `src/app/admin/tools/[id]/edit/page.tsx`
- `src/components/admin/AdminToolForm.tsx`
- `docs/TASK_LOG.md`

检查与修复：

- 开发前已阅读 `docs/PROJECT_RULES.md`、`docs/DATABASE_SCHEMA.md`、`docs/ADMIN_RULES.md`、`docs/ANTI_ENTROPY.md`、`docs/TASK_LOG.md`。
- `createTool(data)` 现在会在写入前打印 `console.log("createTool payload:", payload)`。
- `createTool(data)` 失败时会打印 `console.error("createTool error:", error)`，并返回 Supabase 的 `error.message`。
- `updateTool(data)` 同步增加 `updateTool payload:` 和 `updateTool error:`，方便后续编辑页排查。
- 写入前增加 Supabase Auth session 检查；如果当前 client 没有登录态，会打印 `createTool auth error:` / `updateTool auth error:`。
- 修复 `category_id` 空字符串问题：`""`、`undefined`、`"none"` 都会转成 `null`。
- 修复 `website_url` 空字符串问题：未填写时写入 `null`。
- 修复 `cover_url` 写入：未填写时写入 `null`，填写时写入字符串。
- 同步 `tools.cover_url` 的前端类型，未改数据库 SQL 结构。
- 修复 slug 规范：自动 slug 只保留小写英文、数字和短横线；中文标题无法生成稳定 slug 时自动 fallback 为 `tool-${Date.now()}`。
- 修复 status：只允许 `draft` / `published`，为空或异常时默认 `draft`。
- 保存 payload 只包含允许写入的数据库字段：`title`、`slug`、`summary`、`description`、`website_url`、`cover_url`、`category_id`、`is_free`、`is_open_source`、`target_users`、`use_cases`、`pros`、`cons`、`risk_notice`、`status`、`updated_at`。
- 移除新增时 payload 中的 `name` 和 `created_at`，避免发送本次不允许的字段。
- 表单保存失败提示改为优先显示返回的错误信息，否则提示“保存失败，请检查控制台错误信息。”。
- 已运行 `npm run lint`，通过。
- 已运行 `npm run build`，通过。

下一步：

- 重新在 `/admin/tools/new` 测试新增工具；如果仍失败，优先查看浏览器控制台中的 `createTool payload:` 和 `createTool error:`。

## 2026-06-03

任务：制作后台工具管理 `/admin/tools`。

改动文件：
- `src/app/admin/tools/page.tsx`
- `src/app/admin/tools/new/page.tsx`
- `src/app/admin/tools/[id]/edit/page.tsx`
- `src/components/admin/AdminShell.tsx`
- `src/components/admin/AdminToolForm.tsx`
- `src/lib/db/tools.ts`
- `src/lib/db/categories.ts`
- `src/types/tool.ts`
- `docs/ADMIN_RULES.md`
- `docs/TASK_LOG.md`

检查方式：

- 开发前已阅读 `docs/PROJECT_RULES.md`、`docs/DESIGN_SYSTEM.md`、`docs/DATABASE_SCHEMA.md`、`docs/ADMIN_RULES.md`、`docs/ANTI_ENTROPY.md`、`docs/TASK_LOG.md`。
- 本次只做 `tools` 表后台管理，不修改前台页面、文章后台、分类后台、标签后台、数据库结构、多角色权限和路由结构。
- 新增 `/admin/tools` 工具列表页，从 Supabase `tools` 表读取真实数据，按 `updated_at` 倒序显示。
- 工具列表显示工具名称、slug、官网、分类、是否免费、是否开源、状态、更新时间和编辑/删除操作。
- 删除工具前会二次确认，删除失败显示友好提示。
- 新增 `/admin/tools/new`，支持新增工具并写入 `tools` 表。
- 新增 `/admin/tools/[id]/edit`，支持按 id 读取工具并更新 `tools` 表。
- 新增 `AdminShell`，为工具管理页面提供后台登录校验、侧边菜单、顶部栏、当前邮箱和退出登录按钮。
- 新增 `AdminToolForm`，复用新增/编辑表单，并提供必填校验、URL 校验、状态校验、loading 状态和友好错误提示。
- 表单字段包含 title、slug、summary、description、website_url、cover_url、category_id、is_free、is_open_source、target_users、use_cases、pros、cons、risk_notice、status。
- 当前数据库类型和文档未声明 `cover_url` 字段，本次不修改数据库结构，表单先保留该输入位，写入 payload 暂不包含 `cover_url`。
- 分类下拉从 `categories` 表读取，读取失败时页面不崩溃。
- `src/lib/db/tools.ts` 新增 `getAdminTools()`、`getAdminToolById(id)`、`createTool(data)`、`updateTool(id, data)`、`deleteTool(id)`。
- 未使用、未暴露、未打印 `service_role_key`。
- 已运行 `npm run build`，通过。

下一步：

- 如果后台新增、编辑、删除失败，需要在 Supabase 中为已登录用户配置 `tools` 表的 `insert`、`update`、`delete` RLS policy。

## 2026-06-03

任务：修复 `/admin` 后台首页统计卡片读取真实 Supabase 数量。

改动文件：
- `src/app/admin/page.tsx`
- `src/lib/db/admin.ts`
- `src/lib/db/admin-stats.ts`
- `docs/TASK_LOG.md`

检查与修复：

- 新增 `src/lib/db/admin.ts`，集中实现后台统计读取函数 `getAdminStats()`。
- `getAdminStats()` 返回格式为 `{ tools, articles, submissions, reports }`。
- 工具数量使用 Supabase count 查询 `tools` 表。
- 文章数量使用 Supabase count 查询 `articles` 表。
- 投稿数量使用 Supabase count 查询 `submissions` 表。
- 投诉数量使用 Supabase count 查询 `reports` 表。
- 每项统计都使用 `{ count: "exact", head: true }`，不读取大量数据。
- 任意单项查询失败时，该项返回 `0`，并在控制台输出错误，页面不显示技术错误。
- `/admin` 后台首页改为从 `src/lib/db/admin.ts` 读取统计。
- `src/lib/db/admin-stats.ts` 改为转发 `src/lib/db/admin.ts`，避免保留两套统计逻辑。
- 保持现有 `/admin` 登录保护逻辑不变，不做 CRUD，不改前台页面。
- 已执行 `npm run lint`，通过。
- 已执行 `npm run build`，通过。
- 已清理 `.next` 并重启 3001 端口 dev 服务。

下一步：

- 登录 `/admin` 后检查投稿数量是否和 Supabase `submissions` 表行数一致。
- 如果 `submissions` 表有数据但后台仍显示 `0`，需要检查 Supabase RLS 是否允许当前已登录管理员对 `submissions` 执行 `select/count`。

## 2026-06-03

任务：后台登录与后台首页基础验收修复。

改动文件：
- `src/app/admin/login/page.tsx`
- `src/app/admin/page.tsx`
- `src/lib/db/admin-stats.ts`
- `docs/ADMIN_RULES.md`
- `docs/TASK_LOG.md`

检查与修复：

- `/admin/login` 保持 Supabase Auth 邮箱密码登录。
- `/admin/login` 登录状态检查改为使用 Supabase `auth.getUser()`。
- `/admin/login` 保留登录失败友好提示、登录中 loading、提交中禁用按钮。
- `/admin/login` 密码输入框保持 `type="password"`。
- `/admin` 权限保护改为使用 Supabase `auth.getUser()` 获取当前用户。
- `/admin` 在用户校验完成前只显示权限检查提示，不显示后台菜单、统计卡片或管理内容。
- 未登录访问 `/admin` 会跳转到 `/admin/login?next=admin`。
- `/admin` 顶部栏显示当前登录邮箱，并提供退出登录按钮。
- 退出登录调用 Supabase `auth.signOut()`，失败时显示友好提示，不做前端假退出。
- 后台菜单补齐：后台首页、工具管理、文章管理、分类管理、标签管理、投稿管理、投诉管理、返回前台。
- 未实现的后台菜单项显示“待开放”，保留后续路由结构，不做 CRUD。
- `getAdminStats()` 增加 Supabase 当前用户校验，未登录不会读取统计。
- `getAdminStats()` 继续读取 `tools`、`articles`、`submissions`、`reports` 四张表真实数量。
- 统计读取失败时返回 0 和友好提示，控制台输出错误用于开发调试。
- 已执行 `npm run lint`，通过。
- 已执行 `npm run build`，通过。
- 已清理 `.next` 并重启 3001 端口 dev 服务。
- 已用浏览器检查未登录访问 `/admin`：最终停在 `/admin/login?next=admin`，没有出现后台统计内容。
- 已用浏览器检查 `/admin/login`：CSS 正常加载，无横向滚动。

下一步：

- 使用 Supabase Auth 中的管理员邮箱密码手动登录，确认 `/admin` 是否显示当前邮箱和四个统计卡片真实数量。
- 如果统计卡片为 0 或提示读取失败，需要检查 Supabase RLS 是否允许已登录用户读取 `tools`、`articles`、`submissions`、`reports`。

## 2026-06-03

任务：创建后台登录 `/admin/login` 和后台首页 `/admin`。

改动文件：
- `src/app/admin/login/page.tsx`
- `src/app/admin/page.tsx`
- `src/lib/db/admin-stats.ts`
- `docs/ADMIN_RULES.md`
- `docs/TASK_LOG.md`

检查与实现：

- 新增 `/admin/login`，使用 Supabase Auth 邮箱密码登录。
- 登录页使用客户端表单提交，包含邮箱、密码、登录中状态、失败提示。
- 登录成功后跳转到 `/admin`。
- 新增 `/admin` 后台首页，客户端检查 Supabase session。
- 未登录访问 `/admin` 会自动跳转到 `/admin/login?next=admin`。
- 后台首页包含左侧菜单、顶部栏、退出登录按钮。
- 后台首页显示统计卡片：工具数量、文章数量、投稿数量、投诉数量。
- 新增 `getAdminStats()`，读取 `tools`、`articles`、`submissions`、`reports` 四张表的 count。
- 后台统计只使用 Supabase anon client 搭配当前登录 session，不使用 `service_role_key`。
- 菜单中的工具管理、文章管理、投稿审核、投诉处理当前只作为占位入口，不做 CRUD。
- 已更新 `docs/ADMIN_RULES.md`，记录当前后台阶段规则。
- 已执行 `npm run lint`，通过。
- 已执行 `npm run build`，通过。
- 已重启 3001 端口 dev 服务并清理 `.next` 缓存，避免 build 和 dev 缓存混用造成资源异常。
- 已用浏览器检查 `/admin/login`：样式加载正常，无横向滚动。
- 已用浏览器检查未登录访问 `/admin`：会跳转到 `/admin/login?next=admin`。

下一步：

- 使用 Supabase Auth 中已创建的管理员邮箱密码登录，确认 `/admin` 统计卡片是否能读到真实数量。
- 如果统计卡片读取失败，需要检查 Supabase RLS 是否允许已登录管理员读取 `tools`、`articles`、`submissions`、`reports`。

## 2026-06-03

任务：紧急修复前台样式资源 404 和表单默认 GET 提交问题。

改动文件：
- `src/app/submit/page.tsx`
- `src/app/copyright/page.tsx`
- `docs/TASK_LOG.md`

检查文件：
- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/lib/db/submissions.ts`
- `src/lib/db/reports.ts`

检查与修复：

- 确认 `src/app/layout.tsx` 已正确引入 `./globals.css`，并保留 `<html lang="zh-CN">` 与 `<body>` 结构。
- 确认 `src/app/globals.css` 顶部保留 Tailwind 基础指令，且全站浅色渐变背景、`overflow-x: hidden`、`glass-card` 等通用样式有效。
- 为 `/submit` 表单增加 `method="post"`，避免 React 尚未加载或水合异常时回退成默认 GET 查询提交。
- 确认 `/submit` 已使用 `"use client"`、`onSubmit={handleSubmit}`、`event.preventDefault()`、提交中 loading、成功提示和失败提示。
- 为 `/copyright` 表单增加 `method="post"`，避免 React 尚未加载或水合异常时回退成默认 GET 查询提交。
- 确认 `/copyright` 已使用 `"use client"`、`onSubmit={handleSubmit}`、`event.preventDefault()`、提交中 loading、成功提示和失败提示。
- 确认 `createSubmission(data)` 使用匿名 Supabase client 写入 `submissions` 表，并默认写入 `status: "pending"`。
- 确认 `createReport(data)` 使用匿名 Supabase client 写入 `reports` 表，并默认写入 `status: "pending"`。
- 已执行 `npm run lint`，通过。
- 已执行 `npm run build`，通过。
- 已停止本地 3000 端口 dev 服务，确认 `.next` 位于当前项目目录后删除缓存，并重新启动 dev 服务。
- 已用浏览器检查 `/submit` 与 `/copyright`：CSS 已加载，玻璃卡片样式生效，页面不再是纯 HTML。
- 已用浏览器检查空表单点击提交：URL 不再出现 `?toolName=...` 或 `?ownerName=...` 的默认 GET 提交形式。
- 已用浏览器检查 `/submit` 与 `/copyright` 手机端无横向滚动。

下一步：

- 如果真实提交仍写入失败，需要检查 Supabase 中 `submissions` 和 `reports` 表是否存在，并确认 RLS 是否允许匿名 insert。

## 2026-06-03

任务：接入 `/submit` 投稿页和 `/copyright` 版权投诉页的数据写入。

改动文件：

- `src/app/submit/page.tsx`
- `src/app/copyright/page.tsx`
- `src/lib/db/submissions.ts`
- `src/lib/db/reports.ts`
- `src/types/submission.ts`
- `src/types/report.ts`
- `src/types/database.ts`
- `docs/DATABASE_SCHEMA.md`
- `docs/TASK_LOG.md`

检查方式：

- 开发前已阅读 `docs/PROJECT_RULES.md`、`docs/DESIGN_SYSTEM.md`、`docs/DATABASE_SCHEMA.md`、`docs/ANTI_ENTROPY.md`、`docs/TASK_LOG.md`。
- 新增 `createSubmission(data)`，写入 `submissions` 表。
- 新增 `createReport(data)`，写入 `reports` 表。
- 两个写入函数都使用现有 Supabase anon client，不使用 `service_role_key`。
- `/submit` 字段映射为 `tool_name`、`website_url`、`summary`、`reason`、`email`、`status`。
- `/submit` 默认写入 `status = pending`。
- `/submit` 增加工具名称、官方地址、工具简介必填校验。
- `/submit` 增加官方地址必须为 `http` 或 `https` 链接的校验。
- `/submit` 增加可选邮箱格式校验。
- `/submit` 提交中按钮显示“提交中...”，并禁止重复点击。
- `/submit` 成功后显示“提交成功，我们会进行人工审核后决定是否收录。”并清空表单。
- `/submit` 失败后显示“提交失败，请稍后重试。”，不向用户展示技术错误。
- `/copyright` 字段映射为 `owner_name`、`email`、`page_url`、`issue_type`、`proof`、`request`、`status`。
- `/copyright` 默认写入 `status = pending`。
- `/copyright` 增加权利人、邮箱、页面链接、问题类型、处理要求必填校验。
- `/copyright` 增加邮箱格式校验。
- `/copyright` 增加涉及页面链接必须为 `http` 或 `https` 链接的校验。
- `/copyright` 提交中按钮显示“提交中...”，并禁止重复点击。
- `/copyright` 成功后显示“反馈已提交，我们会在核实后及时处理。”并清空表单。
- `/copyright` 失败后显示“提交失败，请稍后重试。”，不向用户展示技术错误。
- 已更新 `docs/DATABASE_SCHEMA.md`，补充 `submissions`、`reports` 表和 RLS 注意事项。
- 未修改首页、工具页、文章页、搜索页、Header、Footer、后台、Supabase 读取逻辑、视觉设计系统和路由结构。
- 已运行 `npm run lint`，通过。
- 已运行 `npm run build`，通过。
- 已重启 `npm run dev`，并确认 `/submit` 和 `/copyright` 返回 200。
- 已用浏览器检查 `/submit` 空表单校验、URL 格式校验、邮箱格式校验正常。
- 已用浏览器检查 `/copyright` 空表单校验、URL 格式校验、邮箱格式校验正常。
- 已用浏览器检查 `/submit` 和 `/copyright` 手机端无横向滚动。

下一步：

- 如果表单提交失败，需要到 Supabase 给 `submissions` 和 `reports` 表添加允许匿名 `insert` 的 RLS policy。

## 用途

记录每次小任务的执行情况，方便以后回看项目为什么变成现在这样。

## 记录规则

- 每完成一个小步骤，都在本文档追加记录。
- 记录内容包括日期、任务、改动文件、检查方式、下一步。
- 不写无关闲聊，只保留项目事实。

## 2026-05-31

任务：项目初始化检查并创建基础文档。

改动文件：

- `docs/PROJECT_RULES.md`
- `docs/ROADMAP.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/DATABASE_SCHEMA.md`
- `docs/CONTENT_RULES.md`
- `docs/ADMIN_RULES.md`
- `docs/CHANGELOG.md`
- `docs/TASK_LOG.md`
- `docs/ANTI_ENTROPY.md`

检查方式：

- 查看仓库文件结构。
- 确认当前仓库只有 `.git`，尚未初始化 Next.js 项目文件。

下一步：

- 初始化 Next.js App Router + TypeScript + Tailwind CSS 项目骨架。

## 2026-05-31

任务：制作静态首页。

改动文件：

- `.gitignore`
- `eslint.config.mjs`
- `package.json`
- `package-lock.json`
- `next.config.ts`
- `postcss.config.mjs`
- `tailwind.config.ts`
- `tsconfig.json`
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/data/mock-tools.ts`
- `src/data/mock-articles.ts`
- `src/components/home-page.tsx`
- `src/components/site-header.tsx`
- `src/components/hero-section.tsx`
- `src/components/search-panel.tsx`
- `src/components/category-grid.tsx`
- `src/components/featured-tools.tsx`
- `src/components/tool-card.tsx`
- `src/components/latest-articles.tsx`
- `src/components/article-card.tsx`
- `src/components/site-footer.tsx`
- `docs/TASK_LOG.md`

检查方式：

- 确认首页代码拆分到 `src/components`。
- 确认假数据位于 `src/data/mock-tools.ts` 和 `src/data/mock-articles.ts`。
- 已运行 `npm run lint`。
- 已运行 `npm run build`。
- 已启动 `npm run dev`，并在浏览器检查电脑端和手机端布局。
- 电脑端和手机端视口均未发现横向溢出。

下一步：

- 继续检查首页文案和卡片内容，确认是否需要调整分类、工具和文章的展示信息。

## 2026-05-31

任务：制作工具列表页 `/tools`。

改动文件：

- `src/app/tools/page.tsx`
- `src/components/tools/tools-page.tsx`
- `src/components/tools/tools-hero.tsx`
- `src/components/tools/tools-filter-panel.tsx`
- `src/components/tools/tools-grid.tsx`
- `src/components/tools/tools-card.tsx`
- `src/components/tools/tools-no-results.tsx`
- `src/components/site-header.tsx`
- `docs/TASK_LOG.md`

检查方式：

- 使用 `src/data/mock-tools.ts` 假数据。
- 不连接数据库。
- 已运行 `npm run lint`。
- 已运行 `npm run build`。
- 已启动 `npm run dev` 后打开 `/tools`。
- 已检查搜索功能，可匹配工具标题、简介、分类和标签。
- 已检查分类筛选和标签筛选。
- 已检查无结果提示。
- 已检查响应式布局：电脑端 3 栏，平板端 2 栏，手机端 1 栏。
- 电脑端、平板端和手机端视口均未发现横向溢出。

下一步：

- 检查工具列表页的筛选文案和默认假数据是否需要补充。

## 2026-05-31

任务：调整工具展示逻辑，新增工具详情页。

改动文件：

- `src/data/mock-tools.ts`
- `src/components/tools/tools-card.tsx`
- `src/components/tool-card.tsx`
- `src/app/tools/[slug]/page.tsx`
- `src/components/tools/tool-detail-page.tsx`
- `src/components/common/CopyrightNotice.tsx`
- `docs/TASK_LOG.md`

检查方式：

- 列表页工具卡片改为“查看详情”，不再直接显示官网按钮。
- 详情页使用 `src/data/mock-tools.ts` 假数据。
- 详情页官网按钮仅在存在 `website_url` 时显示。
- 外部官网链接使用新窗口打开，并设置 `rel="nofollow noopener noreferrer"`。
- 已运行 `npm run lint`。
- 已运行 `npm run build`。
- 已启动 `npm run dev` 后检查 `/tools` 和 `/tools/raycast`。
- 已检查 `/tools` 有 6 个“查看详情”入口，未显示官网按钮。
- 已检查“查看详情”可跳转到 `/tools/raycast`。
- 已检查详情页包含主要内容区、相关推荐、统一版权声明和 2 个“访问官方网站”按钮。
- 已检查详情页电脑端和手机端视口均未发现横向溢出。

下一步：

- 检查详情页内容结构是否需要继续补充真实运营字段。

## 2026-05-31

任务：优化 `/tools` 页面视觉设计。

改动文件：

- `src/components/tools/tools-page.tsx`
- `src/components/tools/tools-hero.tsx`
- `src/components/tools/tools-filter-panel.tsx`
- `src/components/tools/tools-card.tsx`
- `docs/TASK_LOG.md`

检查方式：

- 仅调整 `/tools` 页面视觉层，不修改筛选业务逻辑。
- 不连接数据库。
- 不修改路由结构。
- 不新增依赖。
- 保持工具卡片按钮为“查看详情”，不显示“查看官网”。
- 已运行 `npm run lint`。
- 已运行 `npm run build`。
- 已启动 `npm run dev` 后检查 `/tools` 电脑端、平板端和手机端布局。
- 已检查电脑端 3 栏、平板端 2 栏、手机端 1 栏。
- 电脑端、平板端和手机端视口均未发现横向溢出。
- 已检查页面未出现“查看官网”。

下一步：

- 根据实际浏览效果继续微调工具卡片内容密度和筛选项数量。

## 2026-05-31

任务：彻底重新设计 `/tools` 页面视觉。

改动文件：

- `src/components/tools/tools-page.tsx`
- `src/components/tools/tools-grid.tsx`
- `src/components/tools/ToolsHero.tsx`
- `src/components/tools/ToolsFilterPanel.tsx`
- `src/components/tools/ToolCard.tsx`
- `src/components/tools/ToolsGridHeader.tsx`
- `src/components/tools/tools-hero.tsx`
- `src/components/tools/tools-filter-panel.tsx`
- `src/components/tools/tools-card.tsx`
- `docs/TASK_LOG.md`

检查方式：

- 保留现有搜索、筛选和跳转详情功能。
- 不连接数据库。
- 不修改路由结构。
- 不新增依赖。
- 使用指定组件拆分文件。
- 已运行 `npm run lint`。
- 已运行 `npm run build`。
- 已启动 `npm run dev` 后检查 `/tools` 电脑端、平板端和手机端布局。
- 已检查电脑端 3 栏、平板端 2 栏、手机端 1 栏。
- 电脑端、平板端和手机端视口均未发现横向溢出。
- 已检查分类筛选和标签筛选。
- 已检查“查看详情”可跳转到详情页。
- 已检查页面未出现“查看官网”。

下一步：

- 继续根据实际视觉效果微调首屏高度、筛选面板密度和工具卡片文案长度。

## 2026-05-31

任务：以 Apple 官网设计理念重写 `/tools` 页面 UI。

改动文件：

- `src/components/tools/tools-page.tsx`
- `src/components/tools/tools-grid.tsx`
- `src/components/tools/ToolsHero.tsx`
- `src/components/tools/ToolsFilterPanel.tsx`
- `src/components/tools/ToolCard.tsx`
- `src/components/tools/ToolsGridHeader.tsx`
- `docs/TASK_LOG.md`

检查方式：

- 保留现有搜索、分类筛选、标签筛选和跳转详情功能。
- 不连接数据库。
- 不修改后台。
- 不修改 mock 数据来源。
- 不新增依赖。
- 页面不出现“查看官网”。
- 已运行 `npm run lint`。
- 已运行 `npm run build`。
- 已启动 `npm run dev` 后检查 `/tools` 桌面端、平板端和手机端布局。
- 已检查电脑端 3 栏、平板端 2 栏、手机端 1 栏。
- 已检查搜索 `Markdown` 可筛选出 `Obsidian`。
- 已检查分类筛选 `开源项目` 可筛选出 `Supabase` 和 `LocalSend`。
- 已检查标签筛选 `PostgreSQL` 可筛选出 `Supabase`。
- 已检查“查看详情 →”可跳转到 `/tools/raycast`。
- 电脑端、平板端和手机端视口均未发现横向溢出。

下一步：

- 根据实际浏览效果继续微调 Apple 式留白、卡片内容密度和移动端首屏高度。

## 2026-05-31

任务：对 `/tools` 页面进行高阶视觉重构。

改动文件：

- `src/components/tools/tools-page.tsx`
- `src/components/tools/ToolsHero.tsx`
- `src/components/tools/ToolsFilterPanel.tsx`
- `src/components/tools/ToolCard.tsx`
- `src/components/tools/ToolsGridHeader.tsx`
- `docs/TASK_LOG.md`

检查方式：

- 保留现有搜索、分类筛选、标签筛选和跳转详情功能。
- 不连接数据库。
- 不修改路由结构。
- 不新增依赖。
- 页面不出现“查看官网”。
- 已运行 `npm run lint`。
- 已运行 `npm run build`。
- 已启动 `npm run dev` 后检查 `/tools` 桌面端、平板端和手机端布局。
- 已检查电脑端 3 栏、平板端 2 栏、手机端 1 栏。
- 已检查移动端 Hero 改为上下布局，概览卡弱化为简洁统计卡。
- 已检查搜索 `Markdown` 可筛选出 `Obsidian`。
- 已检查分类筛选 `开源项目` 可筛选出 `Supabase` 和 `LocalSend`。
- 已检查标签筛选 `PostgreSQL` 可筛选出 `Supabase`。
- 已检查“查看详情”可跳转到 `/tools/raycast`。
- 电脑端、平板端和手机端视口均未发现横向溢出。

下一步：

- 继续根据真实内容数量微调分类统计、卡片文案长度和移动端首屏信息密度。

## 2026-05-31

任务：大幅重构 `/tools` 页面 Hero 过渡与移动端概览展示。

改动文件：

- `src/components/tools/tools-page.tsx`
- `src/components/tools/ToolsHero.tsx`
- `src/components/tools/ToolCard.tsx`
- `docs/TASK_LOG.md`

检查方式：

- 保留现有搜索、分类筛选、标签筛选和跳转详情功能。
- 不连接数据库。
- 不修改路由结构。
- 不新增依赖。
- Hero 底部增加长柔和渐变过渡层，弱化深色区域与浅色内容区硬切。
- 移动端隐藏完整“已整理工具”概览卡，改为高度较低的横条统计。
- 工具卡片强化玻璃态、hover 上浮和青蓝微光。
- 已运行 `npm run lint`。
- 已运行 `npm run build`。
- 已启动 `npm run dev` 后检查 `/tools` 桌面端、平板端和手机端布局。
- 已检查桌面端保留右侧概览卡，移动端仅显示“已收录 6 个工具 + LIVE”横条。
- 已检查电脑端 3 栏、平板端 2 栏、手机端 1 栏。
- 已检查搜索 `Markdown` 可筛选出 `Obsidian`。
- 已检查分类筛选 `开源项目` 可筛选出 `Supabase` 和 `LocalSend`。
- 已检查“查看详情”可跳转到 `/tools/raycast`。
- 电脑端、平板端和手机端视口均未发现横向溢出。

下一步：

- 使用真实移动设备尺寸继续确认首屏高度和筛选面板露出比例。

## 2026-05-31

任务：创建统一版权声明组件。

改动文件：

- `src/components/common/CopyrightNotice.tsx`
- `docs/TASK_LOG.md`

检查方式：

- 更新统一版权声明文案。
- 组件支持 `className` 参数，方便后续复用。
- 工具详情页已在底部调用 `CopyrightNotice`。
- 当前项目未发现 `/articles/[slug]` 文章详情页，因此未新增文章详情页引用。
- 已运行 `npm run lint`。
- 已运行 `npm run build`。

下一步：

- 创建文章详情页时，在页面底部复用 `CopyrightNotice`。

## 2026-05-31

任务：创建广告占位组件并接入工具详情页。

改动文件：

- `src/components/common/AdPlaceholder.tsx`
- `src/components/tools/tool-detail-page.tsx`
- `docs/TASK_LOG.md`

检查方式：

- 新增广告占位组件，支持 `sidebar`、`banner`、`inline` 三种尺寸。
- 工具详情页右侧栏电脑端显示 `sidebar` 广告位。
- 工具详情页正文中间显示 `inline` 广告位。
- 工具详情页底部显示 `banner` 广告位。
- 仅显示“广告位”，不接入真实广告代码。
- 已运行 `npm run lint`。
- 已运行 `npm run build`。
- 已重启 `npm run dev` 并检查 `/tools/raycast`。
- 桌面端可见 3 个广告位：右侧栏、正文中间、底部横幅。
- 手机端可见 2 个广告位：正文中间、底部横幅；右侧栏广告已隐藏。
- 详情页未发现横向滚动。

下一步：

- 后续接入真实广告时，保持广告组件统一替换，不在页面内分散写广告代码。

## 2026-05-31

任务：升级全站视觉设计系统文档。

改动文件：

- `docs/DESIGN_SYSTEM.md`
- `docs/TASK_LOG.md`

检查方式：

- 仅更新设计文档，不修改页面代码。
- 已加入浅色高级风格、留白、渐变分区、液态玻璃卡片、按钮、广告位和移动端规范。
- 已明确首页和工具页的分区规则。
- 已保留响应式、排版和组件化基础规则。

下一步：

- 后续改造首页、工具页和详情页视觉时，严格按新版 `DESIGN_SYSTEM.md` 执行。

## 2026-05-31

任务：升级全站基础视觉样式。

改动文件：

- `src/app/globals.css`
- `docs/TASK_LOG.md`

检查方式：

- 仅修改全站基础 CSS，不改业务逻辑。
- 不修改数据库。
- 不修改后台。
- 不新增依赖。
- 添加全站浅色渐变背景。
- 添加 `glass-card` 通用玻璃拟态卡片类。
- 添加 `section-gradient-blue`、`section-gradient-cyan`、`section-gradient-violet` 通用分区渐变类。
- 添加 `soft-shadow` 通用柔和阴影类。
- 添加 `soft-card-hover` 通用 hover 上浮效果。
- 添加 `page-shell` 页面最大宽度容器类。
- 添加 `section-block` 统一分区间距类。
- 已运行 `npm run lint`。
- 已运行 `npm run build`。
- 已重启 `npm run dev` 并检查 `/tools/raycast` 正常打开。
- 已确认全站浅色渐变背景生效。
- 已确认详情页未发现横向滚动。

下一步：

- 后续升级首页和详情页视觉时，优先复用这些全站基础 class，避免页面内重复写样式。

## 2026-05-31

任务：重做首页视觉设计。

改动文件：

- `src/components/home-page.tsx`
- `src/components/hero-section.tsx`
- `src/components/search-panel.tsx`
- `src/components/category-grid.tsx`
- `src/components/featured-tools.tsx`
- `src/components/tool-card.tsx`
- `src/components/latest-articles.tsx`
- `src/components/article-card.tsx`
- `src/components/common/AdPlaceholder.tsx`
- `docs/TASK_LOG.md`

检查方式：

- 不连接数据库。
- 不修改后台。
- 不新增依赖。
- 不改变已有路由。
- 首页 Hero 使用 `section-gradient-blue`，并加入玻璃态数据看板。
- 搜索区使用独立 `glass-card`，搜索框和按钮尺寸加强。
- 分类区使用 `section-gradient-cyan`，分类卡片使用 `glass-card` 和 hover 上浮。
- 推荐工具区使用浅色渐变背景，工具卡片使用 `glass-card`，按钮文案保持“查看详情”。
- 最新文章区使用 `section-gradient-violet`，文章卡片改为玻璃卡片。
- 推荐工具区和最新文章区之间已插入 `AdPlaceholder` 广告位。
- 广告位文案为“合作推广”和“此处可展示赞助工具、精选服务或广告内容”。
- 已运行 `npm run lint`。
- 已运行 `npm run build`。
- 已重启 `npm run dev` 并检查首页 `/`。
- 已检查桌面端首页 Hero 标题、广告位和“查看详情”按钮正常显示。
- 已检查首页没有出现“查看官网”。
- 已检查手机端 Hero 标题为 `36px`，未超过移动端限制。
- 已检查桌面端和手机端均未发现横向滚动。

下一步：

- 继续按新版设计系统逐步优化工具详情页和文章详情页视觉。

## 2026-06-01

任务：重做 `/tools` 工具库页面视觉设计。

改动文件：

- `src/components/tools/tools-page.tsx`
- `src/components/tools/ToolsHero.tsx`
- `src/components/tools/ToolsFilterPanel.tsx`
- `src/components/tools/ToolsGridHeader.tsx`
- `src/components/tools/tools-grid.tsx`
- `src/components/tools/ToolCard.tsx`
- `src/components/tools/tools-no-results.tsx`
- `docs/TASK_LOG.md`

检查方式：

- 不连接数据库。
- 不修改后台。
- 不新增依赖。
- 不改变 mock 数据结构。
- 保留原有搜索、分类筛选、标签筛选、清空筛选和详情跳转逻辑。
- 工具库 Hero 改为 `section-gradient-blue` 浅色渐变分区。
- Hero 标题更新为“发现实用、可靠、来源清晰的数字工具”。
- Hero 右侧新增 `glass-card` 数据卡，展示当前收录数量、分类数量和持续更新状态。
- 搜索与筛选区改为 `glass-card`，搜索框放大，筛选胶囊选中态使用青蓝渐变。
- 结果统计区改为独立玻璃卡片。
- 工具卡片使用 `glass-card` 和 `soft-card-hover`，保留“查看详情”，不显示“查看官网”。
- 工具列表第 6 个工具后插入横向 `AdPlaceholder` 广告位；少于 6 个时放在列表下方。
- 空状态改为 `glass-card`，文案更新为“没有找到匹配的工具”和“可以尝试减少筛选条件或换一个关键词。”。
- 已运行 `npm run lint`。
- 已运行 `npm run build`。
- 已重启 `npm run dev` 并检查 `/tools`。
- 已检查桌面端 Hero 标题、副标题、广告位和 6 个“查看详情”按钮正常显示。
- 已检查 `/tools` 没有出现“查看官网”。
- 已检查广告位位于第 6 个工具之后。
- 已检查搜索 `Markdown` 可筛选出 `Obsidian`，且不显示 `Raycast`。
- 已检查无结果状态显示指定文案。
- 已检查手机端 Hero 标题为 `36px`，卡片为单列布局。
- 已检查桌面端和手机端均未发现横向滚动。

下一步：

- 继续按新版设计系统逐步优化工具详情页视觉。

## 2026-06-01

任务：参考网络视觉资料后再次重改 `/tools` 工具库视觉效果。

改动文件：

- `src/app/globals.css`
- `src/components/tools/tools-page.tsx`
- `src/components/tools/ToolsHero.tsx`
- `src/components/tools/ToolsFilterPanel.tsx`
- `src/components/tools/ToolsGridHeader.tsx`
- `src/components/tools/ToolCard.tsx`
- `docs/TASK_LOG.md`

检查方式：

- 使用 Chrome 插件尝试查看 Liquid Glass / Glassmorphism 相关视觉参考。
- 参考方向：半透明材料、背景层次、细边框、柔和阴影、玻璃高光、内容可读性。
- 不连接数据库。
- 不修改后台。
- 不新增依赖。
- 不改变 `/tools` 业务逻辑、筛选逻辑和路由结构。
- 升级 `glass-card` 全站玻璃质感，增加饱和模糊、内高光和更柔和的液态阴影。
- 新增 `liquid-grid` 和 `liquid-panel` 通用视觉类。
- `/tools` Hero 增加液态玻璃信息块和更强背景层次。
- `/tools` 搜索筛选区改为浮动控制台视觉。
- `/tools` 工具卡片增加玻璃折射感、内层信息块和更明确的详情按钮。
- 已运行 `npm run lint`。
- 已运行 `npm run build`。
- 已重启 `npm run dev` 并检查 `/tools`。
- 已检查桌面端有 10 个 `glass-card` 和 5 个 `liquid-panel`，液态玻璃样式已生效。
- 已检查搜索 `Markdown` 可筛选出 `Obsidian`，且不显示 `Raycast`。
- 已检查页面未出现“查看官网”，仍保留 6 个“查看详情”按钮。
- 已检查广告位正常显示“合作推广”和“这里可以展示赞助工具或精选服务”。
- 已检查手机端标题为 `36px`，卡片为单列布局。
- 已检查桌面端和手机端均未发现横向滚动。
- 已保存检查截图：`.next-dev-logs/tools-liquid-desktop.png`、`.next-dev-logs/tools-liquid-mobile.png`。

下一步：

- 继续按新版视觉语言优化工具详情页。

## 2026-06-01

任务：检查并修复广告占位组件 `AdPlaceholder`。

改动文件：

- `src/components/common/AdPlaceholder.tsx`
- `src/components/home-page.tsx`
- `src/components/tools/tools-grid.tsx`
- `src/components/tools/tool-detail-page.tsx`
- `docs/TASK_LOG.md`

检查方式：

- 确认 `src/components/common/AdPlaceholder.tsx` 已存在。
- 将组件 props 统一为 `variant: "sidebar" | "banner" | "inline"`、`title?`、`description?`、`className?`。
- 默认文案更新为 `title: 合作推广`。
- 默认说明更新为 `description: 此处可展示赞助工具、精选服务或广告内容`。
- 保留 `glass-card`、虚线边框、低调广告样式和手机端自适应。
- 首页推荐工具区和最新文章区之间继续使用 `variant="banner"`。
- `/tools` 工具列表第 6 个工具后继续使用 `variant="banner"`。
- `/tools/[slug]` 详情页正文中间使用 `variant="inline"`，底部使用 `variant="banner"`，右侧栏使用 `variant="sidebar"`。
- 不接入真实广告代码。
- 不修改数据库。
- 不修改后台。
- 已运行 `npm run lint`。
- 已运行 `npm run build`。
- 已重启 `npm run dev` 并检查首页 `/`、工具库 `/tools`、工具详情页 `/tools/raycast`。
- 首页推荐工具区和最新文章区之间可见 1 个 banner 广告位。
- `/tools` 工具列表可见 1 个 banner 广告位。
- `/tools/raycast` 桌面端可见 3 个广告位：inline、banner、sidebar。
- `/tools/raycast` 手机端可见 2 个广告位：inline、banner；sidebar 已隐藏。
- 已确认默认文案“合作推广”和“此处可展示赞助工具、精选服务或广告内容”正常显示。
- 已确认首页、工具库页和详情页均未发现横向滚动。

下一步：

- 后续接入真实广告时，只替换 `AdPlaceholder` 内部实现，不在页面中分散写广告代码。

## 2026-06-01

任务：优化 `/tools/[slug]` 工具详情页视觉和广告位结构。

改动文件：

- `src/components/tools/tool-detail-page.tsx`
- `docs/TASK_LOG.md`

检查方式：

- 不连接数据库。
- 不修改后台。
- 不新增依赖。
- 不破坏已有路由。
- `CopyrightNotice` 组件已存在，详情页底部继续调用。
- 详情页 Hero 使用 `section-gradient-blue` 和 `glass-card`。
- Hero 已显示工具名称、一句话介绍、分类、标签、是否免费、是否开源和“访问官方网站”按钮。
- 正文主内容区放在左侧主栏，并使用 `glass-card` 包裹。
- 正文分块显示详细介绍、主要功能、适合人群、使用场景、优点、缺点和风险提示。
- 正文中间插入 `variant="inline"` 广告位。
- 页面底部插入 `variant="banner"` 广告位。
- 电脑端右侧插入 `variant="sidebar"` 广告位。
- 相关推荐放在右侧栏，手机端自然排到正文下方。
- 官网按钮使用 `target="_blank"` 和 `rel="nofollow noopener noreferrer"`。
- 已确认列表页相关组件未出现“查看官网”。
- 已运行 `npm run lint`。
- 已运行 `npm run build`。
- 已重启 `npm run dev` 并检查 `/tools/raycast`。
- 桌面端可见 3 个广告位：正文 inline、底部 banner、右侧 sidebar。
- 手机端可见 2 个广告位：正文 inline、底部 banner；右侧 sidebar 已隐藏。
- 已检查详情页有 2 个“访问官方网站”按钮。
- 已检查官网按钮均使用 `target="_blank"` 和 `rel="nofollow noopener noreferrer"`。
- 已检查详细介绍、主要功能、适合人群、使用场景、优点、缺点、风险提示、相关推荐和版权声明均正常显示。
- 已检查详情页未出现“查看官网”。
- 已检查桌面端和手机端均未发现横向滚动。

下一步：

- 继续按新版视觉语言优化文章详情页或后续后台内容管理。

## 2026-06-01

任务：更新统一版权声明组件。

改动文件：

- `src/components/common/CopyrightNotice.tsx`
- `docs/TASK_LOG.md`

检查方式：

- 更新版权声明组件文案。
- 使用 `glass-card` 样式。
- 字号偏小，颜色低调，边框柔和。
- 保留 `className` 参数，方便后续复用。
- 工具详情页已在底部引用 `CopyrightNotice`。
- 当前项目未发现 `/articles/[slug]` 文章详情页，因此本次无法添加文章详情页引用。
- 后续创建文章详情页时，必须在底部引用 `CopyrightNotice`。
- 已运行 `npm run lint`。
- 已运行 `npm run build`。
- 已重启 `npm run dev` 并检查 `/tools/raycast`。
- 已确认新版权声明文案正常显示。
- 已确认版权声明组件使用 `glass-card`。
- 已确认详情页未发现横向滚动。

下一步：

- 创建文章详情页时，在底部复用 `CopyrightNotice`。

## 2026-06-01

任务：升级全站基础视觉样式。

改动文件：

- `src/app/globals.css`
- `docs/TASK_LOG.md`

检查方式：

- 只修改 `src/app/globals.css`，未修改首页、工具库页、工具详情页、mock 数据、数据库、后台和路由结构。
- 已检查 `src/app/layout.tsx`，无需修改。
- 已确认 body 背景为浅色渐变。
- 已确认 body 文字颜色使用 `#0f172a`。
- 已在 `html` 和 `body` 上设置 `overflow-x: hidden`，并新增 `no-horizontal-scroll` 工具类。
- 已规范 `page-shell`、`section-block`、`glass-card`、`soft-card-hover`。
- 已新增 `glass-card-strong`、`section-gradient-soft`、`liquid-border`、`ad-glass`。
- 已保留现有 `section-gradient-blue`、`section-gradient-cyan`、`section-gradient-violet`。
- 已运行 `npm run lint`。
- 已运行 `npm run build`。
- 已重启 `npm run dev` 并检查首页 `/`、工具库 `/tools`、工具详情页 `/tools/raycast`。
- 已确认桌面端和手机端 body 背景均为浅色渐变。
- 已确认桌面端和手机端 body 文字颜色均为 `rgb(15, 23, 42)`。
- 已确认桌面端和手机端 `html`、`body` 的 `overflow-x` 均为 `hidden`。
- 已确认首页、工具库页和工具详情页在桌面端和手机端均未发现横向滚动。

下一步：

- 后续页面视觉升级优先复用这些全站基础样式，避免重复写局部 CSS。

## 2026-06-01

任务：重做首页视觉设计。

改动文件：

- `src/app/page.tsx`
- `src/components/home/home-page.tsx`
- `src/components/home/home-hero.tsx`
- `src/components/home/home-search-section.tsx`
- `src/components/home/home-category-section.tsx`
- `src/components/home/home-featured-tools.tsx`
- `src/components/home/home-tool-card.tsx`
- `src/components/home/home-latest-articles.tsx`
- `src/components/home/home-article-card.tsx`
- `docs/TASK_LOG.md`

检查方式：

- 不连接数据库。
- 不修改 `/tools` 页面。
- 不修改 `/tools/[slug]` 页面。
- 不修改后台、Supabase 相关代码和 mock 数据结构。
- 首页入口改为使用 `src/components/home/` 下的新首页组件。
- Hero 使用 `section-gradient-blue`、`page-shell` 和 `glass-card-strong` 数据看板。
- Hero 文案更新为“发现值得信任的数字工具”和指定副标题。
- Hero 标签更新为“来源清晰”“人工整理”“持续更新”“降低试错”。
- 搜索区使用 `glass-card-strong`，搜索框占位文案更新为指定文案。
- 分类区使用 `section-gradient-cyan`，分类卡片使用 `glass-card` 和 `soft-card-hover`。
- 推荐工具区使用 `section-gradient-soft`，工具卡片使用 `glass-card`，按钮文案为“查看详情”。
- 推荐工具区和最新文章区之间插入 `AdPlaceholder` banner 广告位。
- 最新文章区使用 `section-gradient-violet`，文章卡片使用 `glass-card`。
- 已运行 `npm run lint`。
- 已运行 `npm run build`。
- 已重启 `npm run dev` 并检查首页 `/`。
- 已检查桌面端首页标题、副标题、搜索占位文案、广告位和 6 个“查看详情”按钮正常显示。
- 已检查首页没有出现“查看官网”。
- 已检查桌面端分类区为 4 栏，推荐工具区和最新文章区为 3 栏。
- 已检查手机端 Hero 标题为 `36px`，Hero 改为上下布局，分类、工具和文章卡片均为单列。
- 已检查桌面端和手机端均未发现横向滚动。

下一步：

- 继续完善文章详情页或后台内容管理前，先保持首页和工具页视觉语言一致。

## 2026-06-01

任务：重做 `/tools` 工具库页面视觉设计。

改动文件：

- `src/components/tools/tools-page.tsx`
- `src/components/tools/ToolsHero.tsx`
- `src/components/tools/ToolsFilterPanel.tsx`
- `src/components/tools/ToolsGridHeader.tsx`
- `src/components/tools/tools-grid.tsx`
- `src/components/tools/ToolCard.tsx`
- `src/components/tools/tools-no-results.tsx`
- `docs/TASK_LOG.md`

检查方式：

- 不连接数据库。
- 不修改首页。
- 不修改 `/tools/[slug]` 详情页。
- 不修改后台、Supabase 相关代码、路由结构和 mock 数据结构。
- 保留原有搜索、分类筛选、标签筛选、清空筛选和详情跳转逻辑。
- 工具库 Hero 使用 `section-gradient-blue` 和 `page-shell`，右侧使用 `glass-card-strong` 数据卡。
- Hero 文案更新为“发现实用、可靠、来源清晰的数字工具”和指定副标题。
- Hero 标签更新为“AI 工具”“在线工具”“开源项目”“效率软件”“人工整理”。
- 搜索与筛选区使用 `glass-card-strong`，搜索占位文案更新为“搜索工具标题、简介、分类或标签”。
- 分类和标签筛选继续使用圆角胶囊按钮，选中状态使用青蓝渐变。
- 结果统计区改为轻量标题 + 玻璃统计标签。
- 工具卡片使用 `glass-card` 和 `soft-card-hover`，顶部展示分类与免费状态，底部保留“查看详情”按钮。
- 工具列表第 6 个工具后插入 `AdPlaceholder` banner 广告位。
- 广告位文案更新为“合作推广”和“这里可以展示赞助工具、精选服务或广告内容”。
- 空状态使用 `glass-card`，显示指定无结果文案和“清空筛选”按钮。
- 已运行 `npm run lint`。
- 已运行 `npm run build`。
- 已重启 `npm run dev` 并检查 `/tools`。
- 已检查 CSS 正常加载，桌面端工具卡片为 3 栏。
- 已检查分类筛选 `开源项目` 可筛选出 `Supabase` 和 `LocalSend`，且不显示 `Raycast`。
- 已检查分类和标签组合无结果时显示指定空状态文案。
- 已检查页面未出现“查看官网”，有 6 个“查看详情”入口，示例链接为 `/tools/raycast`。
- 已检查广告位正常显示指定文案。
- 已检查手机端 Hero 为上下布局，标题为 `36px`，工具卡片为单列。
- 已检查桌面端和手机端均未发现横向滚动。

下一步：

- 后续可继续创建文章列表页或文章详情页，保持与首页和工具库一致的视觉语言。

## 2026-06-01

任务：检查并修复广告占位组件 `AdPlaceholder`。

改动文件：

- `src/components/common/AdPlaceholder.tsx`
- `src/components/home/home-page.tsx`
- `src/components/tools/tools-grid.tsx`
- `src/components/tools/tool-detail-page.tsx`
- `docs/TASK_LOG.md`

检查方式：

- 确认 `src/components/common/AdPlaceholder.tsx` 已存在。
- 保留组件 props：`variant: "sidebar" | "banner" | "inline"`、`title?`、`description?`、`className?`。
- 保留默认文案：`title: 合作推广`、`description: 此处可展示赞助工具、精选服务或广告内容`。
- 广告组件统一使用 `ad-glass`、虚线边框、低调文字，并增加明确的“广告位”标识。
- `banner` 用于横向广告位，适合首页分区之间、工具列表中间和详情页底部。
- `sidebar` 用于详情页右侧广告栏，手机端自然变成普通横向卡片并排到正文下方。
- `inline` 用于详情页正文中间，保持较低高度，不干扰阅读。
- 首页推荐工具区和最新文章区之间继续插入 `variant="banner"` 广告位。
- `/tools` 工具列表第 6 个工具后继续插入 `variant="banner"` 广告位，并使用 `col-span-full` 横跨整行。
- `/tools/[slug]` 详情页包含 3 个广告位：正文中间 `inline`、底部 `banner`、右侧栏 `sidebar`。
- 不接入真实广告平台，不加入广告脚本。
- 不修改数据库、后台、Supabase 相关代码、mock 数据结构和路由结构。
- 已运行 `npm run lint`。
- 已运行 `npm run build`。
- 已重启 `npm run dev`。
- 已检查首页 `/`、工具库 `/tools`、工具详情页 `/tools/raycast` 均返回 200。
- 已使用浏览器检查首页桌面端有 1 个广告位，文案为“合作推广”和“此处可展示赞助工具、精选服务或广告内容”。
- 已使用浏览器检查 `/tools` 桌面端和手机端均有 1 个广告位，文案为“合作推广”和“这里可以展示赞助工具、精选服务或广告内容”。
- 已使用浏览器检查 `/tools` 广告位在 grid 中 `grid-column` 为 `1 / -1`，可横跨整行。
- 已使用浏览器检查 `/tools/raycast` 桌面端和手机端均有 3 个广告位。
- 已确认首页、工具库页和工具详情页均未发现横向滚动。

下一步：

- 后续接入真实广告或联盟链接时，只替换 `AdPlaceholder` 内部实现，页面中继续复用统一组件。

## 2026-06-01

任务：优化 `/tools/[slug]` 工具详情页视觉和广告位结构。

改动文件：

- `src/app/tools/[slug]/page.tsx`
- `src/components/tools/tool-detail-page.tsx`
- `docs/TASK_LOG.md`

检查方式：

- 不连接数据库。
- 不修改首页。
- 不修改 `/tools` 工具列表页。
- 不修改后台、Supabase 相关代码、路由结构和 mock 数据结构。
- 详情页 Hero 使用 `section-gradient-blue`、`page-shell` 和 `glass-card-strong`。
- Hero 显示工具名称、一句话介绍、分类、标签、是否免费、是否开源和“访问官方网站”按钮。
- 官网按钮仅在存在 `website_url` 时显示。
- 官网按钮使用 `target="_blank"` 和 `rel="nofollow noopener noreferrer"`。
- 正文主内容区使用 `page-shell`，电脑端为左侧主内容 + 右侧广告栏两栏布局。
- 主内容使用 `glass-card`，并按顺序显示详细介绍、主要功能、适合人群、使用场景、优点、缺点和风险提示。
- 在“主要功能”和“适合人群”之间插入 `AdPlaceholder variant="inline"`。
- 右侧广告栏插入 `AdPlaceholder variant="sidebar"`，电脑端 sticky，手机端自然排到正文下方。
- 正文结束后新增底部官网访问 CTA，标题为“准备访问这个工具？”。
- 相关推荐移动到页面底部，仅推荐同分类工具，最多 3 个，卡片使用 `glass-card`，按钮文案为“查看详情”。
- 相关推荐之后插入 `AdPlaceholder variant="banner"`。
- 最底部继续显示 `CopyrightNotice`。
- 找不到工具时显示友好空状态，文案为“没有找到这个工具”和“你可以返回工具库重新浏览。”，并提供“返回工具库”按钮。
- 已运行 `npm run lint`。
- 已运行 `npm run build`。
- 已重启 `npm run dev` 并检查 `/tools/raycast` 和 `/tools/not-exist` 均返回 200。
- 已使用浏览器检查 `/tools/raycast` 桌面端有 3 个广告位，2 个“访问官方网站”按钮。
- 已使用浏览器检查 `/tools/raycast` 官网按钮均使用 `target="_blank"` 和 `rel="nofollow noopener noreferrer"`。
- 已使用浏览器检查 `/tools/raycast` 未出现“查看官网”。
- 已使用浏览器检查 `/tools/raycast` 手机端标题为 `36px`，页面无横向滚动。
- 已使用浏览器检查正文分块顺序正确，inline 广告位位于“主要功能”和“适合人群”之间。
- 已使用浏览器检查 `/tools/supabase` 有同分类相关推荐，并显示“查看详情”按钮。
- 已使用浏览器检查 `/tools/not-exist` 显示友好空状态和“返回工具库”按钮。

下一步：

- 后续可以创建文章详情页，并复用同一套广告、版权和底部推荐结构。

## 2026-06-01

任务：统一优化文章列表页 `/articles` 和文章详情页 `/articles/[slug]`。

改动文件：

- `src/app/articles/page.tsx`
- `src/app/articles/[slug]/page.tsx`
- `src/components/articles/article-content.ts`
- `src/components/articles/articles-page.tsx`
- `src/components/articles/articles-hero.tsx`
- `src/components/articles/articles-filter-panel.tsx`
- `src/components/articles/articles-grid.tsx`
- `src/components/articles/article-card.tsx`
- `src/components/articles/articles-no-results.tsx`
- `src/components/articles/article-detail-page.tsx`
- `docs/TASK_LOG.md`

检查方式：

- 不连接数据库。
- 不修改首页。
- 不修改 `/tools` 页面。
- 不修改 `/tools/[slug]` 页面。
- 不修改后台、Supabase 相关代码、路由结构和 mock 数据结构。
- 由于 `src/data/mock-articles.ts` 只有基础列表字段，本次在 `src/components/articles/article-content.ts` 中做详情内容、标签和 slug 兼容补充，未改原 mock 文件。
- 新增 `/articles` 文章列表页。
- 新增 `/articles/[slug]` 文章详情页。
- 文章列表 Hero 使用 `section-gradient-violet`、`page-shell` 和 `glass-card-strong` 数据卡。
- 文章列表筛选区使用 `glass-card-strong`，支持搜索、分类筛选、标签筛选、显示当前文章数量和清空筛选。
- 文章卡片使用 `glass-card` 和 `soft-card-hover`，按钮文案为“阅读全文”，链接到 `/articles/[slug]`。
- 文章列表广告位使用 `AdPlaceholder variant="banner"`，少于 6 篇时放在列表下方，并使用 `col-span-full` 横跨整行。
- 文章列表空状态使用 `glass-card`，显示“没有找到匹配的文章”和“可以尝试减少筛选条件或换一个关键词。”。
- 文章详情页 Hero 使用 `section-gradient-violet`、`page-shell` 和 `glass-card-strong`。
- 文章详情页正文使用 `page-shell`，电脑端为左侧正文 + 右侧广告栏两栏布局，手机端为单列。
- 文章详情页正文使用 `glass-card`，排版使用较宽行距、清晰标题和列表。
- 文章详情页正文中部插入 `AdPlaceholder variant="inline"`。
- 文章详情页右侧栏插入 `AdPlaceholder variant="sidebar"`，手机端自然排到正文下方。
- 文章详情页相关推荐优先推荐同分类文章，最多 3 篇，按钮文案为“阅读全文”。
- 文章详情页相关推荐之后插入 `AdPlaceholder variant="banner"`。
- 文章详情页底部插入 `CopyrightNotice`。
- 找不到文章时显示友好空状态，文案为“没有找到这篇文章”和“你可以返回文章列表继续浏览。”，并提供“返回文章列表”按钮。
- 已运行 `npm run lint`。
- 已运行 `npm run build`。
- 已重启 `npm run dev` 并检查 `/articles`、`/articles/ai-tool-checklist`、`/articles/not-exist` 均返回 200。
- 已使用浏览器检查 `/articles` 桌面端文章卡片为 3 栏，手机端为 1 栏。
- 已使用浏览器检查 `/articles` Hero 标题、标签、内容看板、搜索占位文案和 banner 广告位正常显示。
- 已使用浏览器检查 `/articles` 广告位 `grid-column` 为 `1 / -1`，可横跨整行。
- 已使用浏览器检查 `/articles` 分类筛选 `开源项目` 可筛选出 1 篇文章。
- 已使用浏览器检查 `/articles` 分类与标签组合无结果时显示指定空状态。
- 已使用浏览器检查 `/articles/ai-tool-checklist` 桌面端有 3 个广告位，右侧正文布局为两栏。
- 已使用浏览器检查 `/articles/ai-tool-checklist` 手机端标题为 `36px`，页面无横向滚动。
- 已使用浏览器检查 `/articles/ai-tool-checklist` 显示版权声明。
- 已使用浏览器检查 `/articles/not-exist` 显示友好空状态和“返回文章列表”按钮。

下一步：

- 后续接入数据库时，将 `article-content.ts` 中的兼容详情字段迁移到真实文章表和后台表单。

## 2026-06-01

任务：统一优化顶部导航 Header 和底部 Footer。

改动文件：

- `src/components/layout/Header.tsx`
- `src/components/layout/MobileNav.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/site-header.tsx`
- `src/components/site-footer.tsx`
- `docs/TASK_LOG.md`

检查方式：

- 开发前已阅读 `docs/PROJECT_RULES.md`、`docs/DESIGN_SYSTEM.md`、`docs/ANTI_ENTROPY.md`、`docs/TASK_LOG.md`。
- 不修改首页内容、工具页、工具详情页、文章页、文章详情页、数据库、后台、Supabase 相关代码和 mock 数据。
- 新增 `src/components/layout/Header.tsx`，统一站点顶部导航。
- 新增 `src/components/layout/MobileNav.tsx`，用于手机端展开式菜单。
- 新增 `src/components/layout/Footer.tsx`，统一站点底部页脚。
- `src/components/site-header.tsx` 和 `src/components/site-footer.tsx` 改为兼容转发入口，避免逐个页面修改引用。
- Header 使用半透明玻璃背景、backdrop blur、浅边框和 sticky 顶部导航。
- Header 包含站点名“知享”、副标识“工具与知识发现站”、首页、工具库、文章、投稿、版权投诉、搜索、推荐工具。
- 当前页面导航项使用浅色胶囊/深色高亮状态。
- 手机端隐藏中间导航，显示“菜单”按钮，展开后使用 `glass-card` 风格移动菜单。
- Footer 使用浅色渐变背景和 `page-shell`，包含站点说明、快速访问、参与与反馈、内容原则和版权行。
- 已运行 `npm run lint`。
- 已运行 `npm run build`。
- 已重启 `npm run dev`。
- 已使用浏览器检查 `/articles` 桌面端 Header 为 sticky，backdrop blur 生效，主导航显示为横向布局。
- 已使用浏览器检查 `/articles` 桌面端当前导航项“文章”高亮。
- 已使用浏览器检查 Footer 包含“快速访问”“参与与反馈”“内容原则”和 `© 2026 知享. All rights reserved.`。
- 已使用浏览器检查 390px 手机端中间导航隐藏，移动菜单按钮可展开，菜单包含全部导航入口。
- 已使用浏览器检查 390px 手机端 Footer 为单列布局。
- 已确认桌面端和手机端均未发现横向滚动。

下一步：

- 后续可以补齐 `/search`、`/submit`、`/copyright` 页面，避免导航入口进入 404。

## 2026-06-01

任务：统一优化 `/submit` 投稿页和 `/copyright` 版权投诉页。

改动文件：

- `src/app/submit/page.tsx`
- `src/app/copyright/page.tsx`
- `docs/TASK_LOG.md`

检查方式：

- 开发前已阅读 `docs/PROJECT_RULES.md`、`docs/DESIGN_SYSTEM.md`、`docs/ANTI_ENTROPY.md`、`docs/TASK_LOG.md`。
- 不修改首页、工具页、工具详情页、文章页、文章详情页、Header、Footer、数据库、后台、Supabase 相关代码和 mock 数据。
- 新增 `/submit` 投稿页，使用 `section-gradient-cyan`、`page-shell`、`glass-card`、`glass-card-strong`。
- `/submit` Hero 文案为“推荐一个值得收录的工具”，并显示“人工审核”“优先官网”“拒绝破解盗版”“持续收录”标签。
- `/submit` 包含投稿说明区、投稿表单区和收录原则区。
- `/submit` 表单包含工具名称、官方地址、工具简介、推荐理由、推荐人邮箱。
- `/submit` 已做前台必填校验：工具名称、官方地址、工具简介。
- `/submit` 提交成功后显示前台演示成功提示，当前不连接数据库。
- 新增 `/copyright` 版权投诉页，使用 `section-gradient-violet`、`page-shell`、`glass-card`、`glass-card-strong`。
- `/copyright` Hero 文案为“版权与权益问题反馈”，并显示“版权反馈”“权益处理”“链接更正”“及时核实”标签。
- `/copyright` 包含处理说明区、投诉表单区和处理流程区。
- `/copyright` 表单包含权利人姓名或机构名称、联系邮箱、涉及页面链接、问题类型、证明材料说明、处理要求。
- `/copyright` 问题类型包含版权问题、商标问题、授权问题、信息错误、链接失效、其他问题。
- `/copyright` 已做前台必填校验：权利人姓名或机构名称、联系邮箱、涉及页面链接、问题类型、处理要求。
- `/copyright` 提交成功后显示前台演示成功提示，当前不连接数据库。
- 已运行 `npm run lint`。
- 已运行 `npm run build`。
- 已重启 `npm run dev`，并确认 `/submit` 和 `/copyright` 返回 200。
- 已使用浏览器检查 `/submit` 空表单提交会显示 3 条必填错误。
- 已使用浏览器检查 `/submit` 填写必填项后会显示成功提示。
- 已使用浏览器检查 `/copyright` 空表单提交会显示 5 条必填错误。
- 已使用浏览器检查 `/copyright` 填写必填项后会显示成功提示。
- 已使用浏览器检查 390px 手机端 `/submit` 和 `/copyright` 标题字号为 `36px`。
- 已使用浏览器检查 390px 手机端所有输入框和按钮宽度正常。
- 已确认桌面端和手机端均未发现横向滚动。

下一步：

- 后续可以继续制作 `/search` 搜索页，或在 Supabase 阶段把这两个表单接入审核数据表。

## 2026-06-02

任务：统一优化 `/search` 搜索页。

改动文件：

- `src/app/search/page.tsx`
- `src/components/search/search-page.tsx`
- `src/components/search/search-hero.tsx`
- `src/components/search/search-controls.tsx`
- `src/components/search/search-results.tsx`
- `docs/TASK_LOG.md`

检查方式：

- 开发前已阅读 `docs/PROJECT_RULES.md`、`docs/DESIGN_SYSTEM.md`、`docs/ANTI_ENTROPY.md`、`docs/TASK_LOG.md`。
- 不修改首页、工具页、工具详情页、文章页、文章详情页、投稿页、版权投诉页、Header、Footer、数据库、后台、Supabase 相关代码和 mock 数据结构。
- 新增 `/search` 搜索页入口。
- 新增 `src/components/search/` 目录，用于承载搜索页 Hero、搜索筛选区、结果区和空状态。
- 搜索页 Hero 使用 `section-gradient-blue`、`page-shell` 和 `glass-card-strong`。
- Hero 标题为“搜索工具、文章与效率技巧”，副标题和标签按任务要求设置。
- Hero 右侧提示卡显示“搜索建议”和 AI 写作、PDF 工具、开源项目、图片处理、效率软件。
- 主搜索区使用 `glass-card-strong`，搜索框占位文案为“搜索工具、文章、分类或标签”。
- 主搜索区包含“开始搜索”按钮、清空按钮和热门关键词胶囊。
- 热门关键词点击后会自动填入搜索框并触发搜索。
- 快速筛选区包含“全部”“只看工具”“只看文章”，选中状态使用青蓝渐变。
- 搜索范围覆盖工具名称、简介、分类、标签、适合人群、使用场景，以及文章标题、摘要、分类、标签和正文段落/列表内容。
- 初始状态显示“你可以从这些内容开始”，并展示推荐工具 3 个、推荐文章 3 篇。
- 工具结果复用 `ToolCard`，按钮文案为“查看详情”，跳转到 `/tools/[slug]`，不显示“查看官网”。
- 文章结果复用 `ArticleCard`，按钮文案为“阅读全文”，跳转到 `/articles/[slug]`。
- 工具结果和文章结果之间插入 `AdPlaceholder variant="banner"` 广告位；只有一种结果时广告位放在结果列表下方。
- 无搜索结果时显示 `glass-card` 空状态，文案为“没有找到相关内容”和“可以尝试换一个关键词，或减少筛选条件。”，并提供“清空搜索”按钮。
- 已运行 `npm run lint`。
- 已运行 `npm run build`。
- 已重启 `npm run dev`，并确认 `/search` 返回 200。
- 已使用浏览器检查 `/search` 初始状态有 3 个工具详情入口和 3 篇文章阅读入口。
- 已使用浏览器检查 `/search` 初始状态显示广告位“合作推广”和“这里可以展示赞助工具、精选服务或广告内容”。
- 已使用浏览器检查 `/search` 页面未出现“查看官网”。
- 已使用浏览器检查点击热门关键词“开源”后，搜索框自动填入“开源”，并匹配 2 个工具结果和 2 篇文章结果。
- 已使用浏览器检查“只看文章”筛选后仅显示文章结果。
- 已使用浏览器检查“只看工具”筛选后仅显示工具结果。
- 已使用浏览器检查点击热门关键词“PDF”后显示指定空状态。
- 已使用浏览器检查点击“清空搜索”后恢复初始推荐内容。
- 已使用浏览器检查 390px 手机端标题字号为 `36px`，搜索框宽度正常，结果卡片为单列。
- 已确认桌面端和手机端均未发现横向滚动。

下一步：

- 后续可以在 Supabase 阶段把搜索范围扩展到真实工具表和文章表，并根据真实内容数量增加排序规则。

## 2026-06-02

任务：前台页面统一验收与修复。

改动文件：

- `src/components/home/home-article-card.tsx`
- `docs/TASK_LOG.md`

检查方式：

- 开发前已阅读 `docs/PROJECT_RULES.md`、`docs/DESIGN_SYSTEM.md`、`docs/ANTI_ENTROPY.md`、`docs/TASK_LOG.md`。
- 本次不新增功能，不修改数据库、后台、Supabase 相关代码、路由结构和 mock 数据结构。
- 已检查页面：`/`、`/tools`、`/tools/raycast`、`/articles`、`/articles/ai-tool-checklist`、`/search`、`/submit`、`/copyright`。
- 已运行 `npm run lint`，通过。
- 已运行 `npm run build`，通过。
- 已重启 `npm run dev`，并确认 8 个前台页面均返回 200。
- 发现并修复首页最新文章卡片问题：原按钮链接为 `#` 且文案为“阅读文章”，已改为跳转 `/articles/[slug]`，按钮文案为“阅读全文”。
- 已检查首页工具卡片按钮跳转到 `/tools/[slug]`。
- 已检查首页文章卡片按钮跳转到 `/articles/[slug]`。
- 已检查 `/tools` 工具卡片按钮跳转到 `/tools/[slug]`，且未出现“查看官网”。
- 已检查 `/tools/raycast` 只在详情页显示“访问官方网站”，官网链接使用新窗口打开，并带 `rel="nofollow noopener noreferrer"`。
- 已检查 `/articles` 文章卡片跳转到 `/articles/[slug]`，按钮文案为“阅读全文”。
- 已检查 `/search` 工具结果跳转到 `/tools/[slug]`，文章结果跳转到 `/articles/[slug]`。
- 已检查首页、工具库、工具详情、文章列表、文章详情、搜索页、投稿页、版权投诉页均使用浅色渐变分区和玻璃卡片风格。
- 已检查 Header 全站统一，桌面端 sticky，手机端菜单可展开。
- 已检查 Footer 全站统一，手机端为单列布局。
- 已检查首页广告位位于推荐工具区和最新文章区之间。
- 已检查 `/tools` 广告位位于工具列表中，并使用 `col-span-full` 横跨整行。
- 已检查 `/tools/raycast` 有 3 个广告位：正文中间 inline、右侧 sidebar、底部 banner。
- 已检查 `/articles` 广告位位于文章列表中，并使用 `col-span-full` 横跨整行。
- 已检查 `/articles/ai-tool-checklist` 有 3 个广告位：正文中间 inline、右侧 sidebar、底部 banner。
- 已检查 `/search` 广告位位于工具结果和文章结果之间，或结果列表下方，并横跨整行。
- 已检查 `/tools/raycast` 和 `/articles/ai-tool-checklist` 均只有 1 个 `CopyrightNotice`，文案完整。
- 已检查 `/tools` 搜索、分类筛选、标签筛选、清空筛选和无结果状态均正常。
- 已检查 `/articles` 搜索、分类筛选、标签筛选、清空筛选和无结果状态均正常。
- 已检查 `/search` 初始状态、热门关键词、全部/只看工具/只看文章、无结果状态和清空搜索均正常。
- 已检查 `/submit` 空表单校验和正常提交成功提示均正常。
- 已检查 `/copyright` 空表单校验、问题类型选择和正常提交成功提示均正常。
- 已使用 390px 手机端检查所有前台页面，均未发现横向滚动。
- 已使用 390px 手机端检查详情页两栏布局会变为单列，广告位不溢出。
- 已使用 390px 手机端检查 Hero 标题不超过 `36px`，表单输入框不溢出。

下一步：

- 当前前台静态页面验收已通过；后续可以进入 Supabase 数据表设计和表单接入阶段。

## 2026-06-03

任务：接入 Supabase 前台只读数据，把 mock 数据逐步替换为真实数据库读取。

改动文件：

- `package.json`
- `package-lock.json`
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/lib/db/categories.ts`
- `src/lib/db/tags.ts`
- `src/lib/db/tools.ts`
- `src/lib/db/articles.ts`
- `src/lib/db/normalizers.ts`
- `src/types/database.ts`
- `src/types/tool.ts`
- `src/types/article.ts`
- `src/app/page.tsx`
- `src/app/tools/page.tsx`
- `src/app/tools/[slug]/page.tsx`
- `src/app/articles/page.tsx`
- `src/app/articles/[slug]/page.tsx`
- `src/app/search/page.tsx`
- `src/components/home/home-page.tsx`
- `src/components/home/home-category-section.tsx`
- `src/components/home/home-featured-tools.tsx`
- `src/components/home/home-latest-articles.tsx`
- `src/components/home/home-tool-card.tsx`
- `src/components/home/home-article-card.tsx`
- `src/components/tools/ToolCard.tsx`
- `src/components/tools/tool-detail-page.tsx`
- `src/components/tools/tools-page.tsx`
- `src/components/tools/tools-grid.tsx`
- `src/components/articles/articles-page.tsx`
- `src/components/articles/articles-grid.tsx`
- `src/components/search/search-page.tsx`
- `src/components/search/search-results.tsx`
- `docs/DATABASE_SCHEMA.md`
- `docs/TASK_LOG.md`

检查方式：

- 开发前已阅读 `docs/PROJECT_RULES.md`、`docs/DESIGN_SYSTEM.md`、`docs/DATABASE_SCHEMA.md`、`docs/ANTI_ENTROPY.md`、`docs/TASK_LOG.md`。
- 已安装 `@supabase/supabase-js`。
- 新增 Supabase server/client 读取入口，统一读取 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`。
- 未使用、未暴露、未打印 `service_role_key`。
- 新增 `src/lib/db/*` 数据访问层，页面不直接散写 Supabase 查询。
- 新增 `src/types/*` 类型文件，减少页面中的字段猜测和 `any` 使用。
- 工具和文章读取规则为 `status = 'published'`，并按 `created_at` 倒序。
- 分类和标签支持缺失兼容，页面不会因为 `category` 或 `tags` 为空报错。
- Supabase 环境变量缺失或查询失败时，前台 fallback 到 mock 数据。
- Supabase 配置正常但无数据时，首页、列表页和搜索页显示友好空状态。
- Supabase 配置正常但无工具或无文章时，`/tools` 和 `/articles` 的空状态下方仍显示 banner 广告位。
- 首页推荐工具、最新文章、分类入口优先读取 Supabase。
- `/tools` 工具列表优先读取 Supabase，并保留搜索、分类筛选和标签筛选。
- `/tools/[slug]` 工具详情优先读取 Supabase，并保留找不到工具时的友好空状态。
- `/articles` 文章列表优先读取 Supabase，并保留搜索、分类筛选和标签筛选。
- `/articles/[slug]` 文章详情优先读取 Supabase，并保留找不到文章时的友好空状态。
- `/search` 同时优先读取 Supabase 工具和文章，并保留全部 / 只看工具 / 只看文章筛选。
- 搜索范围补充兼容适合人群、使用场景和文章正文内容。
- 未修改后台、登录、数据库 SQL、Header、Footer、`/submit`、`/copyright`、视觉设计系统和路由结构。
- 已运行 `npm run lint`，通过。
- 已运行 `npm run build`，通过。
- 已重启 `npm run dev` 并检查 `/`、`/tools`、`/articles`、`/search` 均可打开。
- 已检查桌面端和手机端 `/tools` 无横向滚动，Supabase 空数据时空状态和广告位显示正常。

下一步：

- 在 Supabase 中补齐 `categories`、`tags`、`tools`、`articles` 及关系表数据后，使用 `npm run dev` 检查首页、工具库、文章页和搜索页是否显示真实内容。

## 2026-06-04

任务：首页搜索支持精准直达详情页。

改动文件：
- `src/app/page.tsx`
- `src/components/home/home-page.tsx`
- `src/components/home/home-search-section.tsx`
- `docs/TASK_LOG.md`

检查方式：

- 开发前已阅读 `docs/PROJECT_RULES.md`、`docs/DESIGN_SYSTEM.md`、`docs/DATABASE_SCHEMA.md`、`docs/ANTI_ENTROPY.md`、`docs/TASK_LOG.md`。
- 首页继续读取 Supabase published 工具和 published 文章数据，并把完整 published 数据传给首页搜索组件用于精准匹配。
- 首页搜索框输入空关键词时跳转 `/search`。
- 首页搜索框输入非精准关键词时跳转 `/search?q=关键词`。
- 首页搜索框输入唯一精准匹配的 published 工具 slug 或标题时，直接跳转 `/tools/[slug]`。
- 首页搜索框输入唯一精准匹配的 published 文章 slug 或标题时，直接跳转 `/articles/[slug]`。
- 同类内容匹配时先判断 slug 完全匹配，再判断标题完全匹配。
- 工具和文章同时精准匹配时优先跳转工具详情。
- 多个工具或多个文章匹配时不直接进入详情页，回退到 `/search?q=关键词`。
- 热门关键词按钮保持模糊搜索逻辑，统一跳转 `/search?q=关键词`，不做精准直达。
- 未修改后台、数据库结构、Supabase RLS、工具详情页、文章详情页和搜索结果页样式。
- 已运行 `npm run lint`，通过。
- 已运行 `npm run build`，通过。
- 已重启 `npm run dev -- -p 3000`，并确认首页返回 200。
- 已用当前 Supabase published 数据校验匹配逻辑：`published-test-tool` 和 `Published Test Tool` 会跳转工具详情，`published` 会跳转搜索页，空关键词会跳转 `/search`。

下一步：

- 在浏览器中从首页手动测试完整 slug、完整标题、模糊关键词和空关键词四种搜索路径。

## 2026-06-05

任务：添加基础 SEO、sitemap、robots 和上线前检查。

改动文件：
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/tools/page.tsx`
- `src/app/tools/[slug]/page.tsx`
- `src/app/articles/page.tsx`
- `src/app/articles/[slug]/page.tsx`
- `src/app/search/page.tsx`
- `src/app/submit/page.tsx`
- `src/app/submit/submit-client.tsx`
- `src/app/copyright/page.tsx`
- `src/app/copyright/copyright-client.tsx`
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `src/lib/seo.ts`
- `docs/TASK_LOG.md`

检查方式：

- 开发前已阅读 `docs/PROJECT_RULES.md`、`docs/DESIGN_SYSTEM.md`、`docs/DATABASE_SCHEMA.md`、`docs/ADMIN_RULES.md`、`docs/CONTENT_RULES.md`、`docs/ANTI_ENTROPY.md`、`docs/TASK_LOG.md`。
- 已在 `src/lib/seo.ts` 统一站点名称、默认描述、关键词、站点 URL、canonical、Open Graph 和 Twitter Card 基础生成逻辑。
- 全站默认 metadata 已在 `src/app/layout.tsx` 中完善，标题模板为 `%s｜知享`。
- `NEXT_PUBLIC_SITE_URL` 用于生成正式站点 URL；缺失时 fallback 到本地开发地址 `http://localhost:3000`。
- 首页、工具库、工具详情、文章列表、文章详情、搜索页、投稿页、版权反馈页已添加页面级 metadata。
- `/tools/[slug]` 动态 metadata 只读取 published 工具；找不到或读取失败时使用“工具未找到”兜底。
- `/articles/[slug]` 动态 metadata 只读取 published 文章；找不到或读取失败时使用“文章未找到”兜底。
- `/submit` 与 `/copyright` 原本是 Client Component，已将表单交互代码拆到同目录 client 文件，原 `page.tsx` 只负责 metadata 和页面渲染入口，表单视觉和写入逻辑不变。
- 已新增 `src/app/sitemap.ts`，包含首页、工具库、文章、搜索、投稿、版权反馈，以及 published 工具详情页和 published 文章详情页。
- sitemap 查询失败时返回基础页面 sitemap，不让构建失败。
- 已新增 `src/app/robots.ts`，允许前台页面抓取，禁止 `/admin`、`/admin/`、`/admin/*`，并指向 `/sitemap.xml`。
- 本次未修改后台 CRUD、后台登录、Supabase 数据库结构、RLS 策略、页面视觉布局、广告接入、统计代码或复杂结构化数据。
- 已运行 `npm run lint`，通过。
- 已运行 `npm run build`，通过；构建输出已包含 `/robots.txt` 和 `/sitemap.xml`。

上线环境变量提醒：

- 必须配置 `NEXT_PUBLIC_SUPABASE_URL`。
- 必须配置 `NEXT_PUBLIC_SUPABASE_ANON_KEY`。
- 必须配置 `NEXT_PUBLIC_SITE_URL`，例如正式域名 `https://your-domain.com`。
- 如果后续后台服务端任务需要 `SUPABASE_SERVICE_ROLE_KEY`，只能放在服务端环境变量中，当前不要在前台暴露或打印。

下一步：

- 部署前在正式域名检查 `/robots.txt`、`/sitemap.xml`、首页源码中的 title/description/canonical，以及工具详情和文章详情的动态标题。

## 2026-06-05

任务：检查并完善站点 URL 配置说明。

改动文件：
- `src/lib/seo.ts`
- `docs/TASK_LOG.md`

检查方式：

- 开发前已阅读 `docs/PROJECT_RULES.md`、`docs/DESIGN_SYSTEM.md`、`docs/DATABASE_SCHEMA.md`、`docs/ANTI_ENTROPY.md`、`docs/TASK_LOG.md`。
- 已检查 `src/app/sitemap.ts`，确认 sitemap URL 统一通过 `getAbsoluteUrl()` 生成。
- 已检查 `src/app/robots.ts`，确认 robots 的 `host` 和 `sitemap` 统一通过 `getSiteUrl()` / `getAbsoluteUrl()` 生成。
- 已检查 `src/lib/seo.ts`，确认站点 URL 统一读取 `NEXT_PUBLIC_SITE_URL`。
- 已将 `NEXT_PUBLIC_SITE_URL` 缺失时的 fallback 从 `https://example.com` 改为 `http://localhost:3000`，避免上线前忘记替换 example.com。
- 未写死正式域名。
- 未修改后台、数据库、业务功能或页面视觉。

环境变量提醒：

- 本地 `.env.local` 需要配置：`NEXT_PUBLIC_SITE_URL=http://localhost:3000`。
- Vercel 生产环境需要配置：`NEXT_PUBLIC_SITE_URL=正式域名`，例如 `https://your-domain.com`。
- `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 仍需按 Supabase 项目配置。

下一步：

- 修改或新增环境变量后重启开发服务，再检查 `/robots.txt` 和 `/sitemap.xml` 是否输出期望域名。

## 2026-06-05

任务：Vercel 部署前检查与上线准备。

改动文件：
- `.gitignore`
- `docs/DEPLOYMENT.md`
- `docs/TASK_LOG.md`

检查方式：

- 开发前已阅读 `docs/PROJECT_RULES.md`、`docs/DESIGN_SYSTEM.md`、`docs/DATABASE_SCHEMA.md`、`docs/ADMIN_RULES.md`、`docs/CONTENT_RULES.md`、`docs/ANTI_ENTROPY.md`、`docs/TASK_LOG.md`。
- 已检查 `package.json`，当前脚本包含 `dev`、`build`、`start`、`lint`，无需修改。
- 已检查 `next.config.ts`，当前没有影响 Vercel 部署的特殊配置，暂不修改。
- 已检查 `src/app/sitemap.ts`，确认通过 `getAbsoluteUrl()` 使用 `NEXT_PUBLIC_SITE_URL`，并只读取 published 工具和 published 文章。
- 已检查 `src/app/robots.ts`，确认通过 `getSiteUrl()` / `getAbsoluteUrl()` 使用 `NEXT_PUBLIC_SITE_URL`，并禁止 `/admin`、`/admin/`、`/admin/*`。
- 已检查 `src/lib/seo.ts`，确认未写死正式域名，`NEXT_PUBLIC_SITE_URL` 缺失时本地 fallback 为 `http://localhost:3000`。
- 已检查环境变量使用，当前代码只使用 `NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`、`NEXT_PUBLIC_SITE_URL`，未使用 `SUPABASE_SERVICE_ROLE_KEY`。
- 已补充 `.gitignore`，新增 `.env.*.local`，并确认已包含 `.env`、`.env.local`、`.next`、`node_modules`。
- 已创建 `docs/DEPLOYMENT.md`，记录 Vercel 部署步骤、环境变量、Supabase 表检查、RLS 检查、后台管理员创建、robots/sitemap 检查和上线后验收清单。
- 当前项目没有 `README.md`，本次未新增 README，部署说明集中放在 `docs/DEPLOYMENT.md`。
- 已运行 `npm run build`，通过。
- 构建输出已包含 `/robots.txt` 和 `/sitemap.xml`。
- 构建日志中仍出现一条既有 Supabase 相关推荐查询日志：`fetch related tools: 未分类`，未导致构建失败；上线前可后续单独清理未分类相关推荐参数。

上线前风险：

- Vercel 生产环境必须配置 `NEXT_PUBLIC_SITE_URL` 为正式域名，否则 robots、sitemap 和 canonical 会使用 fallback 或旧域名。
- Supabase RLS 必须允许前台匿名读取 published 内容、匿名写入投稿和投诉，并允许 authenticated 管理后台数据。
- Supabase Authentication 需要先创建管理员用户，否则后台无法登录。

下一步：

- 把代码提交到 GitHub 后，按 `docs/DEPLOYMENT.md` 的步骤导入 Vercel，并配置生产环境变量。

## 2026-06-05

任务：上线后安全收尾与测试数据清理记录。

改动文件：
- `docs/DEPLOYMENT.md`
- `docs/TASK_LOG.md`

检查方式：

- 开发前已阅读 `docs/PROJECT_RULES.md`、`docs/DATABASE_SCHEMA.md`、`docs/ADMIN_RULES.md`、`docs/DEPLOYMENT.md`、`docs/ANTI_ENTROPY.md`、`docs/TASK_LOG.md`。
- 已确认项目已部署到线上地址：`https://zhishare.vercel.app`。
- 已通过 `git ls-files` 检查，`.env.local` 未被 Git 跟踪。
- 已通过 `git check-ignore` 检查，`.env.local`、`.env`、`.env.production.local` 均被 `.gitignore` 忽略。
- 已扫描 `src`、`package.json`、`next.config.ts`，未发现 `SUPABASE_SERVICE_ROLE_KEY` 或 `service_role` 硬编码。
- 已检查线上 `https://zhishare.vercel.app/robots.txt`，确认禁止 `/admin`、`/admin/`、`/admin/*`。
- 已检查线上 `robots.txt` 指向 `https://zhishare.vercel.app/sitemap.xml`。
- 已检查线上 `https://zhishare.vercel.app/sitemap.xml`，确认使用线上域名。
- 已检查线上 sitemap，当前未发现 `published-test-tool`、`draft-test-tool`、`published-test-article`、`draft-test-article`。
- 已在 `docs/DEPLOYMENT.md` 补充 Vercel 环境变量复查说明：当前版本只需要 `NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`、`NEXT_PUBLIC_SITE_URL`。
- 已在 `docs/DEPLOYMENT.md` 记录当前版本不需要 `SUPABASE_SERVICE_ROLE_KEY`，如曾添加不必要 secret key，建议删除并轮换相关 key。
- 已在 `docs/DEPLOYMENT.md` 记录建议轮换 Supabase `service_role` key 或任何曾经暴露在临时位置的 secret key。
- 已在 `docs/DEPLOYMENT.md` 记录测试数据清理项和后台删除路径。
- 当前没有 `README.md`，本次未修改 README。
- 本次未修改前台页面、后台 CRUD、数据库结构、RLS 策略、视觉设计或依赖。

测试数据清理提醒：

- 通过 `/admin/tools` 删除 `published-test-tool` 和 `draft-test-tool`。
- 通过 `/admin/articles` 删除 `published-test-article` 和 `draft-test-article`。
- 删除后重新检查 `https://zhishare.vercel.app/sitemap.xml`，确认不再包含测试 slug。

下一步：

- 在 Vercel 项目设置中人工复查环境变量，确认没有多余 secret；然后完成后台测试数据清理和一次完整线上冒烟测试。

## 2026-06-05

任务：接入 Cloudflare Turnstile 人机验证。

改动文件：
- `src/app/api/turnstile/verify/route.ts`
- `src/app/admin/login/page.tsx`
- `src/app/submit/submit-client.tsx`
- `src/app/copyright/copyright-client.tsx`
- `src/components/security/TurnstileWidget.tsx`
- `src/lib/security/turnstile.ts`
- `src/lib/security/turnstile-client.ts`
- `docs/DEPLOYMENT.md`
- `docs/TASK_LOG.md`

检查方式：

- 开发前已阅读 `docs/PROJECT_RULES.md`、`docs/DATABASE_SCHEMA.md`、`docs/ADMIN_RULES.md`、`docs/DEPLOYMENT.md`、`docs/ANTI_ENTROPY.md`、`docs/TASK_LOG.md`。
- 已新增服务端 API：`/api/turnstile/verify`。
- 服务端验证通过 `TURNSTILE_SECRET_KEY` 调用 Cloudflare Turnstile siteverify 接口。
- `TURNSTILE_SECRET_KEY` 只在服务端读取，未暴露到前端。
- 已新增前端 Turnstile 组件，使用 `NEXT_PUBLIC_TURNSTILE_SITE_KEY` 渲染 Widget。
- `/submit` 提交前必须完成人机验证；未验证提示“请先完成人机验证。”。
- `/copyright` 提交前必须完成人机验证；未验证提示“请先完成人机验证。”。
- `/admin/login` 登录前必须完成人机验证；未验证提示“请先完成人机验证。”。
- Turnstile 服务端验证失败时统一提示“人机验证失败，请刷新后重试。”。
- 验证成功后才继续原来的 Supabase 投稿写入、版权投诉写入或后台登录逻辑。
- 保留原有 loading、成功提示和失败提示。
- 未修改工具页、文章页、搜索页、后台 CRUD、数据库结构、RLS 策略或视觉设计。
- 已更新 `docs/DEPLOYMENT.md`，记录 `NEXT_PUBLIC_TURNSTILE_SITE_KEY` 和 `TURNSTILE_SECRET_KEY` 的本地/Vercel 配置方式，以及上线后检查方法。
- 已运行 `npm run lint`，通过。
- 已运行 `npm run build`，通过；构建输出包含 `/api/turnstile/verify`。

下一步：

- 部署到 Vercel 后，在线上分别测试 `/submit`、`/copyright`、`/admin/login`：未验证时应阻止提交，验证通过后应继续原有写入或登录流程。

## 2026-06-05

任务：修复并复查 Cloudflare Turnstile 真实接入。

改动文件：
- `src/app/admin/login/page.tsx`
- `src/app/submit/submit-client.tsx`
- `src/app/copyright/copyright-client.tsx`
- `src/components/security/TurnstileWidget.tsx`
- `docs/DEPLOYMENT.md`
- `docs/TASK_LOG.md`

检查方式：

- 开发前已阅读 `docs/PROJECT_RULES.md`、`docs/DATABASE_SCHEMA.md`、`docs/DEPLOYMENT.md`、`docs/ANTI_ENTROPY.md`、`docs/TASK_LOG.md`。
- 已确认 `/submit`、`/copyright`、`/admin/login` 页面提交前均检查 Turnstile token。
- 已确认没有 token 时页面提示 `请先完成人机验证。`，不会继续调用 Supabase 写入或登录。
- 已确认有 token 时先调用 `/api/turnstile/verify`，只有验证成功后才继续 `submissions`、`reports` 或 Supabase Auth 登录请求。
- 已确认 `TurnstileWidget` 使用 `NEXT_PUBLIC_TURNSTILE_SITE_KEY` 渲染，并在缺少站点 key 时显示 `人机验证配置缺失，请联系管理员。`。
- 已确认服务端验证接口仍使用 `TURNSTILE_SECRET_KEY`，不会暴露到前端。
- 已检查线上 `https://zhishare.vercel.app/submit` 当前加载的 JS chunk：未包含 `turnstile` 和 `/api/turnstile/verify`，说明线上当前仍是未包含 Turnstile 的旧部署包或最新代码尚未部署成功。
- 已更新 `docs/DEPLOYMENT.md`，补充 Turnstile 的线上 Network 检查顺序和旧部署包排查说明。
- 已运行 `npm run lint`，通过。
- 已运行 `npm run build`，通过；构建输出包含 `/api/turnstile/verify`。
- 已启动本地 `http://localhost:3000` 做轻量检查，`/submit` 返回 200，页面能显示人机验证区域或缺配置提示。
- 已用无效 token 请求本地 `/api/turnstile/verify`，返回 `{"success":false}`，确认不会放行无效验证。

下一步：

- 推送最新代码并重新部署 Vercel，确认 Production 环境同时配置 `NEXT_PUBLIC_TURNSTILE_SITE_KEY` 和 `TURNSTILE_SECRET_KEY`。
- 重新部署后在线上测试 `/submit`、`/copyright`、`/admin/login`：页面应显示 Turnstile，Network 中应先出现 `/api/turnstile/verify`，验证成功后才出现 Supabase 写入或登录请求。

## 2026-06-05

任务：强制补强 Cloudflare Turnstile 接入。

改动文件：
- `src/app/api/turnstile/verify/route.ts`
- `src/components/security/TurnstileWidget.tsx`
- `src/app/admin/login/page.tsx`
- `src/app/submit/submit-client.tsx`
- `src/app/copyright/copyright-client.tsx`
- `docs/DEPLOYMENT.md`
- `docs/TASK_LOG.md`

检查方式：

- 开发前已阅读 `docs/PROJECT_RULES.md`、`docs/DATABASE_SCHEMA.md`、`docs/DEPLOYMENT.md`、`docs/ANTI_ENTROPY.md`、`docs/TASK_LOG.md`。
- 已将 `TurnstileWidget` 的脚本地址固定为 `https://challenges.cloudflare.com/turnstile/v0/api.js`。
- `TurnstileWidget` 文件顶部保留 `"use client";`。
- `TurnstileWidget` 使用 `NEXT_PUBLIC_TURNSTILE_SITE_KEY` 渲染；缺少 site key 时显示 `人机验证配置缺失，请联系管理员。`，不会静默跳过。
- `TurnstileWidget` 使用 `window.turnstile.render`，渲染容器包含 `cf-turnstile` class。
- `TurnstileWidget` 在成功 callback 时把 token 传给父组件，在 expired/error callback 时清空 token。
- 已将 `/api/turnstile/verify` 改为在 route 内直接读取 `TURNSTILE_SECRET_KEY`、接收 `token`、使用 `FormData` 调用 Cloudflare `siteverify`。
- `/api/turnstile/verify` 在 token 缺失、secret 缺失、Cloudflare 验证失败时都返回 `{ success: false }`。
- `/api/turnstile/verify` 不输出 `TURNSTILE_SECRET_KEY`。
- 已确认 `/submit` 实际表单逻辑在 `submit-client.tsx`，提交时无 token 会提示 `请先完成人机验证。`，有 token 时先调用 `/api/turnstile/verify`，成功后才调用 `createSubmission`。
- 已确认 `/copyright` 实际表单逻辑在 `copyright-client.tsx`，提交时无 token 会提示 `请先完成人机验证。`，有 token 时先调用 `/api/turnstile/verify`，成功后才调用 `createReport`。
- 已确认 `/admin/login` 登录时无 token 会提示 `请先完成人机验证。`，有 token 时先调用 `/api/turnstile/verify`，成功后才调用 Supabase Auth 登录。
- 验证失败文案统一为 `人机验证失败，请刷新后重试。`。
- 已运行 `npm run lint`，通过。
- 已运行 `npm run build`，通过；构建输出包含 `/api/turnstile/verify`。
- 已检查 `.next` 构建产物，确认包含 `cf-turnstile`、Cloudflare `api.js`、`/api/turnstile/verify` 和验证提示文案。
- 已启动本地开发服务，用无效 token 请求 `http://localhost:3000/api/turnstile/verify`，返回 `{"success":false}`。

下一步：

- 推送最新代码并重新部署 Vercel。
- 线上重新测试 `/submit`、`/copyright`、`/admin/login`：Network 必须先出现 `/api/turnstile/verify`，验证成功后才出现 Supabase 写入或登录请求。
