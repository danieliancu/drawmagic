// components/Footer.jsx
import { AiOutlineMail } from "react-icons/ai";
import { FaMapMarkerAlt } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-col">
          <h2 className="logo">DrawMagic</h2>
          <p>
            Bringing children&apos;s imagination to life — printed on canvas,
            mugs, t-shirts and beyond.
          </p>
        </div>

        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul>
            <li><Link href="/#how">How It Works</Link></li>
            <li><Link href="/#pricing">Pricing</Link></li>
            <li><Link href="/#gallery">Gallery</Link></li>
            <li><Link href="/#testimonials">Testimonials</Link></li>
            <li><Link href="/#faq">FAQ</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Contact Us</h3>
          <p><AiOutlineMail /> info@iupii.com</p>
          <p><FaMapMarkerAlt /> Bucharest, Romania</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© DrawMagic.co.uk. All rights reserved.</p>
        <div className="footer-links">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/cookies">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
}
