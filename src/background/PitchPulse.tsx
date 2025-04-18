import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { LogOut } from "lucide-react";
import MetricsDisplay from "./MetricDisplay";
import Logo from "./Logo";

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
  const [meetingUrl, setMeetingUrl] = useState("");
  const [metrics, setMetrics] = useState<Metrics>(initMetrics);
  const socketRef = useRef<WebSocket | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [botId, setBotId] = useState("");

  const [apiUrl, setApiUrl] = useState("");
  const [webSockedUrl, setWebSocketUrl] = useState("");
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    fetch(chrome.runtime.getURL("config.json"))
      .then((res) => res.json())
      .then((config) => {
        setApiUrl(config.API_URL);
        setWebSocketUrl(config.WEBSOCKET_URL);
      });
  }, []);

  const isValidZoomUrl = (url: string) => {
    const regex = /^https:\/\/([\w.-]+)?zoom\.us\/[jw]\/\d+(\?pwd=[\w.-]+)?$/;
    return regex.test(url);
  };

  const initWebSocket = () => {
    if (!webSockedUrl) return;
    socketRef.current = new WebSocket(`${webSockedUrl}/ws`);

    socketRef.current.onopen = () => {
      console.log("WebSocket connection established.");
      setIsSocketConnected(true);
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.event === "bot.call_ended") {
        setIsLoading(true);
        setIsJoined(false);
        closeWebSocket();
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
        console.log("Bot call ended", data.data);
      } else if (data.event === "transcript.data") {
        const parsedData = JSON.parse(data.data);
        console.log("Transcript data:", parsedData);
        setMetrics(parsedData);
      } else if (data.event === "transcript.processing") {
        setIsReady(true);
        console.log("Bot call started", data.data);
      } else if (data.event === "bot.in_call_not_recording") {
        setIsReady(false);
        console.log("Bot in call but not recording", data.data);
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
    if (!isSocketConnected && isJoined) {
      initWebSocket();
    }
  };

  const joinMeeting = (meetingUrl: string) => {
    if (!meetingUrl) {
      alert("Please enter a meeting URL.");
      return;
    }

    if (!isValidZoomUrl(meetingUrl)) {
      alert("Please enter a valid Zoom meeting URL.");
      return;
    }

    setIsLoading(true);
    setMetrics(initMetrics);

    axios
      .post(`${apiUrl}/join-meeting`, { url: meetingUrl })
      .then((response) => {
        console.log(response.data);
        setBotId(response.data.bot_id);
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
      axios
        .post(`${apiUrl}/leave-meeting`, { id: botId })
        .then((response) => {
          console.log(response.data);
          setIsJoined(false);
          closeWebSocket();
        })
        .catch((error) => console.error(error))
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <div className="w-full h-full min-h-screen bg-zinc-800 p-4 rounded-xl shadow-lg relative">
      {/* Status Light */}
      <div
        className="absolute top-4 left-4 flex flex-col items-center gap-1 cursor-pointer"
        onClick={reconnectWebSocket}
      >
        <div
          className={`w-4 h-4 rounded-full animate-pulse shadow-md ${
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
        <span className="text-xs text-white">
          {isSocketConnected ? (isReady ? "Ready" : "Conn.") : "Disc."}
        </span>
      </div>

      <div className="flex justify-center items-center">
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
            <div className="p-2 text-xl self-start">Zoom Meeting URL</div>
            <input
              type="text"
              value={meetingUrl}
              onChange={(e) => setMeetingUrl(e.target.value)}
              className="text-sm p-2 w-full bg-zinc-700 rounded-lg mb-2 text-white"
            />
            <button
              className="text-base bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-xl shadow-sm transition-all duration-200"
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
        <h3 className="text-2xl text-gray-400">Discovery Navigation</h3>
        <MetricsDisplay data={metrics} />
      </div>
    </div>
  );
};

export default PitchPulse;
