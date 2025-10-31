import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'


import HomeView from './views/HomeView'
import LoginView from './views/LoginView'
import ChurchView from './views/ChurchView';
import Footer from './components/footer/footer';
import HistoryView from './views/HistoryView.jsx';
import CalenderView from './views/CalenderView-Church.jsx';






function App() {
  

  return (
   <>
    <BrowserRouter>
  
      <Routes>
  <Route path="/" element={<HomeView />} />
  <Route path="/login" element={<LoginView />} />
  <Route path="/church" element={<ChurchView />} />
  <Route path="/history" element={<HistoryView />} />
  <Route path="/calendar" element={<CalenderView />} />
  {/* <Route path="/worship" element={<ChurchView />} />
  <Route path="/mission" element={<ChurchView />} /> */}

      </Routes>
      <Footer />
    </BrowserRouter>
   </>
  )
}

export default App
