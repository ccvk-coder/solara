import type {
  ElevationChartPoint,
  ElevationLink,
  ElevationPoint,
  ElevationStats } from
'../types/elevation';

export function losHeight(link: ElevationLink, distance: number): number {
  const { from, to } = link;
  const t = (distance - from.distance) / (to.distance - from.distance);
  return from.height + (to.height - from.height) * t;
}

export function buildElevationChart(profile: ElevationPoint[], link: ElevationLink): ElevationChartPoint[] {
  return profile.map((p, i) => {
    const prev = profile[Math.max(0, i - 1)];
    const next = profile[Math.min(profile.length - 1, i + 1)];
    const run = (next.distance - prev.distance) * 1000;
    const slope = run > 0 ? (next.elevation - prev.elevation) / run * 100 : 0;
    return { ...p, los: Math.round(losHeight(link, p.distance) * 10) / 10, slope: Math.round(slope * 10) / 10 };
  });
}

export function computeElevationStats(profile: ElevationPoint[], link: ElevationLink): ElevationStats {
  let maxSlope = 0;
  let totalGain = 0;
  const obstructions: number[] = [];

  for (let i = 1; i < profile.length; i++) {
    const a = profile[i - 1];
    const b = profile[i];
    const rise = b.elevation - a.elevation;
    const run = (b.distance - a.distance) * 1000;
    if (run > 0) maxSlope = Math.max(maxSlope, Math.abs(rise / run * 100));
    if (rise > 0) totalGain += rise;

    const da = a.elevation - losHeight(link, a.distance);
    const db = b.elevation - losHeight(link, b.distance);
    if (da < 0 && db >= 0 || da >= 0 && db < 0) {
      const t = da / (da - db);
      obstructions.push(a.distance + (b.distance - a.distance) * t);
    }
  }

  const first = profile[0];
  const last = profile[profile.length - 1];
  const elevations = profile.map((p) => p.elevation);

  return {
    avgSlope: (last.elevation - first.elevation) / ((last.distance - first.distance) * 1000) * 100,
    maxSlope,
    minElevation: Math.min(...elevations),
    maxElevation: Math.max(...elevations),
    totalGain,
    obstructions
  };
}