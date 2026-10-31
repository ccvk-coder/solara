import type { FieldMoisture } from './dashboard';
import type { ElevationLink, ElevationPoint } from './elevation';

export type ScanStatus = 'idle' | 'scanning' | 'success' | 'error';
export type ScanSource = 'device' | 'demo';
export type ScanStage = 'connect' | 'soil' | 'slope' | 'ground' | 'process';

export interface SoilMoistureReading {
  fields: FieldMoisture[];
}

export interface SlopeElevationReading {
  profile: ElevationPoint[];
  link: ElevationLink;
  signalDbm: number;
}

export interface GroundMovementReading {
  rate: number; // mm/day
  displacement30d: number; // mm
  tilt: number; // degrees
  vibration: number[]; // g
}

export interface MonitoringScan {
  soilMoisture: SoilMoistureReading;
  slopeElevation: SlopeElevationReading;
  groundMovement: GroundMovementReading;
  source: ScanSource;
  scannedAt: Date;
}