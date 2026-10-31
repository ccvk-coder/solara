import React from 'react';
import { groundMovementSite, movementLevels } from '../data/groundMovement';
import { VIBRATION_SAMPLES } from '../data/scan';
import type { GroundMovementReading, ScanStage } from '../types/scan';
import { statusClasses } from '../utils/sensors';
import { CardScanOverlay } from './CardScanOverlay';
import { TiltGauge } from './TiltGauge';
import { VibrationTrace } from './VibrationTrace';

interface GroundMovementProps {
  reading: GroundMovementReading | null;
  scanning: boolean;
  stage: ScanStage | null;
}

const SCALE_MAX = movementLevels[movementLevels.length - 1].max;
const FLAT_TRACE = Array.from({ length: VIBRATION_SAMPLES }, () => 0);

export function GroundMovement({ reading, scanning, stage }: GroundMovementProps) {
  const analyzed = reading !== null;
  const rate = reading?.rate ?? 0;
  const tilt = reading?.tilt ?? 0;
  const vibration = reading?.vibration ?? FLAT_TRACE;
  const peak = reading ? Math.max(...reading.vibration.map((v) => Math.abs(v))) : 0;

  const level = movementLevels.find((l) => rate < l.max) ?? movementLevels[movementLevels.length - 1];
  const s = analyzed ? statusClasses[level.key] : { dot: 'bg-ink-soft', text: 'text-ink-muted' };
  const marker = `${Math.min(rate, SCALE_MAX) / SCALE_MAX * 100}%`;
  const pillBg = !analyzed ? 'bg-canvas' : level.key === 'good' ? 'bg-brand-50' : level.key === 'warn' ? 'bg-sun-50' : 'bg-heat-50';

  const metrics = reading ?
  [
  { label: 'Displacement (30d)', value: `${reading.displacement30d.toFixed(1)} mm` },
  { label: 'Tilt', value: `${reading.tilt.toFixed(2)}°` },
  { label: 'Peak vibration', value: `${peak.toFixed(3)} g` }] :

  [
  { label: 'Displacement (30d)', value: '0 mm' },
  { label: 'Tilt', value: '0°' },
  { label: 'Peak vibration', value: '0 g' }];


  return (
    <section
      id="ground-movement"
      aria-labelledby="ground-title"
      aria-busy={scanning}
      className="relative flex flex-col rounded-xl border border-line bg-white p-4 shadow-card">
      
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 id="ground-title" className="text-[15px] font-bold text-ink">Ground Movement</h2>
          <p className="mt-0.5 text-[12px] text-ink-muted">
            {groundMovementSite.sensor} · {groundMovementSite.location}
          </p>
        </div>
        <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-semibold ${pillBg} ${s.text}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden="true" />
          {analyzed ? level.label : 'Not Analyzed'}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-[12px] text-ink-muted">Movement rate</p>
          <p className="mt-1 flex items-baseline gap-1.5" aria-live="polite">
            <span className="text-[38px] font-extrabold leading-none tracking-tight text-ink tabular-nums">
              {analyzed ? rate.toFixed(1) : '0'}
            </span>
            <span className="text-[14px] font-semibold text-ink-muted">mm/day</span>
          </p>
        </div>
        <TiltGauge tilt={tilt} />
      </div>

      <div className="mt-4" aria-label={analyzed ? `Alert level ${level.label}` : 'Alert level not analyzed'}>
        <div className="flex h-2.5 overflow-hidden rounded-full">
          {movementLevels.map((l, i) => {
            const prevMax = i === 0 ? 0 : movementLevels[i - 1].max;
            const color = l.key === 'good' ? 'bg-brand-200' : l.key === 'warn' ? 'bg-sun-100' : 'bg-heat-100';
            return <span key={l.key} className={color} style={{ width: `${(l.max - prevMax) / SCALE_MAX * 100}%` }} />;
          })}
        </div>
        <div className="relative h-0" aria-hidden="true">
          {analyzed &&
          <span
            className="absolute -top-[15px] h-5 w-1 -translate-x-1/2 rounded-full bg-ink ring-2 ring-white transition-[left] duration-300 ease-out"
            style={{ left: marker }} />

          }
        </div>
        <ul className="mt-1.5 flex text-[10px] text-ink-muted">
          {movementLevels.map((l, i) => {
            const prevMax = i === 0 ? 0 : movementLevels[i - 1].max;
            return (
              <li key={l.key} className="whitespace-nowrap" style={{ width: `${(l.max - prevMax) / SCALE_MAX * 100}%` }}>
                {l.label}
              </li>);

          })}
        </ul>
      </div>

      <div className="mt-4 rounded-lg bg-canvas px-3 pb-1 pt-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold text-ink">Live vibration</span>
          <span className="flex items-center gap-1.5 text-ink-muted">
            <span className={`h-1.5 w-1.5 rounded-full ${analyzed ? 'bg-brand-500' : 'bg-ink-soft'}`} aria-hidden="true" />
            {analyzed ? 'Last scan' : 'No data'}
          </span>
        </div>
        <VibrationTrace samples={vibration} />
      </div>

      <dl className="mt-auto grid grid-cols-3 gap-3 pt-3">
        {metrics.map((m) =>
        <div key={m.label}>
            <dt className="whitespace-nowrap text-[11px] text-ink-muted">{m.label}</dt>
            <dd className="whitespace-nowrap text-[13px] font-bold text-ink tabular-nums">{m.value}</dd>
          </div>
        )}
      </dl>

      <CardScanOverlay active={scanning} stage={stage} target="ground" label="Ground movement" />
    </section>);

}