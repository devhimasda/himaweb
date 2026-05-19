import { getAllArticlesAdmin } from "@/actions/articles";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import ArticleActions from "./ArticleActions";

export default async function AdminArticlesPage() {
  const articles = await getAllArticlesAdmin();

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Articles</h1>
          <p className="admin-subtitle">
            Manage all your news posts and activity reports.
          </p>
        </div>
        <Link href="/admin/articles/new" className="btn btn-primary">
          + New Article
        </Link>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Views</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "var(--space-12)", color: "var(--color-text-muted)" }}>
                  No articles yet. Create your first one!
                </td>
              </tr>
            )}
            {articles.map((article) => (
              <tr key={article.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{article.title}</div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
                    /{article.slug}
                  </div>
                </td>
                <td>
                  {article.category ? (
                    <span className="badge badge-primary">{article.category.name}</span>
                  ) : (
                    <span style={{ color: "var(--color-text-muted)", fontSize: "var(--text-xs)" }}>
                      None
                    </span>
                  )}
                </td>
                <td>
                  <span className={`badge ${article.published ? "badge-success" : "badge-warning"}`}>
                    {article.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td>{article.views}</td>
                <td style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
                  {formatDate(article.createdAt)}
                </td>
                <td>
                  <ArticleActions articleId={article.id} published={article.published} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
