/**
 * Footer Component — Site footer with links and contact info.
 */

import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" id="site-footer">
      <div className="footer-inner container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span>📚</span> Mirabooks
            </Link>
            <p className="footer-tagline">
              Your favorite online bookstore. Discover, explore, and buy books
              from the comfort of your home.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/books">All Books</Link></li>
              <li><Link to="/categories">Categories</Link></li>
              <li><Link to="/cart">Cart</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-section">
            <h4 className="footer-heading">Categories</h4>
            <ul className="footer-links">
              <li><Link to="/books?category=fiction">Fiction</Link></li>
              <li><Link to="/books?category=non-fiction">Non-Fiction</Link></li>
              <li><Link to="/books?category=childrens">Children&apos;s</Link></li>
              <li><Link to="/books?category=african-literature">African Literature</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h4 className="footer-heading">Contact Us</h4>
            <ul className="footer-links footer-contact">
              <li>📧 support@mirabooks.com</li>
              <li>📞 +234 800 123 4567</li>
              <li>📍 Lagos, Nigeria</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Mirabooks. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
