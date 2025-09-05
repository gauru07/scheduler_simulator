"use client";

import { useState, useCallback, useEffect } from 'react';
import { ProcessInput, Algorithm, SimulationRequest, SimulationResponse } from '@/engine/types';

export function useSimulation() {
  const [processes, setProcesses] = useState<ProcessInput[]>([
    { id: 'P1', arrival: 0, burst: 6 },
    { id: 'P2', arrival: 2, burst: 3 },
    { id: 'P3', arrival: 4, burst: 8 },
    { id: 'P4', arrival: 5, burst: 2 },
  ]);
  
  const [algorithm, setAlgorithm] = useState<Algorithm>('FCFS');
  const [results, setResults] = useState<SimulationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Step-by-step simulation state
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [playbackInterval, setPlaybackInterval] = useState<NodeJS.Timeout | null>(null);

  // Monitor results changes
  useEffect(() => {
    console.log('useSimulation: Results changed:', !!results, results?.gantt?.length || 0);
    console.log('useSimulation: Results object:', results);
  }, [results]);

  // Force re-render when results change
  const [renderKey, setRenderKey] = useState(0);
  const [forceUpdate, setForceUpdate] = useState(0);
  
  useEffect(() => {
    console.log('useSimulation: renderKey useEffect triggered, results:', !!results);
    if (results) {
      console.log('useSimulation: Updating renderKey and forceUpdate');
      setRenderKey(prev => prev + 1);
      setForceUpdate(prev => prev + 1);
    }
  }, [results]); // Removed renderKey from dependencies to prevent infinite loop

  const runSimulation = useCallback(async () => {
    console.log('useSimulation: runSimulation called');
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
      console.log('runSimulation: Setting results:', data);
      console.log('runSimulation: Before setResults, current results:', results);
      
      // Use a callback to ensure state update
      setResults(prevResults => {
        console.log('runSimulation: setResults callback, prevResults:', prevResults, 'newData:', data);
        return data;
      });
      
      setCurrentTime(0); // Reset to start when new simulation runs
      console.log('runSimulation: Results set, currentTime reset to 0');
      
      // Force immediate re-render
      setForceUpdate(prev => prev + 1);
      
      // Force component re-render with timestamp
      setTimeout(() => {
        setForceUpdate(prev => prev + 1);
      }, 100);
      
      // Force a re-render to ensure state updates
      setTimeout(() => {
        console.log('runSimulation: State update completed');
      }, 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [algorithm, processes, playbackInterval]);

  const addProcess = useCallback((process: ProcessInput) => {
    setProcesses(prev => [...prev, process]);
  }, []);

  const updateProcess = useCallback((index: number, process: ProcessInput) => {
    setProcesses(prev => prev.map((p, i) => i === index ? process : p));
  }, []);

  const removeProcess = useCallback((index: number) => {
    setProcesses(prev => prev.filter((_, i) => i !== index));
  }, []);

  const resetSimulation = useCallback(() => {
    setResults(null);
    setError(null);
    setCurrentTime(0);
    setIsPlaying(false);
    if (playbackInterval) {
      clearInterval(playbackInterval);
      setPlaybackInterval(null);
    }
  }, [playbackInterval]);

  // Step-by-step simulation functions
  const startPlayback = useCallback(() => {
    if (!results) return;
    
    setIsPlaying(true);
    const maxTime = Math.max(...results.gantt.map(slice => slice.end));
    
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= maxTime) {
          setIsPlaying(false);
          clearInterval(interval);
          setPlaybackInterval(null);
          return maxTime;
        }
        return prev + 1;
      });
    }, 1000 / playbackSpeed);
    
    setPlaybackInterval(interval);
  }, [results, playbackSpeed]);

  const pausePlayback = useCallback(() => {
    setIsPlaying(false);
    if (playbackInterval) {
      clearInterval(playbackInterval);
      setPlaybackInterval(null);
    }
  }, [playbackInterval]);

  const stepForward = useCallback(() => {
    console.log('stepForward called, results:', !!results);
    if (!results) return;
    const maxTime = Math.max(...results.gantt.map(slice => slice.end));
    setCurrentTime(prev => {
      const newTime = Math.min(prev + 1, maxTime);
      console.log('stepForward: prev=', prev, 'newTime=', newTime, 'maxTime=', maxTime);
      return newTime;
    });
  }, [results]);

  const stepBackward = useCallback(() => {
    console.log('stepBackward called');
    setCurrentTime(prev => {
      const newTime = Math.max(prev - 1, 0);
      console.log('stepBackward: prev=', prev, 'newTime=', newTime);
      return newTime;
    });
  }, []);

  const goToStart = useCallback(() => {
    setCurrentTime(0);
    pausePlayback();
  }, [pausePlayback]);

  const goToEnd = useCallback(() => {
    if (!results) return;
    const maxTime = Math.max(...results.gantt.map(slice => slice.end));
    setCurrentTime(maxTime);
    pausePlayback();
  }, [results, pausePlayback]);

  const setSpeed = useCallback((speed: number) => {
    setPlaybackSpeed(speed);
    if (isPlaying) {
      pausePlayback();
      // Restart with new speed
      setTimeout(() => {
        startPlayback();
      }, 100);
    }
  }, [isPlaying, pausePlayback, startPlayback]);

  // Get current visible gantt based on current time
  const getCurrentGantt = useCallback(() => {
    if (!results) return [];
    return results.gantt.filter(slice => slice.start <= currentTime);
  }, [results, currentTime]);

  return {
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
    // Step-by-step controls
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
}

