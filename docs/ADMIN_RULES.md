# ADMIN_RULES

## 2026-06-04 后台统一验收与修复规则

- 后台登录、后台首页和所有后台管理页必须使用 Supabase Auth 获取真实登录状态，不能依赖前端假状态。
- 后台跳转必须使用相对路径，例如 `/admin`、`/admin/login`，不得硬编码 `localhost:3000` 或 `localhost:3001`。
- 未登录访问 `/admin`、`/admin/tools`、`/admin/articles`、`/admin/categories`、`/admin/tags`、`/admin/submissions`、`/admin/reports` 时，必须跳转到 `/admin/login?next=admin`。
- 后台登录状态检查必须有兜底处理，不能永久停留在“正在验证登录状态”或“正在检查登录状态”。
- 正常未登录导致的 `Auth session missing` 属于预期状态，不作为页面错误展示。
- 后台所有读取、写入、更新、删除函数必须输出真实 Supabase 错误到控制台，页面只显示友好中文提示。
- 如果 Supabase 返回 RLS 或权限类错误，例如 `new row violates row-level security policy`、`permission denied`，页面统一显示：`权限不足，请检查 Supabase RLS 配置。`
- 后台数据库访问应复用统一的 Supabase browser client，避免同一浏览器上下文中创建多个 GoTrueClient 实例。
- 后台首页统计必须使用 Supabase count 查询，读取失败时该项显示 0，不让页面崩溃。
- 本阶段只做稳定性验收和必要修复，不新增 CRUD 范围外的新功能，不做多角色权限、图片上传、富文本编辑器或复杂后台系统。

## 2026-06-04 后台投诉管理规则

- 当前投诉管理阶段只开放 `reports` 表查看、状态标记和删除，不做邮件通知、复杂工单系统、批量操作或自动删除内容。
- `/admin/reports` 负责展示用户从 `/copyright` 提交的版权、商标、授权、链接错误和信息错误等反馈。
- 投诉列表字段包括 `owner_name`、`email`、`page_url`、`issue_type`、`proof`、`request`、`status`、`created_at`。
- 顶部统计显示全部投诉数量、`pending` 数量、`reviewed` 数量、`resolved` 数量和 `rejected` 数量。
- 投诉状态支持 `pending`、`reviewed`、`resolved`、`rejected`；数据库里如果存在其他状态，可以兼容显示，但后台状态按钮只允许更新为这四种。
- 状态中文显示：`pending` 为“待处理”，`reviewed` 为“已查看”，`resolved` 为“已处理”，`rejected` 为“已拒绝”。
- 查看详情使用页面内展开，不创建单独详情页。
- 涉及页面链接如为 `http` 或 `https` 链接，必须新窗口打开，并使用 `rel="nofollow noopener noreferrer"`。
- 联系邮箱显示为 `mailto:` 链接。
- 更新投诉状态时，payload 只允许包含 `status`，不更新投诉内容字段。
- 删除投诉必须二次确认，删除只根据 `id` 执行。
- 列表中长文本 `proof` 和 `request` 只显示摘要，详情展开后完整显示。
- Supabase 真实错误只输出到控制台，页面只显示友好中文提示。
- 后台投诉管理使用 Supabase anon client 和当前登录状态，不使用、不暴露 `service_role_key`。
- 如果读取、更新或删除失败，需要检查 Supabase RLS 是否允许已登录用户对 `reports` 表执行 `select`、`update`、`delete`。

## 2026-06-04 后台投稿管理规则

- 当前投稿管理阶段只开放 `submissions` 表查看、状态标记和删除，不做一键转工具、邮件通知、批量操作或复杂审核流程。
- `/admin/submissions` 负责展示用户从 `/submit` 提交的工具推荐。
- 投稿列表字段包括 `tool_name`、`website_url`、`summary`、`reason`、`email`、`status`、`created_at`。
- 顶部统计显示全部投稿数量、`pending` 数量、`reviewed` 数量和 `rejected` 数量。
- 投稿状态支持 `pending`、`reviewed`、`rejected`；数据库里如果存在其他状态，可以兼容显示，但后台状态按钮只允许更新为这三种。
- 状态中文显示：`pending` 为“待处理”，`reviewed` 为“已查看”，`rejected` 为“已拒绝”。
- 查看详情使用页面内展开，不创建单独详情页。
- 官网地址如为 `http` 或 `https` 链接，必须新窗口打开，并使用 `rel="nofollow noopener noreferrer"`。
- 更新投稿状态时，payload 只允许包含 `status`，不更新投稿内容字段。
- 删除投稿必须二次确认，删除只根据 `id` 执行。
- Supabase 真实错误只输出到控制台，页面只显示友好中文提示。
- 后台投稿管理使用 Supabase anon client 和当前登录状态，不使用、不暴露 `service_role_key`。
- 如果读取、更新或删除失败，需要检查 Supabase RLS 是否允许已登录用户对 `submissions` 表执行 `select`、`update`、`delete`。

