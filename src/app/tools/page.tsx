import { ToolsPage } from "@/components/tools/tools-page";
import { getPublishedTools } from "@/lib/db/tools";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "工具库",
  description: "浏览知享整理的 AI 工具、在线工具、效率软件和开源项目，按分类、标签和关键词快速发现实用工具。",
  path: "/tools",
});

export default async function Page() {
  const tools = await getPublishedTools();

  return <ToolsPage tools={tools} />;
}
