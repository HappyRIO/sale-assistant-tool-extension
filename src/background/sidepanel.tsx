import React from "react";

import Login from "./Login";
// import Navbar from './Navbar'
import PitchPulse from "./PitchPulse";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const SidePanel = () => {
  return (
    <div>
      <Router>
        {/* <Navbar /> */}
        <Routes>
          <Route path="/*" element={<Login />} />
          <Route path="/analytics" element={<PitchPulse />} />
        </Routes>
      </Router>
    </div>
  );
};
export default SidePanel;
