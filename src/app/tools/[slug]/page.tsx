import type { Metadata } from "next";
import { ToolDetailPage, ToolNotFoundPage } from "@/components/tools/tool-detail-page";
import { getRelatedTools, getToolBySlug } from "@/lib/db/tools";
import { fetchToolFeatures, fetchToolMedia, fetchToolOfficialDownloadUrl } from "@/lib/media/tool-media";
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

  const [relatedTools, media, officialDownloadUrl, features] = await Promise.all([
    getRelatedTools(tool.category_id, tool.id),
    fetchToolMedia(tool.slug),
    fetchToolOfficialDownloadUrl(tool.slug),
    fetchToolFeatures(tool.slug),
  ]);

  // tools 表没有 features 列，核心功能列表存于 tool-media/{slug}.json，
  // 这里合并进 tool 对象，交给 getToolList 的 "features" 直查键渲染。
  const toolWithFeatures = features.length > 0 ? { ...tool, features } : tool;

  return (
    <ToolDetailPage
      tool={toolWithFeatures}
      relatedTools={relatedTools}
      media={media}
      officialDownloadUrl={officialDownloadUrl}
    />
  );
}
