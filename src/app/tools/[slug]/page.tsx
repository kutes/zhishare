import type { Metadata } from "next";
import { ToolDetailPage, ToolNotFoundPage } from "@/components/tools/tool-detail-page";
import { getPublishedTools, getRelatedTools, getToolBySlug } from "@/lib/db/tools";
import { DEFAULT_SITE_DESCRIPTION, createPageMetadata } from "@/lib/seo";

type ToolPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const tools = await getPublishedTools();

  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const tool = await getToolBySlug(slug);

    if (!tool) {
      return createPageMetadata({
        title: "工具未找到",
        description: DEFAULT_SITE_DESCRIPTION,
        path: `/tools/${slug}`,
      });
    }

    return createPageMetadata({
      title: tool.name,
      description: tool.tagline || tool.description || DEFAULT_SITE_DESCRIPTION,
      path: `/tools/${tool.slug}`,
    });
  } catch (error) {
    console.error("generate tool metadata error:", error);
    return createPageMetadata({
      title: "工具未找到",
      description: DEFAULT_SITE_DESCRIPTION,
      path: `/tools/${slug}`,
    });
  }
}

export default async function Page({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);

  if (!tool) {
    return <ToolNotFoundPage />;
  }

  const relatedTools = await getRelatedTools(tool.category_id ?? tool.category, tool.id);

  return <ToolDetailPage tool={tool} relatedTools={relatedTools} />;
}
