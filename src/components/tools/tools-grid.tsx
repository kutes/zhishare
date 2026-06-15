import { Fragment } from "react";
import { AdPlaceholder } from "@/components/common/AdPlaceholder";
import type { ToolItem } from "@/types/tool";
import { CompactToolCard } from "./CompactToolCard";
import { ToolsNoResults } from "./tools-no-results";

type ToolsGridProps = {
  tools: ToolItem[];
  onClear: () => void;
};

export function ToolsGrid({ tools, onClear }: ToolsGridProps) {
  const adBlock = (
    <div className="col-span-full">
      <div className="zh-tools-ad-wrapper">
        <AdPlaceholder
          variant="banner"
          title="合作推广"
          description="这里可展示赞助工具、精选服务或品牌广告内容。"
          className="zh-tools-ad"
        />
      </div>
    </div>
  );

  if (tools.length === 0) {
    return (
      <div className="zh-tools-grid-shell">
        <ToolsNoResults onClear={onClear} />
        {adBlock}
      </div>
    );
  }

  return (
    <div className="zh-tools-grid-shell">
      <div className="zh-tools-grid">
        {tools.map((tool, index) => (
          <Fragment key={tool.id}>
            <CompactToolCard tool={tool} />
            {index === 5 ? adBlock : null}
          </Fragment>
        ))}
        {tools.length < 6 ? adBlock : null}
      </div>
    </div>
  );
}
