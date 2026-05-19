import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="HIMASDA Logo"
                height={44}
                width={130}
                style={{ objectFit: "contain", height: "44px", width: "auto", marginBottom: "var(--space-4)" }}
              />
            </Link>
            <p>
              Student organization dedicated to fostering academic excellence,
              community engagement, and professional development.
            </p>
          </div>

          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/news">News & Activity</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Connect</h4>
            <ul className="footer-links">
              <li>
                <a href="mailto:hima@example.com">Email Us</a>
              </li>
              <li>
                <a href="https://www.instagram.com/himasda/" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://www.tiktok.com/@himasda.unimus" target="_blank" rel="noopener noreferrer">
                  Tiktok
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} HIMA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
