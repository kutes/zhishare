import type { Metadata } from "next";
import { ToolDetailPage, ToolNotFoundPage } from "@/components/tools/tool-detail-page";
import { getRelatedTools, getToolBySlug } from "@/lib/db/tools";
import { fetchToolMedia } from "@/lib/media/tool-media";
import { DEFAULT_SITE_DESCRIPTION, createPageMetadata } from "@/lib/seo";

type ToolPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  const [relatedTools, media] = await Promise.all([
    getRelatedTools(tool.category_id, tool.id),
    fetchToolMedia(tool.slug),
  ]);

  return <ToolDetailPage tool={tool} relatedTools={relatedTools} media={media} />;
}
