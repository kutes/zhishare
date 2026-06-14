import Link from "next/link";

export function PromoBanner() {
  return (
    <section className="zh-banner">
      <div>
        <p className="zh-section-eyebrow">Sponsor Slot</p>
        <h2>首页横幅广告位</h2>
        <p>
          适合展示云服务、开发工具、课程资源、联盟推广或自有数字产品。保持暖暗克制、低噪呈现，不破坏首页高级感。
        </p>
      </div>
      <Link prefetch={false} className="zh-btn zh-btn-secondary" href="/submit">
        申请合作
      </Link>
    </section>
  );
}
