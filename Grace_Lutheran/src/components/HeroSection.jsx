
import React from 'react';
import './HeroSection.css';
import NavBar from './navbar/NavBar.jsx';



const HeroSection = ({ background, children }) => (
  <section
    className="hero-section"
    style={background ? { backgroundImage: `url(${background})` } : {}}
  >
    <NavBar />
    <div className="hero-content">
      {children}
    </div>
  </section>
);

export default HeroSection;
