import React from 'react';
import './DonationView.css';

const DonationView = () => {
  return (
    <div className="donation-view">
      <div className="construction-container">
        <div className="construction-icon">
          <span className="icon-text">🏗️</span>
        </div>
        <h1 className="construction-title">Under Construction</h1>
        <p className="construction-message">
          We're working hard to bring you an amazing donation page experience.
        </p>
        <p className="construction-submessage">
          Check back soon for updates about giving to Grace Lutheran Church!
        </p>
        <div className="construction-loader">
          <div className="loader-bar"></div>
          <div className="loader-bar"></div>
          <div className="loader-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default DonationView;
