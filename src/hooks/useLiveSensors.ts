import { useEffect, useState } from 'react';
import { sensors } from '../data/sensors';
import type { SensorValues } from '../types/dashboard';

function initialValues(): SensorValues {
  return Object.fromEntries(sensors.map((s) => [s.key, s.base])) as SensorValues;
}

/**
 * Simulated real-time feed. Swap the interval body for a WebSocket / MQTT
 * subscription to stream readings from physical AgriSense devices.
 */
export function useLiveSensors(intervalMs = 4000) {
  const [values, setValues] = useState<SensorValues>(initialValues);
  const [lastSync, setLastSync] = useState<Date>(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => {
      setValues((prev) => {
        const next = { ...prev };
        for (const s of sensors) {
          const v = prev[s.key];
          const drift = (s.base - v) * 0.25 + (Math.random() - 0.5) * 2 * s.jitter;
          next[s.key] = Math.min(s.max, Math.max(s.min, v + drift));
        }
        return next;
      });
      setLastSync(new Date());
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return { values, lastSync };
}