import React from "react";

const metrics = [
  { label: "Problem", value: 20 },
  { label: "Urgency", value: 40 },
  { label: "Goals", value: 60 },
  { label: "Solution Awareness", value: 40 },
  { label: "Financial Qual", value: 50 },
];

const PitchPulse = () => {
  return (
    <div className="w-80 bg-zinc-800 p-4 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-center">PitchPulse</h2>

      <div className="space-y-2 mb-4">
        <h3 className="text-sm text-gray-400">Discovery Navigation</h3>
        {metrics.map((item) => (
          <div key={item.label}>
            <div className="text-sm">{item.label}</div>
            <div className="w-full h-2 bg-zinc-700 rounded">
              <div
                className="h-full bg-blue-500 rounded"
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-zinc-700 pt-4">
        <h3 className="font-semibold text-sm mb-2">Pitch Assist</h3>
        <p className="text-sm text-gray-300 mb-1">
          <strong>Problem:</strong> Experiencing inefficiencies in their process.
        </p>
        <p className="text-sm text-gray-300 mb-1">
          <strong>Urgency:</strong> Recognizes the need to solve this soon.
        </p>
        <p className="text-sm text-gray-300 mb-1">
          <strong>Goals:</strong> Aims to improve team productivity.
        </p>
        <p className="text-sm text-gray-300">
          <strong>Solution Awareness:</strong> Unaware of potential solutions.
        </p>
      </div>
    </div>
  );
};

export default PitchPulse;
