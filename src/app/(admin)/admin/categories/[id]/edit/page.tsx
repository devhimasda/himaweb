import CategoryForm from "../../CategoryForm";
import { getCategoryById } from "@/actions/categories";
import { notFound } from "next/navigation";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await getCategoryById(id);

  if (!category) {
    notFound();
  }

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Edit Category</h1>
          <p className="admin-subtitle">
            Update the topic details for your articles.
          </p>
        </div>
      </div>
      
      <CategoryForm initialData={category} />
    </div>
  );
}
