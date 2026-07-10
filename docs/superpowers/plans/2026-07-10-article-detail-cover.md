# 文章详情页封面 Implementation Plan

> **For agentic workers:** 本计划为低上下文执行者编写:严格按步骤执行,不要即兴发挥,不要顺手重构任何本计划未提到的代码。每步的代码块是完整的、可直接使用的。遇到与预期不符的情况(grep 找不到锚点、tsc 报错、截图不对)立即停下报告,不要猜。

**Goal:** 文章详情页(/articles/[slug])渲染封面图。目前封面 URL 已在数据里(article.cover_url),但页面一张图都没渲染。

**Architecture:** 封面以"内嵌圆角横幅带"(inset rounded band)形式放在 hero 卡片顶部,桌面 21:9 影院比例、移动 16:9;相关推荐卡同样加小封面带。不用负边距贴边(hero 卡 padding 是 clamp 动态值,负边距难以精确匹配,内嵌圆角更稳)。cover_url 为空时不渲染任何占位(页面回到现状,不留空框)。

**Tech Stack:** 纯 JSX + CSS 改动。不动数据层(cover_url 已由 normalizeArticle 提供)、不动路由、不加依赖。

**设计依据(为什么这样设计,执行者无需关心但可参考):**
- 与文章列表卡刚确立的 cover-on-top 视觉语言一致;
- 生成式封面是装饰性图案(首字母+分类纹理),21:9 短横幅让它作为"编辑部刊头装饰带",不会像 16:9 全幅那样在 1000px 宽的卡里占掉 560px 高度、喧宾夺主;
- 文章没有官网,无照片层;cover_url 为空直接不渲染,不做占位框。

---

### Task 1: 详情页 hero 卡加封面带

**Files:**
- Modify: `src/components/articles/article-detail-page.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: 在 hero 卡片内、kicker 行之前插入封面**

打开 `src/components/articles/article-detail-page.tsx`,找到这段(约第 29-33 行):

```tsx
            <div className="article-detail-hero-card">
              <div className="article-detail-kicker-row">
```

把它替换为:

```tsx
            <div className="article-detail-hero-card">
              {article.cover_url?.trim() ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="article-detail-cover"
                  src={article.cover_url}
                  alt=""
                  loading="eager"
                />
              ) : null}

              <div className="article-detail-kicker-row">
```

不要改动该文件的任何其它内容。

- [ ] **Step 2: 加封面带 CSS**

Run: `grep -n "^  \.article-detail-hero-card {" src/app/globals.css`
Expected: 恰好一行,形如 `733:  .article-detail-hero-card {`

打开 `src/app/globals.css`,找到:

```css
  .article-detail-hero-card {
    margin-top: 1rem;
    padding: clamp(1.1rem, 1vw + 1rem, 1.6rem);
  }
```

在这条规则的闭合 `}` 之后、下一条规则之前,插入:

```css
  .article-detail-cover {
    display: block;
    width: 100%;
    aspect-ratio: 21 / 9;
    margin-bottom: 1.1rem;
    border: 1px solid rgba(255, 247, 237, 0.1);
    border-radius: 18px;
    object-fit: cover;
  }

  @media (max-width: 760px) {
    .article-detail-cover {
      aspect-ratio: 16 / 9;
      border-radius: 14px;
    }
  }
```

- [ ] **Step 3: 类型检查**

Run: `npx tsc --noEmit`
Expected: 无输出(通过)。若报错,停下报告错误原文。

- [ ] **Step 4: Commit**

```bash
git add src/components/articles/article-detail-page.tsx src/app/globals.css
git commit -m "feat: render cover band on article detail hero"
```

---

### Task 2: 相关推荐卡加小封面带

**Files:**
- Modify: `src/components/articles/article-detail-page.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: 相关卡加封面**

在同一文件里找到这段(约第 131-140 行):

```tsx
                {relatedArticles.map((relatedArticle) => (
                  <article key={relatedArticle.id} className="article-detail-related-card">
                    <span className="article-detail-tag">{relatedArticle.category}</span>
```

