"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { ProcessInput, Algorithm, SimulationRequest, SimulationResponse, GanttSlice } from '@/engine/types';

interface SimulationContextType {
  processes: ProcessInput[];
  algorithm: Algorithm;
  results: SimulationResponse | null;
  isLoading: boolean;
  error: string | null;
  setProcesses: (processes: ProcessInput[]) => void;
  setAlgorithm: (algorithm: Algorithm) => void;
  runSimulation: () => Promise<void>;
  addProcess: (process: ProcessInput) => void;
  updateProcess: (id: string, process: Partial<ProcessInput>) => void;
  removeProcess: (id: string) => void;
  resetSimulation: () => void;
  // Step-by-step controls
  currentTime: number;
  isPlaying: boolean;
  playbackSpeed: number;
  startPlayback: () => void;
  pausePlayback: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  goToStart: () => void;
  goToEnd: () => void;
  setSpeed: (speed: number) => void;
  getCurrentGantt: () => GanttSlice[];
  renderKey: number;
  forceUpdate: number;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [processes, setProcesses] = useState<ProcessInput[]>([
    { id: 'P1', arrival: 0, burst: 6 },
    { id: 'P2', arrival: 2, burst: 3 },
    { id: 'P3', arrival: 4, burst: 8 },
    { id: 'P4', arrival: 5, burst: 2 }
  ]);
  const [algorithm, setAlgorithm] = useState<Algorithm>('FCFS');
  const [results, setResults] = useState<SimulationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [playbackInterval, setPlaybackInterval] = useState<NodeJS.Timeout | null>(null);

  // Monitor results changes
  useEffect(() => {
    console.log('SimulationContext: Results changed:', !!results, results?.gantt?.length || 0);
    console.log('SimulationContext: Results object:', results);
  }, [results]);

  // Force re-render when results change
  const [renderKey, setRenderKey] = useState(0);
  const [forceUpdate, setForceUpdate] = useState(0);
  
  useEffect(() => {
    console.log('SimulationContext: renderKey useEffect triggered, results:', !!results);
    if (results) {
      console.log('SimulationContext: Updating renderKey and forceUpdate');
      setRenderKey(prev => prev + 1);
      setForceUpdate(prev => prev + 1);
    }
  }, [results]);

  const runSimulation = useCallback(async () => {
    console.log('SimulationContext: runSimulation called');
    setIsLoading(true);
    setError(null);
    
    // Stop any current playback
    if (playbackInterval) {
      clearInterval(playbackInterval);
      setPlaybackInterval(null);
    }
    setIsPlaying(false);
    
    try {
      const request: SimulationRequest = {
        algorithm,
        processes,
        quantum: algorithm === 'ROUND_ROBIN' ? 2 : undefined,
        priorityLowerIsHigher: algorithm.includes('PRIORITY') ? true : undefined,
      };

      const response = await fetch('/api/scheduler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Simulation failed');
      }

      const data: SimulationResponse = await response.json();
      console.log('SimulationContext: Setting results:', data);
      console.log('SimulationContext: Before setResults, current results:', results);
      
      // Use a callback to ensure state update
      setResults(prevResults => {
        console.log('SimulationContext: setResults callback, prevResults:', prevResults, 'newData:', data);
        return data;
      });
      
      setCurrentTime(0); // Reset to start when new simulation runs
      console.log('SimulationContext: Results set, currentTime reset to 0');
      
      // Force immediate re-render
      setForceUpdate(prev => prev + 1);
      
      // Force component re-render with timestamp
      setTimeout(() => {
        setForceUpdate(prev => prev + 1);
      }, 100);
      
      // Force a re-render to ensure state updates
      setTimeout(() => {
        console.log('SimulationContext: State update completed');
      }, 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [algorithm, processes, results, playbackInterval]);

  const addProcess = useCallback((process: ProcessInput) => {
    setProcesses(prev => [...prev, process]);
  }, []);

  const updateProcess = useCallback((id: string, updates: Partial<ProcessInput>) => {
    setProcesses(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const removeProcess = useCallback((id: string) => {
    setProcesses(prev => prev.filter(p => p.id !== id));
  }, []);

  const resetSimulation = useCallback(() => {
    console.log('SimulationContext: resetSimulation called');
    setResults(null);
    setCurrentTime(0);
    setIsPlaying(false);
    setError(null);
    if (playbackInterval) {
      clearInterval(playbackInterval);
      setPlaybackInterval(null);
    }
  }, [playbackInterval]);

  const startPlayback = useCallback(() => {
    if (!results) return;
    console.log('SimulationContext: startPlayback called, currentTime:', currentTime);
    setIsPlaying(true);
  }, [results, currentTime]);

  const pausePlayback = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const stepForward = useCallback(() => {
    if (!results) return;
    const maxTime = Math.max(...results.gantt.map(slice => slice.end));
    console.log('SimulationContext: stepForward called, currentTime:', currentTime, 'maxTime:', maxTime);
    setCurrentTime(prev => {
      const newTime = Math.min(prev + 1, maxTime);
      console.log('SimulationContext: stepForward updating from', prev, 'to', newTime);
      return newTime;
    });
  }, [results, currentTime]);

  const stepBackward = useCallback(() => {
    setCurrentTime(prev => Math.max(prev - 1, 0));
  }, []);

  const goToStart = useCallback(() => {
    setCurrentTime(0);
  }, []);

  const goToEnd = useCallback(() => {
    if (!results) return;
    const maxTime = Math.max(...results.gantt.map(slice => slice.end));
    setCurrentTime(maxTime);
  }, [results]);

  const setSpeed = useCallback((speed: number) => {
    setPlaybackSpeed(speed);
  }, []);

  const getCurrentGantt = useCallback(() => {
    if (!results) return [];
    return results.gantt.filter(slice => slice.start <= currentTime);
  }, [results, currentTime]);

  // Auto-playback effect
  useEffect(() => {
    if (isPlaying && results) {
      const maxTime = Math.max(...results.gantt.map(slice => slice.end));
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= maxTime) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
      setPlaybackInterval(interval);
      return () => clearInterval(interval);
    } else {
      if (playbackInterval) {
        clearInterval(playbackInterval);
        setPlaybackInterval(null);
      }
    }
  }, [isPlaying, playbackSpeed, results]); // Removed playbackInterval from dependencies

  const value: SimulationContextType = {
    processes,
    algorithm,
    results,
    isLoading,
    error,
    setProcesses,
    setAlgorithm,
    runSimulation,
    addProcess,
    updateProcess,
    removeProcess,
    resetSimulation,
    currentTime,
    isPlaying,
    playbackSpeed,
    startPlayback,
    pausePlayback,
    stepForward,
    stepBackward,
    goToStart,
    goToEnd,
    setSpeed,
    getCurrentGantt,
    renderKey,
    forceUpdate,
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
}
