
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./NavBar.css";


const NavBar = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
  };
  
  return (
    <div className="navbar burger-navbar">
      <button
        className={`burger-menu${open ? ' open' : ''}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Toggle navigation menu"
      >
        <span className="burger-bar"></span>
        <span className="burger-bar"></span>
        <span className="burger-bar"></span>
      </button>
      <nav className={`nav-links${open ? ' show' : ''}`}>
        <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
        <NavLink to="/Beliefs" onClick={() => setOpen(false)}>Beliefs</NavLink>
        <NavLink to="/Contact" onClick={() => setOpen(false)}>Contact</NavLink>
        <NavLink to="/Events" onClick={() => setOpen(false)}>Events</NavLink>
        <NavLink to="/History" onClick={() => setOpen(false)}>History</NavLink>
        <NavLink to="/Missions" onClick={() => setOpen(false)}>Missions</NavLink>
        <NavLink to="/Worship" onClick={() => setOpen(false)}>Worship</NavLink>
        {user?.role === 'admin' && (
          <NavLink to="/admin" onClick={() => setOpen(false)}>Admin</NavLink>
        )}
        {user ? (
          <button className="nav-logout-btn" onClick={() => { handleLogout(); setOpen(false); }}>Logout</button>
        ) : (
          <NavLink to="/Login" onClick={() => setOpen(false)}>Login</NavLink>
        )}
      </nav>
    </div>
  );
};

export default NavBar;
