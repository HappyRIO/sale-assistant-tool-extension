import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("yourpassword");
  const [invalid, setInvalid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const [apiUrl, setApiUrl] = useState("");

  fetch(chrome.runtime.getURL("config.json"))
    .then((res) => res.json())
    .then((config) => {
      setApiUrl(config.API_URL);
      console.log(apiUrl);
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("apiUrl", apiUrl);


    try {
      const response = await axios.post(
        `${apiUrl}/api/login`,
        new URLSearchParams({
          username: email,
          password: password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      // Check response
      console.log("response", response);
      const token = response.data?.access_token;
      if (token) {
        setIsLoading(false);
        localStorage.setItem("token", token);
        navigate("/analytics");
        console.log("Login successful");
      } else {
        setIsLoading(false);
        setInvalid(true);
        console.error("Invalid credentials");
      }
    } catch (error) {
      setIsLoading(false);
      setInvalid(true);
      console.error("Login error:", error);
    }
  };

  return (
    <div className="w-full h-screen  mx-auto p-6 bg-slate-950 text-white rounded-2xl shadow-xl">
      <div className="p-3 border-b border-gray-800 flex items-center">
        <Logo />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <label className="block text-sm mb-1" htmlFor="email">
            Email Address
          </label>
          {invalid && <div className="text-red-600 italic">Invalid email</div>}
          <input
            id="email"
            type="email"
            className="w-full px-4 py-2 rounded-lg bg-[#0B0D17] border border-gray-700 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setInvalid(false);
            }}
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
          className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-500 hover:opacity-90 font-semibold flex items-center justify-center disabled:opacity-70"
          disabled={isLoading}
        >
          {isLoading ? (
            <svg
              className="animate-spin h-6 w-6"
              viewBox="0 0 50 50"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="spinnerGradient"
                  x1="1"
                  y1="0"
                  x2="0"
                  y2="0"
                >
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
                </linearGradient>
              </defs>
              <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="url(#spinnerGradient)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="100"
                strokeDashoffset="25"
              />
            </svg>
          ) : (
            "Log in"
          )}
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

export default Login;
