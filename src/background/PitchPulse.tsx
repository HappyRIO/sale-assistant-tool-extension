import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { LogOut } from "lucide-react";
import MetricsDisplay from "./MetricDisplay";
import Logo from "./Logo";
import { useNavigate } from "react-router-dom";

export interface Metrics {
  summary: {
    problem: string;
    goals: string;
    urgency: string;
    solution_awareness: string;
    financial_qualification: string;
  };
  scores: {
    problem: number;
    goals: number;
    urgency: number;
    solution_awareness: number;
    financial_qualification: number;
  };
}

const initMetrics = {
  summary: {
    problem: "",
    goals: "",
    urgency: "",
    solution_awareness: "",
    financial_qualification: "",
  },
  scores: {
    problem: 0,
    goals: 0,
    urgency: 0,
    solution_awareness: 0,
    financial_qualification: 0,
  },
};

const PitchPulse = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [message, setMessage] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [metrics, setMetrics] = useState<Metrics>(initMetrics);
  const socketRef = useRef<WebSocket | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [botId, setBotId] = useState(localStorage.getItem("botId"));

  const [apiUrl, setApiUrl] = useState("");
  const [webSockedUrl, setWebSocketUrl] = useState("");
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    fetch(chrome.runtime.getURL("config.json"))
      .then((res) => res.json())
      .then((config) => {
        setApiUrl(config.API_URL);
        setWebSocketUrl(config.WEBSOCKET_URL);
      });
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    console.log("token", storedToken);
    setToken(storedToken);

    if (!storedToken) {
      navigate("/");
      return;
    }

    fetch(chrome.runtime.getURL("config.json"))
      .then((res) => res.json())
      .then((config) => {
        axios
          .get(`${config.API_URL}/api/protected`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          })
          .then((res) => {
            setMessage(res.data.message);
          })
          .catch(() => {
            setMessage("Unauthorized");
            localStorage.removeItem("token");
          });
      });
  }, []);

  const isValidZoomUrl = (url: string) => {
    const regex = /^https:\/\/([\w.-]+)?zoom\.us\/[jw]\/\d+(\?pwd=[\w.-]+)?$/;
    return regex.test(url);
  };

  const isValidGoogleMeetUrl = (url: string): boolean => {
    const regex = /^https:\/\/meet\.google\.com\/[a-z]{3}-[a-z]{4}-[a-z]{3}$/;
    return regex.test(url);
  };

  const initWebSocket = () => {
    if (!webSockedUrl) return;
    socketRef.current = new WebSocket(`${webSockedUrl}/api/ws`);

    socketRef.current.onopen = () => {
      console.log("WebSocket connection established.");
      setIsSocketConnected(true);
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const current_botID = localStorage.getItem("botId");
      if (data.event == "bot.call_ended" && data.bot_id == current_botID) {
        setIsLoading(true);
        setIsJoined(false);
        setIsReady(false);
        closeWebSocket();
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
        console.log("Bot call ended", data.bot_id);
      } else if (data.event == "close" && data.bot_id == current_botID) {
        closeWebSocket();
        localStorage.removeItem("botId");
        console.log("Bot call started", data.bot_id);
      } else if (
        data.event == "transcript.data" &&
        data.bot_id == current_botID
      ) {
        const parsedData = JSON.parse(data.data);
        setMetrics(parsedData);
        console.log("Analysis data:", data.data);
      } else if (
        data.event == "transcript.processing" &&
        data.bot_id == current_botID
      ) {
        setIsReady(true);
        console.log("Bot call started", data.bot_id);
      } else if (
        data.event == "bot.in_call_not_recording" &&
        data.bot_id == current_botID
      ) {
        setIsReady(false);
        console.log("Bot in call but not recording", data.bot_id);
      } else if (data.event == "bot.fatal" && data.bot_id == current_botID) {
        setIsJoined(false);
        closeWebSocket();
        localStorage.removeItem("botId");
        console.log("Bot fatal error", data.bot_id);
      }
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket connection closed.");
      setIsSocketConnected(false);
    };
  };

  const closeWebSocket = () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
      setIsSocketConnected(false);
      console.log("WebSocket connection closed manually.");
    }
  };

  const reconnectWebSocket = () => {
    if (!isSocketConnected && isJoined && !isReconnecting) {
      setIsLoading(true);
      setIsReconnecting(true);
      initWebSocket();
      setIsReconnecting(false);
      setIsLoading(false);
    }
  };

  const joinMeeting = (meetingUrl: string) => {
    if (!meetingUrl) {
      alert("Please enter a meeting URL.");
      return;
    }

    if (!isValidZoomUrl(meetingUrl) && !isValidGoogleMeetUrl(meetingUrl)) {
      alert("Please enter a valid meeting Link.");
      return;
    }

    setIsLoading(true);
    setMetrics(initMetrics);

    axios
      .post(
        `${apiUrl}/api/join-meeting`,
        { url: meetingUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        setBotId(response.data.bot_id);
        localStorage.setItem("botId", response.data.bot_id);
        setIsJoined(true);
        setMeetingUrl("");
        initWebSocket();
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const leaveMeeting = () => {
    if (isJoined) {
      setIsLoading(true);
      const current_botID = localStorage.getItem("botId");
      axios
        .post(`${apiUrl}/api/leave-meeting`, { id: current_botID })
        .then((response) => {
          console.log(response.data);
          if (current_botID == response.data.bot_id) {
            setIsJoined(false);
            setIsReady(false);
            closeWebSocket();
            localStorage.removeItem("botId");
          }
        })
        .catch((error) => console.error(error))
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <div className="w-full h-full min-h-screen bg-slate-950 p-4 rounded-xl shadow-lg relative">
      {/* Status Light */}
      {isJoined && (
        <div
          className="absolute top-5 right-20 flex flex-col items-center gap-1 cursor-pointer"
          onClick={reconnectWebSocket}
        >
          {isReconnecting ? (
            // Spinner when reconnecting
            <div
              className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"
              title="Reconnecting..."
            />
          ) : (
            // Colored status light
            <div
              className={`w-4 h-4 rounded-full shadow-md ${
                isSocketConnected
                  ? isReady
                    ? "bg-green-600"
                    : "bg-yellow-400"
                  : "bg-red-600"
              }`}
              title={
                isSocketConnected
                  ? isReady
                    ? "Ready"
                    : "WebSocket Connected"
                  : "WebSocket Disconnected (click to reconnect)"
              }
            />
          )}

          <span className="text-xs text-white">
            {isReconnecting
              ? "Reconnecting..."
              : isSocketConnected
              ? isReady
                ? "Ready"
                : "Conn."
              : "Disc."}
          </span>
        </div>
      )}

      <div className="p-3 border-b border-gray-800 flex items-center">
        <Logo />
      </div>

      {isJoined && (
        <button
          onClick={leaveMeeting}
          className="p-2 rounded-full bg-red-500 hover:bg-red-600 transition-colors text-white shadow-md fixed top-4 right-4"
          title="Leave Meeting"
        >
          {isLoading ? (
            <svg
              className="animate-spin h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 50 50"
            >
              <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="90 150"
                strokeDashoffset="0"
                opacity="0.8"
              />
            </svg>
          ) : (
            <LogOut className="w-6 h-6" />
          )}
        </button>
      )}

      <div className="flex flex-col items-center justify-center">
        {!isJoined && (
          <div className="flex flex-col items-center justify-center w-full">
            <div className="text-sm font-semibold text-white p-2 tracking-wide self-start">
              Meeting Link
            </div>
            <input
              type="text"
              value={meetingUrl}
              onChange={(e) => setMeetingUrl(e.target.value)}
              className="text-sm p-2 w-full bg-zinc-700 rounded-lg mb-2 text-white outline-none"
            />
            <button
              className=" py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-500 hover:opacity-90 font-semibold flex items-center justify-center disabled:opacity-70 text-sm text-white mb-4 tracking-wide px-4 shadow-sm transition-all duration-200"
              onClick={() => joinMeeting(meetingUrl)}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Joining...
                </div>
              ) : isJoined ? (
                "Leave Meeting"
              ) : (
                "Join Meeting"
              )}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-2 mb-2">
        <h3 className="text-sm font-semibold text-white my-4 tracking-wide">
          Discovery Navigator
        </h3>
        <MetricsDisplay data={metrics} />
      </div>
    </div>
  );
};

export default PitchPulse;
