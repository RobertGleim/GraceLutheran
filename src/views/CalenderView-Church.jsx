import React from "react";
import HeroSection from "../components/hero/HeroSection";
import { Link } from "react-router-dom";

const CalenderView = () => {
  return (
    <div>
      <div className="home-hero">
        <div className="homeHero-bg1 fadeIn"></div>
        <div className="homeHero-bg2"></div>
        <HeroSection />
      </div>

      {/* toolbar with Upcoming Events button */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          marginTop: "1.25rem",
        }}
      >
        <Link
          to="/upcoming-events"
          className="upcoming-link"
          style={{
            display: "inline-block",
            background:
              "linear-gradient(135deg,#1056ec 0%,#68c0f3 100%)",
            color: "#fff",
            padding: "0.6rem 1rem",
            borderRadius: 6,
            textDecoration: "none",
            fontFamily: '"Libre Baskerville", serif',
            boxShadow: "0 2px 8px rgba(16,86,236,0.2)",
          }}
        >
          Upcoming Events
        </Link>
      </div>

      {/* simple responsive iframe wrapper (no toolbar / button) */}
      <div
        style={{ position: "relative", width: "100%", paddingBottom: "75%" }}
      >
        <iframe
          src="https://calendar.google.com/calendar/embed?src=iframely.embeds%40gmail.com"
          title="Church Calendar"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "75%",
            height: "75%",
            border: 0,
            margin: "auto",
            right: 0,
            bottom: 0,
          }}
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default CalenderView;

