# 工具详情页富内容标准 v2

## 背景

v1 批次（batch-a、batch-ahfs-1）只填了 summary + 单段 description + 折叠列表，详情页显得单薄。
本标准定义"富详情页"的内容预设。前端已支持全部能力，无需改代码：

- `description` 渲染时保留换行（`white-space: pre-line`），支持多段正文
- `tool-media/{slug}.json`（storage 桶）渲染为图片画廊 + B站/YouTube 视频嵌入
- 同一 JSON 里的 `features` 渲染为「核心功能」列表（注意：tools 表实际没有 features 列，DATABASE_SCHEMA.md 写超前了；前端从 media JSON 合并）
- 同一 JSON 里的 `officialDownloadUrl` 点亮「官方下载」按钮

## 内容预设（每个工具）

### 1. description：3-4 段结构化正文（替代单段）

固定段落顺序，段间空行分隔：

1. **是什么/解决什么问题**：先说痛点场景，再说这个工具怎么解决（2-4 句）
2. **实际怎么用**：核心工作流走一遍，写具体操作和界面行为，不写空话（3-5 句）
3. **成本与平台**：免费/付费边界、API Key/账号要求、支持的系统（2-3 句）
4. **上手提示**（可选）：第一次用最容易卡住的点（1-2 句）

红线沿用 TOOL_CONTENT_SCHEMA：不编造价格/评分/用户数，没实测不写"我试过"。

### 2. features：4-6 条核心功能

每条一行，动宾结构 + 一个可验证细节。反例："功能强大"；正例："AI 从课件里拆出可考知识点，每个带难度和资料出处"。

### 3. 媒体画廊：2-5 张图 + 可选视频

- **只用工具官方来源**：官网页面、GitHub README/docs 里项目自己发布的截图、官方演示视频
- **禁止**使用 ahhhhfs 或其他第三方博客的配图（版权红线）
- 图片转存到 `tool-media` 桶（`tool-media/shots/{slug}-{n}.jpg`），不热链原站
- 每张图必须写 caption：说明这张图是什么界面/什么操作
- 视频仅限 B站/YouTube 官方发布的演示（前端 iframe 白名单只放行这两家），有就挂，没有不硬找
- GIF 动图可作为 image 类型直接使用（保留 .gif 原格式转存）

### 4. officialDownloadUrl

官方 Releases/下载页链接，写进 `tool-media/{slug}.json`，点亮详情页灰色的「官方下载」按钮。

## tool-media/{slug}.json 格式

```json
{
  "officialDownloadUrl": "https://github.com/xxx/releases",
  "items": [
    { "type": "image", "url": "https://<supabase>/storage/v1/object/public/tool-media/shots/slug-1.jpg", "caption": "主界面：..." },
    { "type": "embed", "provider": "bilibili", "url": "https://player.bilibili.com/player.html?bvid=...", "caption": "官方演示" }
  ]
}
```

## 落地流程（每个工具）

1. 从官网/GitHub README 收集官方截图 URL 和 Releases 链接
2. 按预设写 description（多段）+ features
3. 跑守门脚本 `enrich-tool-detail.mjs`（dry-run 默认）：转存图片 → 上传 media JSON → 更新 tools 行 → 回读验证
4. 本地开发服务器目检详情页
5. 存量工具逐批补齐，新批次直接按本标准写
