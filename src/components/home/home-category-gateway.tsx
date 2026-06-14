import Link from "next/link";
import type { PortalCategory } from "./cosmic-home-data";

function PortalIcon({ type }: { type: PortalCategory["icon"] }) {
  const common = "zh-card-icon";

  if (type === "ai") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3v18M3 12h18M6.5 6.5l11 11M17.5 6.5l-11 11" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "dev") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="m9 8-4 4 4 4M15 8l4 4-4 4" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === "software") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="5" y="5" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.45" />
        <path d="M8 9h8M8 13h5" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "guide") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 5.5A2.5 2.5 0 0 1 8.5 3H18v18H8.5A2.5 2.5 0 0 1 6 18.5v-13Z" stroke="currentColor" strokeWidth="1.45" />
        <path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 7.5A2.5 2.5 0 0 1 7.5 5h9A2.5 2.5 0 0 1 19 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 16.5v-9Z" stroke="currentColor" strokeWidth="1.45" />
      <path d="M8 9h8M8 12h8M8 15h5" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
    </svg>
  );
}

export function CategoryCard({ item }: { item: PortalCategory }) {
  return (
    <Link prefetch={false} href={item.href} className="zh-card zh-card-hover zh-tool-card">
      <div className="zh-card-top">
        <span className="zh-card-icon-wrap">
          <PortalIcon type={item.icon} />
        </span>
        <span className="zh-badge">{item.count}</span>
      </div>
      <h3>{item.name}</h3>
      <p>{item.description}</p>
    </Link>
  );
}
