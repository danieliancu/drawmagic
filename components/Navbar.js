import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar({ onTryClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScrollResize = () => {
      setScrolled(window.scrollY > 0);
      setIsMobile(window.innerWidth < 1000);
    };

    handleScrollResize();

    window.addEventListener("scroll", handleScrollResize);
    window.addEventListener("resize", handleScrollResize);

    return () => {
      window.removeEventListener("scroll", handleScrollResize);
      window.removeEventListener("resize", handleScrollResize);
    };
  }, []);

  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
      <Link
        href="/"
        className={`logo ${(isMobile && scrolled) ? "dark-logo" : ""}`}
        style={{ textDecoration: "none", cursor: "pointer" }}
      >
        DrawMagic
      </Link>

      <ul className="nav-links">
        <li><Link href="/#how">How It Works</Link></li>
        <li><Link href="/#gallery">Gallery</Link></li>
        <li><Link href="/#pricing">Pricing</Link></li>
        <li><Link href="/#testimonials">Testimonials</Link></li>
        <li><Link href="/#faq">FAQ</Link></li>
      </ul>

      <button
        className="btn mobile-only btn-kids"
        onClick={onTryClick}
      >
        Try it Free
      </button>
    </nav>
  );
}
