import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'


import HomeView from './views/HomeView'
import LoginView from './views/LoginView'
import ChurchView from './views/ChurchView';
import Footer from './components/footer/footer';
import HistoryView from './views/HistoryView.jsx';






function App() {
  

  return (
   <>
    <BrowserRouter>
  
      <Routes>
  <Route path="/" element={<HomeView />} />
  <Route path="/Login" element={<LoginView />} />
  <Route path="/church" element={<ChurchView />} />
  <Route path="/History" element={<HistoryView />} />
  {/* <Route path="/Worship" element={<ChurchView />} />
  <Route path="/Mission" element={<ChurchView />} /> */}
  
       
      </Routes>
      <Footer />
    </BrowserRouter>
   </>
  )
}

export default App