## 2026-06-04 后台标签管理规则

- 当前标签管理阶段只开放 `tags` 表管理，不做工具标签绑定、文章标签绑定、分类管理、投稿审核和复杂权限。
- `/admin/tags` 负责标签列表、新增、编辑和删除。
- 标签用于工具标签、文章标签、前台筛选、搜索匹配和后续内容推荐。
- 标签表单字段为 `name` 和 `slug`。
- 新增和编辑标签时，`name` 与 `slug` 必填。
- 保存 payload 只允许包含 `name` 和 `slug`，不传 `id`、`created_at` 或数据库不存在字段。
- slug 自动生成规则：英文转小写、空格转短横线、去掉特殊符号；中文名称无法生成稳定 slug 时 fallback 为 `tag-${Date.now()}`。
- slug 重复时显示友好错误：“slug 已存在，请换一个 slug。”
- 删除标签必须二次确认。
- 如果标签正在被 `tool_tags` 或 `article_tags` 引用，删除失败时显示：“该标签可能正在被工具或文章使用，请先调整相关内容后再删除。”
- 后台标签管理使用 Supabase anon client 和当前登录状态，不使用、不暴露 `service_role_key`。
- 如果新增、编辑、删除失败，需要检查 Supabase RLS 是否允许已登录用户对 `tags` 表执行 `insert`、`update`、`delete`。

## 2026-06-04 后台分类管理规则

- 当前分类管理阶段只开放 `categories` 表管理，不做标签、工具、文章、投稿审核和复杂权限。
- `/admin/categories` 负责分类列表、新增、编辑和删除。
- 分类用于工具分类、文章分类、前台筛选，以及后台工具和文章表单的分类选择。
- 分类表单字段为 `name`、`slug`、`description`。
- 新增和编辑分类时，`name` 与 `slug` 必填，`description` 可为空。
- 保存 payload 只允许包含 `name`、`slug`、`description`，不传 `id`、`created_at` 或数据库不存在字段。
- `description` 为空时写入 `null`。
- slug 自动生成规则：英文转小写、空格转短横线、去掉特殊符号；中文名称无法生成稳定 slug 时 fallback 为 `category-${Date.now()}`。
- slug 重复时显示友好错误：“slug 已存在，请换一个 slug。”。
- 删除分类必须二次确认。
- 如果分类正在被工具或文章使用，删除失败时显示：“该分类可能正在被工具或文章使用，请先调整相关内容后再删除。”。
- 后台分类管理使用 Supabase anon client 和当前登录态，不使用、不暴露 `service_role_key`。
- 如果新增、编辑、删除失败，需要检查 Supabase RLS 是否允许已登录用户对 `categories` 表执行 `insert`、`update`、`delete`。

## 2026-06-04 后台文章管理规则

- 当前文章管理阶段只开放 `articles` 表管理，不做分类、标签、投稿审核、复杂权限和富文本编辑器。
- `/admin/articles` 负责文章列表、编辑入口和删除操作。
- `/admin/articles/new` 负责新增文章。
- `/admin/articles/[id]/edit` 负责编辑已有文章。
- 文章列表按 `updated_at` 倒序读取所有文章，包括 `draft` 和 `published`。
- 删除文章必须二次确认，删除成功后刷新当前列表状态。
- 新增和编辑文章时，`title`、`slug`、`summary` 必填。
- `cover_url` 如填写，必须是 `http` 或 `https` 链接。
- `category_id` 为空时必须写入 `null`，不能写入空字符串。
- `status` 只能使用 `draft` 或 `published`，异常时默认 `draft`。
- 正文内容当前只使用 textarea 维护，不做富文本编辑器、Markdown 预览、图片上传或标签绑定。
- 分类只从 `categories` 表读取并作为下拉选项，本阶段不在文章表单中新增分类。
- 后台文章管理使用 Supabase anon client 和当前登录态，不使用、不暴露 `service_role_key`。
- 如果新增、编辑、删除失败，需要检查 Supabase RLS 是否允许已登录用户对 `articles` 表执行 `insert`、`update`、`delete`。

## 2026-06-03 后台工具管理规则

