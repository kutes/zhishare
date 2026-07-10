# 文章内容标准落地 设计文档

日期:2026-07-10
来源:`docs/ARTICLE_CONTENT_STANDARD.md`(已提交,记录了从 best.xiaohu.ai 研究出的写作/排版标准)
状态:标记语法已用户确认(见下),本文档补完数据模型、解析器、渲染、CSS 的具体实现设计

## 目标

把 `ARTICLE_CONTENT_STANDARD.md` 里的 6 条核心规则(来源披露、编号小节、双段式导语、WHY 框、KEY 高亮框、图/视频配来源说明)变成真正渲染出来的页面效果,同时:

- 不改数据库结构(`articles.content` 仍是一个 Markdown 文本字段)
- 不改后台编辑器 UI(仍是一个 `<textarea>`)
- 已有的 5 篇文章不用改一个字就能自动获得编号小节 + 导语加大的效果(向后兼容)
- 3 个"可选组件"(prompt 代码框、多图网格、案例墙)本次**不实现**,标准文档已注明按需再加,避免建渲染不到的死代码

## 标记语法(已确认)

```markdown
[来源] 一句话来源说明。

## [发布] 小节标题

第一段是结论（自动变成 lead 大字）。

第二段是展开（自动变成 big 次大字）。

第三段起就是普通正文。

[WHY] 全文只放一次，说明这事和读者有什么关系。

[KEY 标签文字] 正文，可以用 **两个星号** 加粗关键短语。

[IMG] https://example.com/a.jpg | 说明文字，必须以“来源：XXX”结尾。

[VIDEO] https://player.bilibili.com/... | 说明文字，来源：XXX。

- 列表项照旧用短横线
```

规则:
- `[来源] ...` 只能出现在全文最前面(第一个 `##` 之前),全文最多一处。
- `## [标签] 标题` 里的 `[标签]` 可选;省略时该小节没有短标签,只有编号。
- 每个 `##` 小节内,**紧跟标题之后、且中间没有其它类型内容插入**的前两个普通段落自动升级为 `lead`/`big`;跳过 `[WHY]`/`[KEY]`/`[IMG]`/`[VIDEO]`/列表之后出现的段落一律 `normal`(不回溯)。
- `[KEY 标签]` 的标签和正文用空格分隔;正文里 `**文字**` 转成 `<b>`(仅这一种内联标记,不做完整 Markdown 内联解析)。
- `[IMG]`/`[VIDEO]` 用 `|` 分隔 URL 和说明文字;两侧空格自动裁剪。`[VIDEO]` 的 URL 必须匹配既有的 bilibili/youtube 域名白名单(复用 `src/lib/media/tool-media.ts` 的 `getEmbedProvider`),不匹配则整块跳过渲染(容错,不报错崩页)。
- 旧文章(没有任何新记号)完全兼容:每个 `##` 下的段落走"前两段自动 lead/big"规则,等于免费获得新样式。

## 数据模型

**Files:** `src/components/articles/article-content.ts`

替换现有的 `ArticleSection` 联合类型,改成"一个小节一个对象,内含有序的 blocks 数组"(修复现存的一个小 bug:旧模型里混合内容——段落+列表——会拆成两个共享同一 title 的 section 对象,渲染时标题会重复出现两次;新模型每个 `##` 只对应一个对象,标题只渲染一次):

```typescript
export type ArticleBlock =
  | { kind: "paragraph"; text: string; weight: "lead" | "big" | "normal" }
  | { kind: "list"; items: string[] }
  | { kind: "why"; text: string }
  | { kind: "keypoint"; tag: string; text: string }
  | { kind: "photo"; url: string; caption: string }
  | { kind: "video"; url: string; caption: string; provider: "bilibili" | "youtube" };

export type ArticleSection = {
  number: number;
  tag?: string;
  title: string;
  blocks: ArticleBlock[];
};

export type ArticleItem = MockArticle & {
  slug: string;
  tags: string[];
  sections: ArticleSection[];
  sourceNote?: string;
  cover_url?: string | null;
};
```

(用 `kind` 而不是复用旧的 `type` 字段名,避免和 `ArticleSection` 曾经的 `type` 字段混淆,方便全局 grep 区分新旧代码。)

## 解析器重写

**Files:** `src/lib/db/normalizers.ts`(替换 `parseArticleSections` 及其调用点)

