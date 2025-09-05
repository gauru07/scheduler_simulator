"use client";

import React from 'react';
import { Play, Pause, Square, SkipForward, SkipBack } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useSimulation } from '@/contexts/SimulationContext';

export function SimulationControls() {
  const { 
    runSimulation, 
    isLoading, 
    error, 
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
    results
  } = useSimulation();

  const handlePlayPause = () => {
    if (isPlaying) {
      pausePlayback();
    } else {
      startPlayback();
    }
  };

  const handleReset = () => {
    console.log('handleReset clicked');
    resetSimulation();
  };

  const handleStepForward = () => {
    console.log('handleStepForward clicked, results:', !!results);
    stepForward();
  };

  const handleStepBackward = () => {
    console.log('handleStepBackward clicked');
    stepBackward();
  };

  const handleGoToStart = () => {
    console.log('handleGoToStart clicked');
    goToStart();
  };

  const handleGoToEnd = () => {
    console.log('handleGoToEnd clicked');
    goToEnd();
  };

  const handleSetSpeed = (speed: number) => {
    console.log('handleSetSpeed clicked, speed:', speed);
    setSpeed(speed);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Simulation Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">

          {/* Run Simulation Button - Only show when no results */}
          {!results && (
            <div className="mb-4">
              <Button
                variant="primary"
                onClick={runSimulation}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Running Simulation...' : 'Run Simulation'}
              </Button>
            </div>
          )}

          {/* Control Buttons - Only show when results exist */}
          {results && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGoToStart}
                disabled={currentTime === 0}
                title="Go to start"
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleStepBackward}
                disabled={currentTime === 0}
                title="Step backward"
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              
              <Button
                variant="primary"
                size="sm"
                onClick={handlePlayPause}
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleStepForward}
                disabled={currentTime >= (results.gantt?.length || 0) - 1}
                title="Step forward"
              >
                <SkipForward className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleGoToEnd}
                disabled={currentTime >= (results.gantt?.length || 0) - 1}
                title="Go to end"
              >
                <SkipForward className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                title="Reset"
              >
                <Square className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Time Display and Speed Control - Only show when results exist */}
          {results && (
            <>
              <div className="flex items-center justify-between text-sm text-gray-300">
                <span>Current Time: {currentTime}</span>
                <span>Total Steps: {results.gantt?.length || 0}</span>
                <span>Speed: {playbackSpeed}x</span>
              </div>

              {/* Speed Control */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Speed</label>
                <div className="flex space-x-2">
                  {[0.5, 1, 2, 4].map((speedValue) => (
                    <Button
                      key={speedValue}
                      variant={playbackSpeed === speedValue ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => handleSetSpeed(speedValue)}
                    >
                      {speedValue}x
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
