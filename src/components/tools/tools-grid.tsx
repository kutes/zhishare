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
      <AdPlaceholder
        variant="banner"
        title="合作推广"
        description="这里可以展示赞助工具、精选服务或广告内容"
        className="min-h-24"
      />
    </div>
  );

  if (tools.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-4">
        <div className="col-span-full">
          <ToolsNoResults onClear={onClear} />
        </div>
        {adBlock}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool, index) => (
        <Fragment key={tool.id}>
          <CompactToolCard tool={tool} />
          {index === 5 ? adBlock : null}
        </Fragment>
      ))}
      {tools.length < 6 ? adBlock : null}
    </div>
  );
}
