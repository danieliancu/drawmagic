import { useState, useEffect } from "react";

export default function Navbar({ onTryClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScrollResize = () => {
      setScrolled(window.scrollY > 0);
      setIsMobile(window.innerWidth < 1000);
    };

    // rulează o dată la load
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
      <a
        style={{ textDecoration: "none", cursor: "pointer" }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`logo ${(isMobile && scrolled) ? "dark-logo" : ""}`}
      >
        DrawMagic
      </a>

      <ul className="nav-links">
        <li><a href="/#how">How It Works</a></li>
        <li><a href="/#gallery">Gallery</a></li>
        <li><a href="/#pricing">Pricing</a></li>
        <li><a href="/#testimonials">Testimonials</a></li>
        <li><a href="/#faq">FAQ</a></li>
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
