# 卡片照片层(第一期)设计文档

日期:2026-07-09
来源:对 best.xiaohu.ai 展现形式的分析(仅借鉴呈现技术,不引入其期号/来源条等编辑部装置——那是可选的第三期)
前置:2026-07-05 生成式封面系统已上线(tool-covers 桶、covers/{slug}.svg、icons/{slug}.svg、cover_url、兜底链)

## 目标

精选大卡的封面在"有官方图可用"时显示**真实照片**(工具官网的 og:image 分享图),垫在暗色遮罩下与暖色主题融合;抓不到照片时自动回落到现有生成封面,再回落到首字母占位。**页面任何情况下不开天窗。**

## 决策

1. **照片来源**:工具官网 `website_url` 的 og:image / twitter:image(官方自己发布的分享图,版权最稳),Phase 1 不做整页截图。
2. **存储与字段**:照片转存至现有 `tool-covers` 桶的 `photos/{slug}.{jpg|png|webp}`;**复用 cover_url 字段**(语义 = "卡片当前最佳封面"):有照片时指向 photos/,否则保持 covers/ 生成图。不加新列。
3. **图标不变**:紧凑卡 64px 图标永远用生成 SVG(小尺寸照片糊,品牌一致性优先)。`getToolIconUrl` 改为按 slug 从 `/tool-covers/` 基址推导 `icons/{slug}.svg`,兼容 cover_url 指向 photos/ 或 covers/ 两种情况。
4. **前端判定**:cover_url 含 `/tool-covers/photos/` → 精选卡加 `zh-tool-card-banner-photo` 类 → 叠加暖色渐变遮罩(上 rgba(18,15,14,.42) → 中透明 → 下 rgba(18,15,14,.5)),生成封面不加遮罩(其本身已按主题设计)。
5. **抓取通道**:仅守门脚本(Node,服务端)——浏览器有 CORS 限制,后台表单不做第三方抓取;后台新建工具先得到生成封面,照片由脚本批量补。校验:content-type 必须 image/*,大小 ≤ 4MB,跟随跳转,超时 15s,失败即跳过(保留生成封面)。

## 组件

- `scripts/content-import/fetch-tool-photos.mjs`:守门式。dry-run 输出每个工具"找到的 og:image URL / 未找到"报告;--execute 下载→上传 photos/{slug}.*→cover_url 更新为照片 URL→读回验证。默认跳过 cover_url 已指向 photos/ 的行;`--force` 重抓。
- `src/components/tools/FeaturedToolCard.tsx`:banner 包一层 wrap,photo 时加遮罩类。
- `src/components/tools/tool-card-utils.ts`:`getToolIconUrl` 按 slug 推导;新增 `isPhotoCover()`。
- `src/app/globals.css`:banner wrap 与遮罩样式。

## 边界

不碰:文章卡(维持纯排版)、紧凑卡视觉、详情页(第二期)、后台表单抓取、数据库结构。

## 验证与回滚

- 脚本 dry-run 报告人工过目再 execute;执行后 /tools DOM 断言照片卡与生成卡并存、零占位;桌面+移动截图。
- 回滚:把某工具 cover_url 改回 covers/{slug}.svg 即回到生成封面;photos/ 文件留存不影响。
