# CHANGELOG

## 用途

记录对用户可见或项目结构重要的版本变化。

## 记录规则

- 新版本写在上方。
- 日期使用 `YYYY-MM-DD`。
- 内容保持简洁，说明完成了什么。
- 小的日常任务记录放在 `docs/TASK_LOG.md`。

## 2026-07-05（补记 2026-06-05 至今）

> 本条为一次性补记：此前一个月的变化只记录在 `docs/TASK_LOG.md` 与 git 历史（85 次提交），未同步到本文件。自本条起恢复正常记录。

- 网站已完整上线：https://zhishare.vercel.app（Next.js 15 + Supabase + Vercel）。
- 2026-06-05：完成 MVP（公开前台 + 管理后台 CRUD + Supabase 8 张表 + 登录）；接入 Cloudflare Turnstile（/submit、/copyright、/admin/login）。
- 2026-06 上旬：SEO 基建（metadata、sitemap、robots）、RLS 数据访问控制、部署文档。
- 2026-06 中下旬：视觉改版为「暖色编辑部」方向，覆盖全部公开页面（过程见 `docs/COSMIC_REDESIGN_LOG.md`，46+ 步）。
- 2026-06-24：首批 3 个工具经守门流程（dry-run→readiness→approval→execute）导入生产（localsend、stirling-pdf、cyberchef）。
- 2026-07-03：发现内容管线 CSV 中文在生成时已被损坏为 `????`（波及线上 3 个工具），以 UPDATE-only 修复脚本重写正确中文并双重验证；管线其余待导入内容仍需重新生成中文。
- 2026-07-03 起：首页导航/页脚与内页统一，Hero 文案对齐站点定位，衬线字体栈收口为单一 `--zh-serif` 令牌，清理死代码（进行中）。

## 2026-05-31

- 创建项目文档体系。
- 确认当前仓库尚未初始化 Next.js 项目文件。
