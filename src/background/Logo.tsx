import React from 'react';

const Logo = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
  };

  return (
    <div className="flex items-center">
      <div className={`${sizeClasses[size]} relative`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-auto"
        >
          {/* Circle background with gradient */}
          <circle
            cx="24"
            cy="24"
            r="22"
            stroke="url(#circle-gradient)"
            strokeWidth="2"
            fill="transparent"
          />

          {/* Dot before waveform */}
          <circle cx="8" cy="24" r="2" fill="url(#pulse-gradient)" />

          {/* Waveform path */}
          <path
            d="M12 24 L14 18 L18 30 L22 18 L26 30 L30 18 L34 24"
            stroke="url(#pulse-gradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Three vertical bars */}
          <line
            x1="40"
            y1="20"
            x2="40"
            y2="28"
            stroke="url(#pulse-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="43"
            y1="18"
            x2="43"
            y2="30"
            stroke="url(#pulse-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="46"
            y1="22"
            x2="46"
            y2="26"
            stroke="url(#pulse-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Gradients */}
          <defs>
            <linearGradient
              id="circle-gradient"
              x1="0"
              y1="0"
              x2="48"
              y2="48"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#6366F1" />
              <stop offset="1" stopColor="#8B5CF6" />
            </linearGradient>
            <linearGradient
              id="pulse-gradient"
              x1="8"
              y1="18"
              x2="46"
              y2="30"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#06B6D4" />
              <stop offset="1" stopColor="#6366F1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span className="ml-2 text-xl font-semibold text-white">PitchPulse</span>
    </div>
  );
};

export default Logo;
