import React from "react";
import { Link } from "react-router-dom";

const MainPage = () => {
  return (
    <div className="py-10 px-10 flex flex-col bg-gray-800 h-screen" data-theme="aqua">
      <h1 className="py-5 text-lg font-bold">Sales Assistant Tool</h1>
        <button>
          <Link className="text-white hover:text-gray-400 text-xl" to="/tabone">Start</Link>
        </button>

    </div>
  );
};

export default MainPage;
