import React from 'react';
import './SchoolView.css';

const SchoolView = () => {
  return (
    <div className="school-view">
      <div className="construction-container">
        <div className="construction-icon">
          <span className="icon-text">🏗️</span>
        </div>
        <h1 className="construction-title">Under Construction</h1>
        <p className="construction-message">
          We're working hard to bring you an amazing school page experience.
        </p>
        <p className="construction-submessage">
          Check back soon for updates about Grace Lutheran School!
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

export default SchoolView;
