import Link from "next/link";
import type { LatestGuide } from "./cosmic-home-data";

export function LatestGuideCard({ item }: { item: LatestGuide }) {
  return (
    <Link prefetch={false} href={item.href} className="zh-card zh-card-hover zh-guide-card">
      <div className="zh-guide-thumb" />
      <div className="zh-guide-content">
        <p className="zh-guide-category">{item.category}</p>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <p className="zh-guide-meta">
          {item.date} · {item.views}
        </p>
      </div>
    </Link>
  );
}
