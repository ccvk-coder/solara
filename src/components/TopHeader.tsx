import React from 'react';
import { MapPinIcon, SunIcon } from 'lucide-react';
import { currentWeather, farmLocation } from '../data/weather';
import { NotificationsMenu } from './NotificationsMenu';
import { WeatherIcon } from './WeatherIcon';

export function TopHeader() {
  return (
    <header className="flex h-14 w-full items-center justify-between gap-4 px-2 sm:px-3">
      <a
        href="/"
        aria-label="Solara home"
        className="flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
        
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">
          <SunIcon size={18} strokeWidth={2.25} aria-hidden="true" />
        </span>
        <span className="text-[18px] font-extrabold tracking-[0.12em] text-ink">SOLARA</span>
      </a>
      <div className="flex items-center gap-3 sm:gap-5">
        <p className="hidden items-center gap-1.5 whitespace-nowrap text-[12px] font-medium text-ink md:flex">
          <MapPinIcon size={16} className="fill-ink text-white" aria-hidden="true" />
          {farmLocation}
        </p>
        <div className="hidden items-center gap-2 sm:flex">
          <WeatherIcon name="partly" size={28} />
          <div className="leading-tight">
            <p className="text-[13px] font-bold text-ink">{currentWeather.temp}°C</p>
            <p className="whitespace-nowrap text-[11px] text-ink-muted">{currentWeather.condition}</p>
          </div>
        </div>
        <NotificationsMenu />
      </div>
    </header>);

}