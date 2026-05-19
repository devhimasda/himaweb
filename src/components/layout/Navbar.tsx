"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
        <div className="navbar-inner">
          <Link href="/" className="navbar-logo">
            <Image
              src="/logo.png"
              alt="HIMASDA Logo"
              height={80}
              width={80}
              style={{ objectFit: "contain", height: "80px", width: "80px" }}
              priority
            />
          </Link>

          <ul className="navbar-links">
            <li>
              <Link href="/" className="navbar-link">
                Home
              </Link>
            </li>
            <li>
              <Link href="/news" className="navbar-link">
                News
              </Link>
            </li>
            <li>
              <Link href="/#about" className="navbar-link">
                About
              </Link>
            </li>
          </ul>

          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <Link href="/" className="mobile-menu-link" onClick={() => setMenuOpen(false)}>
          Home
        </Link>
        <Link href="/news" className="mobile-menu-link" onClick={() => setMenuOpen(false)}>
          News
        </Link>
        <Link href="/#about" className="mobile-menu-link" onClick={() => setMenuOpen(false)}>
          About
        </Link>
      </div>
    </>
  );
}
