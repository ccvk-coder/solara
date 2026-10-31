import { useCallback, useEffect, useRef, useState } from 'react';
import { SCAN_ERROR_MESSAGE, SCAN_SUCCESS_MESSAGE, scanStages } from '../data/scan';
import type { MonitoringScan, ScanStage, ScanStatus } from '../types/scan';
import { fetchMonitoringData } from '../utils/scan';

export function useSoilScan(simulateFailure = false) {
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [stage, setStage] = useState<ScanStage | null>(null);
  // Last successful scan. A failed re-scan keeps it; nothing is ever filled with placeholder readings.
  const [data, setData] = useState<MonitoringScan | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => () => controllerRef.current?.abort(), []);

  const scan = useCallback(async () => {
    if (controllerRef.current && !controllerRef.current.signal.aborted && status === 'scanning') return;
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setStatus('scanning');
    setStage('connect');
    try {
      const result = await fetchMonitoringData({ onStage: setStage, signal: controller.signal, simulateFailure });
      if (controller.signal.aborted) return;
      setData(result);
      setStatus('success');
    } catch {
      if (controller.signal.aborted) return;
      setStatus('error');
    } finally {
      if (!controller.signal.aborted) setStage(null);
    }
  }, [simulateFailure, status]);

  const message =
  status === 'scanning' ?
  scanStages.find((s) => s.key === stage)?.message ?? scanStages[0].message :
  status === 'success' ?
  SCAN_SUCCESS_MESSAGE :
  status === 'error' ?
  SCAN_ERROR_MESSAGE :
  null;

  return {
    status,
    stage,
    data,
    message,
    scan,
    scanning: status === 'scanning',
    aiEnabled: status !== 'scanning' && data !== null
  };
}