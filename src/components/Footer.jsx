import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="brand-logo">
            <span className="logo-icon">🎬</span>
            <span className="logo-text">MovieFlix</span>
          </div>
          <p className="brand-tagline">Unlimited Movies & TV Shows</p>
        </div>

        <div className="footer-links">
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="footer-link">Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="footer-link">Twitter/X</a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer-link">Instagram</a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer" className="footer-link">YouTube</a>
        </div>

        <div className="footer-copy">
          <span>© {new Date().getFullYear()} MovieFlix. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer


