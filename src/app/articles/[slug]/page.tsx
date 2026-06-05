import type { Metadata } from "next";
import {
  ArticleDetailPage,
  ArticleNotFoundPage,
} from "@/components/articles/article-detail-page";
import { getArticleBySlug, getRelatedArticles } from "@/lib/db/articles";
import { DEFAULT_SITE_DESCRIPTION, createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const article = await getArticleBySlug(slug);

    if (!article) {
      return createPageMetadata({
        title: "文章未找到",
        description: DEFAULT_SITE_DESCRIPTION,
        path: `/articles/${slug}`,
        type: "article",
      });
    }

    return createPageMetadata({
      title: article.title,
      description: article.summary || DEFAULT_SITE_DESCRIPTION,
      path: `/articles/${article.slug}`,
      type: "article",
    });
  } catch (error) {
    console.error("generate article metadata error:", error);
    return createPageMetadata({
      title: "文章未找到",
      description: DEFAULT_SITE_DESCRIPTION,
      path: `/articles/${slug}`,
      type: "article",
    });
  }
}

export default async function Page({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return <ArticleNotFoundPage />;
  }

  const relatedArticles = await getRelatedArticles(article.category_id, article.id);

  return <ArticleDetailPage article={article} relatedArticles={relatedArticles} />;
}
