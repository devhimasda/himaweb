"use client";

import Link from "next/link";
import { useState } from "react";
import { deleteCategory } from "@/actions/categories";
import { useRouter } from "next/navigation";

export default function CategoryActions({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    
    setIsDeleting(true);
    const res = await deleteCategory(id);
    
    if (res.error) {
      alert(res.error);
      setIsDeleting(false);
    } else {
      router.refresh();
    }
  };

  return (
    <div style={{ display: "flex", gap: "var(--space-2)", justifyContent: "flex-end" }}>
      <Link href={`/admin/categories/${id}/edit`} className="btn btn-sm btn-secondary">
        Edit
      </Link>
      <button 
        onClick={handleDelete} 
        disabled={isDeleting}
        className="btn btn-sm btn-danger"
      >
        {isDeleting ? "..." : "Delete"}
      </button>
    </div>
  );
}
