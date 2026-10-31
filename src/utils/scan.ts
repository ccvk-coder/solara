import { elevationLink, elevationProfile } from '../data/elevation';
import { groundMovementBaseline } from '../data/groundMovement';
import { demoSignalDbm, demoVibration, MONITORING_API_URL, scanStages } from '../data/scan';
import { soilMoistureByField } from '../data/soilMoisture';
import type { MonitoringScan, ScanStage } from '../types/scan';

interface FetchOptions {
  onStage: (stage: ScanStage) => void;
  signal: AbortSignal;
  simulateFailure?: boolean;
}

const STAGE_MS = 650;

function wait(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const id = window.setTimeout(resolve, ms);
    signal.addEventListener(
      'abort',
      () => {
        window.clearTimeout(id);
        reject(new DOMException('Scan aborted', 'AbortError'));
      },
      { once: true }
    );
  });
}

function isMonitoringPayload(v: unknown): v is Omit<MonitoringScan, 'source' | 'scannedAt'> {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return Boolean(o.soilMoisture && o.slopeElevation && o.groundMovement);
}

/**
 * Fetches readings from the connected monitoring device. When no device
 * endpoint is configured, runs an asynchronous simulated scan and returns
 * values flagged as demo data.
 */
export async function fetchMonitoringData({ onStage, signal, simulateFailure }: FetchOptions): Promise<MonitoringScan> {
  if (MONITORING_API_URL) {
    onStage('connect');
    const res = await fetch(MONITORING_API_URL, { signal });
    if (!res.ok) throw new Error(`Device responded with ${res.status}`);
    onStage('soil');
    const body: unknown = await res.json();
    onStage('process');
    if (!isMonitoringPayload(body)) throw new Error('Unexpected device payload');
    return { ...body, source: 'device', scannedAt: new Date() };
  }

  for (const stage of scanStages) {
    onStage(stage.key);
    await wait(STAGE_MS, signal);
    if (simulateFailure && stage.key === 'slope') throw new Error('Device did not respond');
  }

  return {
    soilMoisture: { fields: soilMoistureByField },
    slopeElevation: { profile: elevationProfile, link: elevationLink, signalDbm: demoSignalDbm },
    groundMovement: {
      rate: groundMovementBaseline.rate,
      displacement30d: groundMovementBaseline.cumulative30d,
      tilt: groundMovementBaseline.tilt,
      vibration: demoVibration
    },
    source: 'demo',
    scannedAt: new Date()
  };
}