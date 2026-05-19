"use client";

import Link from "next/link";
import { togglePublish, deleteArticle } from "@/actions/articles";
import { toast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";

interface ArticleActionsProps {
  articleId: string;
  published: boolean;
}

export default function ArticleActions({ articleId, published }: ArticleActionsProps) {
  const router = useRouter();

  const handleToggle = async () => {
    const result = await togglePublish(articleId);
    if (result.success) {
      toast(result.published ? "Article published!" : "Article unpublished", "success");
      router.refresh();
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    const result = await deleteArticle(articleId);
    if (result.success) {
      toast("Article deleted", "success");
      router.refresh();
    }
  };

  return (
    <div className="table-actions">
      <Link href={`/admin/articles/${articleId}/edit`} className="btn btn-ghost btn-sm">
        Edit
      </Link>
      <button onClick={handleToggle} className="btn btn-ghost btn-sm">
        {published ? "Unpublish" : "Publish"}
      </button>
      <button onClick={handleDelete} className="btn btn-ghost btn-sm" style={{ color: "var(--color-danger)" }}>
        Delete
      </button>
    </div>
  );
}
