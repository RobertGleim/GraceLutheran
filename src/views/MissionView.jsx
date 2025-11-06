import React from 'react'
import HeroSection from '../components/hero/HeroSection'
import './MissionView.css'

const MissionView = () => {
  return (
    <>
      <HeroSection className='mission-hero' />
      <div className='mission-content'>
        <h1>Mission</h1>
        <h1>The Mission of Grace Lutheran Church & School</h1>
        <p>The information on this page is not an answer to the question, “What is the mission of the church?”  Scripture answers that question quite clearly.  Rather, what is presented here is an answer to the question, “How is the mission of the church engaged at Grace Lutheran Church & School?”  Take a moment to watch the video for a quick overview of the mission of Grace.</p>
      </div>
        <div className='mission-video'>
            <video width="800" height="450" controls muted loop preload="metadata">
                <source src="/Mission-Video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>

       
          
        
        
        <div className='mission-details'>
            <img src="/mission-details.png" alt="Mission Image" />
            <p>If you would like to know more about the mission of Grace Lutheran Church & School, download and read over this Biblical explanation of our mission statement.

Of course, the best way to understand our mission is to participate in it.  Thus, you are invited to…</p>
            <ul>
                <li>Worship with us,</li>
                <li>Study with us,</li>
                <li>Fellowship with us,</li>
                <li>Outreach with us</li>
            </ul>

            <a className="about-holy"
      href="/The-Mission-of-Grace-LCS.pdf"
      target="_blank"
    >Download GLCS Mission Study 
      
    </a>

        </div>
    </>
  )
}

export default MissionView