# DEPLOYMENT

## 用途

记录知享部署到 Vercel 前后的检查步骤、环境变量、Supabase 权限确认和上线后验收清单。

本文只记录上线配置，不包含后台 CRUD、数据库结构变更、RLS SQL 方案或新功能设计。

## 当前部署目标

- 部署平台：Vercel。
- 技术栈：Next.js App Router、TypeScript、Tailwind CSS、Supabase。
- 数据来源：Supabase 已发布内容。
- 后台登录：Supabase Auth 邮箱密码登录。

## 构建检查

部署前先在本地执行：

```bash
npm run build
```

要求：

- TypeScript 不报错。
- ESLint 不报错。
- metadata、sitemap、robots 不导致构建失败。
- Supabase 查询失败时页面有容错，不让构建崩溃。

如果构建失败，只修复具体错误，不做大范围重构。

## 本地环境变量

本地 `.env.local` 至少需要：

```bash
NEXT_PUBLIC_SUPABASE_URL=你的 Supabase Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的 Supabase anon public key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

说明：

- 浏览器端只能使用 `NEXT_PUBLIC_SUPABASE_ANON_KEY`。
- 不要把真实 key 写进 README 或 docs。
- `.env.local` 必须保留在 `.gitignore` 中。
- 当前版本不需要 `SUPABASE_SERVICE_ROLE_KEY`。
- 如果后续服务端任务确实需要 `SUPABASE_SERVICE_ROLE_KEY`，只能放在服务端环境变量中，不能暴露到前台代码或浏览器。

## Vercel 生产环境变量

进入：

Vercel → Project Settings → Environment Variables

添加：

```bash
NEXT_PUBLIC_SUPABASE_URL=你的 Supabase Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的 Supabase anon public key
NEXT_PUBLIC_SITE_URL=https://你的正式域名
```

说明：

- 本地 `NEXT_PUBLIC_SITE_URL` 是 `http://localhost:3000`。
- 上线后必须改成正式域名。
- 如果还没有绑定自定义域名，可以先使用 Vercel 默认域名，例如 `https://your-project.vercel.app`。
- 后续绑定自定义域名后，要把 `NEXT_PUBLIC_SITE_URL` 改成自定义域名。
- 修改环境变量后需要 Redeploy，新的 robots、sitemap、canonical 才会使用新域名。

如果未来确实有服务端后台任务使用 service role，再添加：

```bash
SUPABASE_SERVICE_ROLE_KEY=你的 service role key
```

当前版本不需要配置这项。

## .gitignore 检查

上线前确认 `.gitignore` 包含：

```gitignore
.env
.env.local
.env.*.local
.next
node_modules
```

不要提交任何真实密钥、Supabase URL 或服务端密钥。

## Supabase 表检查

上线前确认 Supabase 已创建这些表：

- `categories`
- `tags`
- `tools`
- `articles`
- `tool_tags`
- `article_tags`
- `submissions`
- `reports`

## Supabase RLS 检查

前台匿名读取需要确认：

- `anon` 可以读取 `published` 的 `tools`。
- `anon` 可以读取 `published` 的 `articles`。
- `anon` 可以读取 `categories`。
- `anon` 可以读取 `tags`。

前台表单写入需要确认：

- `anon` 可以 `insert` 到 `submissions`。
- `anon` 可以 `insert` 到 `reports`。

后台管理需要确认：

- `authenticated` 可以管理 `tools`。
- `authenticated` 可以管理 `articles`。
- `authenticated` 可以管理 `categories`。
- `authenticated` 可以管理 `tags`。
- `authenticated` 可以读取、更新、删除 `submissions`。
- `authenticated` 可以读取、更新、删除 `reports`。

当前文档只记录检查项，不自动生成复杂 RLS 方案。

## 后台登录检查

上线前需要在 Supabase Authentication → Users 中创建管理员用户。

注意：

- 密码无法查询，只能创建或重置。
- 当前版本暂时使用 Supabase Auth 登录用户作为后台管理员。
- 后续可以升级为 `profiles` + `role = admin` 的权限模型。
- 当前阶段不做复杂多角色权限。

## robots 和 sitemap 检查

当前实现要求：

- `robots.ts` 使用 `NEXT_PUBLIC_SITE_URL`。
- `sitemap.ts` 使用 `NEXT_PUBLIC_SITE_URL`。
- 不写死 localhost。
- 不写死 example.com。
- sitemap 只包含 `published` 工具和 `published` 文章。
- sitemap 不包含 `draft`。
- robots 禁止：
  - `/admin`
  - `/admin/`
  - `/admin/*`
- robots 指向：
  - `/sitemap.xml`

上线后检查：

- `https://你的正式域名/robots.txt`
- `https://你的正式域名/sitemap.xml`

确认输出中的域名和 `NEXT_PUBLIC_SITE_URL` 一致。

## Vercel 部署步骤

1. 本地执行 `npm run build`，确认通过。
2. 确认代码已提交到 GitHub。
3. 登录 Vercel。
4. 点击 Import GitHub Repository。
5. 选择当前项目仓库。
6. Framework 选择 Next.js。
7. 在 Environment Variables 中配置环境变量。
8. 点击 Deploy。
9. 部署成功后打开 Vercel 域名测试。
10. 如果绑定自定义域名，回到 Vercel Domains 添加域名。
11. 修改 `NEXT_PUBLIC_SITE_URL` 为正式域名。
12. Redeploy。
13. 检查 `/robots.txt` 和 `/sitemap.xml` 是否是正式域名。

## 上线后检查清单

### 前台页面

- `/`
- `/tools`
- `/tools/[slug]`
- `/articles`
- `/articles/[slug]`
- `/search`
- `/submit`
- `/copyright`
- `/robots.txt`
- `/sitemap.xml`

### 后台页面

- `/admin/login`
- `/admin`
- `/admin/tools`
- `/admin/articles`
- `/admin/categories`
- `/admin/tags`
- `/admin/submissions`
- `/admin/reports`

### 数据联动

- `published` 工具前台可见。
- `draft` 工具前台不可见。
- `published` 文章前台可见。
- `draft` 文章前台不可见。
- 投稿能进入 `submissions`。
- 投诉能进入 `reports`。
- 后台能登录。
- 后台 CRUD 正常。

## 常见风险

- 忘记配置 `NEXT_PUBLIC_SITE_URL`，导致 sitemap、robots、canonical 域名不正确。
- Vercel 修改环境变量后没有 Redeploy。
- Supabase RLS 未允许匿名读取 published 内容，导致前台无数据。
- Supabase RLS 未允许匿名 insert，导致投稿或投诉提交失败。
- 没有在 Supabase Auth 创建管理员用户，导致后台无法登录。
- 将真实 key 写进文档、README 或代码，这是禁止的。
