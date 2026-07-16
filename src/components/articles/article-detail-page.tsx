import Link from "next/link";
import type { ReactNode } from "react";
import { AdPlaceholder } from "@/components/common/AdPlaceholder";
import { CopyrightNotice } from "@/components/common/CopyrightNotice";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { ArticleBlock, ArticleItem, ArticleSection } from "./article-content";

type ArticleDetailPageProps = {
  article: ArticleItem;
  relatedArticles: ArticleItem[];
};

export function ArticleDetailPage({ article, relatedArticles }: ArticleDetailPageProps) {
  const middleIndex = Math.max(1, Math.ceil(article.sections.length / 2));
  const firstSections = article.sections.slice(0, middleIndex);
  const lastSections = article.sections.slice(middleIndex);
  const hasRelatedArticles = relatedArticles.length > 0;

  return (
    <div className="article-detail-warm-page">
      <SiteHeader />
      <main>
        <section className="article-detail-hero">
          <div className="article-detail-shell">
            <Link href="/articles" className="article-detail-back-link">
              返回文章列表
            </Link>

            <div className="article-detail-hero-plain">
              <div className="article-detail-kicker-row">
                <span className="article-detail-kicker">文章详情</span>
                <span className="article-detail-meta-item">{article.category}</span>
              </div>

              <h1 className="article-detail-title">{article.title}</h1>
              <p className="article-detail-summary">{article.summary}</p>

              <div className="article-detail-meta">
                <span className="article-detail-meta-item">更新于 {article.date}</span>
                <span className="article-detail-meta-item">{article.readTime}</span>
                <span className="article-detail-meta-item">共 {article.sections.length} 节</span>
              </div>

              <div className="article-detail-tags">
                {article.tags.map((tag) => (
                  <span key={tag} className="article-detail-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="article-detail-layout-shell">
          <div className="article-detail-shell article-detail-layout">
            <article className="article-detail-main">
              <div className="article-detail-main-head">
                <div>
                  <p className="article-detail-kicker">正文阅读</p>
                  <h2 className="article-detail-section-heading">按编辑稿结构拆开的完整内容</h2>
                </div>
                <p className="article-detail-section-copy">按章节阅读，重点内容已用高亮框标出。</p>
              </div>

              {article.tldr && article.tldr.length > 0 ? (
                <div className="article-detail-tldr">
                  <p className="article-detail-tldr-title">一分钟速览</p>
                  <ul>
                    {article.tldr.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {article.sourceNote ? (
                <p className="article-detail-source-note">
                  <span aria-hidden="true">⚑</span> {article.sourceNote}
                </p>
              ) : null}

              <div className="article-detail-sections">
                {firstSections.map((section, index) => (
                  <ArticleContentSection key={`${section.title}-${index}`} section={section} />
                ))}

                <AdPlaceholder variant="inline" className="article-detail-ad article-detail-inline-ad" />

                {lastSections.map((section, index) => (
                  <ArticleContentSection key={`${section.title}-${index + firstSections.length}`} section={section} />
                ))}
              </div>
            </article>

            <aside className="article-detail-side">
              <button className="article-detail-side-tab" type="button">
                阅读概览
              </button>

              <div className="article-detail-side-panel">
              <section className="article-detail-side-card">
                <p className="article-detail-side-kicker">阅读概览</p>
                <h3 className="article-detail-side-title">这篇文章怎么读更顺手</h3>
                <p className="article-detail-side-text">
                  先看标题、摘要和标签，再按章节顺序阅读，可以更快捕捉这篇文章的核心判断与实操建议。
                </p>
              </section>

              <section className="article-detail-side-card">
                <p className="article-detail-side-kicker">文章信息</p>
                <div className="article-detail-facts">
                  <div className="article-detail-fact">
                    <p className="article-detail-fact-label">分类</p>
                    <p className="article-detail-fact-value">{article.category}</p>
                  </div>
                  <div className="article-detail-fact">
                    <p className="article-detail-fact-label">标签</p>
                    <p className="article-detail-fact-value">{article.tags.length} 个</p>
                  </div>
                  <div className="article-detail-fact">
                    <p className="article-detail-fact-label">正文</p>
                    <p className="article-detail-fact-value">{article.sections.length} 节</p>
                  </div>
                  <div className="article-detail-fact">
                    <p className="article-detail-fact-label">阅读时长</p>
                    <p className="article-detail-fact-value">{article.readTime}</p>
                  </div>
                </div>
              </section>

              <AdPlaceholder variant="sidebar" className="article-detail-ad" />
              </div>
            </aside>
          </div>
        </section>

        <section className="article-detail-related">
          <div className="article-detail-shell">
            <div className="article-detail-related-head">
              <div>
                <p className="article-detail-kicker">相关推荐</p>
                <h2 className="article-detail-section-heading">继续阅读同类文章</h2>
              </div>
              <p className="article-detail-related-copy">
                优先推荐同分类文章，方便顺着当前主题继续深入。
              </p>
            </div>

            {hasRelatedArticles ? (
              <div className="article-detail-related-grid">
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
                    <h3 className="article-detail-related-title">{relatedArticle.title}</h3>
                    <p className="article-detail-related-desc">{relatedArticle.summary}</p>
                    <Link href={`/articles/${relatedArticle.slug}`} className="article-detail-action">
                      阅读全文
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className="article-detail-empty-related">
                当前暂无同分类推荐，后续相关文章增加后会自动补充。
              </div>
            )}
          </div>
        </section>

        <section className="article-detail-footer-block">
          <div className="article-detail-shell article-detail-footer-grid">
            <AdPlaceholder variant="banner" className="article-detail-ad" />
            <CopyrightNotice className="article-detail-copyright" />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export function ArticleNotFoundPage() {
  return (
    <div className="article-detail-warm-page">
      <SiteHeader />
      <main className="article-detail-not-found-page">
        <div className="article-detail-shell article-detail-not-found-wrap">
          <section className="article-detail-not-found">
            <p className="article-detail-kicker">文章未找到</p>
            <h1 className="article-detail-not-found-title">没有找到这篇文章</h1>
            <p className="article-detail-not-found-copy">
              这通常意味着链接已经变化，或者这篇内容还没有发布到当前站点。
            </p>
            <Link href="/articles" className="article-detail-action">
              返回文章列表
            </Link>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

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
        <span className="article-detail-why-icon" aria-hidden="true">
          ◆
        </span>
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

  if (block.kind === "video") {
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

  if (block.kind === "subheading") {
    return <h3 className="article-detail-subheading">{block.text}</h3>;
  }

  if (block.kind === "stats") {
    return (
      <div className="article-detail-stats">
        {block.items.map((item, index) => (
          <div key={index} className="article-detail-stat">
            <span className="article-detail-stat-value">{item.value}</span>
            <span className="article-detail-stat-label">{item.label}</span>
          </div>
        ))}
      </div>
    );
  }

  if (block.kind === "contrast") {
    return (
      <div className="article-detail-contrast">
        <div className="article-detail-contrast-card article-detail-contrast-good">
          <span className="article-detail-contrast-badge">✓ {block.good.title}</span>
          <p>{block.good.text}</p>
        </div>
        <div className="article-detail-contrast-card article-detail-contrast-bad">
          <span className="article-detail-contrast-badge">✕ {block.bad.title}</span>
          <p>{block.bad.text}</p>
        </div>
      </div>
    );
  }

  if (block.kind === "kv") {
    return (
      <dl className="article-detail-kv">
        {block.rows.map((row, index) => (
          <div key={index} className="article-detail-kv-row">
            <dt>{row.key}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    );
  }

  if (block.kind === "steps") {
    return (
      <ol className="article-detail-steps">
        {block.items.map((item, index) => (
          <li key={index} className="article-detail-step">
            <span className="article-detail-step-no">{index + 1}</span>
            <span className="article-detail-step-title">{item.title}</span>
            {item.text ? <span className="article-detail-step-text">{item.text}</span> : null}
          </li>
        ))}
      </ol>
    );
  }

  return (
    <p className="article-detail-takeaway">
      <span className="article-detail-takeaway-bar" aria-hidden="true" />
      {block.text}
    </p>
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
