import React from 'react';

interface VibrationTraceProps {
  samples: number[];
  range?: number; // g, half-height of the trace
}

const W = 300;
const H = 56;

export function VibrationTrace({ samples, range = 0.035 }: VibrationTraceProps) {
  const step = W / (samples.length - 1);
  const points = samples.
  map((v, i) => {
    const y = H / 2 - Math.max(-range, Math.min(range, v)) / range * (H / 2 - 4);
    return `${(i * step).toFixed(1)},${y.toFixed(1)}`;
  }).
  join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-20 w-full" role="img" aria-label="Live ground vibration trace">
      <line x1={0} x2={W} y1={H / 2} y2={H / 2} stroke="#cfd8d3" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
      <polyline points={points} fill="none" stroke="#1a8a3a" strokeWidth={1.6} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>);

}