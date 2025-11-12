import React, { useState, useEffect } from "react";
import "./Homeview.css";
import SearchBible from "../components/searchbible/SearchBible.jsx";
import DailyVerse from "../components/dailyverse/DailyVerse.jsx";
import HeroSection from "../components/hero/HeroSection.jsx";
import { useNavigate, Link } from "react-router-dom";

import {
  YouTubeProvider,
  YouTubeEmbed,
  YouTubeLink,
} from "../contexts/YouTubeContext";

const HomeView = () => {
  const navigate = useNavigate();
 

  const [pastorMessage, setPastorMessage] = useState(null);

  useEffect(() => {
    const fetchPastorMessage = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/pastor-messages/active`);
        if (response.ok) {
          const data = await response.json();
          setPastorMessage(data);
        } else {
          setPastorMessage(null);
        }
      } catch {
        setPastorMessage(null);
      }
    };
    
   
    fetchPastorMessage();
    
    
    const interval = setInterval(fetchPastorMessage, 30000);
    
    
    const handleMessageUpdate = () => {
      fetchPastorMessage();
    };
    window.addEventListener('pastorMessageUpdated', handleMessageUpdate);
    
   
    return () => {
      clearInterval(interval);
      window.removeEventListener('pastorMessageUpdated', handleMessageUpdate);
    };
  }, []);

  return (
    <>
      <div className="home-hero">
        <div className="homeHero-bg1 fadeIn">
          <div className="homeHero-bg2"></div>
        </div>
        <HeroSection />
      </div>
      <div className="home-intro">
        <div
          className="church-card"
          onClick={() => navigate("/church")}
          style={{ cursor: "pointer" }}
        >
          Church Information
        </div>
        <div
          className="school-card"
          onClick={() => navigate("/school")}
          style={{ cursor: "pointer" }}
        >
          School Information
        </div>
        <div
          className="donation-card"
          onClick={() => navigate("/donation")}
          style={{ cursor: "pointer" }}
        >
          Donation Information
        </div>
      </div>

      <div className="main-content">
        <div className="pastor-message-sidebar scrollable-sidebar">
          {pastorMessage ? (
            <>
              <h2>{pastorMessage.title}</h2>
               <hr />
              <p>{pastorMessage.message}</p>
              <hr />
              <p>
                <em>
                  - {pastorMessage.pastorName || " Pastor"}{" Andrew Green "}
                </em>
              </p>
            </>
          ) : (
            <>
              <h2>Message from the Pastor</h2>
              <br />
              <p>
                Welcome! <br /> Here at Grace we strive to follow Jesus – first as He gathers us together in worship to feed and nourish us with His Word and Sacraments and then as He leads us into our neighborhoods and work places to serve one another and share God’s love.  Take some time to browse through our website and get to know a little about us.  You will discover our mission and learn how to connect to the people and ministry of Grace.  When you are ready, know that you are welcome to join us and be part of our mission team.
                
              </p>
              
            </>
          )}
        </div>

        {/* Center column: YouTube above, Search centered under it */}
        <div className="center-column">
          <div className="youtube">
            <div className="youtube-responsive">
              <iframe
                src="https://www.youtube.com/embed/zVr8VortWJE?si=od36QN1j03ijyy0e"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
            <h4>Watch Our Latest Sermon</h4>
          </div>

          <div className="search-wrapper">
            <SearchBible />
          </div>
        </div>

        <div className="dailyverse-container">
          <DailyVerse />
        </div>
      </div> {/* end .main-content */}
    </>
  );
};

export default HomeView;
