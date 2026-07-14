"use client";

import { useState } from "react";
import type { ReactNode } from "react";

type CollapsibleBlockProps = {
  summary: string;
  children: ReactNode;
};

// Collapsed-by-default wrapper for a tool's secondary attributes (适合人群/使用场景/优缺点),
// so they stay out of the way until the reader wants them.
export function CollapsibleBlock({ summary, children }: CollapsibleBlockProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="tool-detail-more">
      <button
        type="button"
        className="tool-detail-more-toggle"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span>{summary}</span>
        <span className="tool-detail-more-state">{open ? "收起 −" : "展开 +"}</span>
      </button>
      {open ? <div className="tool-detail-more-body">{children}</div> : null}
    </div>
  );
}
