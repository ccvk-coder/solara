import React from 'react';
import { CloudIcon, CloudRainIcon, SunIcon } from 'lucide-react';
import type { WeatherIconName } from '../types/dashboard';

interface WeatherIconProps {
  name: WeatherIconName;
  size?: number;
}

export function WeatherIcon({ name, size = 28 }: WeatherIconProps) {
  const sun =
  <SunIcon
    size={size * 0.72}
    className="absolute left-0 top-0 fill-sun-500 text-sun-500"
    strokeWidth={2}
    aria-hidden="true" />;



  if (name === 'sun') {
    return (
      <span className="inline-grid shrink-0 place-items-center" style={{ width: size, height: size }}>
        <SunIcon size={size * 0.9} className="fill-sun-500 text-sun-500" aria-hidden="true" />
      </span>);

  }

  const CloudGlyph = name === 'partly' ? CloudIcon : CloudRainIcon;

  return (
    <span className="relative inline-block shrink-0" style={{ width: size, height: size }} aria-hidden="true">
      {name !== 'rain' && sun}
      <CloudGlyph
        size={size * 0.78}
        strokeWidth={1.8}
        className={`absolute bottom-0 right-0 fill-white ${name === 'partly' ? 'text-ink-soft' : 'text-water-500'}`} />
      
    </span>);

}