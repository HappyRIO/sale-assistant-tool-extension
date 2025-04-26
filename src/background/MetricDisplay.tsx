import React, { FC } from "react";
import { motion } from "framer-motion";
import { Metrics } from "./PitchPulse";

interface MetricsProps {
  data: Metrics;
}

interface MetricBarProps {
  name: string;
  percentage: number;
}

const MetricBar: FC<MetricBarProps> = ({ name, percentage }) => {
  const getProgressClass = () => {
    if (percentage === 0) {
      return {
        bar: "bg-gray-700",
        nameColor: "text-gray-400",
        percentColor: "text-gray-500",
      };
    } else if (percentage <= 33) {
      return {
        bar: "bg-gradient-to-r from-red-600 to-red-500 shadow-[0_0_8px_rgba(220,38,38,0.5)]",
        nameColor: "text-gray-300",
        percentColor: "text-red-500",
      };
    } else if (percentage <= 66) {
      return {
        bar: "bg-gradient-to-r from-amber-600 to-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]",
        nameColor: "text-gray-300",
        percentColor: "text-amber-500",
      };
    } else {
      return {
        bar: "bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]",
        nameColor: "text-gray-300",
        percentColor: "text-emerald-500",
      };
    }
  };

  const classes = getProgressClass();

  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-1.5">
        <div
          className={`text-sm font-medium tracking-wide ${classes.nameColor}`}
        >
          {name}
        </div>
        <div className={`text-xs font-medium ${classes.percentColor}`}>
          {percentage}%
        </div>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${classes.bar}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

const MetricsDisplay: FC<MetricsProps> = ({ data }) => {
  const metrics = [
    { label: "Problem", value: data.scores.problem },
    { label: "Goals", value: data.scores.goals },
    { label: "Urgency", value: data.scores.urgency },
    { label: "Solution Awareness", value: data.scores.solution_awareness },
    {
      label: "Financial Qualification",
      value: data.scores.financial_qualification,
    },
  ];

  return (
    <div className="text-white">
      {/* Score Bars */}
      <div className="mb-6">
        {metrics.map((item) => (
          <MetricBar
            key={item.label}
            name={item.label}
            percentage={item.value}
          />
        ))}
      </div>

      {/* Pitch Assist Summary */}
      <div className="border-t border-zinc-700 pt-4">
        <h3 className="text-sm font-semibold text-white mb-4 tracking-wide">
          Pitch Assist
        </h3>
        <div className="space-y-4 text-sm text-gray-300">
          <div>
            <p className="text-white text-sm mb-1.5 tracking-wide">
              Problem:
            </p>
            <p
              className="text-[13px] text-gray-400 leading-relaxed"
              style={{ lineHeight: 1.6 }}
            >
              {data.summary.problem}
            </p>
          </div>
          <div>
            <p className="text-white text-sm mb-1.5 tracking-wide">
              Goals:
            </p>
            <p
              className="text-[13px] text-gray-400 leading-relaxed"
              style={{ lineHeight: 1.6 }}
            >
              {data.summary.goals}
            </p>
          </div>
          <div>
            <p className="text-white text-sm mb-1.5 tracking-wide">
              Urgency:
            </p>
            <p
              className="text-[13px] text-gray-400 leading-relaxed"
              style={{ lineHeight: 1.6 }}
            >
              {data.summary.urgency}
            </p>
          </div>
          <div>
            <p className="text-white text-sm mb-1.5 tracking-wide">
              Solution Awareness:
            </p>
            <p
              className="text-[13px] text-gray-400 leading-relaxed"
              style={{ lineHeight: 1.6 }}
            >
              {data.summary.solution_awareness}
            </p>
          </div>
          <div>
            <p className="text-white text-sm mb-1.5 tracking-wide">
              Financial Qualification:
            </p>
            <p
              className="text-[13px] text-gray-400 leading-relaxed"
              style={{ lineHeight: 1.6 }}
            >
              {data.summary.financial_qualification}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsDisplay;
