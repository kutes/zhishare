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
NEXT_PUBLIC_TURNSTILE_SITE_KEY=你的 Cloudflare Turnstile Site Key
TURNSTILE_SECRET_KEY=你的 Cloudflare Turnstile Secret Key
```

说明：

- 浏览器端只能使用 `NEXT_PUBLIC_SUPABASE_ANON_KEY`。
- 不要把真实 key 写进 README 或 docs。
- `.env.local` 必须保留在 `.gitignore` 中。
- 当前版本不需要 `SUPABASE_SERVICE_ROLE_KEY`。
- 如果后续服务端任务确实需要 `SUPABASE_SERVICE_ROLE_KEY`，只能放在服务端环境变量中，不能暴露到前台代码或浏览器。
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` 可以被浏览器读取。
- `TURNSTILE_SECRET_KEY` 只能在服务端 API Route 中读取，不能暴露到前台代码或公开文档。

## Vercel 生产环境变量

进入：

Vercel → Project Settings → Environment Variables

添加：

```bash
NEXT_PUBLIC_SUPABASE_URL=你的 Supabase Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的 Supabase anon public key
NEXT_PUBLIC_SITE_URL=https://你的正式域名
NEXT_PUBLIC_TURNSTILE_SITE_KEY=你的 Cloudflare Turnstile Site Key
TURNSTILE_SECRET_KEY=你的 Cloudflare Turnstile Secret Key
```

说明：

- 本地 `NEXT_PUBLIC_SITE_URL` 是 `http://localhost:3000`。
- 上线后必须改成正式域名。
- 如果还没有绑定自定义域名，可以先使用 Vercel 默认域名，例如 `https://your-project.vercel.app`。
- 后续绑定自定义域名后，要把 `NEXT_PUBLIC_SITE_URL` 改成自定义域名。
- 修改环境变量后需要 Redeploy，新的 robots、sitemap、canonical 才会使用新域名。
- Cloudflare Turnstile Widget 需要在 Cloudflare 控制台添加线上域名，例如 `zhishare.vercel.app`。

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

## Turnstile 人机验证检查

当前 Turnstile 用于保护这些入口：

- `/submit`
- `/copyright`
- `/admin/login`

环境变量：

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`：前端 Widget 使用，可以公开。
- `TURNSTILE_SECRET_KEY`：服务端校验使用，禁止暴露到前端。

实现原则：

- 用户提交 `/submit` 前必须完成人机验证。
- 用户提交 `/copyright` 前必须完成人机验证。
- 管理员登录 `/admin/login` 前必须完成人机验证。
- 未完成验证时提示：`请先完成人机验证。`
- Turnstile 站点 key 缺失时提示：`人机验证配置缺失，请联系管理员。`
- 验证失败时提示：`人机验证失败，请刷新后重试。`
- 验证成功后才继续原来的 Supabase 写入或登录逻辑。

上线后检查：

- 打开 `/submit`，确认显示 Turnstile，并且未验证时不能提交。
- 打开 `/copyright`，确认显示 Turnstile，并且未验证时不能提交。
- 打开 `/admin/login`，确认显示 Turnstile，并且未验证时不能登录。
- 提交 `/submit` 时，浏览器 Network 中必须先出现 `/api/turnstile/verify`，验证成功后才出现 Supabase `submissions` 请求。
- 提交 `/copyright` 时，浏览器 Network 中必须先出现 `/api/turnstile/verify`，验证成功后才出现 Supabase `reports` 请求。
- 登录 `/admin/login` 时，浏览器 Network 中必须先出现 `/api/turnstile/verify`，验证成功后才出现 Supabase Auth 登录请求。
- 在浏览器开发者工具中确认前端代码不会出现 `TURNSTILE_SECRET_KEY`。

排错说明：

- 如果页面没有显示 Turnstile，先检查 Vercel Production 环境是否配置了 `NEXT_PUBLIC_TURNSTILE_SITE_KEY`，修改后必须 Redeploy。
- 如果 Network 中只有 Supabase `submissions` 或 `reports` 请求，没有 `/api/turnstile/verify` 请求，说明线上部署包仍是旧版本，或最新代码尚未部署成功；需要确认最新代码已推送并重新部署 Vercel。
- 如果 `/api/turnstile/verify` 返回 `success: false`，检查 Vercel Production 环境是否配置了 `TURNSTILE_SECRET_KEY`，并确认 Cloudflare Turnstile Widget 已添加线上域名 `zhishare.vercel.app`。

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

线上地址：

- `https://zhishare.vercel.app`

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

