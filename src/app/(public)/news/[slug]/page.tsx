import { getArticleBySlug, getPublishedArticles } from "@/actions/articles";
import { formatDate, getInitials } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import DOMPurify from "isomorphic-dompurify";
import { cache } from "react";

// cache() deduplicates this call per request so generateMetadata and the
// page component share one DB fetch — fixing the double view-increment bug.
const getCachedArticle = cache(getArticleBySlug);

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getCachedArticle(slug);
  if (!article) return { title: "Not Found" };
  return {
    title: `${article.title} — HIMA`,
    description: article.excerpt || `Read ${article.title} on HIMA website.`,
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getCachedArticle(slug);

  if (!article) notFound();

  const { articles: related } = await getPublishedArticles(1, 3);
  const relatedArticles = related.filter((a) => a.id !== article.id).slice(0, 2);

  return (
    <article className="article-detail">
      <div className="article-detail-header animate-fade-in">
        {article.category && (
          <Link href={`/news?category=${article.category.slug}`}>
            <span className="badge badge-primary" style={{ marginBottom: "var(--space-4)" }}>
              {article.category.name}
            </span>
          </Link>
        )}

        <h1 className="article-detail-title">{article.title}</h1>

        <div className="article-detail-meta">
          <div className="article-author">
            <div className="author-avatar">
              {getInitials(article.author?.name || "A")}
            </div>
            <span className="author-name">{article.author?.name}</span>
          </div>
          <span>·</span>
          <span>{formatDate(article.createdAt)}</span>
          <span>·</span>
          <span>{article.views} views</span>
        </div>
      </div>

      {article.coverImage && (
        <img
          src={article.coverImage}
          alt={article.title}
          className="article-detail-cover animate-fade-in animate-delay-1"
        />
      )}

      <div
        className="article-content animate-fade-in animate-delay-2"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content || "") }}
      />

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section style={{ marginTop: "var(--space-24)", borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-12)" }}>
          <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-8)" }}>
            More from HIMA
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "var(--space-6)" }}>
            {relatedArticles.map((a) => (
              <Link key={a.id} href={`/news/${a.slug}`} className="card article-card">
                {a.coverImage ? (
                  <img src={a.coverImage} alt={a.title} className="card-image" />
                ) : (
                  <div
                    className="card-image"
                    style={{ background: "linear-gradient(135deg, var(--color-primary-light), var(--color-accent-light))" }}
                  />
                )}
                <div className="card-body">
                  <h3 className="article-title">{a.title}</h3>
                  <span className="article-date">{formatDate(a.createdAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
