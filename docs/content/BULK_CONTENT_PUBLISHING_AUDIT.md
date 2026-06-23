# 海量内容发布通道检查 v1

Status: completed

## 1. 当前目标

网站现在准备进入海量内容阶段。

本次只审计内容发布通道，不写入数据库，不发布内容，不修改前台页面。

## 2. 当前内容类型

当前项目里至少存在以下内容类型：

- 工具 Tools
- 文章 Articles
- 分类 Categories
- 标签 Tags
- 投稿 Submissions
- 搜索 Search
- sitemap
- robots

## 3. 工具内容数据流

- 前台 `/tools` 读取 `src/lib/db/tools.ts` 里的 `getPublishedTools()`
- 工具详情页 `/tools/[slug]` 读取 `getToolBySlug()` 和 `getRelatedTools()`
- 默认数据源是 Supabase `tools` 表
- 如果没有可用的 Supabase 配置，会回退到 `src/data/mock-tools.ts`
- 后台 `/admin/tools` 支持新增、编辑、删除
- `src/components/admin/AdminToolForm.tsx` 当前覆盖：
  - title
  - slug
  - summary
  - description
  - website_url
  - download_url
  - cover_url
  - category_id
  - status
  - is_free
  - is_open_source
  - target_users
  - use_cases
  - pros
  - cons
  - risk_notice
- `src/app/sitemap.ts` 只把 `status = published` 的工具写进站点地图
- `src/app/robots.ts` 只负责指向 sitemap 并屏蔽后台路径

结论：

- 工具内容的真实发布通道已经存在
- 但当前没有看到“CSV 直接批量写入 Supabase tools 表”的现成入口

## 4. 文章内容数据流

- 前台 `/articles` 读取 `src/lib/db/articles.ts` 里的 `getPublishedArticles()`
- 文章详情页 `/articles/[slug]` 读取 `getArticleBySlug()` 和 `getRelatedArticles()`
- 默认数据源是 Supabase `articles` 表
- 如果没有可用的 Supabase 配置，会回退到 `src/data/mock-articles.ts`
- 后台 `/admin/articles` 支持新增、编辑、删除
- `src/components/admin/AdminArticleForm.tsx` 当前覆盖：
  - title
  - slug
  - summary
  - content
  - cover_url
  - category_id
  - status
- `src/app/sitemap.ts` 只把 `status = published` 的文章写进站点地图

结论：

- 文章内容的真实发布通道也已经存在
- 但当前同样没有看到“CSV 直接批量写入 Supabase articles 表”的现成入口

## 5. 是否已有 seed / import / content pipeline

有，但它更像“来源收集和中间层骨架”，不是最终发布器。

现有内容管线是：

- `scripts/content-pipeline/content_pipeline.py`
- `scripts/content-pipeline/feishu_export.py`
- `scripts/content-pipeline/feishu_sync.py`

它们当前的职责是：

- 从 JSON 来源定义抓取 RSS 或 HTML
- 归一化成标准化 JSON
- 输出 Feishu Bitable payload
- 在提供 `FEISHU_APP_ID`、`FEISHU_APP_SECRET`、`FEISHU_APP_TOKEN`、`FEISHU_TABLE_ID` 后进行同步

这条链路说明：

- 已经有“收集 -> 标准化 -> 人工复核 -> 中间层同步”的骨架
- 但还没有“CSV 直接批量导入 Supabase 公共内容”的成品流程

## 6. 推荐的海量内容路径

### 路径 A：先做 staged CSV，再人工核对

适合：

- 字段还没有完全冻结
- 需要人工复核标题、摘要、slug、封面和风险提示
- 想先控制错误率和重复率

### 路径 B：先写导入脚本，再批量写入 Supabase

适合：

- 字段定义已经稳定
- 允许脚本直接写数据库
- 已经确认 RLS、唯一约束和回滚方案

### 路径 C：先走 Feishu 中间层，再人工转入 Supabase

适合：

- 先标准化来源收集和人工审核
- 暂时不想直接碰数据库写入

### 当前推荐

先走路径 A。

原因：

- 目前没有现成的 CSV -> Supabase 批量导入脚本
- 工具和文章的 slug、封面、正文、摘要、风险提示都需要人工校对
- staged CSV 能先把字段、来源和风险边界冻结住

## 7. 海量内容字段建议

### 工具字段

优先级最高的字段：

- title
- slug
- category
- tags
- short_description
- long_description
- official_website
- pricing
- suitable_for
- not_suitable_for
- cover_image
- published

需要额外核对的字段：

- official_repository
- license
- platform
- risk_tags
- featured
- source_urls

### 文章字段

优先级最高的字段：

- title
- slug
- category
- tags
- excerpt
- body
- publish_status

需要额外核对的字段：

- source_type
- related_tool_slug
- seo_title
- seo_description
- social_copy

## 8. 风险和回滚

- slug 冲突会直接影响 `/tools/[slug]` 和 `/articles/[slug]`
- `published` 状态写错会影响前台可见性
- `published` 也是 sitemap 是否收录的关键条件
- 封面缺失会让列表卡片和详情页视觉不完整
- 正文缺失会让详情页变空壳
- 没有先做 staged CSV 就直接导入，最容易出现重复内容、字段错位和回滚困难

## 9. 下一步建议

先产出首批 staged CSV：

- 50 个工具
- 20 篇文章
- 统一字段名和必填字段
- 先人工复核
- 再决定是手动录入、Feishu 中转，还是写批量导入脚本
