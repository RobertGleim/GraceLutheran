import React from 'react'
import HeroSection from '../components/hero/HeroSection'

const CalenderView = () => {
  return (
    <div>
      <div className="calendar-hero">
        <HeroSection />
        <h1 className="calendar-title">Grace Lutheran Church Calendar</h1>
      </div>
      <div style={{ left: 0, width: '100%', height: 0, position: 'relative', paddingBottom: '75%' }}>
        <iframe
          src="https://calendar.google.com/calendar/embed?src=iframely.embeds%40gmail.com"
          style={{ top: 0, left: 0, width: '80%', height: '80%', position: 'absolute', border: 0, marginLeft: '10%', marginTop: '5%' }}
          allowFullScreen
        ></iframe>
      </div>
      <style>
        {`
          .calendar-hero {
          display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 40vh;
            position: relative;
            background: #a5edfac4;
            padding: 2rem 0 1rem 0;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .calendar-title {
            font-size: 2.5rem;
            color: #014691f1;
            margin-top: 1rem;
            text-shadow: 1px 1px 4px #665202ff;
            background-color:none;
           
            
            border-radius: 8px;
            font-weight: bold;
            
            font-size: 5rem;
          }
        `}
      </style>
    </div>
  )
}



export default CalenderView

