import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <nav className="footer-nav">
        <Link to="/">Home</Link>
        <Link to="/beliefs">Beliefs</Link>
        <Link to="/church">Church</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/events">Events</Link>
        <Link to="/history">History</Link>
        <Link to="/login">Login</Link>
        <Link to="/mission">Mission</Link>
        <Link to="/worship">Worship</Link>
      </nav>
      <div className="footer-copy">&copy; {new Date().getFullYear()} Grace Lutheran Church</div>
    </footer>
  );
};

export default Footer;