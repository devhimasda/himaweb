"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createArticle } from "@/actions/articles";
import { uploadImage } from "@/actions/upload";
import { toast } from "@/components/ui/Toast";
import RichEditor from "@/components/admin/RichEditor";
import type { Category } from "@/types";

interface ArticleEditorProps {
  categories: Category[];
  initialData?: {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    coverImage: string;
    categoryId: string;
    published: boolean;
  };
  updateAction?: (id: string, formData: FormData) => Promise<{ error?: string; success?: boolean }>;
}

export default function ArticleEditor({
  categories,
  initialData,
  updateAction,
}: ArticleEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");
  const [published, setPublished] = useState(initialData?.published || false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadImage(formData);
    if (result.error) {
      toast(result.error, "error");
    } else if (result.url) {
      setCoverImage(result.url);
      toast("Image uploaded!", "success");
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.set("title", title);
    formData.set("excerpt", excerpt);
    formData.set("content", content);
    formData.set("coverImage", coverImage);
    formData.set("categoryId", categoryId);
    formData.set("published", String(published));

    let result;
    if (initialData && updateAction) {
      result = await updateAction(initialData.id, formData);
    } else {
      result = await createArticle(formData);
    }

    if (result.error) {
      toast(result.error, "error");
    } else {
      toast(initialData ? "Article updated!" : "Article created!", "success");
      router.push("/admin/articles");
    }

    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="admin-header">
        <div>
          <h1 className="admin-title">
            {initialData ? "Edit Article" : "New Article"}
          </h1>
        </div>
        <div style={{ display: "flex", gap: "var(--space-3)" }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => router.back()}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : initialData ? "Update" : "Create"}
          </button>
        </div>
      </div>

      <div className="editor-layout">
        <div className="editor-container">
          <input
            type="text"
            className="editor-title-input"
            placeholder="Article title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <RichEditor content={content} onChange={setContent} />
        </div>

        <div className="editor-sidebar">
          <div className="editor-sidebar-section">
            <h3 className="editor-sidebar-title">Publishing</h3>
            <label style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: "var(--color-primary)" }}
              />
              <span style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>
                {published ? "Published" : "Save as Draft"}
              </span>
            </label>
          </div>

          <div className="editor-sidebar-section">
            <h3 className="editor-sidebar-title">Excerpt</h3>
            <textarea
              className="input"
              placeholder="Brief summary of the article..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              style={{ minHeight: "80px" }}
            />
          </div>

          <div className="editor-sidebar-section">
            <h3 className="editor-sidebar-title">Category</h3>
            <select
              className="input"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">No category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="editor-sidebar-section">
            <h3 className="editor-sidebar-title">Cover Image</h3>
            {coverImage && (
              <img
                src={coverImage}
                alt="Cover"
                style={{
                  width: "100%",
                  aspectRatio: "16/9",
                  objectFit: "cover",
                  borderRadius: "var(--radius-md)",
                  marginBottom: "var(--space-3)",
                }}
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              style={{ fontSize: "var(--text-sm)" }}
            />
            {uploading && (
              <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginTop: "var(--space-2)" }}>
                Uploading...
              </p>
            )}
            <div style={{ marginTop: "var(--space-3)" }}>
              <input
                type="text"
                className="input"
                placeholder="Or paste image URL..."
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                style={{ fontSize: "var(--text-sm)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
