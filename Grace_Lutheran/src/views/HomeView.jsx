// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import "./HomeView.css";
import SearchBible from "../components/searchbible/SearchBible.jsx";
import DailyVerse from "../components/dailyverse/DailyVerse.jsx";
import HeroSection from "../components/HeroSection.jsx";
import { useNavigate } from "react-router-dom";
import {
  YouTubeProvider,
  YouTubeEmbed,
  YouTubeLink,
} from "../contexts/YouTubeContext";

const HomeView = () => {
  const navigate = useNavigate();
  // const [apiStatus, setApiStatus] = useState("");

  return (
    <>
      <div className="home-hero">
        <div className="homeHero-bg1"></div>
        <div className="homeHero-bg2"></div>
        <HeroSection />
      </div>
      <div className="home-intro">
        <div
          className="church-card"
          onClick={() => navigate("/church")}
          style={{ cursor: "pointer" }}
        >
          Church Card
        </div>
        <div className="school-card">School Card</div>
        <div className="donation-card">Donation Card</div>
      </div>

      <div className="main-content">
        <div className="pastor-message-sidebar">
          <h2>Message from the Pastor</h2>
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

        <div>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/zVr8VortWJE?si=od36QN1j03ijyy0e"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
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
