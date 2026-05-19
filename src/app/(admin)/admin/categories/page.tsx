import Link from "next/link";
import { getAllCategories } from "@/actions/articles";
import { db } from "@/lib/db";
import { articles } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import CategoryActions from "./CategoryActions";

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  // We want to fetch the count of articles per category in a robust way without making n+1 queries
  // For simplicity since the dataset is small, we get the counts directly:
  const counts = await db
    .select({
      categoryId: articles.categoryId,
      count: sql<number>`count(${articles.id})`
    })
    .from(articles)
    .where(sql`${articles.categoryId} IS NOT NULL`)
    .groupBy(articles.categoryId);

  const countMap = counts.reduce((acc, curr) => {
    if (curr.categoryId) acc[curr.categoryId] = Number(curr.count);
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Categories</h1>
          <p className="admin-subtitle">
            Manage article categories and topics.
          </p>
        </div>
        <Link href="/admin/categories/new" className="btn btn-primary">
          + New Category
        </Link>
      </div>

      <div className="card">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                <th style={{ padding: "var(--space-4)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>Name</th>
                <th style={{ padding: "var(--space-4)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>Slug</th>
                <th style={{ padding: "var(--space-4)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>Description</th>
                <th style={{ padding: "var(--space-4)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>Articles</th>
                <th style={{ padding: "var(--space-4)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} style={{ borderBottom: "1px solid var(--color-border-strong)" }}>
                  <td style={{ padding: "var(--space-4)", fontWeight: 600 }}>{cat.name}</td>
                  <td style={{ padding: "var(--space-4)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}><code>{cat.slug}</code></td>
                  <td style={{ padding: "var(--space-4)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", maxWidth: "300px" }}>
                    <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {cat.description || "—"}
                    </div>
                  </td>
                  <td style={{ padding: "var(--space-4)" }}>
                    <span className="badge badge-primary">{countMap[cat.id] || 0}</span>
                  </td>
                  <td style={{ padding: "var(--space-4)", textAlign: "right" }}>
                    <CategoryActions id={cat.id} />
                  </td>
                </tr>
              ))}
              
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "var(--space-8)", textAlign: "center", color: "var(--color-text-muted)" }}>
                    No categories found. Create your first category to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
