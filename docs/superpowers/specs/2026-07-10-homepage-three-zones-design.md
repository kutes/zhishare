# 首页三段式重构 设计文档

日期:2026-07-10
来源:对比 best.xiaohu.ai 首页信息架构(3 区 vs 我们 7 区)得出的"混乱"根因;用户确认的取舍见下
状态:方案已经用户确认(薄 Hero 保留搜索;分类卡全删;现有广告区全删、悬浮广告留后期;移动端文章优先)

## 问题诊断

当前首页 7 个区(大 Hero / 分类入口 5 卡 / 合作伙伴 4 卡 / 精选 1+4 / 中部横幅 / 最新文章 3 / 更多工具 6)、5 种卡片式样互相竞争。内容量不小(13 真实工具 + 3 真实文章)但被切碎,识别度低。best.xiaohu.ai 的"简洁"来自狠删:薄 Hero + 1 张精选大卡 + 1 个统一网格,共 3 区。

## 目标结构

**桌面端(>760px)**:
1. 薄 Hero:一行站名口号 + 搜索框(保留现有 /search 表单行为)。删除大标题、英文 kicker、描述段、8 个热词、双 CTA 按钮。高度目标 ≈ 现在的 1/3。
2. 🛠 工具区:区头(「工具库」标题 + 真实收录数 + 「进入工具库 →」链接)→ 今日精选 1 张 `FeaturedToolCard`(优先有官方照片封面的工具,复用现有 pickFeatured 逻辑)→ 其余 12 个工具 `CompactToolCard` 统一 3 列网格。
3. 📄 文章区:区头(「文章」+「全部文章 →」)→ 3 张 `ArticleCard`。
4. 页脚:不动。

**移动端(≤760px)**:
- 顺序翻转为:薄 Hero → 📄 文章区 → 🛠 工具区 → 页脚(手机以文章阅读为主)。
- 工具区在移动端收敛:精选 1 张 + 紧凑卡最多 4 张,其余用 CSS 隐藏,区尾放「进入工具库」按钮。
- 实现:两个区块包在同一 flex-column 容器里,用媒体查询翻转 `order`;多余工具卡用 `nth-child` 范围隐藏。不写两套 DOM、不用 JS。

## 删除项

- 分类入口区(`CategoryCard`/`home-category-gateway.tsx`、portalCategories 数据、zh-channel-card 相关 CSS)
- 合作伙伴广告区(`PartnerAdCard`/`home-partner-ads.tsx`、partnerAds 数据、zh-partner-card CSS)
- 中部横幅(`PromoBanner`/`home-promo-banner.tsx`、zh-banner CSS)
- Hero 的热词行(heroHotwords 数据)、CTA 行、kicker、描述段
- 删组件必须同 pass 清掉其独占 CSS(共享选择器只摘除死选择器),遵循 AGENTS.md 既定清理规则

## 不做/后期

- **悬浮式可关闭广告**(网页两侧):用户明确留到后期单独设计,本期不做任何广告位。
- **详情页阅读体验改造**(导语段/编号章节头/文章图片块):下一期单独 spec,不混入本期。

## 复用与约束

- 卡片 100% 复用现有 3 组件(FeaturedToolCard / CompactToolCard / ArticleCard),不新做卡片。
- 数据仍由 `src/app/page.tsx` 的 `getPublishedTools()` / `getPublishedArticles()` 传入,真实数据规则不变。
- 不动数据库、后台、/tools、/articles、详情页、SiteHeader/SiteFooter、SEO metadata。
- cosmic-home-data.ts 在删除热词/分类/广告数据后为空,本期一并删除该文件(及其类型导出)。

## 验证与回滚

- tsc;桌面+移动截图(重点验证移动端区序翻转与工具卡收敛);DOM 断言(文章卡在移动视口先于工具卡出现——用截图确认视觉顺序);删除的组件按 AGENTS.md 规则 grep 确认 CSS 清理干净。
- 回滚:单一功能分支式提交,可整体 revert;被删组件在 git 历史里可恢复。
