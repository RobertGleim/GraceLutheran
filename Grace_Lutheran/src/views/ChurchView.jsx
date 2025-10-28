import React from "react";
import HeroSection from "../components/HeroSection.jsx";
import "./ChurchView.css";
import { NavLink } from "react-router-dom";

const ChurchView = () => {
  return (
    <>
      <div className="ChurchHero">
        <div className="ChurchHero-bg1"></div>
        <div className="ChurchHero-bg2"></div>
        <HeroSection />
      </div>
      <div className="church-info-cards">
        <NavLink to="/worship" className="worship-card"></NavLink>
        <div className="mission-card"></div>
        <div className="beliefs-card"></div>
      </div>
      <div className="pastor-card"></div>
      <div className="admin-card"></div>
    </>
  );
};

export default ChurchView;
