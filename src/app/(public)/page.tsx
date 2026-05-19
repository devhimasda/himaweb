import Link from "next/link";
import { getPublishedArticles } from "@/actions/articles";
import { formatDate, getInitials } from "@/lib/utils";
import HeroCanvas from "@/components/HeroCanvas";

export default async function HomePage() {
  const { articles } = await getPublishedArticles(1, 3);

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero" style={{ position: "relative", overflow: "hidden" }}>
        <HeroCanvas />
        <div className="hero-bg">
          <div className="hero-gradient-1" />
          <div className="hero-gradient-2" />
          <div className="hero-gradient-3" />
        </div>

        <div className="hero-content" style={{ position: "relative", zIndex: 2 }}>
          <div className="hero-badge hero-reveal hero-reveal-1">
            <span className="hero-badge-dot" />
            HIMASDA ON AIR
          </div>

          <h1 className="hero-reveal hero-reveal-2">
            We Build the <span className="highlight">Future</span> of Campus
            Together
          </h1>

          <p className="hero-subtitle hero-reveal hero-reveal-3">
            HIMASDA merupakan organisasi mahasiswa prodi sains data universitas muhammadiyah semarang.
            yang bergerak untuk mewujudkan SDM Sains Data yang berintegritas, berkarakter dan berwawasan global.
          </p>

          <div className="hero-actions hero-reveal hero-reveal-4">
            <Link href="/news" className="btn btn-primary btn-lg">
              Explore Our Activities
            </Link>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section
        id="about"
        className="section"
        style={{
          position: "relative",
          overflow: "hidden",
          /* 3-layer background stack */
          background: `
            linear-gradient(135deg,
              oklch(0.97 0.015 60) 0%,
              oklch(0.96 0.012 200) 100%
            )
          `,
        }}
      >
        {/* Layer 1 — Blueprint dot-grid (SVG data URI) */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1.2' fill='%235290d8' fill-opacity='0.18'/%3E%3C/svg%3E")`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Layer 2 — Large decorative arcs (brand color rings) */}
        <svg
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }}
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 1200 600"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top-right arc — Arctic blue */}
          <circle cx="1100" cy="-60" r="380" fill="none" stroke="#5290d8" strokeWidth="1.5" strokeOpacity="0.12" />
          <circle cx="1100" cy="-60" r="280" fill="none" stroke="#5290d8" strokeWidth="1" strokeOpacity="0.09" />
          <circle cx="1100" cy="-60" r="180" fill="none" stroke="#5290d8" strokeWidth="1" strokeOpacity="0.06" />

          {/* Bottom-left arc — Warm sand */}
          <circle cx="100" cy="660" r="360" fill="none" stroke="#c8af78" strokeWidth="1.5" strokeOpacity="0.15" />
          <circle cx="100" cy="660" r="240" fill="none" stroke="#c8af78" strokeWidth="1" strokeOpacity="0.10" />
          <circle cx="100" cy="660" r="140" fill="none" stroke="#c8af78" strokeWidth="1" strokeOpacity="0.07" />

          {/* Faint diagonal crosshair lines — blueprint feel */}
          <line x1="0" y1="0" x2="1200" y2="600" stroke="#5290d8" strokeWidth="0.5" strokeOpacity="0.04" />
          <line x1="1200" y1="0" x2="0" y2="600" stroke="#5290d8" strokeWidth="0.5" strokeOpacity="0.04" />
        </svg>

        {/* Content — sits above all background layers */}
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="section-header">
            <span className="section-label scroll-reveal">About Us</span>
            <h2 className="section-title scroll-reveal scroll-reveal-2">Who We Are</h2>
            <p className="section-subtitle scroll-reveal scroll-reveal-3">
              A community of driven students passionate about making a
              difference on campus and beyond.
            </p>
          </div>

          {/* Vision & Mission — text only, 2-column */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "var(--space-12)",
            marginTop: "var(--space-12)",
          }}>

            {/* Vision */}
            <div>
              <h3 className="scroll-reveal scroll-reveal-2" style={{
                fontSize: "var(--text-xl)",
                fontWeight: 700,
                color: "var(--color-text)",
                marginBottom: "var(--space-4)",
                letterSpacing: "-0.02em",
              }}>
                Our Vision
              </h3>
              <p className="scroll-reveal scroll-reveal-3" style={{
                fontSize: "var(--text-base)",
                color: "var(--color-text-secondary)",
                lineHeight: 1.8,
              }}>
                Mewujudkan himpunan mahasiswa S1 Sains Data yang adaptif, kreatif, dan inovatif        dalam mengembangkan potensi dan kualitas diri, baik dibidang akademik maupun non akademik.
              </p>
            </div>

            {/* Mission */}
            <div>
              <h3 className="scroll-reveal scroll-reveal-2" style={{
                fontSize: "var(--text-xl)",
                fontWeight: 700,
                color: "var(--color-text)",
                marginBottom: "var(--space-4)",
                letterSpacing: "-0.02em",
              }}>
                Our Mission
              </h3>
              <ul className="scroll-reveal scroll-reveal-3" style={{
                fontSize: "var(--text-base)",
                color: "var(--color-text-secondary)",
                lineHeight: 1.8,
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-3)",
              }}>
                {[
                  "Mewujudkan keterbukaan ide-ide kreatif, inovatif, serta revolusioner dari seluruh lini mahasiswa S1 Sains Data",
                  "Membuat sistem serta mekanisme himpunan lebih tegas dan progresif",
                  "Memberikan wadah pada keterminatan, aspirasi, ruang bertumbuh, serta kritik untuk mahasiswa S1 Sains Data",
                  "Menumbuhkan budaya disiplin, serta solidaritas guna mewujudkan sumber daya mahasiswa yang lebih unggul dan maju untuk kinerja yang jauh lebih optimal",
                ].map((item) => (
                  <li key={item} style={{ display: "flex", gap: "var(--space-3)", alignItems: "flex-start" }}>
                    <span style={{ color: "var(--color-primary)", fontWeight: 600, flexShrink: 0 }}>—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ── LATEST NEWS ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Latest News</span>
            <h2 className="section-title">What&apos;s Happening</h2>
            <p className="section-subtitle">
              Stay up to date with our latest activities, events, and
              achievements.
            </p>
          </div>

          {articles.length > 0 ? (
            <div className="news-editorial scroll-reveal">

              {/* ── Feature Card — Article[0] ── */}
              {articles[0] && (
                <Link
                  href={`/news/${articles[0].slug}`}
                  className="news-feature"
                >
                  {articles[0].coverImage ? (
                    <img
                      src={articles[0].coverImage}
                      alt={articles[0].title}
                      className="news-feature-image"
                    />
                  ) : (
                    <div className="news-feature-image-placeholder" />
                  )}

                  <div className="news-feature-body">
                    <span className="news-issue-label">Featured Story</span>

                    <div className="article-meta" style={{ marginBottom: "var(--space-3)" }}>
                      {articles[0].category && (
                        <span className="badge badge-primary">
                          {articles[0].category.name}
                        </span>
                      )}
                      <span className="article-date">
                        {formatDate(articles[0].createdAt)}
                      </span>
                    </div>

                    <h3 className="news-feature-title">{articles[0].title}</h3>
                    <p className="news-feature-excerpt">{articles[0].excerpt}</p>

                    <div className="news-feature-footer">
                      <div className="article-author" style={{ border: "none", padding: 0, margin: 0 }}>
                        <div className="author-avatar">
                          {getInitials(articles[0].author?.name || "A")}
                        </div>
                        <span className="author-name">{articles[0].author?.name}</span>
                      </div>
                      <span style={{
                        fontSize: "var(--text-xs)",
                        fontWeight: 700,
                        color: "var(--color-primary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}>
                        Read →
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* ── Sidebar — Articles[1] & [2] ── */}
              {articles.length > 1 && (
                <div className="news-sidebar">
                  {articles.slice(1, 3).map((article) => (
                    <Link
                      key={article.id}
                      href={`/news/${article.slug}`}
                      className="news-sidebar-item"
                    >
                      {article.coverImage ? (
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          className="news-sidebar-thumb"
                        />
                      ) : (
                        <div className="news-sidebar-thumb-placeholder" />
                      )}

                      <div className="news-sidebar-meta">
                        {article.category && (
                          <span className="badge badge-primary" style={{ fontSize: "0.65rem" }}>
                            {article.category.name}
                          </span>
                        )}
                      </div>

                      <h3 className="news-sidebar-title">{article.title}</h3>

                      <div className="news-sidebar-footer">
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                          <div className="author-avatar" style={{ width: "24px", height: "24px", fontSize: "0.6rem" }}>
                            {getInitials(article.author?.name || "A")}
                          </div>
                          <span className="article-date">{formatDate(article.createdAt)}</span>
                        </div>
                        <span className="news-read-more">Read →</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "var(--space-16) 0", color: "var(--color-text-muted)" }}>
              <p style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-4)" }}>
                No articles published yet
              </p>
              <p>Check back soon for the latest news and updates!</p>
            </div>
          )}

          {articles.length > 0 && (
            <div style={{ textAlign: "center", marginTop: "var(--space-12)" }}>
              <Link href="/news" className="btn btn-secondary">
                View All News →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="section"
        style={{
          background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
          color: "var(--color-text-inverse)",
          textAlign: "center",
        }}
      >
        <div className="container">
          <span
            className="section-label"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            Join Us
          </span>
          <h2
            className="section-title"
            style={{ color: "var(--color-text-inverse)" }}
          >
            Ready to Make an Impact?
          </h2>
          <p
            className="section-subtitle"
            style={{
              color: "rgba(255,255,255,0.8)",
              marginBottom: "var(--space-10)",
            }}
          >
            Join HIMA and become part of a community that shapes the future of
            our campus.
          </p>
          <Link
            href="/news"
            className="btn btn-lg"
            style={{
              background: "white",
              color: "var(--color-primary-dark)",
              fontWeight: 700,
            }}
          >
            Learn More About Us
          </Link>
        </div>
      </section>
    </>
  );
}