## 上线后安全收尾

### 已检查项目

- `.env.local` 不应提交到 GitHub。
- `.env.local`、`.env`、`.env.*.local` 应保留在 `.gitignore` 中。
- 代码中不应写死 `SUPABASE_SERVICE_ROLE_KEY`、`service_role` 或其他 secret key。
- `robots.txt` 应禁止后台路径：
  - `/admin`
  - `/admin/`
  - `/admin/*`
- `sitemap.xml` 应使用线上域名。
- `sitemap.xml` 不应包含草稿内容或测试内容。

### Vercel 环境变量复查

Vercel → Project Settings → Environment Variables 中，当前版本只需要：

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_TURNSTILE_SITE_KEY
TURNSTILE_SECRET_KEY
```

当前版本不需要：

```bash
SUPABASE_SERVICE_ROLE_KEY
```

如果 Vercel 项目中曾经添加过不必要的 secret key，建议删除不需要的变量，并在 Supabase 中轮换相关 key。

### Supabase key 轮换建议

上线后建议在 Supabase 中轮换或重新生成敏感 key，尤其是：

- `service_role` key。
- 任何曾经复制到本地、聊天记录、截图、日志或临时文件中的 secret key。

注意：

- 前台和浏览器端只能使用 anon public key。
- `service_role` key 具有高权限，不应该出现在前台代码、GitHub、Vercel 前台变量、README 或公开文档中。
- 轮换 key 后，需要同步更新 Vercel 环境变量并 Redeploy。

### 测试数据清理

请通过后台删除以下测试数据：

- `published-test-tool`
- `draft-test-tool`
- `published-test-article`
- `draft-test-article`

建议路径：

- 工具测试数据：进入 `/admin/tools`，找到对应工具后删除。
- 文章测试数据：进入 `/admin/articles`，找到对应文章后删除。

删除后检查：

- 打开 `https://zhishare.vercel.app/sitemap.xml`。
- 搜索测试 slug，确认不再包含：
  - `published-test-tool`
  - `draft-test-tool`
  - `published-test-article`
  - `draft-test-article`
- 打开 `/tools` 和 `/articles`，确认测试内容不再显示。

### 线上检查记录

2026-06-05 检查记录：

- 线上地址：`https://zhishare.vercel.app`。
- `robots.txt` 可访问，并禁止 `/admin`、`/admin/`、`/admin/*`。
- `robots.txt` 指向 `https://zhishare.vercel.app/sitemap.xml`。
- `sitemap.xml` 可访问，并使用 `https://zhishare.vercel.app` 域名。
- 检查时 `sitemap.xml` 未发现 `published-test-tool`、`draft-test-tool`、`published-test-article`、`draft-test-article`。
- 本地 Git 检查确认 `.env.local` 未被跟踪，并被 `.gitignore` 忽略。
- 本地代码扫描未发现 `SUPABASE_SERVICE_ROLE_KEY` 或 `service_role` 写入 `src`、`package.json`、`next.config.ts`。

## 常见风险

- 忘记配置 `NEXT_PUBLIC_SITE_URL`，导致 sitemap、robots、canonical 域名不正确。
- Vercel 修改环境变量后没有 Redeploy。
- Supabase RLS 未允许匿名读取 published 内容，导致前台无数据。
- Supabase RLS 未允许匿名 insert，导致投稿或投诉提交失败。
- 没有在 Supabase Auth 创建管理员用户，导致后台无法登录。
- 将真实 key 写进文档、README 或代码，这是禁止的。
