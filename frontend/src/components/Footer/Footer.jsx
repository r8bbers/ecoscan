import React from 'react'
import './Footer.css'
import { Recycle } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <a href="/" className="footer-brand">
            <span className="footer-logo-icon"><Recycle size={16} /></span>
            <span className="footer-logo-text">EcoScan AI</span>
          </a>
          <p className="footer-tagline">© 2024 EcoScan AI. High-tech clinical waste management.</p>
        </div>
        <nav className="footer-links">
          <a href="#sustainability">Sustainability Goals</a>
          <a href="#api">API Docs</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#contact">Contact Support</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;