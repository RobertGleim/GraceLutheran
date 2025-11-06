import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

import HomeView from './views/HomeView'
import LoginView from './views/LoginView'
import ChurchView from './views/ChurchView';
import Footer from './components/footer/footer';
import HistoryView from './views/HistoryView.jsx';
import CalenderView from './views/CalenderView-Church.jsx';
import WorshipView from './views/WorshipView.jsx';
import MissionView from './views/MissionView.jsx';
import BeliefsView from './views/BeliefsView.jsx';
import AdminView from './views/Adminview.jsx';

function App() {
  return (
   <>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/church" element={<ChurchView />} />
        <Route path="/history" element={<HistoryView />} />
        <Route path="/calendar" element={<CalenderView />} />
        <Route path="/worship" element={<WorshipView />} />
        <Route path="/mission" element={<MissionView />} />
        <Route path="/beliefs" element={<BeliefsView />} />
        <Route path="/admin" element={<AdminView />} />
      </Routes>
      <Footer />
    </BrowserRouter>
   </>
  )
}

export default App
