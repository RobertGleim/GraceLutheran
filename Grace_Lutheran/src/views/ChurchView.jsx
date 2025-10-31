import React from "react";
import HeroSection from "../components/hero/HeroSection.jsx";
import "./ChurchView.css";
import { NavLink } from "react-router-dom";


function ChurchView() {
  return (
    <>
      <div className="ChurchHero">
        <div className="ChurchHero-bg1"></div>
        <div className="ChurchHero-bg2 scaleUp">
          <h1 className="gracename ">Grace Lutheran Church</h1>
          <br />
        </div>
        <HeroSection />
        <p style={{ position: "absolute", bottom: "10px", width: "100%", textAlign: "center", color: "#020202ff", zIndex: 3, fontSize: "3rem", textShadow: "2px 0px 2px rgb(236, 182, 4), 2px 2px 2px rgba(4, 161, 252, 0.829)" }}>
          A Member of the Lutheran Church - Missouri Synod
        </p>
      </div>
      <div className="greeting"> <p>Welcome! <br /> Here at Grace we strive to follow Jesus – first as He gathers us together in worship to feed and nourish us with His Word and Sacraments and then as He leads us into our neighborhoods and work places to serve one another and share God’s love.  Take some time to browse through our website and get to know a little about us.  You will discover our mission and learn how to connect to the people and ministry of Grace.  When you are ready, know that you are welcome to join us and be part of our mission team.

<br /><br />   Visiting for the first time...
<br /><br />
If you are visiting with us, here are a few links that will help you get acquainted with Grace.  Of course, nothing beats experiencing Grace in person.  Please know you are welcome to visit anytime.</p>

      </div>

      <div className="church-info-cards">
       
        <NavLink to="/worship" className="worship-card scaleUp1"></NavLink>
        <div className="mission-card scaleUp1"></div>
        <div className="beliefs-card scaleUp1"></div>
      </div>

      <div className="church-staff">
        <div className="pastor-card">
          <div className="image-container1">
            <img
              className="pastor-image"
              src="/pastor_img.jpg"
              alt="Pastor Andrew Green of Grace Lutheran Church"
            />
            <h4>Andrew Green, Pastor</h4>
            <br />
            <p>
              Hello. I am Andrew Green, the pastor here at Grace. I graduated
              from Concordia Seminary in St. Louis, Missouri in May, 2000. I
              began serving this congregation as a vacancy pastor in January,
              2002 and received the pastoral call in October, 2003. My wife,
              Erica, and I have been married since June, 2000 and we have two
              children, Clara and John-August. It has been an amazing experience
              witnessing how our Lord has worked in this part of the Church and
              serving the people of Grace through the years. If you are looking
              for a church home or looking for an early childhood center for
              your child, I would encourage you to come visit Grace. I assure
              you that you will find a place to grow in faith and knowledge of
              our Lord Jesus amidst a people who are united in their love of
              Jesus and their desire to follow Him as participants in His
              mission in the greater Ft. Hood area.
            </p>
          </div>
          <NavLink to="/contact">
            <img
              src="/icons8-email-100.png"
              alt="Envelope icon representing email contact option"
            />
          </NavLink>
        </div>

        <div className="admin-card">
          <div className="image-container2">
            <img
              className="admin-image"
              src="/melissa_img.png"
              alt="Melissa Hamilton of Grace Lutheran Church"
            />
            <h4>Melissa Hamilton, Administrative Assistant/Music Director</h4>
            <br />
            <p>
              Melissa has split her time as our Music Director and Music Teacher
              since 2005. She taught elementary music for Killeen ISD for 12
              years. She is originally from Victoria, Texas but has lived in the
              Killeen area since 1988 with her husband Davis, who retired in May
              2022 after teaching elementary music for 31 years. They have a
              daughter, Nichole, who graduated from Baylor University with a
              master’s degree in social work, in May 2022. Teaching others to
              sing has been Melissa’s passion for many years. She hopes to
              instill a love of singing and, most importantly, of God’s deep
              love for them through Jesus!
            </p>
          </div>
          <NavLink to="/contact">
            <img
              src="/icons8-email-100.png"
              alt="Envelope icon representing email contact option"
            />
          </NavLink>
        </div>
        
      </div>
      
      <div className="church-resources">
        <a
          href="https://www.youtube.com/@GraceLCS/streams"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="youtube-icon"></div>
        </a>
        <NavLink to="/history">
          <div className="history">History</div>
        </NavLink>
        <NavLink to="/calendar">
          <div className="calendar">Calendar</div>
        </NavLink>
      </div>
    </>
  );
}

export default ChurchView;
