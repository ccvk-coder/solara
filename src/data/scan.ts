import type { ScanStage } from '../types/scan';

/**
 * Endpoint of the connected monitoring device. Leave empty to run the
 * simulated demo scan; set it to fetch real readings instead.
 */
export const MONITORING_API_URL = '';

export const scanStages: {key: ScanStage;message: string;}[] = [
{ key: 'connect', message: 'Connecting to monitoring device...' },
{ key: 'soil', message: 'Fetching soil moisture data...' },
{ key: 'slope', message: 'Fetching slope elevation data...' },
{ key: 'ground', message: 'Fetching ground movement data...' },
{ key: 'process', message: 'Processing sensor readings...' }];


export const SCAN_SUCCESS_MESSAGE = 'Scan completed successfully.';
export const SCAN_ERROR_MESSAGE = 'Failed to retrieve monitoring data. Please try again.';
export const AI_LOCKED_MESSAGE = 'Complete a soil scan to unlock AI Analysis.';

export const DEPTH_LABELS = ['10 cm', '30 cm', '60 cm'];
export const VIBRATION_SAMPLES = 48;

export const demoSignalDbm = -86;

// Accelerometer snapshot (g) returned by the demo scan.
export const demoVibration = [
0.002, -0.003, 0.004, -0.001, 0.003, -0.004, 0.001, 0.005, -0.002, 0.003, -0.005, 0.002,
0.018, -0.014, 0.004, -0.002, 0.003, -0.004, 0.002, 0.001, -0.003, 0.004, -0.002, 0.003,
-0.001, 0.002, -0.004, 0.005, -0.003, 0.001, 0.003, -0.021, 0.012, -0.003, 0.002, -0.001,
0.004, -0.003, 0.002, 0.003, -0.002, 0.001, -0.004, 0.003, -0.002, 0.004, -0.001, 0.002];