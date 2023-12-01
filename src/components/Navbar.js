import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

import UserDashboard from '../components/UserDashboard';
import OutboundEmails from '../components/OutboundEmails';
import UserOutbound from '../components/UserOutbound';
import Dashboard from '../routes/Dashboard';
import DashboardMenu from './DashboardMenu';
import Logo from './Logo';

const Navbar = () => {
  const issUserLoggedin = !!localStorage.getItem("token")
  const [showNav, setShowNav] = useState(false);
  const navMenu = useRef(null);
  let navMove = useNavigate();
  // const generalCart = useSelector((state) => state.generalCart.generalCart);

  const [tabHeader, setTabHeader] = useState(null);
  const [tabContent, setTabContent] = useState();
  const dashboardRef = useRef();
  const emailRef = useRef();
  const outboundRef = useRef();
  const taskRef = useRef();

  const removeActive = () => {
    dashboardRef.current.classList.remove("active");
    emailRef.current.classList.remove("active");
    outboundRef.current.classList.remove("active");
  }

  const toggleMenu = () => {
    setShowNav(!showNav);
    if (!showNav) {
      document.body.style.overflow = 'hidden';
      navMenu.current.classList.add('nav-links-mobile');
    } else {
      document.body.style.overflow = '';
      navMenu.current.classList.remove('nav-links-mobile');
    }
  };

  const closeMenu = () => {
    setShowNav(false);
    document.body.style.overflow = '';
    navMenu.current.classList.remove('nav-links-mobile');
  };

  return (

    <nav className="navbar">
      <div className="nav-container">
        <NavLink to="/" onClick={closeMenu}>
          <Logo />
        </NavLink>

        <ul className="nav-links" ref={navMenu}>
          {/* <li>
            <NavLink to="" onClick={closeMenu}>
              About
            </NavLink>
          </li> */}

          <li>
            <NavLink to="/contact" onClick={closeMenu}>
              Contact
            </NavLink>
          </li>

        </ul>

        <div className='other-nav-menu' >
          <Link to={issUserLoggedin ? "/dashboard" : "/login"} onClick={() => {
            if (issUserLoggedin) {
              navMove("/dashboard")
              closeMenu()
            }
            else {
              navMove("/login")
              closeMenu()
            }

          }}> <i class="fa-solid fa-user nav-acount-icon" title='account'></i></Link>

          <div className="menu-icon" onClick={toggleMenu}>
            {showNav ? (
              <i className="fa-solid fa-xmark nav-icon"></i>
            ) : (
              <i className="fa-solid fa-bars nav-icon"></i>
            )}
          </div>
        </div>


      </div>
    </nav>
  );
};

export default Navbar;
