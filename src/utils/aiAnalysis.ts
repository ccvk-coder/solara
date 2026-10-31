import { fields } from '../data/fields';
import { movementLevels } from '../data/groundMovement';
import { sensors } from '../data/sensors';
import type { AiAnalysisResult, AiInsight, InsightStatus } from '../types/aiAnalysis';
import type { GroundMovementReading, MonitoringScan, SlopeElevationReading, SoilMoistureReading } from '../types/scan';
import { computeElevationStats } from './elevation';
import { getSensorStatus } from './sensors';

const moistureDef = sensors.find((s) => s.key === 'moisture')!;

function analyzeSoil(reading: SoilMoistureReading): AiInsight {
  const count = reading.fields.length;
  const depths = reading.fields[0].depths.map((d, i) => ({
    depth: d.depth,
    value: Math.round(reading.fields.reduce((sum, f) => sum + f.depths[i].value, 0) / count)
  }));
  const [top, mid, deep] = depths;
  const { label } = getSensorStatus(moistureDef, top.value);
  const range = `${moistureDef.goodMin}–${moistureDef.goodMax}%`;
  const dryFields = reading.fields.filter((f) => f.depths[0].value < moistureDef.goodMin);
  const wetFields = reading.fields.filter((f) => f.depths[0].value > moistureDef.goodMax);
  const inRange = top.value >= moistureDef.goodMin && top.value <= moistureDef.goodMax;

  const trend =
  deep.value > top.value ?
  'Moisture increases with depth, so the root zone is holding more water than the surface.' :
  'Moisture does not increase with depth, so deeper roots may have less water than the surface.';

  let finding = `Average moisture is ${top.value}% at ${top.depth} (${label}), ${mid.value}% at ${mid.depth} and ${deep.value}% at ${deep.depth}. ${trend}`;
  if (dryFields.length) {
    const names = dryFields.map((f) => `${fields.find((x) => x.id === f.fieldId)?.name ?? f.fieldId} (${f.depths[0].value}%)`);
    finding += ` ${names.join(', ')} ${dryFields.length > 1 ? 'are' : 'is'} below the ${range} reference at ${top.depth}.`;
  }

  const recommendation = !inRange ?
  top.value < moistureDef.goodMin ?
  `Plan irrigation within 12 hours to bring top-soil moisture back into the ${range} range, then re-scan.` :
  'Hold irrigation and check drainage; re-scan once the surface has drained.' :
  dryFields.length ?
  `No farm-wide irrigation needed. Check ${dryFields.length > 1 ? 'the drier fields' : 'the drier field'} first and re-scan in about 6 hours.` :
  wetFields.length ?
  'No irrigation needed. Watch the wetter fields for standing water and re-scan in about 6 hours.' :
  'No irrigation needed. Re-scan in about 6 hours; top-soil dries first.';

  const status: InsightStatus = !inRange ? 'attention' : dryFields.length || wetFields.length ? 'watch' : 'normal';
  return { id: 'soil', title: 'Soil Moisture', finding, recommendation, status };
}

function analyzeSlope(reading: SlopeElevationReading): AiInsight {
  const stats = computeElevationStats(reading.profile, reading.link);
  const km = (reading.link.to.distance - reading.link.from.distance).toFixed(2);
  const direction = stats.avgSlope < 0 ? 'descends' : stats.avgSlope > 0 ? 'rises' : 'is level';
  const crossings = stats.obstructions.length;

  const finding = `The ${km} km Field A → Field C profile ${direction} overall (${stats.avgSlope.toFixed(2)}% average) but includes a section as steep as ${stats.maxSlope.toFixed(1)}%. Elevation ranges ${stats.minElevation}–${stats.maxElevation} m with ${stats.totalGain} m of cumulative gain. The signal path crosses terrain at ${crossings} ${crossings === 1 ? 'point' : 'points'} (${reading.signalDbm} dBm).`;

  const recommendation =
  crossings > 0 ?
  `Consider a relay or a taller antenna near the ${stats.maxElevation} m high point to keep the link reliable. Inspect the steepest section for runoff after rain.` :
  'Link has clear line of sight. Inspect the steepest section for runoff after rain.';

  return { id: 'slope', title: 'Slope Elevation', finding, recommendation, status: crossings > 0 ? 'watch' : 'normal' };
}

function analyzeGround(reading: GroundMovementReading): AiInsight {
  const level = movementLevels.find((l) => reading.rate < l.max) ?? movementLevels[movementLevels.length - 1];
  const dailyAvg = reading.displacement30d / 30;
  const peak = reading.vibration.length ? Math.max(...reading.vibration.map((v) => Math.abs(v))) : 0;
  const aboveAverage = reading.rate > dailyAvg * 1.5;

  const finding = `Movement rate is ${reading.rate.toFixed(1)} mm/day, in the dashboard's ${level.label} band (${level.range}). ${reading.displacement30d.toFixed(1)} mm of displacement over 30 days averages about ${dailyAvg.toFixed(2)} mm/day${aboveAverage ? ', so the current rate is above the monthly average' : ''}. Tilt is ${reading.tilt.toFixed(2)}° and vibration peaks at ${peak.toFixed(3)} g in the latest trace.`;

  const recommendation =
  level.key === 'good' ?
  `${aboveAverage ? 'Compare the next few scans against the 30-day average to see if the rate settles.' : 'Keep the current monitoring schedule.'} Confirm alert limits with a geotechnical engineer before relying on these bands for safety decisions.` :
  'Increase scan frequency and have the Field C slope inspected on site. Confirm alert limits with a geotechnical engineer.';

  const status: InsightStatus = level.key === 'alert' ? 'attention' : level.key === 'warn' || aboveAverage ? 'watch' : 'normal';
  return { id: 'ground', title: 'Ground Movement', finding, recommendation, status };
}

/**
 * Rule-based stand-in for an AI model that interprets only the three scanned
 * data sets. Swap the body for an API call returning the same shape.
 */
export function analyzeMonitoring(scan: MonitoringScan): AiAnalysisResult {
  const insights = [analyzeSoil(scan.soilMoisture), analyzeSlope(scan.slopeElevation), analyzeGround(scan.groundMovement)];
  const attention = insights.filter((i) => i.status === 'attention');
  const watch = insights.filter((i) => i.status === 'watch');

  const lead =
  attention.length > 0 ?
  `${attention.map((i) => i.title).join(' and ')} ${attention.length > 1 ? 'need' : 'needs'} attention.` :
  'No reading needs immediate action.';
  const follow = watch.length > 0 ? ` Keep an eye on ${watch.map((i) => i.title.toLowerCase()).join(' and ')}.` : '';
  const summary = `${lead}${follow} Soil moisture, slope profile, and ground movement were interpreted from the latest scan only.`;

  return { summary, insights, analyzedAt: new Date(), scannedAt: scan.scannedAt, source: scan.source };
}