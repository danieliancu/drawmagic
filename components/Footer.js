// components/Footer.jsx
import { AiOutlineMail } from "react-icons/ai";
import { FaMapMarkerAlt } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-col">
          <h2 className="logo">doodle<span style={{ color:"white" }}>joy</span></h2>
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
          <p><AiOutlineMail /> info@doodlejoy.co.uk</p>
          <p><FaMapMarkerAlt /> Southend on Sea, United Kingdom</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© doodlejoy.co.uk. All rights reserved.</p>
        <div className="footer-links">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/cookies">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
}
