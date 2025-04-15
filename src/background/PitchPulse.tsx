import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import MetricsDisplay from "./MetricDisplay";

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

const PitchPulse = () => {
  const [meetingUrl, setMeetingUrl] = React.useState("");
  const [metrics, setMetrics] = React.useState<Metrics>({
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
  });
  const socketRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [botId, setBotId] = useState("");

  const isValidZoomUrl = (url: string) => {
    const regex = /^https:\/\/([\w.-]+)?zoom\.us\/[jw]\/\d+(\?pwd=[\w.-]+)?$/;
    return regex.test(url);
  };

  useEffect(() => {
    socketRef.current = new WebSocket(
      "wss://2227-45-126-3-252.ngrok-free.app/ws"
    );

    socketRef.current.onopen = () => {
      console.log("WebSocket connection established.");
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMetrics(data);
      console.log(data);
    };
    socketRef.current.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const joinMeeting = (meetingUrl: string) => {
    if (isJoined) {
      setIsLoading(true);
      const response = axios
        .post("https://2227-45-126-3-252.ngrok-free.app/leave-meeting", {
          id: botId,
        })
        .then((response) => {
          console.log(response.data);
          setIsJoined(false);
        })
        .catch((error) => {
          console.error(error);
        }).finally(() => {
          setIsLoading(false);
        })

      return;
    }

    if (!meetingUrl) {
      alert("Please enter a meeting URL.");
      return;
    }

    if (!isValidZoomUrl(meetingUrl)) {
      alert("Please enter a valid Zoom meeting URL.");
      return;
    }

    setIsLoading(true);

    const response = axios
      .post("https://2227-45-126-3-252.ngrok-free.app/join-meeting", {
        url: meetingUrl,
      })
      .then((response) => {
        console.log(response.data);
        setBotId(response.data.bot_id);
        setIsJoined(true);
        setMeetingUrl("");
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="w-full bg-zinc-800 p-4 rounded-xl shadow-lg h-screen ">
      <h2 className="text-3xl font-semibold mb-4 text-center">PitchPulse</h2>
      <div className="flex flex-col items-center justify-center">
        {isJoined ? (
          <div>
            <div className="p-2 text-base self-start">ID: {botId}</div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full">
            <div className="p-2 text-base self-start">Zoom Meeting URL</div>
            <input
              type="text"
              value={meetingUrl}
              onChange={(e) => setMeetingUrl(e.target.value)}
              className="text-sm p-2 w-full bg-zinc-700 rounded-lg mb-2 text-white"
            />
          </div>
        )}
        <button
          className="text-base bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-xl shadow-sm transition-all duration-200"
          onClick={() => joinMeeting(meetingUrl)} // pass a function here!
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
            </div>
          ) : isJoined ? (
            "Leave Meeting"
          ) : (
            "Join Meeting"
          )}
        </button>
      </div>
      <div className="space-y-2 mb-4">
        <h3 className="text-2xl text-gray-400">Discovery Navigation</h3>
        <MetricsDisplay data={metrics} />
      </div>
    </div>
  );
};

export default PitchPulse;