算法(状态机,单趟扫描):

1. 逐行扫描。先处理"文首来源披露":如果还没遇到第一个 `##`,且当前行匹配 `/^\[来源\]\s*(.+)$/`,记录为 `sourceNote`,跳过该行。
2. 遇到 `## [标签]? 标题` (正则 `/^#{1,3}\s*(?:\[([^\]]+)\])?\s*(.+)$/`):把当前正在构建的 section(如果有)推入结果数组;新开一个 section,`number` = 结果数组长度 + 1,`tag` = 捕获组 1(可能是 undefined),`title` = 捕获组 2,`blocks = []`,并重置"是否仍在小节开头"的标记为 true。
3. 遇到 `[WHY] 文字`:推入 `{kind:"why", text}` block,标记"不再是小节开头"。
4. 遇到 `[KEY 标签] 正文`(正则 `/^\[KEY\s+([^\]]+)\]\s*(.+)$/`):`**x**` 替换成占位标记,推入 `{kind:"keypoint", tag, text}`(text 保留 `**`,渲染时再转 `<b>`,不在解析阶段转 HTML 字符串,避免 XSS 面);标记"不再是小节开头"。
5. 遇到 `[IMG] url | caption`:按 `|` split,两段 trim;推入 `{kind:"photo", url, caption}`;标记"不再是小节开头"。
6. 遇到 `[VIDEO] url | caption`:同上,额外调用 `getEmbedProvider(url)`(从 `src/lib/media/tool-media.ts` 导入,该函数已存在、已在工具详情页验证过白名单逻辑);返回 null 则整行跳过(不 push 任何 block);返回 provider 则推入 `{kind:"video", url, caption, provider}`。
7. 遇到列表行(复用现有正则 `/^(?:[-*•]|\d+[.)])\s+(.+)$/`):如果上一个 block 也是 `kind:"list"` 就 push 进它的 `items`,否则新开一个 `{kind:"list", items:[...]}` block;标记"不再是小节开头"。
8. 遇到 `---` 或空行:跳过,不改变状态(旧逻辑里空行用来触发 flush,新模型不需要——block 边界由记号本身决定,不依赖空行)。
9. 其余非空行 = 普通段落。**每一行独立成一个 paragraph block,不做跨行合并**(对齐现有旧解析器的行为:一行 = 一段,不是按空行分隔多行拼成一段):
   - 若当前"仍是小节开头"且这是遇到的第 1 个普通段落 → `weight:"lead"`。
   - 若"仍是小节开头"且这是第 2 个普通段落 → `weight:"big"`,之后清除"小节开头"标记。
   - 否则 → `weight:"normal"`。
   - 推入 `{kind:"paragraph", text, weight}`。
10. 扫描结束,把最后一个 section(如果有)推入结果数组。
11. 如果全文没有任何 `##`(结果数组为空),回退成一个单独 section:`{number:1, title:"文章说明", blocks:[{kind:"paragraph", text: summary, weight:"lead"}]}`(对齐现有 `readArticleSections` 的兜底行为)。

`readArticleSections(content, summary)` 函数签名不变,内部改调新解析器,返回值加一个 `sourceNote`(从解析器一并返回,函数签名改成返回 `{ sections, sourceNote }`,调用处 `normalizeArticle` 解构后分别赋给 `article.sections` 和 `article.sourceNote`)。

## 渲染组件重写

**Files:** `src/components/articles/article-detail-page.tsx`

`ArticleContentSection` 组件整体重写:

