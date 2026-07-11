# 首页三段式重构 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 首页从 7 区收口为 3 段(薄 Hero / 工具区 / 文章区),移动端顺序翻转为"文章优先、工具收敛",全部复用现有卡片组件,零新依赖。

**Architecture:** `CosmicHomeHero.tsx` 只留一行 eyebrow + 搜索框;`CosmicHomeSections.tsx` 删除分类/合作伙伴/横幅三个区,把工具相关内容(精选大卡 + 更多工具网格)包进 `.zh-zone-tools`,文章内容包进 `.zh-zone-articles`,兄弟节点放进 `.zh-home-zones` flex 容器,靠 `order: -1` 媒体查询在移动端把文章区排到工具区前面(同一份 DOM,不重复渲染)。移动端额外用 `display:none` 隐藏"更多收录工具"网格,只留精选卡 + 4 张紧凑卡 + 一个"进入工具库"按钮。

**Tech Stack:** Next.js 15 (React Server Components) / TypeScript / 纯 CSS(`@layer components` + 媒体查询,`src/app/globals.css`),不引入 JS 断点逻辑。

**Spec:** `docs/superpowers/specs/2026-07-10-homepage-three-zones-design.md`

---

### Task 1: Hero 瘦身

**Files:**
- Modify: `src/components/home/CosmicHomeHero.tsx`

- [ ] **Step 1: 替换整个文件内容**

