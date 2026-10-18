import React from 'react';

export const QRCodeSVG = ({ seed = 'SH-26-004517', size = 86, className = '', darkColor = 'var(--ink)', lightColor = 'var(--card)' }) => {
  const seedStr = String(seed || 'SEHA');
  const n = 21;
  let h = 0;
  for (let i = 0; i < seedStr.length; i++) {
    h = (h * 31 + seedStr.charCodeAt(i)) >>> 0;
  }

  const renderFinderPattern = (x, y, key) => (
    <g key={key}>
      <rect x={x} y={y} width="7" height="7" fill={darkColor} rx="1" />
      <rect x={x + 1} y={y + 1} width="5" height="5" fill={lightColor} />
      <rect x={x + 2} y={y + 2} width="3" height="3" fill={darkColor} />
    </g>
  );

  const modules = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      // Skip finder patterns
      if ((i < 7 && j < 7) || (i < 7 && j > 13) || (i > 13 && j < 7)) continue;
      const v = (h >> ((i * n + j) % 24)) ^ (i * 31 + j * 17 + h);
      if (v & 1) {
        modules.push(
          <rect
            key={`${i}-${j}`}
            x={j}
            y={i}
            width="1.02"
            height="1.02"
            fill={darkColor}
          />
        );
      }
    }
  }

  return (
    <div className={`inline-block p-1.5 rounded-lg border border-[var(--line)] bg-[var(--card)] shadow-sm ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="-1 -1 23 23"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block"
      >
        <rect x="-1" y="-1" width="23" height="23" fill={lightColor} rx="1.5" />
        {renderFinderPattern(0, 0, 'tl')}
        {renderFinderPattern(14, 0, 'tr')}
        {renderFinderPattern(0, 14, 'bl')}
        {modules}
      </svg>
    </div>
  );
};
