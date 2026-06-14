import Link from "next/link";
import type { RankingGroup } from "./cosmic-home-data";

export function RankingCard({ group }: { group: RankingGroup }) {
  return (
    <article className="zh-card zh-ranking-card">
      <div className="zh-ranking-head">
        <div>
          <h3>{group.title}</h3>
          <p>{group.description}</p>
        </div>
        <Link prefetch={false} href={group.href} className="zh-section-link">
          →
        </Link>
      </div>

      <div className="zh-ranking-list">
        {group.items.map((item, index) => (
          <Link key={item.title} href={item.href} className="zh-ranking-item">
            <span className="zh-ranking-index">{index + 1}</span>
            <span className="zh-ranking-title">{item.title}</span>
            <span className="zh-ranking-views">{item.views}</span>
          </Link>
        ))}
      </div>
    </article>
  );
}
