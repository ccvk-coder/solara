import React from 'react';
import { ChevronDownIcon, DropletIcon } from 'lucide-react';
import { fields } from '../data/fields';
import { DEPTH_LABELS } from '../data/scan';
import { sensors } from '../data/sensors';
import type { ScanStage, SoilMoistureReading } from '../types/scan';
import { getSensorStatus, statusClasses } from '../utils/sensors';
import { CardScanOverlay } from './CardScanOverlay';

interface SoilMoistureProps {
  selectedId: string;
  onSelect: (id: string) => void;
  reading: SoilMoistureReading | null;
  scanning: boolean;
  stage: ScanStage | null;
}

const SCALE_MAX = 60;
const moistureDef = sensors.find((s) => s.key === 'moisture')!;

function pct(value: number) {
  return `${Math.min(SCALE_MAX, Math.max(0, value)) / SCALE_MAX * 100}%`;
}

export function SoilMoisture({ selectedId, onSelect, reading, scanning, stage }: SoilMoistureProps) {
  const selected = reading ? reading.fields.filter((f) => selectedId === 'all' || f.fieldId === selectedId) : [];
  const analyzed = selected.length > 0;

  const depths = analyzed ?
  selected[0].depths.map((d, i) => ({
    depth: d.depth,
    value: Math.round(selected.reduce((sum, f) => sum + f.depths[i].value, 0) / selected.length)
  })) :
  DEPTH_LABELS.map((depth) => ({ depth, value: 0 }));

  const surface = depths[0].value;
  const { status, label } = analyzed ? getSensorStatus(moistureDef, surface) : { status: null, label: 'Not Analyzed' };
  const s = status ? statusClasses[status] : { dot: 'bg-ink-soft', text: 'text-ink-muted' };
  const field = fields.find((f) => f.id === selectedId);
  const scope = field ? `${field.name} · ${field.crop}` : 'Farm average · 4 fields';

  const advice = !analyzed ?
  'Scan soil to view recommendations.' :
  surface < moistureDef.goodMin ?
  `Irrigate ${field ? field.name : 'dry fields'} within 12 hours — about ${Math.round((moistureDef.goodMin + 5 - surface) * 1.6)} mm needed.` :
  surface > moistureDef.goodMax ?
  'Soil is saturated. Hold irrigation and check drainage.' :
  'No irrigation needed. Next check in 6 hours.';

  const adviceBg = !analyzed ? 'bg-canvas' : status === 'good' ? 'bg-brand-50' : status === 'alert' ? 'bg-heat-50' : 'bg-sun-50';

  return (
    <section
      id="soil-moisture"
      aria-labelledby="soil-moisture-title"
      aria-busy={scanning}
      className="relative flex flex-col rounded-xl border border-line bg-white p-4 shadow-card">
      
      <div className="flex items-center justify-between gap-3">
        <h2 id="soil-moisture-title" className="text-[15px] font-bold text-ink">Soil Moisture</h2>
        <div className="relative z-30">
          <select
            value={selectedId}
            onChange={(e) => onSelect(e.target.value)}
            aria-label="Select field"
            className="h-8 w-[120px] appearance-none rounded-md border border-line bg-white pl-2.5 pr-7 text-[12px] font-medium text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
            
            <option value="all">All Fields</option>
            {fields.map((f) =>
            <option key={f.id} value={f.id}>{f.name}</option>
            )}
          </select>
          <ChevronDownIcon size={14} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-[12px] text-ink-muted">{scope}</p>
          <p className="mt-1 flex items-baseline gap-2" aria-live="polite">
            <span className="text-[38px] font-extrabold leading-none tracking-tight text-ink tabular-nums">{surface}%</span>
            <span className={`flex items-center gap-1 text-[12px] font-semibold ${s.text}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden="true" />
              {label}
            </span>
          </p>
        </div>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-water-50 text-water-500">
          <DropletIcon size={22} className="fill-water-500" aria-hidden="true" />
        </span>
      </div>

      <div className="mt-4" aria-hidden="true">
        <div className="relative flex h-2.5 overflow-hidden rounded-full">
          <span className="bg-sun-100" style={{ width: pct(moistureDef.goodMin) }} />
          <span className="bg-brand-200" style={{ width: `calc(${pct(moistureDef.goodMax)} - ${pct(moistureDef.goodMin)})` }} />
          <span className="flex-1 bg-water-100" />
        </div>
        <div className="relative h-0">
          {analyzed &&
          <span
            className="absolute -top-[15px] h-5 w-1 -translate-x-1/2 rounded-full bg-ink ring-2 ring-white transition-[left] duration-300 ease-out"
            style={{ left: pct(surface) }} />

          }
        </div>
        <div className="relative mt-1.5 h-3 text-[10px] text-ink-muted">
          <span className="absolute left-0">Dry</span>
          <span className="absolute -translate-x-1/2" style={{ left: pct(moistureDef.goodMin) }}>{moistureDef.goodMin}%</span>
          <span className="absolute -translate-x-1/2" style={{ left: pct(moistureDef.goodMax) }}>{moistureDef.goodMax}%</span>
          <span className="absolute right-0">Wet</span>
        </div>
      </div>

      <div className="mb-4 mt-5">
        <p className="text-[12px] font-semibold text-ink">By depth</p>
        <ul className="mt-3 space-y-3.5">
          {depths.map((d) => {
            const tone = analyzed ? statusClasses[getSensorStatus(moistureDef, d.value).status].text : 'text-ink-muted';
            return (
              <li key={d.depth} className="flex items-center gap-3">
                <span className="w-11 shrink-0 text-[11px] text-ink-muted tabular-nums">{d.depth}</span>
                <span className="relative h-3 flex-1 overflow-hidden rounded bg-soil-100">
                  <span
                    className="absolute inset-y-0 left-0 rounded bg-water-500 transition-[width] duration-300 ease-out"
                    style={{ width: pct(d.value) }} />
                  
                  <span className="absolute inset-y-0 w-px bg-soil-500/40" style={{ left: pct(moistureDef.goodMin) }} />
                  <span className="absolute inset-y-0 w-px bg-soil-500/40" style={{ left: pct(moistureDef.goodMax) }} />
                </span>
                <span className={`w-9 shrink-0 text-right text-[12px] font-semibold tabular-nums ${tone}`}>{d.value}%</span>
              </li>);

          })}
        </ul>
      </div>

      <p className={`mt-auto flex items-start gap-2 rounded-lg px-3 py-2 text-[12px] leading-snug text-ink ${adviceBg}`}>
        <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${s.dot}`} aria-hidden="true" />
        {advice}
      </p>

      <CardScanOverlay active={scanning} stage={stage} target="soil" label="Soil moisture" />
    </section>);

}