import type { SensorDef, Status, Tone } from '../types/dashboard';

export function getSensorStatus(def: SensorDef, value: number): {status: Status;label: string;} {
  if (value >= def.goodMin && value <= def.goodMax) {
    return { status: def.informational ? 'info' : 'good', label: def.goodLabel };
  }
  const low = value < def.goodMin;
  const label = low ? def.lowLabel : def.highLabel;
  if (def.informational) return { status: 'info', label };
  const margin = (def.goodMax - def.goodMin) * 0.5;
  const distance = low ? def.goodMin - value : value - def.goodMax;
  if (distance <= margin) return { status: 'warn', label };
  return { status: 'alert', label: 'Critical' };
}

export function formatNumber(value: number, decimals: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

export function isWordUnit(unit: string): boolean {
  return /[a-z]/.test(unit);
}

export function formatWithUnit(def: SensorDef, value: number): string {
  const n = formatNumber(value, def.decimals);
  if (!def.unit) return n;
  return isWordUnit(def.unit) ? `${n} ${def.unit}` : `${n}${def.unit}`;
}

export const toneClasses: Record<Tone, string> = {
  water: 'bg-water-50 text-water-500',
  heat: 'bg-heat-50 text-heat-500',
  sun: 'bg-sun-50 text-sun-500',
  leaf: 'bg-brand-50 text-brand-600'
};

export const statusClasses: Record<Status, {dot: string;text: string;}> = {
  good: { dot: 'bg-brand-500', text: 'text-brand-600' },
  warn: { dot: 'bg-sun-500', text: 'text-sun-600' },
  alert: { dot: 'bg-heat-500', text: 'text-heat-600' },
  info: { dot: 'bg-water-500', text: 'text-water-600' }
};

export const fieldStatusClasses: Record<'good' | 'warn' | 'alert', {fill: string;pin: string;}> = {
  good: { fill: 'fill-brand-500/35 stroke-brand-300', pin: 'bg-brand-500' },
  warn: { fill: 'fill-sun-500/35 stroke-sun-500', pin: 'bg-sun-500' },
  alert: { fill: 'fill-heat-500/45 stroke-heat-500', pin: 'bg-heat-500' }
};