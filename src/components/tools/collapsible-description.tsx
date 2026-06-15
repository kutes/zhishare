"use client";

import { useState } from "react";

type CollapsibleDescriptionProps = {
  title?: string;
  content?: string | null;
  className?: string;
};

export function CollapsibleDescription({
  title = "这个工具是什么",
  content,
  className = "",
}: CollapsibleDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const safeContent = typeof content === "string" ? content.trim() : "";

  if (!safeContent) {
    return null;
  }

  return (
    <section className={`tool-collapsible-description ${className}`.trim()}>
      {title ? (
        <div className="tool-collapsible-head">
          <p className="tool-collapsible-title">{title}</p>
          <span className="tool-collapsible-chip">简介</span>
        </div>
      ) : null}

      <div className="tool-collapsible-body-wrap">
        <p className={`tool-collapsible-body ${expanded ? "is-open" : ""}`}>{safeContent}</p>

        {!expanded ? <div className="tool-collapsible-fade" aria-hidden="true" /> : null}
      </div>

      <button type="button" onClick={() => setExpanded((value) => !value)} className="tool-collapsible-toggle" aria-expanded={expanded}>
        {expanded ? "收起全文" : "展开全文"}
      </button>
    </section>
  );
}