```tsx
function ArticleContentSection({ section }: { section: ArticleSection }) {
  return (
    <section className="article-detail-section">
      <div className="article-detail-section-eyebrow">
        <span className="article-detail-section-number">{section.number}</span>
        {section.tag ? <span className="article-detail-section-tag">{section.tag}</span> : null}
      </div>
      <h2 className="article-detail-section-title">{section.title}</h2>
      <div className="article-detail-section-body">
        {section.blocks.map((block, index) => (
          <ArticleBlockView key={`${section.number}-${block.kind}-${index}`} block={block} />
        ))}
      </div>
    </section>
  );
}

function ArticleBlockView({ block }: { block: ArticleBlock }) {
  if (block.kind === "paragraph") {
    const className =
      block.weight === "lead"
        ? "article-detail-lead"
        : block.weight === "big"
          ? "article-detail-big"
          : undefined;
    return <p className={className}>{block.text}</p>;
  }

  if (block.kind === "list") {
    return (
      <div className="article-detail-list-grid">
        {block.items.map((item, index) => (
          <div key={index} className="article-detail-list-item">
            {item}
          </div>
        ))}
      </div>
    );
  }

  if (block.kind === "why") {
    return (
      <div className="article-detail-why">
        <span className="article-detail-why-icon" aria-hidden="true">◆</span>
        <div>
          <b>为什么值得看：</b>
          {block.text}
        </div>
      </div>
    );
  }

  if (block.kind === "keypoint") {
    return (
      <div className="article-detail-keypoint">
        <span className="article-detail-keypoint-tag">{block.tag}</span>
        <p>{renderBoldMarkup(block.text)}</p>
      </div>
    );
  }

  if (block.kind === "photo") {
    return (
      <figure className="tool-media-item">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="tool-media-image" src={block.url} alt="" loading="lazy" />
        <figcaption className="tool-media-caption">{block.caption}</figcaption>
      </figure>
    );
  }

  // block.kind === "video"
  return (
    <figure className="tool-media-item">
      <div className="tool-media-embed">
        <iframe
          src={block.url}
          title={block.caption}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <figcaption className="tool-media-caption">{block.caption}</figcaption>
    </figure>
  );
}

function renderBoldMarkup(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <b key={index}>{part.slice(2, -2)}</b>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}
```

`photo`/`video` block 直接复用 `tool-media-*` 三个 CSS 类(`.tool-media-item`/`.tool-media-image`/`.tool-media-embed`/`.tool-media-caption`,已在 `globals.css` 里,是工具详情页富媒体那次做的),不新增重复样式——这些类名语义本来就是"一张带说明的图/一段带说明的嵌入视频",不含"tool"专属逻辑,文章复用没有耦合问题。

**来源披露**渲染位置:在 `article-detail-hero-card` 内、封面图和 kicker 行之间(如果 `article.sourceNote` 存在):

```tsx
{article.sourceNote ? <p className="article-detail-source-note">{article.sourceNote}</p> : null}
```

**Props 类型**:`ArticleDetailPageProps.article` 类型不变(`ArticleItem`,已经在类型层面加了 `sourceNote`/`cover_url`)。

**相关推荐卡**(`article-detail-related-card`)不受本次改动影响,已在上一步(Step 58)加了封面带,不用再动。

## 其它调用点同步修改

**Files:** `src/components/articles/articles-page.tsx`、`src/components/search/search-page.tsx`

两处都有一份几乎相同的"把 section 摊平成搜索用纯文本"的函数,基于旧的 `section.type === "paragraphs"` 判断。改成读取 `section.blocks`,新增一个共享工具函数放进 `article-content.ts`:

```typescript
export function getSectionPlainText(section: ArticleSection): string {
  const blockText = section.blocks
    .map((block) => {
      if (block.kind === "paragraph") return block.text;
      if (block.kind === "list") return block.items.join(" ");
      if (block.kind === "why") return block.text;
      if (block.kind === "keypoint") return block.text;
      if (block.kind === "photo" || block.kind === "video") return block.caption;
      return "";
    })
    .join(" ");
  return [section.title, blockText].join(" ");
}
```

`articles-page.tsx` 与 `search-page.tsx` 里原本的 `getArticleSearchText`/内联 map 逻辑改成调用 `article.sections.map(getSectionPlainText).join(" ")`。

**Files:** `src/components/articles/article-content.ts`(`getArticles()` 里的 mock 兜底数据)

`articleDetails` 里 3 篇 mock 文章(`ai-tool-checklist`/`open-source-license`/`online-tools-safety`)的 `sections` 字段是旧形状,只在 Supabase 未配置时的开发兜底路径使用。改成新形状,不重写文案,只是把现有 `paragraphs`/`items` 包进新的 `blocks` 结构(段落全部标 `weight:"normal"`,不用特意做 lead/big,这是兜底数据不是正式内容):

```typescript
sections: [
  { number: 1, title: "先确认它解决什么问题", blocks: [
    { kind: "paragraph", weight: "normal", text: "很多 AI 工具看起来功能很多……" },
    { kind: "paragraph", weight: "normal", text: "在尝试前先写下自己的使用场景……" },
  ] },
  { number: 2, title: "选择前重点检查", blocks: [
    { kind: "list", items: ["数据来源是否清楚", "输出结果是否可核验", "隐私政策是否明确", "免费额度是否够用", "是否有可替代方案"] },
  ] },
  // ...
],
```

