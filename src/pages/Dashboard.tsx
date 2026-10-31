import React, { useCallback, useEffect, useState } from 'react';
import { AiAnalysisModal } from '../components/AiAnalysisModal';
import { GroundMovement } from '../components/GroundMovement';
import { HeroSection } from '../components/HeroSection';
import { SlopeElevation } from '../components/SlopeElevation';
import { SoilMoisture } from '../components/SoilMoisture';
import { TopHeader } from '../components/TopHeader';
import { fields } from '../data/fields';
import { useLiveSensors } from '../hooks/useLiveSensors';
import { useSoilScan } from '../hooks/useSoilScan';

interface DashboardProps {
  simulateScanFailure?: boolean;
}

export function Dashboard({ simulateScanFailure = false }: DashboardProps) {
  const { lastSync } = useLiveSensors();
  const { status, stage, data, message, scan, scanning, aiEnabled } = useSoilScan(simulateScanFailure);
  const [selectedField, setSelectedField] = useState<string>('all');
  const [aiOpen, setAiOpen] = useState(false);

  const deviceField = fields.find((f) => f.id === selectedField) ?? fields[0];

  const closeAi = useCallback(() => setAiOpen(false), []);
  const openAi = useCallback(() => {
    if (aiEnabled) setAiOpen(true);
  }, [aiEnabled]);

  // Never leave analysis open over data that is being replaced.
  useEffect(() => {
    if (scanning) setAiOpen(false);
  }, [scanning]);

  return (
    <div className="min-h-screen w-full bg-canvas font-sans text-ink">
      <TopHeader />

      <main className="w-full space-y-2.5 px-2 pb-6 sm:px-3">
        <HeroSection
          field={deviceField}
          lastSync={lastSync}
          scanStatus={status}
          scanMessage={message}
          dataSource={data?.source ?? null}
          aiEnabled={aiEnabled}
          onScan={scan}
          onAiAnalysis={openAi} />
        

        <div className="grid auto-rows-[minmax(440px,auto)] gap-2.5 lg:grid-cols-2 min-[1440px]:grid-cols-[1fr_1.1fr_1.18fr]">
          <SoilMoisture
            selectedId={selectedField}
            onSelect={setSelectedField}
            reading={data?.soilMoisture ?? null}
            scanning={scanning}
            stage={stage} />
          
          <SlopeElevation reading={data?.slopeElevation ?? null} scanning={scanning} stage={stage} />
          <div className="grid lg:col-span-2 min-[1440px]:col-span-1">
            <GroundMovement reading={data?.groundMovement ?? null} scanning={scanning} stage={stage} />
          </div>
        </div>
      </main>

      <footer className="mx-2 border-t border-line py-4 text-center text-[12px] text-ink-muted sm:mx-3">
        © 2026 All Rights Reserved.
      </footer>

      <AiAnalysisModal open={aiOpen && aiEnabled} onClose={closeAi} scan={data} />
    </div>);

}