import React from 'react';
import { Dashboard } from './pages/Dashboard';

interface AppProps {
  simulateScanFailure?: boolean;
}

export function App({ simulateScanFailure = false }: AppProps) {
  return <Dashboard simulateScanFailure={simulateScanFailure} />;
}