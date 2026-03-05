import React from 'react';
import { useLocation } from 'react-router-dom';
import './Footer.css';
import logoCircle from '../assets/logo-circle.png';
import logoText from '../assets/logo-text.png';

import { Facebook, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
    const location = useLocation();

    // Hide footer on login and signup pages
    if (['/login', '/signup'].includes(location.pathname)) {
        return null;
    }

    return (
        <footer className="footer-container">
            {/* Left Side: Logo & Name */}
            <div className="footer-left" style={{ alignItems: 'center' }}>
                <img src={logoCircle} alt="StudiIn Logo" className="footer-logo-img" />
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', marginLeft: '10px', color: '#333' }}>StudiIn</span>
            </div>

            {/* Center: Copyright */}
            <div className="footer-center" style={{ color: '#6c757d' }}>
                &copy; {new Date().getFullYear()} StudiIn. All rights reserved.
            </div>

            {/* Right Side: Social Media Icons (SVG) */}
            <div className="footer-right">
                <a href="https://facebook.com" className="social-btn" target="_blank" rel="noopener noreferrer">
    <Facebook className="social-icon" />
</a>

<a href="https://twitter.com" className="social-btn" target="_blank" rel="noopener noreferrer">
    <Twitter className="social-icon" />
</a>

<a href="https://linkedin.com" className="social-btn" target="_blank" rel="noopener noreferrer">
    <Linkedin className="social-icon" />
</a>
            </div>
        </footer>
    );
};

export default Footer;
