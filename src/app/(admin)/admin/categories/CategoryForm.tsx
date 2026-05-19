"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCategory, updateCategory } from "@/actions/categories";

type CategoryFormProps = {
  initialData?: {
    id: string;
    name: string;
    description: string | null;
  };
};

export default function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    let res;
    if (initialData?.id) {
      res = await updateCategory(initialData.id, formData);
    } else {
      res = await createCategory(formData);
    }

    if (res.error) {
      setError(res.error);
      setIsLoading(false);
    } else {
      router.push("/admin/categories");
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="card-glass" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
        
        {error && (
          <div style={{ background: "var(--color-danger)", color: "white", padding: "var(--space-3)", borderRadius: "var(--radius-md)" }}>
            {error}
          </div>
        )}

        <div className="input-group">
          <label htmlFor="name" className="input-label">Category Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={initialData?.name}
            className="input"
            placeholder="e.g. Technology, Campus Life..."
          />
        </div>

        <div className="input-group">
          <label htmlFor="description" className="input-label">Description (Optional)</label>
          <textarea
            id="description"
            name="description"
            defaultValue={initialData?.description || ""}
            className="input"
            placeholder="Brief description of this category..."
            style={{ minHeight: "100px" }}
          />
        </div>

        <div style={{ display: "flex", gap: "var(--space-4)", marginTop: "var(--space-4)" }}>
          <button type="button" onClick={() => router.back()} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="btn btn-primary">
            {isLoading ? "Saving..." : (initialData ? "Update Category" : "Create Category")}
          </button>
        </div>
      </div>
    </form>
  );
}
