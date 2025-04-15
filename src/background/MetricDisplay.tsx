import React from "react";
import { Metrics } from "./PitchPulse";

interface MetricsProps {
  data: Metrics;
}

const MetricsDisplay: React.FC<MetricsProps> = ({ data }) => {
  const metrics = [
    { label: "Problem", value: data.scores.problem },
    { label: "Goals", value: data.scores.goals },
    { label: "Urgency", value: data.scores.urgency },
    { label: "Solution Awareness", value: data.scores.solution_awareness },
    { label: "Financial Qualification", value: data.scores.financial_qualification },
  ];

  return (
    <div className="text-white">
      {/* Scores Section */}
      <div className="space-y-4 mb-6">
        {metrics.map((item) => (
          <div key={item.label}>
            <div className="text-xl font-medium mb-1">{item.label}</div>
            <div className="w-full h-2 bg-zinc-700 rounded overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded transition-all duration-500 ease-out"
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Summary Section */}
      <div className="border-t border-zinc-700 pt-4">
        <h3 className="font-semibold text-2xl mb-4">Pitch Assist</h3>
        <p className="text-xl text-gray-300 mb-1">
          <strong>Problem:</strong> {data.summary.problem}
        </p>
        <p className="text-xl text-gray-300 mb-1">
          <strong>Urgency:</strong> {data.summary.urgency}
        </p>
        <p className="text-xl text-gray-300 mb-1">
          <strong>Goals:</strong> {data.summary.goals}
        </p>
        <p className="text-xl text-gray-300 mb-1">
          <strong>Solution Awareness:</strong> {data.summary.solution_awareness}
        </p>
        <p className="text-xl text-gray-300">
          <strong>Financial Qualification:</strong> {data.summary.financial_qualification}
        </p>
      </div>
    </div>
  );
};

export default MetricsDisplay;
