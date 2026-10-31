export interface ElevationPoint {
  distance: number; // km
  elevation: number; // m
}

export interface ElevationEndpoint {
  name: string;
  distance: number; // km
  height: number; // m (antenna / sensor height above sea level)
}

export interface ElevationLink {
  from: ElevationEndpoint;
  to: ElevationEndpoint;
}

export interface ElevationChartPoint extends ElevationPoint {
  los: number;
  slope: number; // % grade
}

export interface ElevationStats {
  avgSlope: number;
  maxSlope: number;
  minElevation: number;
  maxElevation: number;
  totalGain: number;
  obstructions: number[]; // km positions where the link crosses terrain
}