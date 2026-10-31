export type SensorKey =
'moisture' |
'soilTemp' |
'light' |
'rainfall' |
'airTemp' |
'humidity' |
'ph' |
'nitrogen' |
'phosphorus' |
'potassium';

export type Tone = 'water' | 'heat' | 'sun' | 'leaf';

export type Status = 'good' | 'warn' | 'alert' | 'info';

export type SensorIconName =
'droplet' |
'thermometer' |
'sun' |
'rain' |
'droplets' |
'flask' |
'leaf' |
'sprout' |
'wheat';

export interface SensorDef {
  key: SensorKey;
  label: string;
  unit: string;
  icon: SensorIconName;
  tone: Tone;
  base: number;
  decimals: number;
  jitter: number;
  min: number;
  max: number;
  goodMin: number;
  goodMax: number;
  goodLabel: string;
  lowLabel: string;
  highLabel: string;
  footnote: string;
  informational?: boolean;
}

export type SensorValues = Record<SensorKey, number>;

export interface FieldDevice {
  solar: number;
  signal: 'Strong' | 'Good' | 'Weak';
  battery: number;
}

export interface FieldInfo {
  id: string;
  name: string;
  crop: string;
  status: Exclude<Status, 'info'>;
  statusLabel: string;
  polygon: string;
  label: {x: number;y: number;};
  device: FieldDevice;
}

export interface DepthReading {
  depth: string;
  value: number;
}

export interface FieldMoisture {
  fieldId: string;
  depths: DepthReading[];
}

export type WeatherIconName = 'sun' | 'partly' | 'partlyRain' | 'rain';

export interface ForecastDay {
  offset: number;
  hi: number;
  lo: number;
  rainChance: number;
  humidity: number;
  wind: number;
  condition: string;
  icon: WeatherIconName;
}

export type TrendRange = '24H' | '7D' | '30D';

export interface TrendPoint {
  label: string;
  full: string;
  value: number;
}

export interface AppNotification {
  id: string;
  title: string;
  detail: string;
  time: string;
  status: Exclude<Status, 'info'>;
}

export interface HowItWorksStep {
  title: string;
  body: string;
}