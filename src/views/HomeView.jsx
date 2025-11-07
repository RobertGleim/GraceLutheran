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
        <div className="homeHero-bg1 fadeIn"></div>
        <div className="homeHero-bg2"></div>
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
            </>
          ) : (
            <>
              <h2>Message from the Pastor</h2>
              <br />
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident
                odit impedit ratione dolore. Deserunt deleniti minus nostrum,
                voluptatibus magnam nesciunt temporibus. Necessitatibus facere animi
                vel in veniam nostrum nam tempora hic molestias possimus culpa
                tenetur assumenda, quidem, repellat sit officia iste, ullam adipisci
                sapiente similique amet! Minima omnis numquam corporis placeat. Sunt
                tempora illo maiores voluptatibus fugit dicta atque nostrum
                molestias. Autem, totam quod, ratione doloribus nihil aspernatur
                voluptatibus repellat aliquid, odio dolorum natus et quos. Aut,
                mollitia quibusdam maiores ipsam ipsa veniam eum ipsum repudiandae
                reprehenderit iste aspernatur et quia commodi at numquam voluptatem
                adipisci. Dolor corporis pariatur architecto?
              </p>
            </>
          )}
        </div>

        {/* YouTube Video Section - In center */}
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

        <div className="dailyverse-container">
          <DailyVerse />
        </div>
      </div>

      <SearchBible />
      
    </>
  );
};

export default HomeView;
