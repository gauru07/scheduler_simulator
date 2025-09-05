"use client";

import React from 'react';
import { Cpu, Play, Settings, Activity, Loader2 } from 'lucide-react';
import { useSimulation } from '@/contexts/SimulationContext';

export function Header() {
  const { runSimulation, isLoading } = useSimulation();

  const handleExecuteSimulation = async () => {
    console.log('Header: handleExecuteSimulation clicked');
    try {
      await runSimulation();
      console.log('Header: runSimulation completed');
    } catch (error) {
      console.error('Header: runSimulation error:', error);
    }
  };
  return (
    <header className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg glow">
            <Cpu className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              CPU Scheduler Simulator
            </h1>
            <p className="text-sm text-gray-400 flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Interactive Process Scheduling Visualization</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-300 bg-gray-800 px-3 py-2 rounded-lg">
            <div className={`w-2 h-2 rounded-full status-indicator ${isLoading ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
            <span>{isLoading ? 'Running Simulation...' : 'System Ready'}</span>
          </div>
          
          <button 
            onClick={handleExecuteSimulation}
            disabled={isLoading}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 glow-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span className="font-medium">{isLoading ? 'Running...' : 'Execute Simulation'}</span>
          </button>
          
          <button className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-300">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

