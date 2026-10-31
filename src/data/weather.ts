import type { ForecastDay } from '../types/dashboard';

export const farmLocation = 'San Carlos City, Negros Occidental';

export const currentWeather = {
  temp: 28,
  condition: 'Partly Cloudy',
  humidity: 65,
  wind: 12,
  rain24h: 12
};

export const forecast: ForecastDay[] = [
{ offset: 0, hi: 28, lo: 22, rainChance: 20, humidity: 65, wind: 12, condition: 'Partly Cloudy', icon: 'partlyRain' },
{ offset: 1, hi: 30, lo: 23, rainChance: 15, humidity: 62, wind: 10, condition: 'Partly Cloudy', icon: 'partlyRain' },
{ offset: 2, hi: 29, lo: 22, rainChance: 10, humidity: 60, wind: 9, condition: 'Mostly Sunny', icon: 'partly' },
{ offset: 3, hi: 27, lo: 22, rainChance: 40, humidity: 74, wind: 14, condition: 'Light Rain', icon: 'rain' },
{ offset: 4, hi: 28, lo: 23, rainChance: 20, humidity: 68, wind: 11, condition: 'Partly Cloudy', icon: 'partly' },
{ offset: 5, hi: 29, lo: 23, rainChance: 25, humidity: 66, wind: 13, condition: 'Partly Cloudy', icon: 'partlyRain' },
{ offset: 6, hi: 26, lo: 21, rainChance: 55, humidity: 79, wind: 16, condition: 'Showers', icon: 'rain' }];