# 内容建设任务日志

## 2026-06-11

### 本次任务

创建首批 5 个工具内容草稿。

### 新增文件

- `docs/content/tool-drafts/chatgpt.md`
- `docs/content/tool-drafts/canva.md`
- `docs/content/tool-drafts/photopea.md`
- `docs/content/tool-drafts/notion.md`
- `docs/content/tool-drafts/cursor.md`

### 内容原则

本次 5 个工具草稿全部按现有后台工具字段组织：

- `title`
- `slug`
- `summary`
- `description`
- `website_url`
- `download_url`
- `cover_url`
- `category_suggestion`
- `status`
- `is_free`
- `is_open_source`
- `target_users`
- `use_cases`
- `pros`
- `cons`
- `risk_notice`

同时保留 GEO 备注，方便后续修改详情页或扩字段时复用。

### 本次没有做

- 没有写入 Supabase。
- 没有修改数据库。
- 没有修改后台表单。
- 没有修改前台详情页。
- 没有新增标签编辑功能。
- 没有新增富文本编辑器。
- 没有新增评论、点赞、转发功能。

### 下一步建议

人工审核这 5 份草稿，确认后再决定：

1. 手动录入后台。
2. 或让 Codex 基于现有后台字段生成安全录入方案。
3. 或先继续制作 3 篇文章样板。

## 2026-06-11

### 本次任务

将首批 5 个工具样板内容录入 Supabase `tools` 表。

### 已录入工具

- ChatGPT
- Canva
- Photopea
- Notion
- Cursor

### 录入方式

使用临时脚本 `.tmp/upsert-tool-drafts.mjs` 按 `slug` 执行 upsert。

### 修正记录

真实 Supabase 表结构和仓库类型文件存在差异：

- `tools.name` 不存在
- `categories.status` 不存在

因此本次脚本改为只检测并写入真实存在的 `tools` 字段，不新增数据库字段，不修改 schema。

### 本次没有做

- 没有修改数据库 schema。
- 没有新增 migration。
- 没有新增 `tools.name` 字段。
- 没有新增 `categories.status` 字段。
- 没有修改前台页面。
- 没有修改后台表单。
- 没有新增标签绑定。
- 没有新增评论、点赞、转发功能。
- 没有提交 commit。
- 没有 push。

### 后续建议

后台检查 5 个工具内容显示效果。确认无问题后，再决定是否将状态从 `draft` 改为 `published`。

## 2026-06-11

### 本次任务

将首批 5 个工具从 `draft` 发布为 `published`。

### 已发布工具

- Canva
- ChatGPT
- Cursor
- Notion
- Photopea

### 验证结果

- Supabase 查询返回 5 条工具。
- 5 条工具的 `status` 均为 `published`。
- 本地构建通过。
- 连续问号乱码检查无匹配。

### 本次没有做

- 没有修改数据库 schema。
- 没有新增 migration。
- 没有修改页面代码。
- 没有修改后台表单。
- 没有修改工具正文内容。
- 没有提交 commit。
- 没有 push。

### 下一步建议

检查前台 `/tools` 和 5 个工具详情页显示效果。确认无问题后，再统一提交内容文档变更。

## 2026-06-11

### 本次任务

补充第一阶段 `download_url` 留空规则，并清理首批 5 个工具的 `download_url`。

### 本次完成

- 更新 `docs/content/CONTENT_RULES.md`，明确第一阶段所有工具 `download_url` 必须留空。
- 更新 `docs/content/CONTENT_TEMPLATES.md`，补充 `website_url` / `download_url` 填写规则。
- 更新 `docs/content/CONTENT_REVIEW_CHECKLIST.md`，把工具页发布检查改为“`download_url` 必须为空”。
- 更新 `docs/content/CONTENT_DATA_MAP.md`，明确 `download_url` 虽存在，但第一阶段不承接真实下载链接。
- 检查 `docs/content/tool-drafts` 下首批 5 个工具草稿，确认 `download_url` 均为空，未写入真实网盘或第三方下载链接。
- 使用临时脚本将 `canva`、`chatgpt`、`cursor`、`notion`、`photopea` 的 `download_url` 统一清理为 `null`。
- 执行完成后删除 `.tmp` 临时脚本目录。

### 本次没有做

- 没有新增数据库字段。
- 没有修改前台页面代码。
- 没有修改后台表单逻辑。
- 没有新增下载入口。

### 结果说明

- 第一阶段工具内容统一只保留 `website_url` 作为官网入口。
- `download_url` 字段保留，但当前阶段不写入任何真实下载地址。