- 当前工具管理阶段只开放 `tools` 表管理，不做文章、分类、标签后台 CRUD。
- `/admin/tools` 负责工具列表、编辑入口和删除操作。
- `/admin/tools/new` 负责新增工具。
- `/admin/tools/[id]/edit` 负责编辑已有工具。
- 工具列表按 `updated_at` 倒序读取所有工具，包括 `draft` 和 `published`。
- 删除工具必须二次确认，删除成功后刷新当前列表状态。
- 新增和编辑工具时，`title`、`slug`、`summary` 必填。
- `website_url` 如填写，必须是 `http` 或 `https` 链接。
- `status` 只能使用 `draft` 或 `published`。
- 分类只从 `categories` 表读取并作为下拉选项，本阶段不在工具表单中新增分类。
- 后台工具管理使用 Supabase anon client 和当前登录态，不使用、不暴露 `service_role_key`。
- 如果新增、编辑、删除失败，需要检查 Supabase RLS 是否允许已登录用户对 `tools` 表执行 `insert`、`update`、`delete`。
- 工具管理页面保持后台风格简洁清晰，不引入富文本编辑器、图片上传、批量导入或复杂权限。

## 2026-06-03 后台登录与权限保护加固规则

- `/admin/login` 使用 Supabase Auth 邮箱密码登录。
- 登录页只显示友好中文提示，不直接向用户展示技术错误；技术错误只允许输出到控制台。
- `/admin` 必须通过 Supabase `auth.getUser()` 获取当前用户，不能只依赖前端自定义状态。
- `/admin` 在用户校验完成前，只显示权限检查提示，不显示后台菜单、统计卡片或管理内容。
- 未登录访问 `/admin` 必须跳转到 `/admin/login?next=admin`。
- 已登录访问 `/admin` 才能显示后台首页、当前登录邮箱、统计卡片和退出登录按钮。
- 统计卡片读取 `tools`、`articles`、`submissions`、`reports` 四张表真实数量。
- 统计读取函数也必须先确认当前 Supabase 用户，避免被未登录状态误调用。
- 统计读取失败时页面显示 0 或友好提示，不让后台页面崩溃。
- 退出登录必须调用 Supabase `auth.signOut()`，成功后再跳转 `/admin/login`；失败时显示友好提示。
- 后台菜单当前保留这些入口：后台首页、工具管理、文章管理、分类管理、标签管理、投稿管理、投诉管理、返回前台。
- 暂未实现的后台入口可以显示“待开放”，但不做 CRUD、不做多角色权限、不新增复杂依赖。

## 2026-06-03 后台当前阶段规则

- 当前后台阶段只实现 `/admin/login` 和 `/admin`。
- 后台登录使用 Supabase Auth 邮箱密码登录。
- 未登录访问 `/admin` 时，前端会自动跳转到 `/admin/login?next=admin`。
- 登录成功后进入 `/admin` 后台首页。
- 后台首页目前只显示统计卡片：工具数量、文章数量、投稿数量、投诉数量。
- 后台首页包含左侧菜单和顶部栏，但菜单中的工具管理、文章管理、投稿审核、投诉处理暂时只是占位入口，不做 CRUD。
- 当前阶段不做多角色权限，不做复杂后台功能，不做邮件通知，不做文件上传。
- 后台不得使用或暴露 `service_role_key`。
- 后台统计读取依赖 Supabase Auth 登录状态和数据库 RLS 读取权限；如果统计读取失败，需要检查对应表是否允许已登录管理员读取。

## 用途

记录后台功能设计规则，确保后台简单、直观、低风险。

## 后台目标

- 让非技术用户也能管理内容。
- 操作路径短，字段说明清楚。
- 高风险操作必须有确认。
- 不做复杂系统，先满足内容发布和维护。

## 基础功能原则

- 登录后才能进入后台。
- 内容支持新增、编辑、保存草稿、发布、下架。
- 列表页支持搜索、分类筛选、状态筛选。
- 表单字段保持必要，不堆太多选项。
- 错误提示要用人能看懂的中文。

## 权限原则

- 初期只考虑管理员角色。
- 不提前实现复杂多角色权限。
- 涉及数据库写入的操作必须受保护。
- 不在前端暴露敏感密钥。

## 操作安全

- 删除操作优先做软删除或下架。
- 危险操作需要二次确认。
- 后台改动应尽量留下时间记录。

## 可维护性

- 后台页面和前台页面目录清晰分开。
- 后台组件命名要直观。
- 新增后台功能时同步更新本文档。
