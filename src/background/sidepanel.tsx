import React from 'react'

import MainPage from './MainPage'
// import Navbar from './Navbar'
import PitchPulse from './PitchPulse';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';



const SidePanel = () => {
  return (
    <div>
      <Router>
      {/* <Navbar /> */}
        <Routes>
        <Route path="/*" element={<MainPage />} />
        <Route path="/tabone" element={<PitchPulse/>} />
        </Routes>
        {/* Add more routes for other pages */}
    </Router>
    </div>
  )
}
export default SidePanel