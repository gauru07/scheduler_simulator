"use client";

import { SimulationProvider } from '@/contexts/SimulationContext';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProcessInput } from '@/components/controls/ProcessInput';
import { AlgorithmSelector } from '@/components/controls/AlgorithmSelector';
import { GanttChart } from '@/components/visualization/GanttChart';
import { SimulationControls } from '@/components/controls/SimulationControls';
import { MetricsDisplay } from '@/components/visualization/MetricsDisplay';

export default function SimulatorPage() {
  return (
    <SimulationProvider>
      <div className="min-h-screen animated-bg">
        <Header />
        <div className="flex">
          <Sidebar>
            <ProcessInput />
            <AlgorithmSelector />
          </Sidebar>
          <main className="flex-1 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <GanttChart />
                <SimulationControls />
              </div>
              <div className="space-y-6">
                <MetricsDisplay />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SimulationProvider>
  );
}