替换为:

```tsx
                {relatedArticles.map((relatedArticle) => (
                  <article key={relatedArticle.id} className="article-detail-related-card">
                    {relatedArticle.cover_url?.trim() ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className="article-detail-related-cover"
                        src={relatedArticle.cover_url}
                        alt=""
                        loading="lazy"
                      />
                    ) : null}
                    <span className="article-detail-tag">{relatedArticle.category}</span>
```

该 map 块其余行(h3、p、Link、闭合标签)保持原样不动。

- [ ] **Step 2: 加相关卡封面 CSS**

Run: `grep -n "^  \.article-detail-related-card {" src/app/globals.css`
Expected: 恰好一行。

在 `.article-detail-related-card { ... }` 规则的闭合 `}` 之后插入:

```css
  .article-detail-related-cover {
    display: block;
    width: 100%;
    aspect-ratio: 21 / 9;
    margin-bottom: 0.85rem;
    border: 1px solid rgba(255, 247, 237, 0.08);
    border-radius: 12px;
    object-fit: cover;
  }
```

- [ ] **Step 3: 类型检查**

Run: `npx tsc --noEmit`
Expected: 无输出(通过)

- [ ] **Step 4: Commit**

```bash
git add src/components/articles/article-detail-page.tsx src/app/globals.css
git commit -m "feat: add cover bands to related article cards"
```

---

### Task 3: 验证(必须执行,不许跳过)

- [ ] **Step 1: 确认 dev server 在 3001 端口运行**

Run: `node -e "fetch('http://localhost:3001').then(r=>console.log('SERVER_OK',r.status)).catch(()=>console.log('SERVER_DOWN'))"`

若输出 SERVER_DOWN:后台启动 `npm run dev -- -p 3001`,等待就绪后继续。

- [ ] **Step 2: DOM 断言**

Run:
```bash
node -e "
fetch('http://localhost:3001/articles/free-ai-tools-safety').then(r=>r.text()).then(html=>{
  console.log('hero cover:', (html.match(/article-detail-cover\b/g)||[]).length);
  console.log('related covers:', (html.match(/article-detail-related-cover\b/g)||[]).length);
  console.log('mojibake:', (html.match(/\?{3,}/g)||[]).length);
});"
```
Expected: `hero cover:` 至少 1;`related covers:` ≥ 0(有同分类文章才有);`mojibake: 0`。

- [ ] **Step 3: 截图人工核对**

Run: `npm run capture:articles`
然后用 Read 工具查看:
- `artifacts/articles-screenshots/article-detail-free-ai-tools-safety-desktop.png` — hero 卡顶部应有一条 21:9 的圆角封面横幅(暖色底、大字+纹理),下方是 kicker/标题/摘要;
- `artifacts/articles-screenshots/article-detail-free-ai-tools-safety-mobile.png` — 封面为 16:9,不溢出。

任何一项不符,停下报告,附截图路径。

- [ ] **Step 4: 记录 + Commit**

在 `docs/COSMIC_REDESIGN_LOG.md` 末尾追加:

```markdown

### Step 58 - Article detail cover band

Status: completed

- Article detail hero card now renders the generated cover as an inset rounded 21:9 band (16:9 on mobile) above the kicker/title; related-article cards got matching small cover bands.
- cover_url data was already flowing (Step 57); this step only adds the missing presentation. Empty cover_url renders nothing (no placeholder box).
- Verified via tsc, DOM assertions, and desktop/mobile screenshots.
```

```bash
git add docs/COSMIC_REDESIGN_LOG.md
git commit -m "docs: record article detail cover band step"
```

---

## 边界(执行者必读)

- 只改本计划列出的 2 个文件 + 日志;**不要**动列表页卡片、首页、工具页、数据层、后台。
- `article.cover_url` 类型已是 `string | null | undefined`(ArticleItem 上,前一步已加),不需要改任何类型定义;若 tsc 报 cover_url 不存在,停下报告,不要自行加类型。
- 不要引入 next/image,保持原生 `<img>`(与全站现有封面实现一致)。
