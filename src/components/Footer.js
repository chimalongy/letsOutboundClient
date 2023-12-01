import React from 'react';

import '../styles/Footer.css'
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <div className='footer-container'>

        <div className="footer-column">
          <h3>Socials</h3>
          <div className="social-icons">
            <a href="https://facebook.com"><i class="fa-brands fa-facebook"></i>  Facebook</a>
            <a href="https://twitter.com"><i class="fa-brands fa-x-twitter"></i>  Twitter</a>
            <a href="https://linkedin.com"><i class="fa-brands fa-linkedin"></i>  LinkedIn</a>
            {/* <a href="https://instagram.com"><FontAwesomeIcon icon={faInstagram} /> Instagram</a> */}
          </div>
        </div>

        <div className="footer-column">
          <h3>Contact</h3>
          <div className="contact-info">
            <p><i class="fa-solid fa-phone"></i> (081) 579-67548</p>
            <p><i class="fa-solid fa-envelope"></i> letsoutbound@gmail.com</p>
          </div>
        </div>

        <div className="footer-column">
          <h3>Address</h3>
          <p><i class="fa-solid fa-map-location-dot"></i> 38 Aminat St, Ojo, Lagos, 102114</p>
        </div>

      </div>
      <div className={"bottomBarStyle"}>
        <p>&copy; {currentYear} LetsOutbound. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
