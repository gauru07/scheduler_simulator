"use client";

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ProcessInput as ProcessInputType } from '@/engine/types';
import { useSimulation } from '@/contexts/SimulationContext';

export function ProcessInput() {
  const { processes, addProcess, removeProcess, updateProcess } = useSimulation();

  const handleAddProcess = () => {
    const newId = `P${processes.length + 1}`;
    addProcess({ id: newId, arrival: 0, burst: 1 });
  };

  const handleRemoveProcess = (index: number) => {
    const process = processes[index];
    if (process) {
      removeProcess(process.id);
    }
  };

  const handleUpdateProcess = (index: number, field: keyof ProcessInputType, value: string | number) => {
    const process = processes[index];
    if (process) {
      updateProcess(process.id, { [field]: value });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {processes.map((process, index) => (
          <div key={index} className="group relative p-4 border border-gray-600 rounded-xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 hover:from-gray-700/80 hover:to-gray-800/80 transition-all duration-300 hover:border-gray-500 hover:shadow-lg">
            {/* Process Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {process.id}
                </div>
                <span className="text-gray-300 font-medium">Process {process.id}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveProcess(index)}
                className="text-red-400 hover:text-red-300 hover:bg-red-900/30 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Input Fields */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Process ID</label>
                <input
                  type="text"
                  value={process.id}
                  onChange={(e) => handleUpdateProcess(index, 'id', e.target.value)}
                  className="w-full h-10 px-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="P1"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Arrival Time</label>
                <input
                  type="number"
                  value={process.arrival}
                  onChange={(e) => handleUpdateProcess(index, 'arrival', parseInt(e.target.value) || 0)}
                  className="w-full h-10 px-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="0"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Burst Time</label>
                <input
                  type="number"
                  value={process.burst}
                  onChange={(e) => handleUpdateProcess(index, 'burst', parseInt(e.target.value) || 0)}
                  className="w-full h-10 px-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        ))}
        
        <Button
          variant="outline"
          onClick={handleAddProcess}
          className="w-full border-dashed border-2 border-gray-600 hover:border-cyan-500 hover:bg-cyan-500/10 text-gray-400 hover:text-cyan-400 transition-all duration-300"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Process
        </Button>
      </CardContent>
    </Card>
  );
}
