import Link from "next/link";

export function SectionHeader({
  eyebrow,
  title,
  description,
  href,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
}) {
  return (
    <div className="zh-section-header">
      <div>
        {eyebrow ? <p className="zh-section-eyebrow">{eyebrow}</p> : null}
        <h2 className="zh-section-title">{title}</h2>
        {description ? <p className="zh-section-desc">{description}</p> : null}
      </div>
      {href ? (
        <Link className="zh-section-link" href={href}>
          查看全部 →
        </Link>
      ) : null}
    </div>
  );
}
