import CategoryForm from "../CategoryForm";

export default function NewCategoryPage() {
  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-title">New Category</h1>
          <p className="admin-subtitle">
            Create a new topic to organize your articles.
          </p>
        </div>
      </div>
      
      <CategoryForm />
    </div>
  );
}
