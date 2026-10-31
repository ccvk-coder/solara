import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, Loader2Icon } from 'lucide-react';
import { scanStages } from '../data/scan';
import type { ScanStage } from '../types/scan';

interface CardScanOverlayProps {
  active: boolean;
  stage: ScanStage | null;
  target: ScanStage;
  label: string;
}

const EASE = [0.23, 1, 0.32, 1] as const;

export function CardScanOverlay({ active, stage, target, label }: CardScanOverlayProps) {
  const current = scanStages.findIndex((s) => s.key === stage);
  const own = scanStages.findIndex((s) => s.key === target);
  const received = current > own;
  const text = received ? `${label} received` : current === own ? `Fetching ${label.toLowerCase()} data...` : 'Waiting for device...';

  return (
    <AnimatePresence>
      {active &&
      <motion.div
        className="absolute inset-0 z-20 grid place-items-center rounded-xl bg-white/80 backdrop-blur-[1px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18, ease: EASE }}
        aria-hidden="true">
        
          <div className="flex flex-col items-center gap-2.5">
            <span className={`grid h-10 w-10 place-items-center rounded-full ${received ? 'bg-brand-500 text-white' : 'bg-brand-50 text-brand-600'}`}>
              {received ? <CheckIcon size={18} strokeWidth={3} /> : <Loader2Icon size={20} className="animate-spin" />}
            </span>
            <span className="text-[12px] font-semibold text-ink">{text}</span>
          </div>
        </motion.div>
      }
    </AnimatePresence>);

}