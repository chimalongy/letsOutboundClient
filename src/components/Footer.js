import React from 'react';
import "../styles/Footer.css"
function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-links">
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/terms-of-service">Terms of Service</a>
          <a href="/contact">Contact Us</a>
        </div>
        <div className="contact-info">
          <p>Email: me.chimaobi@gmail.com</p>
          <p>Phone: 0817967548</p>
          <p>Address: Lagos Nigeria</p>
        </div>
      </div>
      <p className="copyright">&copy; {new Date().getFullYear()} LetsOutbound. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
