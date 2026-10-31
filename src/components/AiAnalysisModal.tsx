import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { format } from 'date-fns';
import { CheckIcon, Loader2Icon, RefreshCwIcon, SparklesIcon, XIcon } from 'lucide-react';
import { analysisCaveat, analysisSteps } from '../data/aiAnalysis';
import type { AiAnalysisResult, InsightStatus } from '../types/aiAnalysis';
import type { MonitoringScan } from '../types/scan';
import { analyzeMonitoring } from '../utils/aiAnalysis';

interface AiAnalysisModalProps {
  open: boolean;
  onClose: () => void;
  scan: MonitoringScan | null;
}

const EASE = [0.23, 1, 0.32, 1] as const;
const STEP_MS = 450;

const STATUS: Record<InsightStatus, {label: string;dot: string;text: string;}> = {
  attention: { label: 'Needs attention', dot: 'bg-heat-500', text: 'text-heat-600' },
  watch: { label: 'Watch', dot: 'bg-sun-500', text: 'text-sun-600' },
  normal: { label: 'Normal', dot: 'bg-brand-500', text: 'text-brand-600' }
};

export function AiAnalysisModal({ open, onClose, scan }: AiAnalysisModalProps) {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<AiAnalysisResult | null>(null);
  const [runId, setRunId] = useState(0);

  const rerun = useCallback(() => setRunId((r) => r + 1), []);

  // Process the latest scan each time the modal opens or the user re-runs it.
  useEffect(() => {
    if (!open || !scan) return;
    setResult(null);
    setStep(0);
    const timers = analysisSteps.map((_, i) => window.setTimeout(() => setStep(i + 1), STEP_MS * (i + 1)));
    const done = window.setTimeout(() => setResult(analyzeMonitoring(scan)), STEP_MS * analysisSteps.length + 150);
    return () => {
      timers.forEach(window.clearTimeout);
      window.clearTimeout(done);
    };
  }, [open, runId, scan]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && scan &&
      <motion.div
        className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: EASE }}
        onClick={onClose}>
        
          <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ai-title"
          className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-pop"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.22, ease: EASE }}
          onClick={(e) => e.stopPropagation()}>
          
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 id="ai-title" className="flex items-center gap-2 text-[17px] font-bold text-ink">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-white">
                  <SparklesIcon size={16} aria-hidden="true" />
                </span>
                AI Monitoring Analysis
              </h2>
              <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              autoFocus
              className="grid h-8 w-8 place-items-center rounded-full text-ink-muted transition-colors duration-150 ease-out hover:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
              
                <XIcon size={18} />
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-5" aria-live="polite" aria-busy={!result}>
              {!result ?
            <ul className="space-y-3 py-2">
                  {analysisSteps.map((label, i) => {
                const done = step > i;
                const active = step === i;
                return (
                  <li key={label} className={`flex items-center gap-3 text-[14px] ${done || active ? 'text-ink' : 'text-ink-soft'}`}>
                        <span className={`grid h-6 w-6 place-items-center rounded-full ${done ? 'bg-brand-500 text-white' : 'bg-canvas'}`}>
                          {done ?
                      <CheckIcon size={13} strokeWidth={3} aria-hidden="true" /> :
                      active ?
                      <Loader2Icon size={14} className="animate-spin text-brand-600" aria-hidden="true" /> :
                      null}
                        </span>
                        {label}
                      </li>);

              })}
                </ul> :

            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, ease: EASE }}>
                  <div className="rounded-xl bg-brand-50 p-4">
                    <p className="text-[13px] font-semibold text-ink">Monitoring summary</p>
                    <p className="mt-1 text-[13px] leading-snug text-ink-muted">{result.summary}</p>
                  </div>

                  <h3 className="mt-5 text-[13px] font-semibold text-ink">Findings & recommendations</h3>
                  <ul className="mt-2 divide-y divide-line">
                    {result.insights.map((ins) => {
                  const st = STATUS[ins.status];
                  return (
                    <li key={ins.id} className="flex gap-3 py-3">
                          <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${st.dot}`} aria-hidden="true" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline justify-between gap-3">
                              <p className="text-[14px] font-semibold text-ink">{ins.title}</p>
                              <span className={`shrink-0 text-[11px] font-semibold ${st.text}`}>{st.label}</span>
                            </div>
                            <p className="mt-0.5 text-[13px] leading-snug text-ink-muted">{ins.finding}</p>
                            <p className="mt-1.5 text-[13px] leading-snug text-ink">
                              <span className="font-semibold">Recommendation: </span>
                              {ins.recommendation}
                            </p>
                          </div>
                        </li>);

                })}
                  </ul>
                  <p className="mt-2 text-[11.5px] leading-snug text-ink-muted">{analysisCaveat}</p>
                </motion.div>
            }
            </div>

            {result &&
          <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-3">
                <p className="text-[12px] text-ink-muted">
                  Scan at {format(result.scannedAt, 'h:mm:ss a')}
                  {result.source === 'demo' && ' · Demo data'}
                </p>
                <button
              type="button"
              onClick={rerun}
              className="inline-flex h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-brand-600 px-4 text-[13px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2">
              
                  <RefreshCwIcon size={14} aria-hidden="true" />
                  Run again
                </button>
              </div>
          }
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>);

}