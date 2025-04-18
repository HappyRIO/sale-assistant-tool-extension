import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import axios from "axios";

const MainPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();
  
  const [apiUrl, setApiUrl] = useState("");

  fetch(chrome.runtime.getURL('config.json'))
  .then(res => res.json())
  .then(config => {
    setApiUrl(config.API_URL);
    console.log(apiUrl);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(`${apiUrl}/login`, {
        username: email,
        password: password,
      });
  
      // Check response
      if (response.data?.message === "Login successful") {
        console.log("Login successful");
        navigate("/analytics");
      } else {
        console.error("Invalid credentials");
        alert("Invalid email or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred while trying to log in.");
    }
  };

  return (
    <div className="w-full h-screen max-w-sm mx-auto p-6 bg-[#0D0F1A] text-white rounded-2xl shadow-xl">
      <div className="flex items-center justify-center mb-6">
        <Logo />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-4 py-2 rounded-lg bg-[#0B0D17] border border-gray-700 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* <div>
          <label className="block text-sm mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-4 py-2 rounded-lg bg-[#0B0D17] border border-gray-700 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div> */}

        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-500 hover:opacity-90 font-semibold"
        >
          Log in
        </button>
      </form>

      {/* <p className="text-xs text-gray-500 mt-4 text-center">
        By signing up, you agree to our
        <a href="#" className="underline text-white hover:text-purple-400">
          Terms
        </a>
        and
        <a href="#" className="underline text-white hover:text-purple-400">
          Privacy Policy
        </a>
      </p> */}
    </div>
  );
};

export default MainPage;
