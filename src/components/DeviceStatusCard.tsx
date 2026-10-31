import React from 'react';
import { format } from 'date-fns';
import { BatteryMediumIcon, CalendarClockIcon, MapPinIcon, SignalIcon, SunIcon } from 'lucide-react';
import type { FieldInfo } from '../types/dashboard';

interface DeviceStatusCardProps {
  field: FieldInfo;
  lastSync: Date;
}

export function DeviceStatusCard({ field, lastSync }: DeviceStatusCardProps) {
  const rows = [
  { label: 'Solar Power', value: `${field.device.solar}%`, icon: <SunIcon size={18} className="fill-sun-500 text-sun-500" aria-hidden="true" /> },
  { label: 'Signal Strength', value: field.device.signal, icon: <SignalIcon size={18} className="text-brand-400" aria-hidden="true" /> },
  { label: 'Battery', value: `${field.device.battery}%`, icon: <BatteryMediumIcon size={18} className={field.device.battery < 50 ? 'text-sun-500' : 'text-brand-400'} aria-hidden="true" /> }];


  return (
    <aside
      aria-label="Device status"
      className="w-full rounded-xl border border-white/15 bg-brand-950/80 p-3 text-white backdrop-blur-md sm:w-[260px]">
      
      <div className="inline-flex items-center gap-2 rounded-lg bg-brand-800/80 px-2.5 py-1.5 text-[13px] font-semibold">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-400" />
        </span>
        Device Online
      </div>

      <p className="mt-3 flex items-center gap-2 text-[13px] font-medium">
        <MapPinIcon size={15} aria-hidden="true" />
        {field.name} - {field.crop}
      </p>

      <div className="mt-2.5 flex items-center gap-2.5 border-t border-white/10 pt-2.5">
        <span className="grid h-8 w-8 place-items-center rounded-md border border-white/25">
          <CalendarClockIcon size={16} aria-hidden="true" />
        </span>
        <div>
          <p className="text-[11px] text-white/70">Last Sync</p>
          <p className="text-[13px] font-semibold tabular-nums" aria-live="polite">
            {format(lastSync, 'MMM d, yyyy h:mm a')}
          </p>
        </div>
      </div>

      <dl className="mt-2.5 space-y-2 border-t border-white/10 pt-2.5">
        {rows.map((r) =>
        <div key={r.label} className="flex items-center gap-2.5">
            <span className="grid w-8 place-items-center">{r.icon}</span>
            <dt className="flex-1 text-[13px] text-white/85">{r.label}</dt>
            <dd className="text-[14px] font-semibold tabular-nums">{r.value}</dd>
          </div>
        )}
      </dl>
    </aside>);

}