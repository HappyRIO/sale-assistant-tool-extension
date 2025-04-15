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
    if (!meetingUrl) {
      alert("Please enter a meeting URL.");
      return;
    }

    if (!isValidZoomUrl(meetingUrl)) {
      alert("Please enter a valid Zoom meeting URL.");
      return;
    }

    const response = axios
      .post("https://2227-45-126-3-252.ngrok-free.app/join-meeting", {
        url: meetingUrl,
      })
      .then((response) => {
        console.log(response.data);
        setMeetingUrl("");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="w-full bg-zinc-800 p-4 rounded-xl shadow-lg h-screen ">
      <h2 className="text-4xl font-semibold mb-4 text-center">PitchPulse</h2>
      <div className="flex flex-col items-center justify-center">
        <div className="p-2 text-xl self-start">Zoom Meeting URL</div>
        <input
          type="text"
          value={meetingUrl}
          onChange={(e) => setMeetingUrl(e.target.value)}
          className="text-md p-2 w-full bg-zinc-700 rounded-lg mb-2 text-white"
        />

        <button
          className="text-xl bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-xl shadow-sm transition-all duration-200"
          onClick={() => joinMeeting(meetingUrl)} // pass a function here!
        >
          Join
        </button>
      </div>
      <div className="space-y-2 mb-4">
        <h3 className="text-3xl text-gray-400">Discovery Navigation</h3>
        <MetricsDisplay data={metrics} />
        {/* {metrics.map((item) => (
          <div key={item.label}>
            <div className="text-xl">{item.label}</div>
            <div className="w-full h-2 bg-zinc-700 rounded">
              <div
                className="h-full bg-blue-500 rounded"
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))} */}
      </div>

      {/* <div className="border-t border-zinc-700 pt-4">
        <h3 className="font-semibold text-2xl mb-2">Pitch Assist</h3>
        <p className="text-xl text-gray-300 mb-1">
          <strong>Problem:</strong> Experiencing inefficiencies in their
          process.
        </p>
        <p className="text-xl text-gray-300 mb-1">
          <strong>Urgency:</strong> Recognizes the need to solve this soon.
        </p>
        <p className="text-xl text-gray-300 mb-1">
          <strong>Goals:</strong> Aims to improve team productivity.
        </p>
        <p className="text-xl text-gray-300">
          <strong>Solution Awareness:</strong> Unaware of potential solutions.
        </p>
        <p className="text-xl text-gray-300">
          <strong>Financial Qualification:</strong> Financial capacity or
          readiness to invest was not discussed.
        </p>
      </div> */}
    </div>
  );
};

export default PitchPulse;
