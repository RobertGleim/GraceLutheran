import React from "react";
import HeroSection from "../components/HeroSection.jsx";
import "./ChurchView.css";
import { NavLink } from "react-router-dom";

function ChurchView() {
  return (
    <>
      <div className="ChurchHero">
        <div className="ChurchHero-bg1"></div>
        <div className="ChurchHero-bg2 scaleUp">
          <h1 className="gracename ">Grace Lutheran Church</h1>
        </div>

        <HeroSection />
      </div>
      <div className="church-info-cards">
        <NavLink to="/worship" className="worship-card scaleUp1"></NavLink>
        <div className="mission-card scaleUp1"></div>
        <div className="beliefs-card scaleUp1"></div>
      </div>
      <div className="pastor-card">
        <img
          className="pastor-image"
          src="/pastor_img.jpg"
          alt="Pastor Andrew Green sits smiling warmly in a welcoming church office with bookshelves and soft lighting. The environment feels inviting and peaceful. No visible text in the image. The emotional tone is friendly and approachable."
        />
        <p>
          Hello. I am Andrew Green, the pastor here at Grace. I graduated from Concordia Seminary in St. Louis, Missouri in May, 2000. I began serving this congregation as a vacancy pastor in January, 2002 and received the pastoral call in October, 2003. My wife, Erica, and I have been married since June, 2000 and we have two children, Clara and John-August. It has been an amazing experience witnessing how our Lord has worked in this part of the Church and serving the people of Grace through the years. If you are looking for a church home or looking for an early childhood center for your child, I would encourage you to come visit Grace. I assure you that you will find a place to grow in faith and knowledge of our Lord Jesus amidst a people who are united in their love of Jesus and their desire to follow Him as participants in His mission in the greater Ft. Hood area.
        </p>
        <NavLink to="/contact">
          <img src="/icons8-email-100.png" alt="Envelope icon representing email contact option" />
        </NavLink>
      </div>
      <div className="admin-card"></div>
    </>
  );
}

export default ChurchView;
