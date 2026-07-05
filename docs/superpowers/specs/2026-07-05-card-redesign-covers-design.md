# 卡片重设计 + 生成式封面系统 设计文档

日期:2026-07-05
状态:已经用户逐项确认(封面来源、存储架构、卡片版式、文章卡处理)

## 背景与问题

- 工具卡(/tools 的精选大卡与紧凑卡)封面位只有首字母占位(如 CC、SP),视觉空洞;此前"查看详情"按钮过小的问题已用 stretched-link 整卡可点修复。
- `tools.cover_url` 字段存在但全部为空;没有任何配图生产机制。
- 用户需求:①卡片重新设计;②添加工具时自动生成配套封面图。

## 已确认的决策

1. **封面来源:程序确定性生成**(非抓取官方 logo、非 AI 生成)。
2. **封面形态:生成 SVG 文件存入 Supabase Storage**,`cover_url` 写库(非实时渲染组件)。
3. **工具卡版式:双层混合**——精选大卡 16:9 封面横幅;紧凑卡 64px 图标行内式。
4. **文章卡:纯排版强化**,不配图。

## 第 1 节:封面生成器

新模块 `src/lib/covers/tool-cover.ts`(纯函数、零依赖、Node 与浏览器通用):

- 输入:`{ title: string; slug: string; categorySlug: string }`
- 输出:`{ coverSvg: string; iconSvg: string }`
  - `coverSvg`:viewBox 1200×675(16:9),精选卡横幅用
  - `iconSvg`:viewBox 256×256(1:1),紧凑卡图标用
- **确定性**:以 slug 的简单字符串哈希选取图案变体与琥珀色相微调;同一 slug 永远得到同一张图。禁止 `Math.random()`。
- **调色板锁定暖色编辑部**:底 #171210→#120f0e 渐变;强调 #E3A75F(琥珀)及其哈希微调;纹理用 #F7F1EA 低透明度;辅助深紫 rgba(91,58,82,·) 少量。
- **分类→几何母题映射**(14 个分类各一个,内置默认兜底母题):编程工具=角括号纹、在线工具=同心波纹、效率软件/效率工具=网格点阵、AI工具/AI入门=星芒、开源项目=分支节点、设计工具=同心圆环、图片工具/图片处理=取景框、视频剪辑=时间轴刻度、效率笔记=横线簿、软件避坑=警示斜纹、工具合集=九宫格。
- **主视觉**:工具名首字母缩写(复用 `src/components/tools/tool-card-utils.ts` 的 `getToolInitials`),`--zh-serif` 同源衬线字形(SVG 内写 font-family 完整栈),居中放置。
- SVG 内不引用任何外部资源(字体不嵌入,依赖系统衬线栈渲染,与站内标题策略一致)。

## 第 2 节:存储与入库链路

**Storage 约定**

- 桶:`tool-covers`,公开只读;写权限:service role(脚本)+ 已登录管理员(后台)。
- 路径:`covers/{slug}.svg` 与 `icons/{slug}.svg`;content-type `image/svg+xml`。
- 库字段:`tools.cover_url` = cover 公开 URL;图标 URL 由 cover_url 做 `covers/→icons/` 路径替换推导(约定写入模块注释,卡片组件内封装 `getToolIconUrl()` 单点实现)。

**三个入口**

1. **批量导入脚本**(下一批工具导入,execute 阶段):插入行前生成两张 SVG → 上传 Storage → `cover_url` 一并写入。dry-run 阶段只在报告中预览将生成的文件路径,不上传。
2. **后台表单** `AdminToolForm`:保存时若 `cover_url` 为空,浏览器端生成 SVG → supabase-js 上传 → 回填表单字段后提交。失败时不阻塞保存(cover_url 留空,卡片走兜底占位),控制台输出安全错误。
3. **补跑脚本** `scripts/content-import/backfill-tool-covers.mjs`:给现有已发布工具(当前 3 个)补封面。守门模式:默认 dry-run 出报告(将生成哪些文件、覆盖哪些行),`--execute` 才上传与 UPDATE(仅写 `cover_url` 与 `updated_at`);执行后读回验证 URL 非空。不打印任何密钥。

**前置人工操作(需用户在 Supabase 控制台完成或授权脚本创建)**:创建 `tool-covers` 公开桶及写入策略。

## 第 3 节:工具卡重设计(双层混合)

**FeaturedToolCard(精选大卡)**

- 顶部 16:9 `<img src={cover_url}>` 横幅(圆角上沿贴合卡片);
- 下方依次:徽章行(分类/免费/开源)→ 衬线大标题(--zh-serif)→ 简介两行截断 → 「适合」行 → 底部行:标签靠左、"→"箭头靠右。
- **移除"查看详情"按钮**;stretched-link 保留(链接移到箭头元素上,::after 撑满整卡不变)。

**CompactToolCard(紧凑卡)**

- 左侧 64px 圆角图标(`iconSvg` 的 Storage URL);右侧:小号徽章行 → 标题 → 简介两行截断;底部:「适合」+ 右下箭头。整体高度显著低于现状。
- **移除"查看详情"按钮**,同上。

**兜底**:`cover_url` 为空时回落到现有首字母占位视觉(防御性保留,不删旧样式)。

**悬停**:沿用现有 lift + 暖色描边模式;新增封面图轻微亮度提升(filter)。

## 第 4 节:文章卡纯排版强化

- 不配图。行首琥珀色点(#E3A75F,全站统一,不做每分类配色)+ 分类名 + `--zh-serif` 衬线大标题 + 摘要 + 「日期 · 阅读时长」meta 行;"阅读全文"按钮改为带 → 的文字链(stretched-link 不变)。
- 组件结构(article-card.tsx)不动,以样式精修为主。

## 第 5 节:边界、验证与回滚

**不碰**:首页卡片与首页数据流、搜索结果卡、后台其余 UI、`src/lib/db/*` 查询逻辑、路由。

**验证**

- `npx tsc --noEmit` 通过;
- 生成器单测式自检脚本(node 直跑):同一输入两次输出逐字节一致(确定性)、SVG 含 CJK 安全(纯 ASCII 图形 + 首字母)、两种尺寸 viewBox 正确;
- 补跑脚本 dry-run 报告人工过目后再 execute;
- dev server 截图(桌面+移动)检查 /tools 与 /articles 卡片。

**回滚**:封面系统纯增量——清空 `cover_url` 即全站回落占位视觉;卡片样式改动集中在 globals.css 的 tools/articles 区块与两个卡片组件,可独立 revert。

## 依赖

无新增 npm 依赖;无需安装插件。使用现有 @supabase/supabase-js 与 Next.js `<img>`(SVG 不走 next/image 优化管线,直接原生 img)。
