# DATABASE_SCHEMA

## 用途

记录 Supabase 数据库设计、前台读取和前台表单写入约定，避免后续随意加表、加字段导致结构混乱。

## 当前阶段

当前处于“前台读取 + 前台表单写入”阶段：

- 前台页面可以读取 Supabase 已发布内容。
- `/submit` 投稿表单可以写入 `submissions` 表。
- `/copyright` 版权投诉表单可以写入 `reports` 表。
- 暂不做后台管理。
- 暂不做登录。
- 暂不做邮件通知。
- 暂不做文件上传。
- 如果 Supabase 环境变量缺失或读取查询失败，内容页临时 fallback 到本地 mock 数据。
- 如果 Supabase 配置正常但数据库暂无内容，页面显示友好空状态。

## 环境变量

前台只读取公开匿名 key：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

禁止在前台或日志中使用、打印、暴露 `service_role_key`。

## 数据读取规则

- 工具和文章只读取 `status = 'published'` 的内容。
- 默认按 `created_at` 倒序展示。
- 分类信息尽量一起读取；分类缺失时页面不能报错。
- 标签关系暂时允许为空；标签缺失时页面不能报错。
- Supabase 查询失败时只在控制台输出安全错误信息，不输出密钥。
- 所有前台读取逻辑集中放在 `src/lib/db/*`，不要在页面里直接散写 Supabase 查询。

## 表单写入规则

- 投稿和版权投诉只做 `insert`，不做前台查询列表。
- 新写入数据默认 `status = 'pending'`。
- 写入失败时，页面显示友好提示，不向用户展示技术错误。
- 控制台可以输出安全错误信息，方便开发调试。
- 不使用 `service_role_key`。
- 如果 Supabase 开启 RLS，需要给 `submissions` 和 `reports` 表增加允许匿名 `insert` 的 policy，否则前台提交会失败。

## 推荐数据表

### categories

用于工具和文章分类。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | uuid | 主键 |
| `name` | text | 分类名称 |
| `slug` | text | 分类标识 |
| `description` | text | 分类说明 |
| `status` | text | 分类状态 |
| `created_at` | timestamptz | 创建时间 |
| `updated_at` | timestamptz | 更新时间 |

### tags

用于工具和文章标签。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | uuid | 主键 |
| `name` | text | 标签名称 |
| `slug` | text | 标签标识 |
| `status` | text | 标签状态 |
| `created_at` | timestamptz | 创建时间 |
| `updated_at` | timestamptz | 更新时间 |

### tools

用于工具、软件、AI 工具、开源项目和在线工具内容。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | uuid | 主键 |
| `title` | text | 工具名称 |
| `name` | text | 兼容字段，可选 |
| `slug` | text | 工具详情页路径标识 |
| `summary` | text | 一句话简介 |
| `description` | text | 详细介绍 |
| `website_url` | text | 官方网站链接 |
| `download_url` | text | 网盘下载链接，可为空 |
| `category_id` | uuid | 关联 `categories.id` |
| `category` | text | 兼容字段，可选 |
| `tags` | jsonb | 兼容字段，可选 |
| `status` | text | 内容状态，只展示 `published` |
| `is_free` | boolean | 是否免费 |
| `is_open_source` | boolean | 是否开源 |
| `pricing` | text | 价格说明 |
| `free_status` | text | 免费状态文案 |
| `open_source_status` | text | 开源状态文案 |
| `target_users` | text 或 jsonb | 适合人群 |
| `use_cases` | text 或 jsonb | 使用场景 |
| `features` | jsonb | 主要功能 |
| `pros` | jsonb | 优点 |
| `cons` | jsonb | 缺点 |
| `risk_notice` | text | 风险提示 |
| `created_at` | timestamptz | 创建时间 |
| `updated_at` | timestamptz | 更新时间 |

### tool_tags

工具与标签的多对多关系。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `tool_id` | uuid | 关联 `tools.id` |
| `tag_id` | uuid | 关联 `tags.id` |

### articles

用于文章、教程、技巧和工具经验内容。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | uuid | 主键 |
| `title` | text | 文章标题 |
| `slug` | text | 文章详情页路径标识 |
| `summary` | text | 文章摘要 |
| `content` | text 或 jsonb | 正文内容 |
| `category_id` | uuid | 关联 `categories.id` |
| `category` | text | 兼容字段，可选 |
| `tags` | jsonb | 兼容字段，可选 |
| `read_time` | text | 阅读时间 |
| `status` | text | 内容状态，只展示 `published` |
| `created_at` | timestamptz | 创建时间 |
| `updated_at` | timestamptz | 更新时间 |

### article_tags

文章与标签的多对多关系。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `article_id` | uuid | 关联 `articles.id` |
| `tag_id` | uuid | 关联 `tags.id` |

### submissions

用于保存用户通过 `/submit` 推荐的工具。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | uuid | 主键 |
| `tool_name` | text | 工具名称 |
| `website_url` | text | 官方地址 |
| `summary` | text | 工具简介 |
| `reason` | text | 推荐理由，可为空 |
| `email` | text | 推荐人邮箱，可为空 |
| `status` | text | 处理状态，默认 `pending` |
| `created_at` | timestamptz | 创建时间 |
| `updated_at` | timestamptz | 更新时间 |

### reports

用于保存用户通过 `/copyright` 提交的版权与权益反馈。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | uuid | 主键 |
| `owner_name` | text | 权利人姓名或机构名称 |
| `email` | text | 联系邮箱 |
| `page_url` | text | 涉及页面链接 |
| `issue_type` | text | 问题类型 |
| `proof` | text | 证明材料说明，可为空 |
| `request` | text | 处理要求 |
| `status` | text | 处理状态，默认 `pending` |
| `created_at` | timestamptz | 创建时间 |
| `updated_at` | timestamptz | 更新时间 |

## 前台兼容字段

当前前台页面需要兼容这些字段：

- `title`
- `slug`
- `summary`
- `description`
- `website_url`
- `download_url`
- `category`
- `tags`
- `is_free`
- `is_open_source`
- `target_users`
- `use_cases`
- `pros`
- `cons`
- `risk_notice`
- `created_at`
- `updated_at`

如果数据库字段和 mock 字段不同，统一通过 `src/lib/db/normalizers.ts` 做转换，不要在页面组件里大量写兼容判断。

## RLS 注意事项

如果 Supabase 开启 Row Level Security：

- `tools`、`articles`、`categories`、`tags` 需要允许匿名读取已发布内容。
- `submissions` 需要允许匿名 `insert`。
- `reports` 需要允许匿名 `insert`。
- 不建议允许匿名 `select`、`update`、`delete` 这两个表单表。

本阶段不自动生成复杂 RLS 方案，后续上线前需要在 Supabase 控制台中单独确认。

## Supabase 原则

- 前台只读公开允许展示的数据。
- 前台表单只写入待审核数据。
- 后台写入和审核必须通过明确权限控制。
- 生产环境上线前必须检查 Row Level Security。
- 数据库结构变更必须同步更新本文档。
- 不存储破解、盗版、绕过付费、未授权下载或侵权资源链接。
