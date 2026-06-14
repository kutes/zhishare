import Link from "next/link";
import type { FeaturedResource } from "./cosmic-home-data";

export function FeatureSmallCard({ item }: { item: FeaturedResource }) {
  return (
    <Link prefetch={false} href={item.href} className="zh-card zh-card-hover zh-feature-small">
      <p className="zh-card-eyebrow">{item.eyebrow}</p>
      <h3>{item.title}</h3>
      <p>{item.meta}</p>
      <span className="zh-card-action">打开 ↗</span>
    </Link>
  );
}

export function FeaturedLargeCard({ item }: { item: FeaturedResource }) {
  return (
    <Link prefetch={false} href={item.href} className="zh-card zh-card-hover zh-feature-large">
      <div className="zh-feature-visual" />
      <div className="zh-feature-copy">
        <p className="zh-card-eyebrow">{item.eyebrow}</p>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <p className="zh-card-meta">{item.meta}</p>
        <span className="zh-card-action">查看资源 ↗</span>
      </div>
    </Link>
  );
}
