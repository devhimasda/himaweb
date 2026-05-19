import { getAllCategories } from "@/actions/articles";
import ArticleEditor from "../ArticleEditor";

export default async function NewArticlePage() {
  const categories = await getAllCategories();

  return <ArticleEditor categories={categories} />;
}
