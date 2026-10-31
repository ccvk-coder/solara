import React, { useCallback, useMemo, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import {
  Area,
  ComposedChart,
  Line,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import { InfoIcon } from 'lucide-react';
import { elevationLink } from '../data/elevation';
import { useClickOutside } from '../hooks/useClickOutside';
import type { ScanStage, SlopeElevationReading } from '../types/scan';
import { buildElevationChart, computeElevationStats, losHeight } from '../utils/elevation';
import { CardScanOverlay } from './CardScanOverlay';
import { ElevationTooltip } from './ElevationTooltip';

interface SlopeElevationProps {
  reading: SlopeElevationReading | null;
  scanning: boolean;
  stage: ScanStage | null;
}

const TERRAIN = '#43ad65';
const TERRAIN_EDGE = '#1a8a3a';
const RIDGE = '#a9dcb6';
const LINK = '#2f8fe0';
const OBSTRUCTION = '#f26b1d';
const TICK = '#5f6f66';

interface MarkerShapeProps {
  cx?: number;
  cy?: number;
  animate?: boolean;
}

function EndpointMarker({ cx = 0, cy = 0, animate = true }: MarkerShapeProps) {
  return (
    <g>
      {animate &&
      <circle cx={cx} cy={cy} r={10} fill="none" stroke={LINK} strokeWidth={2}>
          <animate attributeName="r" values="10;19" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.55;0" dur="2s" repeatCount="indefinite" />
        </circle>
      }
      <circle cx={cx} cy={cy} r={10} fill="#fff" stroke={LINK} strokeWidth={2} />
      <circle cx={cx} cy={cy} r={3.5} fill={LINK} />
    </g>);

}

function ObstructionMarker({ cx = 0, cy = 0, animate = true }: MarkerShapeProps) {
  return (
    <g>
      {animate &&
      <circle cx={cx} cy={cy} r={4} fill={OBSTRUCTION}>
          <animate attributeName="r" values="4;10" dur="1.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0" dur="1.4s" repeatCount="indefinite" />
        </circle>
      }
      <circle cx={cx} cy={cy} r={4.5} fill={OBSTRUCTION} stroke="#fff" strokeWidth={1.5} />
    </g>);

}

export function SlopeElevation({ reading, scanning, stage }: SlopeElevationProps) {
  const [infoOpen, setInfoOpen] = useState(false);
  const closeInfo = useCallback(() => setInfoOpen(false), []);
  const infoRef = useClickOutside<HTMLDivElement>(closeInfo, infoOpen);
  const reduceMotion = useReducedMotion() ?? false;

  const data = useMemo(
    () =>
    reading ?
    buildElevationChart(reading.profile, reading.link).map((p, i, arr) => {
      const ahead = arr[Math.min(arr.length - 1, i + 4)];
      return { ...p, ridge: Math.round(ahead.elevation * 0.7 + 38) };
    }) :
    [],
    [reading]
  );
  const stats = useMemo(() => reading ? computeElevationStats(reading.profile, reading.link) : null, [reading]);

  const link = reading?.link ?? elevationLink;
  const { from, to } = link;
  const totalKm = reading ? to.distance - from.distance : 0;
  const crossings = stats?.obstructions.length ?? 0;
  const blocked = crossings > 0;

  const summary = stats ?
  [
  { label: 'Avg. slope', value: `${stats.avgSlope > 0 ? '+' : ''}${stats.avgSlope.toFixed(2)}%` },
  { label: 'Max slope', value: `${stats.maxSlope.toFixed(1)}%` },
  { label: 'Elevation', value: `${stats.minElevation}–${stats.maxElevation} m` },
  { label: 'Total gain', value: `${stats.totalGain} m` }] :

  [
  { label: 'Avg. slope', value: '0%' },
  { label: 'Max slope', value: '0%' },
  { label: 'Elevation', value: '0 m' },
  { label: 'Total gain', value: '0 m' }];


  const statusTone = !reading ? 'text-ink-muted' : blocked ? 'text-heat-600' : 'text-brand-600';
  const statusDot = !reading ? 'bg-ink-soft' : blocked ? 'bg-heat-500' : 'bg-brand-500';
  const statusText = !reading || blocked ? `${crossings} terrain crossings on signal path` : 'Clear line of sight';

  return (
    <section
      id="slope-elevation"
      aria-labelledby="elevation-title"
      aria-busy={scanning}
      className="relative flex flex-col rounded-xl border border-line bg-white p-4 shadow-card">
      
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 id="elevation-title" className="text-[15px] font-bold text-ink">
            Slope Elevation <span className="font-normal text-ink-muted">(Field A → Field C)</span>
          </h2>
          <p className={`mt-1 flex items-center gap-1.5 text-[12px] font-semibold ${statusTone}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${statusDot}`} aria-hidden="true" />
            {statusText}
          </p>
        </div>
        <div ref={infoRef} className="relative">
          <button
            type="button"
            onClick={() => setInfoOpen((v) => !v)}
            aria-expanded={infoOpen}
            aria-label="About this chart"
            className="grid h-7 w-7 place-items-center rounded-full text-water-500 transition-colors duration-150 ease-out hover:bg-water-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
            
            <InfoIcon size={18} />
          </button>
          {infoOpen &&
          <div className="absolute right-0 top-9 z-30 w-[240px] rounded-lg border border-line bg-white p-3 text-[12px] leading-snug text-ink-muted shadow-pop">
              Terrain profile between the {from.name} and {to.name}. The blue line is the device signal path; orange
              points mark where the terrain rises above it.
            </div>
          }
        </div>
      </div>

      <div className="relative mt-3 overflow-hidden rounded-lg bg-water-50 px-2 pb-1 pt-2">
        <div
          className="absolute left-3 top-9 z-10 flex items-center gap-1.5 rounded-full bg-white/90 px-2 py-0.5 text-[10.5px] font-semibold text-ink shadow-card"
          aria-live="polite">
          
          <span className="relative flex h-2 w-2">
            {reading && !reduceMotion && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-water-500 opacity-60" />}
            <span className={`relative inline-flex h-2 w-2 rounded-full ${reading ? 'bg-water-500' : 'bg-ink-soft'}`} />
          </span>
          Live link
          <span className="tabular-nums text-ink-muted">{reading ? `${reading.signalDbm} dBm` : 'No data'}</span>
        </div>

        <div className="flex items-center gap-2 px-3 text-ink-muted" aria-label={`Distance ${reading ? totalKm.toFixed(2) : 0} kilometers`}>
          <span className="relative h-px flex-1 bg-ink-soft">
            <span className="absolute -left-px -top-[3px] h-0 w-0 border-y-[3.5px] border-r-[6px] border-y-transparent border-r-ink-soft" />
          </span>
          <span className="whitespace-nowrap text-[12px] font-semibold text-ink tabular-nums">{reading ? totalKm.toFixed(2) : '0'} km</span>
          <span className="relative h-px flex-1 bg-ink-soft">
            <span className="absolute -right-px -top-[3px] h-0 w-0 border-y-[3.5px] border-l-[6px] border-y-transparent border-l-ink-soft" />
          </span>
        </div>

        <div className="relative h-[230px] w-full">
          {reading && stats ?
          <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 14, right: 0, bottom: 0, left: 0 }}>
                <XAxis type="number" dataKey="distance" domain={[-0.18, totalKm + 0.18]} hide allowDataOverflow />
                <YAxis
                orientation="right"
                domain={[0, 220]}
                ticks={[0, 100, 200]}
                tickFormatter={(v: number) => `${v}m`}
                tick={{ fontSize: 10, fill: TICK }}
                tickLine={{ stroke: '#c5cec9' }}
                axisLine={false}
                width={40} />
              
                <Tooltip content={<ElevationTooltip />} cursor={{ stroke: TICK, strokeDasharray: '3 3' }} />
                <Area type="monotone" dataKey="ridge" stroke="none" fill={RIDGE} fillOpacity={0.7} isAnimationActive={false} activeDot={false} />
                <Area
                type="linear"
                dataKey="elevation"
                stroke={TERRAIN_EDGE}
                strokeWidth={1.5}
                fill={TERRAIN}
                fillOpacity={0.85}
                isAnimationActive={!reduceMotion}
                animationDuration={300}
                animationEasing="ease-out"
                activeDot={{ r: 4, fill: TERRAIN_EDGE, stroke: '#fff', strokeWidth: 2 }} />
              
                <Line type="linear" dataKey="los" stroke={LINK} strokeWidth={3} dot={false} activeDot={false} isAnimationActive={false} />
                <Line
                type="linear"
                dataKey="los"
                stroke="#fff"
                strokeWidth={2}
                strokeLinecap="round"
                strokeDasharray="3 15"
                dot={false}
                activeDot={false}
                isAnimationActive={false}
                className={reduceMotion ? undefined : 'signal-flow'} />
              
                <ReferenceLine
                segment={[{ x: from.distance, y: reading.profile[0].elevation }, { x: from.distance, y: from.height }]}
                stroke={LINK}
                strokeWidth={2} />
              
                <ReferenceLine
                segment={[{ x: to.distance, y: reading.profile[reading.profile.length - 1].elevation }, { x: to.distance, y: to.height }]}
                stroke={LINK}
                strokeWidth={2} />
              
                {stats.obstructions.map((d) =>
              <ReferenceDot key={d} x={d} y={losHeight(link, d)} shape={<ObstructionMarker animate={!reduceMotion} />} />
              )}
                <ReferenceDot x={from.distance} y={from.height} shape={<EndpointMarker animate={!reduceMotion} />} />
                <ReferenceDot x={to.distance} y={to.height} shape={<EndpointMarker animate={!reduceMotion} />} />
              </ComposedChart>
            </ResponsiveContainer> :

          <>
              <span className="absolute inset-x-3 bottom-3 h-px bg-ink-soft/50" aria-hidden="true" />
              <p className="absolute inset-0 grid place-items-center px-6 text-center text-[12px] text-ink-muted">
                Elevation profile appears after a soil scan.
              </p>
            </>
          }
        </div>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
        {summary.map((s) =>
        <div key={s.label}>
            <dt className="whitespace-nowrap text-[11px] text-ink-muted">{s.label}</dt>
            <dd className="whitespace-nowrap text-[13px] font-bold text-ink tabular-nums">{s.value}</dd>
          </div>
        )}
      </dl>

      <CardScanOverlay active={scanning} stage={stage} target="slope" label="Slope elevation" />
    </section>);

}