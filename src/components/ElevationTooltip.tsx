import React from 'react';
import type { ElevationChartPoint } from '../types/elevation';

interface ElevationTooltipProps {
  active?: boolean;
  payload?: Array<{payload: ElevationChartPoint;}>;
}

export function ElevationTooltip({ active, payload }: ElevationTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0].payload;
  const clearance = p.los - p.elevation;

  return (
    <div className="rounded-lg border border-line bg-white px-3 py-2 text-[11px] shadow-pop">
      <p className="font-semibold text-ink">{p.distance.toFixed(2)} km</p>
      <dl className="mt-1 grid grid-cols-[auto_auto] gap-x-4 gap-y-0.5 tabular-nums">
        <dt className="text-ink-muted">Elevation</dt>
        <dd className="text-right font-semibold text-ink">{p.elevation} m</dd>
        <dt className="text-ink-muted">Slope</dt>
        <dd className="text-right font-semibold text-ink">{p.slope > 0 ? '+' : ''}{p.slope}%</dd>
        <dt className="text-ink-muted">Clearance</dt>
        <dd className={`text-right font-semibold ${clearance < 0 ? 'text-heat-600' : 'text-brand-600'}`}>
          {clearance.toFixed(0)} m
        </dd>
      </dl>
    </div>);

}