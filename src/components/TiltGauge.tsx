import React from 'react';

interface TiltGaugeProps {
  tilt: number; // degrees
}

// Visual exaggeration so sub-degree tilt is readable.
const EXAGGERATION = 18;

export function TiltGauge({ tilt }: TiltGaugeProps) {
  const angle = tilt * EXAGGERATION;
  return (
    <svg viewBox="0 0 72 72" className="h-[72px] w-[72px] shrink-0" role="img" aria-label={`Tilt ${tilt.toFixed(2)} degrees`}>
      <circle cx={36} cy={36} r={34} fill="#ecf7ef" />
      <rect x={6} y={56} width={60} height={10} rx={2} fill="#cfae88" />
      <line x1={36} y1={14} x2={36} y2={58} stroke="#8a978f" strokeDasharray="2 3" />
      <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: '36px 58px', transition: 'transform 300ms cubic-bezier(0.23, 1, 0.32, 1)' }}>
        <line x1={36} y1={58} x2={36} y2={18} stroke="#14251b" strokeWidth={3.5} strokeLinecap="round" />
        <circle cx={36} cy={18} r={4} fill="#22a447" stroke="#fff" strokeWidth={1.5} />
      </g>
    </svg>);

}