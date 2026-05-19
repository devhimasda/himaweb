import Link from "next/link";
import { getPublishedArticles, getAllCategories } from "@/actions/articles";
import { formatDate, getInitials } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News & Activities — HIMA",
  description: "Latest news, events, and activity reports from HIMA student organization.",
};

interface PageProps {
  searchParams: Promise<{ page?: string; category?: string; q?: string }>;
}

export default async function NewsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const categorySlug = params.category;
  const search = params.q;

  const [{ articles, pagination }, categories] = await Promise.all([
    getPublishedArticles(page, 9, categorySlug, search),
    getAllCategories(),
  ]);

  return (
    <div style={{ paddingTop: "calc(var(--navbar-height) + var(--space-12))" }}>
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ marginBottom: "var(--space-10)" }}>
          <span className="section-label">News & Activities</span>
          <h1 className="section-title">Activity Reports</h1>
          <p className="section-subtitle">
            Keep up with everything happening in our organization.
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", marginBottom: "var(--space-10)" }}>
          <Link
            href="/news"
            className={`btn ${!categorySlug ? "btn-primary" : "btn-ghost"} btn-sm`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/news?category=${cat.slug}`}
              className={`btn ${categorySlug === cat.slug ? "btn-primary" : "btn-ghost"} btn-sm`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <div className="news-grid">
            {articles.map((article, i) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className={`card article-card animate-fade-in animate-delay-${(i % 3) + 1}`}
              >
                {article.coverImage ? (
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="card-image"
                  />
                ) : (
                  <div
                    className="card-image"
                    style={{
                      background: "linear-gradient(135deg, var(--color-primary-light), var(--color-accent-light))",
                    }}
                  />
                )}
                <div className="card-body">
                  <div className="article-meta">
                    {article.category && (
                      <span className="badge badge-primary">
                        {article.category.name}
                      </span>
                    )}
                    <span className="article-date">
                      {formatDate(article.createdAt)}
                    </span>
                  </div>
                  <h2 className="article-title">{article.title}</h2>
                  <p className="article-excerpt">{article.excerpt}</p>
                  <div className="article-author">
                    <div className="author-avatar">
                      {getInitials(article.author?.name || "A")}
                    </div>
                    <span className="author-name">{article.author?.name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "var(--space-24) 0", color: "var(--color-text-muted)" }}>
            <p style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-4)" }}>
              No articles found
            </p>
            <p>
              {search
                ? `No results for "${search}". Try a different search term.`
                : "Check back soon for the latest news and updates!"}
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="pagination">
            <Link
              href={`/news?page=${page - 1}${categorySlug ? `&category=${categorySlug}` : ""}`}
              className="pagination-btn"
              style={{ pointerEvents: pagination.hasPrevPage ? "auto" : "none" }}
            >
              ←
            </Link>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (p) => (
                <Link
                  key={p}
                  href={`/news?page=${p}${categorySlug ? `&category=${categorySlug}` : ""}`}
                  className={`pagination-btn ${p === page ? "active" : ""}`}
                >
                  {p}
                </Link>
              )
            )}
            <Link
              href={`/news?page=${page + 1}${categorySlug ? `&category=${categorySlug}` : ""}`}
              className="pagination-btn"
              style={{ pointerEvents: pagination.hasNextPage ? "auto" : "none" }}
            >
              →
            </Link>
          </div>
        )}

        <div style={{ height: "var(--space-24)" }} />
      </div>
    </div>
  );
}
