
import React from "react";

const OthelloSVG: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 80 80"
    width={112}
    height={112}
    className={className}
    fill="none"
  >
    {/* Board */}
    <rect x="8" y="8" width="64" height="64" rx="8" fill="#25643B"/>
    {/* Grid lines */}
    {Array.from({ length: 7 }).map((_, i) => (
      <g key={i}>
        {/* Vertical */}
        <line
          x1={16 + i * 8}
          y1={8}
          x2={16 + i * 8}
          y2={72}
          stroke="#fff"
          strokeWidth="0.7"
          opacity="0.5"
        />
        {/* Horizontal */}
        <line
          x1={8}
          y1={16 + i * 8}
          x2={72}
          y2={16 + i * 8}
          stroke="#fff"
          strokeWidth="0.7"
          opacity="0.5"
        />
      </g>
    ))}
    {/* Black pieces */}
    <circle cx="32" cy="32" r="6.5" fill="#222" stroke="#fff" strokeWidth="1"/>
    <circle cx="48" cy="48" r="6.5" fill="#222" stroke="#fff" strokeWidth="1"/>
    {/* White pieces */}
    <circle cx="32" cy="48" r="6.5" fill="#fff" stroke="#222" strokeWidth="1"/>
    <circle cx="48" cy="32" r="6.5" fill="#fff" stroke="#222" strokeWidth="1"/>
    {/* Extra few black/white at the top for effect */}
    <circle cx="24" cy="16" r="3" fill="#222" stroke="#fff" strokeWidth="0.7"/>
    <circle cx="56" cy="64" r="3" fill="#fff" stroke="#222" strokeWidth="0.7"/>
  </svg>
);

export default OthelloSVG;
