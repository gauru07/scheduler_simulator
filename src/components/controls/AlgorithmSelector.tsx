"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Algorithm } from '@/engine/types';
import { useSimulation } from '@/contexts/SimulationContext';

const algorithms = [
  { value: 'FCFS', label: 'First-Come-First-Served', description: 'Processes executed in arrival order' },
  { value: 'SJF_NON_PREEMPTIVE', label: 'Shortest Job First', description: 'Shortest burst time first (non-preemptive)' },
  { value: 'SRTF_PREEMPTIVE', label: 'Shortest Remaining Time', description: 'Shortest remaining time first (preemptive)' },
  { value: 'PRIORITY_NON_PREEMPTIVE', label: 'Priority Scheduling', description: 'Priority-based scheduling (non-preemptive)' },
  { value: 'PRIORITY_PREEMPTIVE', label: 'Preemptive Priority', description: 'Priority-based scheduling (preemptive)' },
  { value: 'ROUND_ROBIN', label: 'Round Robin', description: 'Time-sliced scheduling with quantum' },
  { value: 'MLFQ', label: 'Multilevel Feedback Queue', description: 'Multiple priority levels with aging' },
];

export function AlgorithmSelector() {
  const { algorithm, setAlgorithm } = useSimulation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scheduling Algorithm</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {algorithms.map((algo) => (
          <div
            key={algo.value}
            className={`p-4 border rounded-xl cursor-pointer transition-all duration-300 ${
              algorithm === algo.value
                ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50'
            }`}
            onClick={() => setAlgorithm(algo.value as Algorithm)}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                algorithm === algo.value
                  ? 'border-cyan-500 bg-cyan-500 shadow-lg shadow-cyan-500/50'
                  : 'border-gray-500'
              }`}>
                {algorithm === algo.value && (
                  <div className="w-2 h-2 bg-white rounded-full m-1"></div>
                )}
              </div>
              <div className="flex-1">
                <h4 className={`font-medium transition-colors ${
                  algorithm === algo.value ? 'text-cyan-400' : 'text-gray-200'
                }`}>
                  {algo.label}
                </h4>
                <p className="text-sm text-gray-400">{algo.description}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
