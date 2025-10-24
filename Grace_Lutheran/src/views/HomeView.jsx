import React from 'react';
import './HomeView.css';
import SearchBible from '../components/searchbible/SearchBible.jsx';
import DailyVerse from '../components/dailyverse/DailyVerse.jsx';


const HomeView = () => {
  return (
    <>
      <div className="home-intro">
        <h1>Welcome to Grace Lutheran Church</h1>
        <p>Your faith journey begins here.</p>
      </div>
      <div className='church-card'>Church Card</div>
      <div className='school-card'>School Card</div>

      <div className='donation-card'>Donation Card</div>
      <DailyVerse />
      <SearchBible />
    </>
  );
};

export default HomeView;