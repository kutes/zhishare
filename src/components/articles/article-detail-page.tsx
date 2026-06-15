import Link from "next/link";
import { AdPlaceholder } from "@/components/common/AdPlaceholder";
import { CopyrightNotice } from "@/components/common/CopyrightNotice";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { ArticleItem, ArticleSection } from "./article-content";

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

            <div className="article-detail-hero-card">
              <div className="article-detail-kicker-row">
                <span className="article-detail-kicker">文章详情</span>
                <span className="article-detail-meta-item">{article.category}</span>
              </div>

              <h1 className="article-detail-title">{article.title}</h1>
              <p className="article-detail-summary">{article.summary}</p>

              <div className="article-detail-meta">
                <span className="article-detail-meta-item">更新于 {article.date}</span>
                <span className="article-detail-meta-item">{article.readTime}</span>
                <span className="article-detail-meta-item">共 {article.sections.length} 个正文 section</span>
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
                  <p className="article-detail-section-eyebrow">正文阅读</p>
                  <h2 className="article-detail-section-heading">按编辑稿结构拆开的完整内容</h2>
                </div>
                <p className="article-detail-section-copy">
                  保留原始 section 渲染逻辑，只把页面背景、卡片、层次和间距统一到暖黑编辑风。
                </p>
              </div>

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
              <section className="article-detail-side-card">
                <p className="article-detail-side-kicker">阅读概览</p>
                <h3 className="article-detail-side-title">这篇文章怎么读更顺手</h3>
                <p className="article-detail-side-text">
                  先看标题、摘要和标签，再顺着正文 section 阅读，可以更快捕捉这篇文章的核心判断与实操建议。
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
                    <p className="article-detail-fact-value">{article.sections.length} 个 section</p>
                  </div>
                  <div className="article-detail-fact">
                    <p className="article-detail-fact-label">阅读时长</p>
                    <p className="article-detail-fact-value">{article.readTime}</p>
                  </div>
                </div>
              </section>

              <AdPlaceholder variant="sidebar" className="article-detail-ad" />
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
  if (section.type === "list") {
    return (
      <section className="article-detail-section">
        <h2 className="article-detail-section-title">{section.title}</h2>
        <div className="article-detail-section-body article-detail-list-grid">
          {section.items.map((item, index) => (
            <div key={`${section.title}-item-${index}`} className="article-detail-list-item">
              {item}
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="article-detail-section">
      <h2 className="article-detail-section-title">{section.title}</h2>
      <div className="article-detail-section-body">
        {section.paragraphs.map((paragraph, index) => (
          <p key={`${section.title}-paragraph-${index}`}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
