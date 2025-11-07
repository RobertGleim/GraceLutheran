import React from 'react';
import './HeroSection.css';



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
    <div className="hero-content">
      {children}
    </div>
  </section>
);

export default HeroSection;
