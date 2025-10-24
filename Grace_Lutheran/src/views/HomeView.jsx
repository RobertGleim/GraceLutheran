import React from 'react';
import './HomeView.css';
import SearchBible from '../components/SearchBible.jsx';
import DailyVerse from '../components/DailyVerse.jsx';


const HomeView = () => {
  return (
    <>
      <div className="home-view">
        <h1>Welcome to Grace Lutheran Church</h1>
        <p>Your faith journey begins here.</p>
      </div>
      <DailyVerse />
      <SearchBible />
    </>
  );
};

export default HomeView;