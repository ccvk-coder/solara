import React from 'react';
import { AlertCircleIcon, ArrowRightIcon, CheckCircle2Icon, Loader2Icon, LockIcon, SparklesIcon } from 'lucide-react';
import { AI_LOCKED_MESSAGE } from '../data/scan';
import type { FieldInfo } from '../types/dashboard';
import type { ScanSource, ScanStatus } from '../types/scan';
import { DeviceStatusCard } from './DeviceStatusCard';

interface HeroSectionProps {
  field: FieldInfo;
  lastSync: Date;
  scanStatus: ScanStatus;
  scanMessage: string | null;
  dataSource: ScanSource | null;
  aiEnabled: boolean;
  onScan: () => void;
  onAiAnalysis: () => void;
}

const HERO_IMAGE = "/1dadb45a-f0e9-4bc3-86e7-c862cf144aa8.jpg";


export function HeroSection({
  field,
  lastSync,
  scanStatus,
  scanMessage,
  dataSource,
  aiEnabled,
  onScan,
  onAiAnalysis
}: HeroSectionProps) {
  const scanning = scanStatus === 'scanning';

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden rounded-2xl bg-brand-900">
      <img
        src={HERO_IMAGE}
        alt="Young corn rows with an AgriSense solar soil-monitoring device in the field"
        className="absolute inset-0 h-full w-full object-cover object-[62%_60%]" />
      
      <div className="hero-shade absolute inset-0" aria-hidden="true" />

      <div className="relative flex flex-col gap-6 p-5 sm:p-7 lg:min-h-[300px] lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-[460px] text-white">
          <span className="inline-block rounded-full bg-brand-800 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide">
            Real-Time Soil Monitoring
          </span>
          <h1
            id="hero-title"
            className="mt-3 text-[32px] font-extrabold leading-[1.06] tracking-tight [text-shadow:0_2px_12px_rgba(0,0,0,0.25)] sm:text-[40px]">
            
            Smarter Farming
            <br />
            Healthier Soils
            <br />
            Higher Yields.
          </h1>
          <p className="mt-3 max-w-[360px] text-[15px] leading-snug text-white/90">
            AI-powered soil insights from real devices to help you make better farming decisions.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onScan}
              disabled={scanning}
              aria-busy={scanning}
              className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full bg-brand-600 px-5 text-[14px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-wait disabled:bg-brand-700">
              
              {scanning && <Loader2Icon size={16} className="animate-spin" aria-hidden="true" />}
              {scanning ? 'Scanning Soil...' : 'Scan Soil'}
              {!scanning && <ArrowRightIcon size={16} aria-hidden="true" />}
            </button>

            <span className="group relative inline-flex">
              <button
                type="button"
                onClick={aiEnabled ? onAiAnalysis : undefined}
                aria-disabled={!aiEnabled}
                aria-describedby={aiEnabled ? undefined : 'ai-lock-tip'}
                className={`inline-flex h-11 items-center gap-2.5 whitespace-nowrap rounded-full pl-2 pr-5 text-[14px] font-semibold transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                aiEnabled ? 'bg-white text-ink hover:bg-brand-50' : 'cursor-not-allowed bg-white/70 text-ink-muted'}`
                }>
                
                <span
                  className={`grid h-7 w-7 place-items-center rounded-full text-white transition-colors duration-150 ease-out ${
                  aiEnabled ? 'bg-brand-600' : 'bg-ink-soft'}`
                  }>
                  
                  {aiEnabled ? <SparklesIcon size={14} aria-hidden="true" /> : <LockIcon size={13} aria-hidden="true" />}
                </span>
                AI Analysis
              </button>
              {!aiEnabled &&
              <span
                id="ai-lock-tip"
                role="tooltip"
                className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-[230px] -translate-x-1/2 rounded-md bg-ink px-2.5 py-1.5 text-[12px] font-medium leading-snug text-white opacity-0 shadow-pop transition-opacity duration-150 ease-out group-focus-within:opacity-100 group-hover:opacity-100">
                
                  {AI_LOCKED_MESSAGE}
                </span>
              }
            </span>
          </div>

          <p role="status" aria-live="polite" className="mt-3 flex min-h-[20px] items-center gap-2 text-[13px] font-medium">
            {scanStatus === 'scanning' && <span className="text-white/90">{scanMessage}</span>}
            {scanStatus === 'success' &&
            <>
                <CheckCircle2Icon size={15} className="shrink-0 text-brand-300" aria-hidden="true" />
                <span className="text-white/90">{scanMessage}</span>
                {dataSource === 'demo' &&
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-semibold text-white">Demo data</span>
              }
              </>
            }
            {scanStatus === 'error' &&
            <>
                <AlertCircleIcon size={15} className="shrink-0 text-heat-100" aria-hidden="true" />
                <span className="text-heat-100">{scanMessage}</span>
              </>
            }
          </p>
        </div>

        <DeviceStatusCard field={field} lastSync={lastSync} />
      </div>
    </section>);

}