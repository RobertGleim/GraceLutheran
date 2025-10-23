
import React from "react";
import { NavLink } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
  return (
    <div className="navbar">
      <h1>Grace Lutheran Church</h1>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/Beliefs">Beliefs</NavLink>
        <NavLink to="/Contact">Contact</NavLink>
        <NavLink to="/Events">Events</NavLink>
        <NavLink to="/History">History</NavLink>
        <NavLink to="/Missions">Missions</NavLink>
        <NavLink to="/Worship">Worship</NavLink>
        <NavLink to="/Login">Login</NavLink>
      </nav>
    </div>
  );
};

export default NavBar;
