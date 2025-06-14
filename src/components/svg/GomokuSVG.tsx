
import React from "react";

const GomokuSVG: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 80 80"
    width={112}
    height={112}
    className={className}
    fill="none"
  >
    {/* Board */}
    <rect x="8" y="8" width="64" height="64" rx="8" fill="#A47334" />
    {/* Grid */}
    {Array.from({ length: 13 }).map((_, i) => (
      <g key={i}>
        {/* Vertical lines */}
        <line
          x1={14 + i * 4}
          y1={12}
          x2={14 + i * 4}
          y2={68}
          stroke="#4E342E"
          strokeWidth="0.6"
          opacity="0.65"
        />
        {/* Horizontal lines */}
        <line
          x1={12}
          y1={14 + i * 4}
          x2={68}
          y2={14 + i * 4}
          stroke="#4E342E"
          strokeWidth="0.6"
          opacity="0.65"
        />
      </g>
    ))}
    {/* Some black pieces */}
    <circle cx="38" cy="38" r="3.4" fill="#222" stroke="#fff" strokeWidth="0.6"/>
    <circle cx="26" cy="30" r="3.4" fill="#222" stroke="#fff" strokeWidth="0.6"/>
    {/* Some white pieces */}
    <circle cx="46" cy="46" r="3.4" fill="#fff" stroke="#222" strokeWidth="0.6"/>
    <circle cx="58" cy="54" r="3.4" fill="#fff" stroke="#222" strokeWidth="0.6"/>
    {/* Extra black for line effect */}
    <circle cx="58" cy="26" r="3.4" fill="#222" stroke="#fff" strokeWidth="0.6"/>
  </svg>
);

export default GomokuSVG;
