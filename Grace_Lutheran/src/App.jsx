import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import HomeView from './views/HomeView'
import LoginView from './views/LoginView'
import NavBar from './components/navbar/NavBar'






function App() {
  

  return (
   <>
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/Login" element={<LoginView />} />
        
      </Routes>

    </BrowserRouter>
   </>
  )
}

export default App
