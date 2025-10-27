import React, { useState } from "react";
import "./HomeView.css";
import SearchBible from "../components/searchbible/SearchBible.jsx";
import DailyVerse from "../components/dailyverse/DailyVerse.jsx";
import HeroSection from "../components/HeroSection.jsx";
import { useNavigate } from "react-router-dom";
import { YouTubeProvider, YouTubeEmbed, YouTubeLink } from "../contexts/YouTubeContext";

const HomeView = () => {
  const navigate = useNavigate();
  const [apiStatus, setApiStatus] = useState("");

  return (
    <>
      <HeroSection />
      <div className="home-intro">
        <div className="church-card" onClick={() => navigate('/church')} style={{cursor: 'pointer'}}>
          Church Card
        </div>
        <div className="school-card">School Card</div>
        <div className="donation-card">Donation Card</div>
      </div>
     
      <div className="main-content">
        <div className="pastor-message-sidebar">
          <h2>Message from the Pastor</h2>
        </div>
        <div style={{ flex: 1 }}>
          <DailyVerse />
        </div>
      </div>
      <SearchBible />
      
      <YouTubeProvider setApiStatus={setApiStatus}>
        <h2>Latest Livestream</h2>
        <YouTubeEmbed />
        <YouTubeLink />
        <div style={{ marginTop: "1rem" }}>
          <b>Status:</b> {apiStatus}
        </div>
      </YouTubeProvider>
    </>
  );
};

export default HomeView;
