import React from "react";
import { Link } from "react-router-dom";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <nav className="footer-nav">
        <div className="footer-home-links">
          <Link to="/"><h3 style={{ fontSize: "2rem", margin: 0, color: "#0800ffa8", textShadow: "0 1px 3px rgba(0,0,0,0.2)" }}>Home</h3></Link>
          <div><Link to="/contact">Contact</Link>
          <Link to="/login">Login</Link></div>
        </div>
        <div className="footer-church-links">
          <Link to="/church"><h3 style={{ fontSize: "2rem", margin: 0, color: "#0800ffa8", textShadow: "0 1px 3px rgba(0,0,0,0.2)" }}>Church</h3></Link>
          <div><Link to="/worship">Worship</Link>
          <Link to="/history">History</Link>
          <Link to="/mission">Mission</Link></div>
        </div>
        <div className="footer-school-links">
          <Link to="/school"><h3 style={{ fontSize: "2rem", margin: 0, color: "#0800ffa8", textShadow: "0 1px 3px rgba(0,0,0,0.2)" }}>School</h3></Link>
          <div><Link to="/admissions">Admissions</Link>
          <Link to="/academics">Academics</Link>
          <Link to="/activities">Activities</Link></div>
        </div>
      </nav>
      <div className="footer-copy">
        &copy; Grace Lutheran Church
      </div>
    </footer>
  );
};

export default Footer;
