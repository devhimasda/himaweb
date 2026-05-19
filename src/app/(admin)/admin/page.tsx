import { getAdminStats, getAllArticlesAdmin } from "@/actions/articles";
import { getAllCategories } from "@/actions/articles";
import Link from "next/link";

export default async function AdminDashboard() {
  const stats = await getAdminStats();
  const articles = await getAllArticlesAdmin();
  const categories = await getAllCategories();

  const recentArticles = articles.slice(0, 5);

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Dashboard</h1>
          <p className="admin-subtitle">
            Welcome back! Here&apos;s an overview of your content.
          </p>
        </div>
        <Link href="/admin/articles/new" className="btn btn-primary">
          + New Article
        </Link>
      </div>

      <div className="stats-grid" style={{ marginBottom: "var(--space-12)" }}>
        <div className="card-glass" style={{ padding: "var(--space-6)" }}>
          <div className="admin-stat-label" style={{ marginBottom: "var(--space-2)" }}>Total Articles</div>
          <div className="admin-stat-value" style={{ fontSize: "var(--text-3xl)", fontWeight: 900 }}>{stats.totalArticles}</div>
        </div>
        <div className="card-glass" style={{ padding: "var(--space-6)" }}>
          <div className="admin-stat-label" style={{ marginBottom: "var(--space-2)" }}>Published</div>
          <div className="admin-stat-value" style={{ fontSize: "var(--text-3xl)", fontWeight: 900, color: "var(--color-success)" }}>
            {stats.publishedArticles}
          </div>
        </div>
        <div className="card-glass" style={{ padding: "var(--space-6)" }}>
          <div className="admin-stat-label" style={{ marginBottom: "var(--space-2)" }}>Drafts</div>
          <div className="admin-stat-value" style={{ fontSize: "var(--text-3xl)", fontWeight: 900, color: "var(--color-warning)" }}>
            {stats.draftArticles}
          </div>
        </div>
        <div className="card-glass" style={{ padding: "var(--space-6)" }}>
          <div className="admin-stat-label" style={{ marginBottom: "var(--space-2)" }}>Total Views</div>
          <div className="admin-stat-value" style={{ fontSize: "var(--text-3xl)", fontWeight: 900, color: "var(--color-accent-dark)" }}>{stats.totalViews.toLocaleString()}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "var(--space-8)" }}>

        {/* Main Feed: Recent Articles */}
        <div>
          <div className="admin-header" style={{ marginBottom: "var(--space-4)" }}>
            <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 700 }}>Recent Articles</h2>
            <Link href="/admin/articles" className="btn btn-sm btn-ghost">View All</Link>
          </div>

          <div className="card">
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <th style={{ padding: "var(--space-4)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>Title</th>
                    <th style={{ padding: "var(--space-4)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>Status</th>
                    <th style={{ padding: "var(--space-4)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentArticles.map((article) => (
                    <tr key={article.id} style={{ borderBottom: "1px solid var(--color-border-strong)" }}>
                      <td style={{ padding: "var(--space-4)", fontWeight: 600 }}>
                        <Link href={`/admin/articles/${article.id}/edit`} style={{ color: "var(--color-primary)" }}>
                          {article.title}
                        </Link>
                      </td>
                      <td style={{ padding: "var(--space-4)" }}>
                        {article.published ? (
                          <span className="badge badge-success">Published</span>
                        ) : (
                          <span className="badge badge-warning">Draft</span>
                        )}
                      </td>
                      <td style={{ padding: "var(--space-4)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
                        {new Date(article.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {recentArticles.length === 0 && (
                    <tr>
                      <td colSpan={3} style={{ padding: "var(--space-8)", textAlign: "center", color: "var(--color-text-muted)" }}>
                        No articles found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
          <div>
            <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 700, marginBottom: "var(--space-4)" }}>Quick Links</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <Link href="/admin/articles/new" className="card-glass" style={{ padding: "var(--space-4)", textDecoration: "none", display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                <div style={{ background: "var(--color-primary-ghost)", color: "var(--color-primary)", padding: "var(--space-2)", borderRadius: "var(--radius-md)" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </div>
                <div style={{ fontWeight: 600, color: "var(--color-text)" }}>Write Article</div>
              </Link>
              <Link href="/admin/categories/new" className="card-glass" style={{ padding: "var(--space-4)", textDecoration: "none", display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                <div style={{ background: "oklch(0.72 0.12 60 / 0.15)", color: "var(--color-accent-dark)", padding: "var(--space-2)", borderRadius: "var(--radius-md)" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <div style={{ fontWeight: 600, color: "var(--color-text)" }}>New Category</div>
              </Link>
            </div>
          </div>

          <div>
            <div className="admin-header" style={{ marginBottom: "var(--space-4)" }}>
              <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 700 }}>Categories Overview</h2>
              <Link href="/admin/categories" className="btn btn-sm btn-ghost">Manage</Link>
            </div>
            <div className="card" style={{ padding: "var(--space-4)", background: "var(--color-surface-sunken)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                {categories.slice(0, 4).map(cat => (
                  <div key={cat.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--space-2) 0", borderBottom: "1px solid var(--color-border)" }}>
                    <span style={{ fontWeight: 500 }}>{cat.name}</span>
                    <span className="badge badge-primary" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>{cat.slug}</span>
                  </div>
                ))}
                {categories.length === 0 && (
                  <div style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)", textAlign: "center", padding: "var(--space-2)" }}>No categories yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
