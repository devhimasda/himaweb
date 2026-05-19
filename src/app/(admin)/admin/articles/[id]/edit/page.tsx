import { getAllCategories, getArticleById, updateArticle } from "@/actions/articles";
import ArticleEditor from "../../ArticleEditor";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: PageProps) {
  const { id } = await params;
  const [article, categories] = await Promise.all([
    getArticleById(id),
    getAllCategories(),
  ]);

  if (!article) notFound();

  return (
    <ArticleEditor
      categories={categories}
      initialData={{
        id: article.id,
        title: article.title,
        excerpt: article.excerpt || "",
        content: article.content || "",
        coverImage: article.coverImage || "",
        categoryId: article.categoryId || "",
        published: article.published,
      }}
      updateAction={updateArticle}
    />
  );
}
