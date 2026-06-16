import Link from "next/link";

const notFoundStyles = `
.not-found-warm-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(ellipse 900px 420px at 50% 0%, rgba(227, 167, 95, 0.105), transparent 70%),
    radial-gradient(ellipse 900px 520px at 86% 20%, rgba(105, 75, 52, 0.13), transparent 72%),
    linear-gradient(180deg, #120f0e 0%, #171210 48%, #120f0e 100%);
  color: #f7f1ea;
}

.not-found-warm-bg {
  pointer-events: none;
  position: absolute;
  inset: 0;
  background:
    linear-gradient(rgba(255, 247, 237, 0.018) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 247, 237, 0.014) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: linear-gradient(180deg, black, transparent 72%);
  opacity: 0.38;
}

.not-found-shell {
  position: relative;
  z-index: 1;
  width: min(100% - 40px, 1120px);
  margin-inline: auto;
}

.not-found-stage {
  display: flex;
  min-height: calc(100vh - 88px);
  flex-direction: column;
  justify-content: center;
  padding-block: clamp(72px, 10vh, 128px);
  text-align: center;
}

.not-found-kicker {
  color: rgba(227, 167, 95, 0.78);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.24em;
  text-transform: uppercase;
}

.not-found-title {
  margin-top: 18px;
  font-family: var(--zh-serif, "Songti SC", "Noto Serif SC", "STSong", "SimSun", serif);
  font-size: clamp(46px, 6vw, 96px);
  font-weight: 500;
  line-height: 1.08;
  letter-spacing: 0.05em;
}

.not-found-desc {
  max-width: 720px;
  margin: 18px auto 0;
  color: rgba(247, 241, 234, 0.68);
  font-size: 15px;
  line-height: 1.85;
}

.not-found-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 30px;
}

.not-found-button {
  display: inline-flex;
  min-height: 46px;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0 20px;
  font-size: 13px;
  font-weight: 900;
  transition:
    border-color 180ms ease,
    background 180ms ease,
    color 180ms ease,
    transform 180ms ease;
}

.not-found-button:hover {
  transform: translateY(-1px);
}

.not-found-button-primary {
  border: 1px solid rgba(227, 167, 95, 0.42);
  background: #e3a75f;
  color: #120f0e;
  box-shadow: 0 14px 36px rgba(227, 167, 95, 0.18);
}

.not-found-button-primary:hover {
  background: #efb86f;
}

.not-found-button-secondary {
  border: 1px solid rgba(255, 247, 237, 0.13);
  background: rgba(255, 247, 237, 0.052);
  color: rgba(247, 241, 234, 0.82);
}

.not-found-button-secondary:hover {
  border-color: rgba(227, 167, 95, 0.36);
  background: rgba(227, 167, 95, 0.11);
  color: #f7f1ea;
}

.not-found-card-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-top: clamp(42px, 6vh, 72px);
}

.not-found-card {
  display: grid;
  gap: 10px;
  border: 1px solid rgba(255, 247, 237, 0.13);
  border-radius: 24px;
  background:
    radial-gradient(circle at 18% 0%, rgba(227, 167, 95, 0.052), transparent 34%),
    linear-gradient(180deg, rgba(255, 247, 237, 0.062), rgba(255, 247, 237, 0.032));
  box-shadow:
    0 18px 54px rgba(0, 0, 0, 0.22),
    inset 0 1px 0 rgba(255, 247, 237, 0.055);
  padding: 22px;
  text-align: left;
  transition:
    border-color 180ms ease,
    transform 180ms ease,
    background 180ms ease;
}

.not-found-card:hover {
  border-color: rgba(227, 167, 95, 0.38);
  transform: translateY(-2px);
}

.not-found-card-eyebrow {
  color: rgba(227, 167, 95, 0.78);
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.2em;
}

.not-found-card-title {
  color: #f7f1ea;
  font-family: var(--zh-serif, "Songti SC", "Noto Serif SC", "STSong", "SimSun", serif);
  font-size: 22px;
  font-weight: 500;
  letter-spacing: 0.04em;
}

.not-found-card-text {
  color: rgba(247, 241, 234, 0.64);
  font-size: 13px;
  line-height: 1.75;
}

@media (min-width: 1600px) {
  .not-found-shell {
    width: min(100% - 80px, 1220px);
  }
}

@media (max-width: 860px) {
  .not-found-card-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .not-found-shell {
    width: min(100% - 28px, 100%);
  }

  .not-found-stage {
    min-height: auto;
    padding-block: 56px 78px;
    text-align: left;
  }

  .not-found-desc {
    margin-inline: 0;
  }

  .not-found-actions {
    justify-content: flex-start;
  }

  .not-found-button {
    width: 100%;
  }

  .not-found-card {
    border-radius: 20px;
    padding: 18px;
  }
}
`;

export default function NotFound() {
  return (
    <main className="not-found-warm-page">
      <style dangerouslySetInnerHTML={{ __html: notFoundStyles }} />
      <div className="not-found-warm-bg" aria-hidden="true" />

      <section className="not-found-shell not-found-stage">
        <p className="not-found-kicker">404 路 NOT FOUND</p>

        <h1 className="not-found-title">这里没有找到内容</h1>

        <p className="not-found-desc">
          这个页面可能已经移动、下线，或者链接地址输入有误。你可以回到首页，继续探索工具、文章和实用资源。
        </p>

        <div className="not-found-actions">
          <Link className="not-found-button not-found-button-primary" href="/">
            返回首页
          </Link>
          <Link className="not-found-button not-found-button-secondary" href="/tools">
            浏览工具库
          </Link>
          <Link className="not-found-button not-found-button-secondary" href="/search?q=ai">
            搜索资源
          </Link>
        </div>

        <div className="not-found-card-grid" aria-label="推荐入口">
          <Link className="not-found-card" href="/tools">
            <span className="not-found-card-eyebrow">TOOLS</span>
            <span className="not-found-card-title">工具库</span>
            <span className="not-found-card-text">查找 AI 工具、开源项目与效率软件。</span>
          </Link>

          <Link className="not-found-card" href="/articles">
            <span className="not-found-card-eyebrow">ARTICLES</span>
            <span className="not-found-card-title">文章指南</span>
            <span className="not-found-card-text">阅读工具教程、实战方法与资源整理。</span>
          </Link>

          <Link className="not-found-card" href="/submit">
            <span className="not-found-card-eyebrow">SUBMIT</span>
            <span className="not-found-card-title">提交资源</span>
            <span className="not-found-card-text">推荐值得收录的工具、项目或教程。</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
