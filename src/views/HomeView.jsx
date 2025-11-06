import React, { useState, useEffect } from "react";
import "./Homeview.css";
import SearchBible from "../components/searchbible/SearchBible.jsx";
import DailyVerse from "../components/dailyverse/DailyVerse.jsx";
import HeroSection from "../components/hero/HeroSection.jsx";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

import {
  YouTubeProvider,
  YouTubeEmbed,
  YouTubeLink,
} from "../contexts/YouTubeContext";

const HomeView = () => {
  const navigate = useNavigate();
  // const [apiStatus, setApiStatus] = useState("");

  const [pastorMessage, setPastorMessage] = useState(null);

  useEffect(() => {
    const fetchPastorMessage = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/pastor-messages/active`);
        if (response.ok) {
          const data = await response.json();
          setPastorMessage(data);
        }
      } catch (error) {
        console.error('Error fetching pastor message:', error);
      }
    };
    
    fetchPastorMessage();
  }, []);

  return (
    <>
      <div className="home-hero">
        <div className="homeHero-bg1 scaleUp"></div>
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
        <div className="school-card">School Information</div>
        <div className="donation-card">Donation Information</div>
      </div>

      <div className="main-content">
        <div className="pastor-message-sidebar scrollable-sidebar">
          {pastorMessage ? (
            <>
              <h2>{pastorMessage.title}</h2>
              <br />
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
        {/* <YouTubeProvider setApiStatus={setApiStatus}>  you tube section temporarily removed waiting on client id
        <h2>Latest Livestream</h2>
        <YouTubeEmbed />
        <YouTubeLink />
        <div style={{ marginTop: "1rem" }}>
          <b>Status:</b> {apiStatus}
        </div>
      </YouTubeProvider> */}

        {/*  temp iframe code for testing  */}
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
      <div className="contact-info">
        <h4>Mailing Address</h4>

        <div>Mailing Address : 1007 Bacon Ranch Road, Killeen, Texas 76542</div>
      </div>
      <div ><div className="church-office">Church Office (254) 392-0717 Mon.-Thurs. 9:00 – 2:00 
        <NavLink to="/contact"><img style={{ width: '50px', transform: 'translateY(10px)' }}
              src="/icons8-email-100.png"
              alt="Envelope icon representing email contact option"
            /></NavLink></div>

      <div className="school-office">School Office (254) 441-5519 Mon.-Fri. 8:30 – 3:30 <NavLink to="/contact"><img style={{ width: '50px', transform: 'translateY(10px)' }}
              src="/icons8-email-100.png"
              alt="Envelope icon representing email contact option"
            /></NavLink></div>

      </div>
    </>
  );
};

export default HomeView;
