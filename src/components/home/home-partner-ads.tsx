import Link from "next/link";
import type { PartnerAd } from "./cosmic-home-data";

export function PartnerAdCard({ item }: { item: PartnerAd }) {
  return (
    <Link prefetch={false} href={item.href} className="zh-card zh-card-hover zh-partner-card">
      <span className="zh-ad-label">{item.label}</span>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </Link>
  );
}
