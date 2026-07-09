# 详情页富媒体(第二期)设计文档

日期:2026-07-09
来源:借鉴 best.xiaohu.ai 详情页"图片块 + 说明文字 + 视频"的展现形式(仅呈现形式)
前置:第一期卡片照片层已上线;工具已有 tool-covers 桶与 cover_url

## 目标

工具详情页正文中可插入**带说明文字的截图**和**视频**,像 best.xiaohu.ai 的解读页那样图文并茂;没有配媒体的工具正文保持现状,不留空白。

## 关键约束与决策

1. **零 SQL、零控制台操作**(用户不做任何运维)。因此**不新增数据库列/表**——PostgREST + service key 无法执行 DDL,新增列必须在 Supabase 网页控制台跑 SQL,违背"用户什么都不操作"。
2. **媒体数据存为 Storage JSON 文件**:新建公开桶 `tool-media`,每个工具一份 `tool-media/{slug}.json`(媒体数组)。我用 service key 全程读写,用户零操作。
3. **详情页服务端读取**:详情页已是 `force-dynamic`,在服务组件里多一次读取该 JSON(公开 URL,`cache: no-store`,失败即视为无媒体、页面照常)。
4. **视频用嵌入不自托管**:只允许 Bilibili / YouTube 的白名单域名转成 `<iframe>`;不存 mp4(省 Supabase 1GB 额度,且规避版权/带宽)。白名单校验防止任意 iframe 注入(XSS)。
5. **图片来自官方**:截图/配图取自工具官网或官方文档,转存到 `tool-media/{slug}/` 或直接引用官方图;每张配一句中文说明。

## 媒体项数据结构

`tool-media/{slug}.json`:
```json
{
  "slug": "obsidian",
  "items": [
    { "type": "image", "url": "https://.../shot.png", "caption": "本地优先的双链笔记界面" },
    { "type": "embed", "provider": "bilibili", "url": "https://player.bilibili.com/player.html?bvid=...", "caption": "3 分钟上手演示" }
  ]
}
```
- `type`: `image` | `embed`
- `image`: url + caption
- `embed`: provider(bilibili|youtube) + 已转好的播放器 URL + caption
- 未知 type / 非白名单域名 → 该项跳过(防御)

## 组件与文件

- 新建公开桶 `tool-media`(守门脚本创建,同 Phase 1 建桶模式)
- `src/lib/media/tool-media.ts`:类型 + `fetchToolMedia(slug)`(读 storage JSON,校验+过滤非法项,失败返回空)+ `toEmbedSrc()` 白名单校验
- `src/components/tools/tool-media-gallery.tsx`:渲染图片块(img+caption 懒加载)与响应式 iframe;空数组渲染 null
- `src/components/tools/tool-detail-page.tsx`:在"核心功能"后插入 `<ToolMediaGallery>`(桌面与移动各一处)
- `src/app/tools/[slug]/page.tsx`:`fetchToolMedia(slug)` 并传入
- `src/app/globals.css`:图片块、说明文字、16:9 iframe 容器样式(暖色编辑部)
- `scripts/content-import/import-tool-media.mjs`:守门式,从内容 JSON 上传/写 `tool-media/{slug}.json`;dry-run 先出报告
- `docs/content/tool-media-seed-v1.json`:先给 2-3 个工具(Obsidian、Notion 等有官方素材的)配真实截图+说明,验证链路

## 边界

不碰:卡片(一二期已定)、文章系统、主 tools 查询、后台表单(媒体编辑作为 Phase 2b 追加,不阻塞本期)、数据库结构。

## 验证与回滚

- 建桶 dry-run→execute;seed 脚本 dry-run 报告过目→execute;详情页 DOM 断言媒体块出现、iframe 白名单生效、无媒体工具无空块。
- tsc + 截图(桌面+移动)。
- 回滚:删除某 slug 的 JSON 文件即回到纯文字详情;组件对空数据渲染 null。