```tsx
import { SearchIcon } from "./home-search-icon";

const heroText = {
  eyebrow: "工具与知识发现站",
  searchPlaceholder: "搜索工具、文章或关键词",
  searchButton: "搜索",
};

export function CosmicHomeHero() {
  return (
    <section className="zh-shell zh-hero zh-hero-slim">
      <div className="zh-hero-stage-inner">
        <div className="zh-eyebrow">
          <span className="zh-eyebrow-dot" />
          {heroText.eyebrow}
        </div>

        <form action="/search" method="get" className="zh-search-bar zh-hero-search" role="search">
          <SearchIcon />
          <input
            className="zh-search-input"
            name="q"
            type="search"
            placeholder={heroText.searchPlaceholder}
            aria-label={heroText.searchPlaceholder}
            autoComplete="off"
          />
          <button className="zh-btn zh-btn-primary" type="submit">
            {heroText.searchButton}
          </button>
        </form>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: 抽出 SearchIcon 为独立文件(避免和后面的组件重复定义)**

Create `src/components/home/home-search-icon.tsx`:

```tsx
export function SearchIcon() {
  return (
    <svg className="hero-search-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 20l-4.6-4.6M18 10.8a7.2 7.2 0 1 1-14.4 0 7.2 7.2 0 0 1 14.4 0Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
```

- [ ] **Step 3: 类型检查**

Run: `npx tsc --noEmit`
Expected: 无输出(通过)。此时 `heroHotwords`/`portalCategories`/`partnerAds` 在 `cosmic-home-data.ts` 里仍未被引用清空,不影响 tsc(它们仍被 `CosmicHomeSections.tsx` 使用,到 Task 4 才会清空)。

- [ ] **Step 4: Commit**

```bash
git add src/components/home/CosmicHomeHero.tsx src/components/home/home-search-icon.tsx
git commit -m "feat: slim homepage hero to tagline + search only"
```

---

### Task 2: 薄 Hero 的 CSS(新增 `.zh-hero-slim`,不改旧类)

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: 定位 `.zh-hero {` 规则,在其后追加新规则**

Grep 确认位置:

Run: `grep -n "^  \.zh-hero {" src/app/globals.css`
Expected: 一行,形如 `1579:  .zh-hero {`

用 Edit 工具,在该规则的闭合 `}` 之后插入(把下面代码块整体加在 `.zh-hero { ... }` 规则结束的下一行):

```css
  .zh-hero-slim {
    padding-block: 1.75rem 0.5rem;
  }

  .zh-hero-slim .zh-hero-stage-inner {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    flex-wrap: wrap;
  }

  .zh-hero-slim .zh-eyebrow {
    margin: 0;
    flex-shrink: 0;
  }

  .zh-hero-slim .zh-hero-search {
    flex: 1;
    min-width: 260px;
    margin: 0;
  }

  @media (max-width: 640px) {
    .zh-hero-slim .zh-hero-stage-inner {
      flex-direction: column;
      align-items: stretch;
    }
  }
```

- [ ] **Step 2: 类型检查(CSS 不受 tsc 检查,但确认项目仍能编译)**

Run: `npx tsc --noEmit`
Expected: 无输出

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add slim hero layout CSS"
```

---

### Task 3: 首页三段容器与移动端顺序翻转的 CSS

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: 定位 `.zh-content-flow {` 规则,在其后追加**

Run: `grep -n "\.zh-content-flow {" src/app/globals.css`

在找到的规则块结束后插入:

```css
  .zh-home-zones {
    display: flex;
    flex-direction: column;
    gap: clamp(36px, 5vh, 58px);
  }

  .zh-zone-tools-mobile-cta {
    display: none;
  }

  @media (max-width: 760px) {
    .zh-zone-articles {
      order: -1;
    }

    .zh-zone-more-tools {
      display: none;
    }

    .zh-zone-tools-mobile-cta {
      display: flex;
      justify-content: center;
      margin-top: 18px;
    }
  }
```

- [ ] **Step 2: tsc 检查**

Run: `npx tsc --noEmit`
Expected: 无输出

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add homepage zone container and mobile article-first ordering CSS"
```

---

### Task 4: 重构 CosmicHomeSections.tsx 为工具区 + 文章区

**Files:**
- Modify: `src/components/home/CosmicHomeSections.tsx`

- [ ] **Step 1: 替换整个文件内容**

```tsx
import Link from "next/link";
import type { PublishedArticle } from "@/types/article";
import type { ToolItem } from "@/types/tool";
import { ArticleCard } from "@/components/articles/article-card";
import { CompactToolCard } from "@/components/tools/CompactToolCard";
import { FeaturedToolCard } from "@/components/tools/FeaturedToolCard";
import { SectionHeader } from "./home-section-header";

type CosmicHomeSectionsProps = {
  tools: ToolItem[];
  articles: PublishedArticle[];
};

// Hero prefers a tool that already has a real photo cover so the largest slot
// shows a photograph; falls back to the first published tool.
function pickFeatured(tools: ToolItem[]) {
  const withPhoto = tools.find((tool) => (tool.cover_url ?? "").includes("/tool-covers/photos/"));
  const hero = withPhoto ?? tools[0];
  if (!hero) {
    return { hero: null, sideTools: [] as ToolItem[] };
  }
  const sideTools = tools.filter((tool) => tool.id !== hero.id).slice(0, 4);
  return { hero, sideTools };
}

const sectionCopy = {
  featured: {
    title: "精选工具与开源项目",
    description: "筛选更值得收藏的 AI 工具、开源项目、自托管方案和效率软件。",
  },
  latest: {
    title: "最新文章与实战指南",
    description: "工具选择、避坑经验和效率方案，帮助你在收藏前判断值不值得深入。",
  },
  more: {
    title: "更多收录工具",
    description: "继续浏览已整理的 AI 工具、开源项目、效率软件和在线工具。",
  },
};

export function CosmicHomeSections({ tools, articles }: CosmicHomeSectionsProps) {
  const { hero, sideTools } = pickFeatured(tools);
  const featuredIds = new Set([hero?.id, ...sideTools.map((tool) => tool.id)].filter(Boolean));
  const moreTools = tools.filter((tool) => !featuredIds.has(tool.id)).slice(0, 6);
  const latestArticles = articles.slice(0, 6);

  return (
    <section className="zh-shell zh-home-sections zh-content-flow">
      <div className="zh-home-zones">
        <div className="zh-zone-tools">
          {hero && (
            <div className="zh-section zh-section-featured">
              <SectionHeader
                eyebrow="Tools"
                title={sectionCopy.featured.title}
                description={sectionCopy.featured.description}
                href="/tools"
              />
              <div className="zh-feature-layout">
                <FeaturedToolCard tool={hero} />
                <div className="zh-feature-small-grid">
                  {sideTools.map((tool) => (
                    <CompactToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {moreTools.length > 0 && (
            <div className="zh-section zh-section-more zh-zone-more-tools">
              <SectionHeader
                eyebrow="More"
                title={sectionCopy.more.title}
                description={sectionCopy.more.description}
                href="/tools"
              />
              <div className="zh-grid zh-grid-3">
                {moreTools.map((tool) => (
                  <CompactToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          )}

          <div className="zh-zone-tools-mobile-cta">
            <Link className="zh-btn zh-btn-primary" href="/tools">
              进入工具库
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {latestArticles.length > 0 && (
          <div className="zh-zone-articles zh-section zh-section-latest">
            <SectionHeader
              eyebrow="Articles"
              title={sectionCopy.latest.title}
              description={sectionCopy.latest.description}
              href="/articles"
            />
            <div className="zh-home-article-grid">
              {latestArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: 类型检查**

Run: `npx tsc --noEmit`
Expected: 无输出(通过)。此时 `home-category-gateway.tsx`、`home-partner-ads.tsx`、`home-promo-banner.tsx`、`cosmic-home-data.ts` 都已无人引用,但文件还没删除,tsc 不会因未使用的文件报错。

- [ ] **Step 3: Commit**

```bash
git add src/components/home/CosmicHomeSections.tsx
git commit -m "feat: restructure homepage into tools zone + articles zone, drop category/partner/banner sections"
```

---

### Task 5: 删除死组件、死数据文件、死 CSS,双端截图验证

**Files:**
- Delete: `src/components/home/home-category-gateway.tsx`
- Delete: `src/components/home/home-partner-ads.tsx`
- Delete: `src/components/home/home-promo-banner.tsx`
- Delete: `src/components/home/cosmic-home-data.ts`
- Modify: `src/app/globals.css`

- [ ] **Step 1: 确认这 4 个文件已无引用**

Run:
```bash
grep -rl "home-category-gateway\|home-partner-ads\|home-promo-banner\|cosmic-home-data" src --include=*.tsx --include=*.ts
```
Expected: 无输出(zero matches)

- [ ] **Step 2: 删除 4 个文件**

```bash
git rm src/components/home/home-category-gateway.tsx src/components/home/home-partner-ads.tsx src/components/home/home-promo-banner.tsx src/components/home/cosmic-home-data.ts
```

- [ ] **Step 3: 类型检查**

Run: `npx tsc --noEmit`
Expected: 无输出(通过)

- [ ] **Step 4: 逐个确认下列 CSS 类是否还有 tsx 引用,记录结果**

Run:
```bash
for cls in zh-channel-card zh-partner-card zh-banner zh-ad-label zh-hero-anomaly zh-hero-orb zh-hero-field zh-hero-title zh-hero-kicker zh-hero-desc zh-categories zh-categories-label zh-pill zh-pill-active zh-cta-row zh-section-channels zh-section-partners; do
  n=$(grep -rl "$cls" src --include=*.tsx | wc -l)
  echo "$cls: $n"
done
```

预期结果解读(照这个表处理,不要凭记忆猜):
- `zh-channel-card`、`zh-partner-card`、`zh-banner`、`zh-ad-label`、`zh-categories`、`zh-categories-label`、`zh-pill`、`zh-pill-active`、`zh-cta-row`、`zh-section-channels`、`zh-section-partners` — 应为 **0**,可删对应 CSS 规则。
- `zh-hero-anomaly`、`zh-hero-orb`、`zh-hero-field` — 应为 **0**(Task 1 已把 Hero 换成 `zh-hero-slim`,不再用 `zh-hero-anomaly` 类),可删。
- `zh-hero-title`、`zh-hero-kicker`、`zh-hero-desc` — 应为 **0**(Task 1 已删除对应 JSX),可删。

若任何一项实际计数不是 0,停下来读引用它的文件,不要删该类的 CSS。

- [ ] **Step 5: 删除 "Hero anomalous matter stage v5" 整块**

Run: `grep -n "Hero anomalous matter stage v5\|End hero anomalous matter stage v5" src/app/globals.css`

用 Read 工具查看该注释标记之间的完整内容,确认块内选择器全部是 `.warm-home-page .zh-hero-anomaly` 及其后代(不含任何 Step 4 表格之外的类),然后用 Edit 把从 `/* Hero anomalous matter stage v5 */` 到 `/* End hero anomalous matter stage v5 */`(含首尾两行注释)整体删除。

- [ ] **Step 6: 删除分类入口区 CSS**

用 Grep 定位并删除以下选择器所在的规则(包括它们出现在响应式媒体查询里的重复声明):`.zh-channel-card`、`.zh-section-channels`、`.zh-grid-5`(先确认第 4 步计数结果里 `zh-grid-5` 是否仍被非分类区使用——若 `portalCategories` 是唯一使用者则删,若发现其他网格也用了 `zh-grid-5` 则保留)。

- [ ] **Step 7: 删除合作伙伴区 CSS**

删除 `.zh-partner-card`、`.zh-ad-label`、`.zh-section-partners` 相关规则(含媒体查询里的重复声明)。

- [ ] **Step 8: 删除横幅区 CSS**

删除 `.zh-banner` 相关规则(含媒体查询里的重复声明)。`.zh-section-eyebrow` 规则本身**不要删**——它被 `SectionHeader` 组件共用,只删专属于 `.zh-banner` 的规则。

- [ ] **Step 9: 删除旧 Hero 专属 CSS**

删除 `.zh-hero-title`、`.zh-hero-kicker`、`.zh-hero-desc`、`.zh-categories`、`.zh-categories-label`(先确认第 4 步没有其它引用者)、`.zh-pill`、`.zh-pill-active`、`.zh-cta-row` 相关规则。`.zh-eyebrow`、`.zh-eyebrow-dot`、`.zh-search-bar`、`.zh-search-input`、`.zh-btn` 系列**不要删**(薄 Hero 和其它页面仍在用)。

- [ ] **Step 10: 括号平衡 + tsc 检查**

Run:
```bash
node -e "
const fs=require('fs');const s=fs.readFileSync('src/app/globals.css','utf8');
const open=(s.match(/\{/g)||[]).length, close=(s.match(/\}/g)||[]).length;
console.log('OPEN:',open,'CLOSE:',close,'BALANCED:',open===close);
"
npx tsc --noEmit
```
Expected: `BALANCED: true`,tsc 无输出

- [ ] **Step 11: 起服务并双端截图**

```bash
npm run dev -- -p 3001
```
等待就绪后(或用已有的 preview 工具):
```bash
npm run capture:homepage
```
用 Read 工具查看 `artifacts/homepage-screenshots/homepage-desktop.png` 和 `homepage-mobile.png`,确认:
- 桌面:薄 Hero(一行口号+搜索框,无大标题)→ 工具区(精选大卡+4紧凑卡+"更多收录工具"6卡网格)→ 文章区(3卡)→ 页脚。分类入口、合作伙伴、中部横幅均已消失。
- 移动:薄 Hero → 文章区(3卡)先于工具区出现 → 工具区只有精选卡+4紧凑卡+"进入工具库"按钮,无"更多收录工具"网格 → 页脚。

若布局不对,回到对应 Task 的 CSS 修正,不要跳过这一步直接提交。

- [ ] **Step 12: 记录 + Commit**

在 `docs/COSMIC_REDESIGN_LOG.md` 末尾追加:

```markdown

### Step 53 - Homepage three-zone restructure (mobile article-first)

Status: completed

- Collapsed the homepage from 7 sections to 3: slim hero (tagline + search only), tools zone (featured card + compact grid + "more tools" grid), articles zone (3 article cards).
- Removed the category gateway, partner-ad strip, and mid-page promo banner sections entirely (deferred: floating dismissible ad units, per user decision, not part of this change).
- Mobile (<=760px): CSS-only reorder puts the articles zone before the tools zone (single DOM, `order: -1`, no duplicate markup); the "more tools" grid is hidden on mobile, replaced by a "进入工具库" CTA button after the abbreviated tools zone (featured + 4 compact cards).
- Deleted 4 now-dead files: home-category-gateway.tsx, home-partner-ads.tsx, home-promo-banner.tsx, cosmic-home-data.ts, plus their exclusive CSS (zh-channel-card, zh-partner-card, zh-banner, zh-ad-label, zh-hero-anomaly decorative stage, old zh-hero-title/kicker/desc, zh-categories, zh-pill, zh-cta-row).
- Verified via tsc + desktop/mobile screenshot comparison.
```

```bash
git add src/components/home/ src/app/globals.css docs/COSMIC_REDESIGN_LOG.md
git commit -m "refactor: collapse homepage to 3 zones, delete dead category/partner/banner code"
```

---

## 依赖顺序

Task 1 → Task 2(依赖 Task 1 的 `.zh-hero-slim` 类名已在 JSX 里)→ Task 3(独立,可与 Task 2 并行,但建议顺序做以减少并发编辑同一文件的冲突)→ Task 4(依赖 Task 1-3 的 CSS 类已就绪)→ Task 5(依赖 Task 1-4 全部完成,才能安全判断哪些文件/类真正死亡)。
