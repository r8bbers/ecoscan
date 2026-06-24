import React, { useEffect, useState } from 'react'
import './Navbar.css'
import { Wifi, UserCircle2 } from 'lucide-react'

const Navbar = () => {
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar ${sticky ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <a href="/" className="navbar-brand">
          <span className="brand-icon">⟳</span>
          <span className="brand-name">EcoScan AI</span>
        </a>
        <ul className="navbar-links">
          <li><a href="/">Home</a></li>
          <li><a href="#detect">Detection</a></li>
          <li><a href="#info">Information</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="navbar-icons">
          <button className="icon-btn" aria-label="Signal"><Wifi size={18} /></button>
          <button className="icon-btn" aria-label="Account"><UserCircle2 size={18} /></button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar