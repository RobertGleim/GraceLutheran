import React from 'react';
import './HeroSection.css';
import NavBar from './navbar/NavBar.jsx';



const HeroSection = ({ backgroundImage, className = "", children }) => (
  <section
    className={`hero-section ${className}`}
    style={
      backgroundImage
        ? {
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '300px',
            width: '100%',
          }
        : undefined
    }
  >
    <NavBar />
    <div className="hero-content">
      {children}
    </div>
  </section>
);

export default HeroSection;
