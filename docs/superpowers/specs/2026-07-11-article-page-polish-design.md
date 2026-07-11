# 文章页三项优化 设计文档(标题排版 / 详情页白色 / 素材自动插入)

日期:2026-07-11。用户已确认的决策:标题缩小+居中;素材=官方优先+CC0 补充、全自动插入;白色只做详情页(全站黑白切换列为将来独立项目)。三项独立,按 A→B→C 顺序小步提交。

## A. 标题排版修正

**Files:** `src/app/globals.css`

- `.article-detail-title`:`font-size: clamp(1.9rem, 3.4vw, 2.75rem)`;`line-height: 1.15`;删除 `max-width: 16ch`;`margin-left/right: auto` 不需要(用容器居中)。
- 760px 断点内的 `.article-detail-title` 覆盖改为 `clamp(1.6rem, 7vw, 2.1rem)`。
- hero 卡内容整体居中:`.article-detail-hero-card` 加 `text-align: center`;`.article-detail-kicker-row`、`.article-detail-meta`、`.article-detail-tags` 加 `justify-content: center`。封面带不受影响(块级 100% 宽)。
- 摘要 `.article-detail-summary` 若有 max-width,加 `margin-inline: auto`。

## B. 文章详情页白色(仅 /articles/[slug])

**Files:** `src/app/globals.css`(只动 article-detail 相关规则)

`.article-detail-warm-page` 上定义页面级变量,article-detail 规则全部改引用变量;将来全站主题切换时这套变量直接接入,不返工:

```css
.article-detail-warm-page {
  --ad-bg: #faf6f0;            /* 页面底 */
  --ad-surface: #ffffff;       /* 卡面 */
  --ad-surface-soft: #fdf9f3;  /* 次级卡面/列表项 */
  --ad-border: rgba(35, 25, 15, 0.12);
  --ad-text: #2a211b;          /* 主文字 */
  --ad-text-muted: rgba(42, 33, 27, 0.68);
  --ad-text-faint: rgba(42, 33, 27, 0.5);
  --ad-accent: #b06e22;        /* 白底强调(原 #E3A75F 对比度不够) */
  --ad-accent-soft: rgba(176, 110, 34, 0.08);   /* tldr/why 底 */
  --ad-accent-border: rgba(176, 110, 34, 0.25);
}
```

规则:
- 页面背景改 `var(--ad-bg)`(替换暖黑渐变);所有 article-detail-* 的颜色值逐条换成对应变量。字号/间距/圆角一律不动。
- 速览框/WHY 框:`--ad-accent-soft` 底 + `--ad-accent-border` 边 + `--ad-text` 字;KEY 框左线 `--ad-accent`、底 `--ad-surface-soft`。
- 编号圆圈/小节标签/kicker:`--ad-accent`。
- 共享媒体块作用域覆盖:`.article-detail-warm-page .tool-media-item / .tool-media-caption` 改浅色边框与图注色(工具页不受影响)。
- 相关推荐卡、侧栏卡、广告位框:卡面白、边框浅。
- SiteHeader/SiteFooter 保持全站暖黑(深导航+浅正文成立);/articles 列表页不动。
- hero 卡封面带下方原有暖色 scrim 类若只在深色下成立,检查后调整或去除。

**验证:** 桌面+移动截图人工核对对比度;DOM 断言不变(结构没动);tsc(无 TS 改动,跑一遍保险)。

## C. 素材全自动插入(守门脚本)

**Files:** `scripts/content-import/insert-article-media.mjs`(新)

流程(dry-run 默认 → 报告 → `--execute` → 回读验证):

1. 读已发布文章。content 已含 `[IMG]` 或 `[VIDEO]` 的整篇跳过(不重复插)。
2. **官方素材层:** 取已发布工具的 `{name, slug, cover_url}`,筛出 cover_url 含 `/tool-covers/photos/` 的(库里已有官方图)。对每篇文章按小节扫描正文纯文本,工具名(不区分大小写)首次出现的小节记为插入点;每篇最多取前 2 个命中工具。在该小节最后一行之后(下一个 `##` 之前)插入:`[IMG] {photo_url} | 「{工具名}」官网视觉素材，来源：{工具名}官方`。
3. **CC0 补充层:** 零命中的文章,用 Openverse API(`api.openverse.org/v1/images/?license=cc0&q={第一个标签}`,免 key)取首个可下载结果,下载转存到 `article-media` 桶(`cc0/{article-slug}.{ext}`,新建公开桶,复用 create-*-bucket 模式),插入第 1 节末尾,图注 `示意图，来源：Openverse（CC0）`。下载失败/无结果 → 该篇跳过并记入报告,不算失败。
4. 每篇改动过反乱码门(含 CJK、无 `??` 连串),更新 content + updated_at,回读比对一致。
5. 报告 `docs/content/insert-article-media-report-v1.json`:每篇 `{slug, inserted:[{section, tool/cc0, url}], skipped_reason}`。

**边界:** 不动文章封面(cover_url);不动工具页;图注句式固定以「来源：XXX」结尾(标准第 6 条零容忍);Openverse 仅 license=cc0 过滤。

**验证:** dry-run 报告人工核对插入点合理;execute 后 capture:articles 截图确认图片块在白色页面渲染正常;解析器自检已覆盖 [IMG] 语法,无需新断言。

## 回滚

A/B 纯 CSS,revert 即回。C 动了 DB content:报告里有每篇插入的确切行,可写反向脚本删除;或从 git 里的旧 content 备份恢复(执行前 dry-run 报告即备份清单)。
