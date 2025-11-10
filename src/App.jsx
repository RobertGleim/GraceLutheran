import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

import HomeView from './views/HomeView'
import LoginView from './views/LoginView'
import RegisterView from './views/RegisterView' // added import
import ChurchView from './views/ChurchView';
import Footer from './components/footer/footer';
import HistoryView from './views/HistoryView.jsx';
import CalenderView from './views/CalenderView-Church.jsx';
import WorshipView from './views/WorshipView.jsx';
import MissionView from './views/MissionView.jsx';
import BeliefsView from './views/BeliefsView.jsx';
import AdminView from './views/Adminview.jsx';
import NavBar from './components/navbar/NavBar';
import ContactView from './views/ContactView';
import SchoolView from './views/SchoolView';
import DonationView from './views/DonationView';
import UpcomingView from './views/UpcomingView'; // <-- new import

function App() {
  // make scroll/touch/wheel listeners passive by default to avoid non-passive warnings
  useEffect(() => {
    if (typeof window === 'undefined' || !window.EventTarget) return;
    if (window.__passiveListenerPatched) return;

    const orig = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, listener, options) {
      try {
        const passiveEvents = ['touchstart', 'touchmove', 'wheel', 'scroll'];
        // ensure options is an object when needed
        if (passiveEvents.includes(type)) {
          if (options === undefined || typeof options === 'boolean') {
            options = { passive: true };
          } else if (typeof options === 'object' && !options.passive) {
            options = { ...options, passive: true };
          }
        }
      } catch  {
        // ignore and fall back to original behavior
      }
      return orig.call(this, type, listener, options);
    };
    window.__passiveListenerPatched = true;
  }, []);

  return (
   <>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <NavBar />
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<RegisterView />} /> {/* added register route */}
        <Route path="/church" element={<ChurchView />} />
        <Route path="/history" element={<HistoryView />} />
        <Route path="/calendar" element={<CalenderView />} />
        <Route path="/worship" element={<WorshipView />} />
        <Route path="/mission" element={<MissionView />} />
        <Route path="/beliefs" element={<BeliefsView />} />
        <Route path="/admin" element={<AdminView />} />
        <Route path="/contact" element={<ContactView />} />
        <Route path="/school" element={<SchoolView />} />
        <Route path="/donation" element={<DonationView />} />
        <Route path="/upcoming-events" element={<UpcomingView />} /> {/* <-- new route */}
      </Routes>
      <Footer />
    </BrowserRouter>
   </>
  )
}

export default App
