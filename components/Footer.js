// components/Footer.jsx
import { AiOutlineMail } from "react-icons/ai";
import { FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-col">
          <h2 className="logo">iupii.ro</h2>
          <p>Bringing children’s imagination to life — printed on canvas, mugs, t-shirts and beyond.</p>
        </div>
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/#how">How It Works</a></li>
            <li><a href="/#pricing">Pricing</a></li>
            <li><a href="/#gallery">Gallery</a></li>
            <li><a href="/#testimonials">Testimonials</a></li>
            <li><a href="/#faq">FAQ</a></li>
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
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/cookies">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
}