(具体每篇的 3 段文案原样保留,只改包裹结构,执行时照抄原文字。)

## CSS

**Files:** `src/app/globals.css`

新增类(锚点:`.article-detail-section-title` 现有规则附近):

```css
.article-detail-source-note {
  margin: 0 0 0.9rem;
  color: rgba(175, 163, 153, 0.75);
  font-size: 0.82rem;
  font-style: italic;
  line-height: 1.7;
}

.article-detail-section-eyebrow {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.5rem;
}

.article-detail-section-number {
  display: inline-flex;
  width: 1.6rem;
  height: 1.6rem;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(227, 167, 95, 0.35);
  border-radius: 999px;
  color: #e3a75f;
  font-family: var(--zh-serif);
  font-size: 0.78rem;
  font-weight: 600;
  flex-shrink: 0;
}

.article-detail-section-tag {
  color: rgba(227, 167, 95, 0.85);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.1em;
}

.article-detail-lead {
  color: #f7f1ea;
  font-size: 1.15rem;
  font-weight: 600;
  line-height: 1.75;
}

.article-detail-big {
  color: rgba(247, 241, 234, 0.92);
  font-size: 1.02rem;
  line-height: 1.8;
}

.article-detail-why {
  display: flex;
  gap: 0.7rem;
  border: 1px solid rgba(227, 167, 95, 0.22);
  border-radius: 16px;
  background: rgba(227, 167, 95, 0.06);
  padding: 1rem 1.15rem;
  color: rgba(247, 241, 234, 0.92);
  line-height: 1.8;
}

.article-detail-why-icon {
  color: #e3a75f;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.article-detail-keypoint {
  border-left: 3px solid #e3a75f;
  border-radius: 0 12px 12px 0;
  background: rgba(255, 247, 237, 0.04);
  padding: 0.85rem 1.1rem;
}

.article-detail-keypoint-tag {
  display: inline-block;
  margin-bottom: 0.4rem;
  color: #e3a75f;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.article-detail-keypoint p {
  margin: 0;
  color: rgba(247, 241, 234, 0.92);
  line-height: 1.8;
}

.article-detail-keypoint b {
  color: #f7f1ea;
}
```

(不使用单侧圆角边框这种特殊写法,`article-detail-keypoint` 是有意的左侧强调线设计,和站内其它"单侧描边"元素没有冲突。)

## 边界

不碰:`/tools` 详情页(那边的 `ToolMediaGallery` 独立组件不动)、卡片系统(已在 Step 55-57 定稿)、后台文本编辑器 UI(仍是 textarea,不加富文本/预览)、数据库结构、路由。

3 个可选组件(prompt 代码块、多图网格、案例墙横向滚动)不在本次实现范围,`ARTICLE_CONTENT_STANDARD.md` 已注明"按需再加"。

## 验证

1. `npx tsc --noEmit` 全绿(类型改动影响 5 个文件,必须全部同步)。
2. 单元级验证:写一个 node 脚本(或临时验证片段)喂几个样例 Markdown 字符串给新解析器,断言:①无新记号的旧内容能正确生成 lead/big;②`[来源]` 只在文首生效;③`[VIDEO]` 非白名单域名被跳过不报错;④混合列表+段落不再产生重复标题。
3. **至少 1 篇真实文章按新记号重写**(建议 `free-ai-tools-safety`,加一句来源披露 + 1 个 WHY 框 + 2 个 KEY 高亮块),用来验证端到端渲染,不只是"旧内容不崩"。
4. 桌面 + 移动截图,人工核对编号小节、导语加大、WHY/KEY 框视觉是否符合暖色编辑部调性。
5. `npm run capture:articles` 的 detail 截图对比,确认相关推荐卡片(Step 58 已做)与新内容区视觉统一,不冲突。

## 回滚

纯前端改动(类型+解析器+渲染+CSS),不动已存数据。回滚即 revert 对应提交;由于旧内容 100% 向后兼容,即使部分提交,页面也不会因为解析器识别不到新记号而崩溃(未识别的记号退化为普通段落文本原样显示,不是最理想效果但不报错)。
