"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { getProcessColorByID } from '@/utils/colors';
import { useSimulation } from '@/contexts/SimulationContext';

export function GanttChart() {
  const { results, currentTime } = useSimulation();
  
  const gantt = results?.gantt || [];
  const maxTime = gantt.length > 0 ? Math.max(...gantt.map(slice => slice.end)) : 0;
  const timeScale = 30; // pixels per time unit (reduced to fit more time units)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gantt Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">

          {/* Timeline */}
          {gantt.length > 0 && (
            <div className="flex items-center space-x-2">
              <div className="w-16 text-sm font-medium text-gray-600">Time</div>
              <div className="flex-1 relative">
                <div className="overflow-x-auto">
                  <div className="flex bg-gray-800 rounded-lg p-2" style={{ minWidth: `${(maxTime + 1) * timeScale}px` }}>
                    {Array.from({ length: maxTime + 1 }, (_, i) => (
                      <div 
                        key={i} 
                        className={`flex-shrink-0 flex items-center justify-center text-xs font-medium border-r border-gray-700 ${
                          i === currentTime ? 'bg-cyan-500 text-white' : 'text-gray-300'
                        }`}
                        style={{ width: `${timeScale}px`, height: '30px' }}
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Process Rows */}
          {gantt.length > 0 && (
            <div className="space-y-2">
              {/* Get unique process IDs */}
              {Array.from(new Set(gantt.map(slice => slice.id))).map(processId => (
                <div key={processId} className="flex items-center space-x-2">
                  <div className="w-16 text-sm font-medium text-gray-300">{processId}</div>
                  <div className="flex-1 relative">
                    <div className="overflow-x-auto">
                      <div className="relative bg-gray-800 rounded-lg" style={{ minWidth: `${(maxTime + 1) * timeScale}px`, height: '40px' }}>
                        {/* Current time indicator */}
                        <div 
                          className="absolute top-0 bottom-0 bg-cyan-500 opacity-30 z-10"
                          style={{ 
                            left: `${currentTime * timeScale}px`, 
                            width: `${timeScale}px`
                          }}
                        />
                        
                        {/* Process execution blocks */}
                        {gantt
                          .filter(slice => slice.id === processId && slice.start < currentTime + 1)
                          .map((slice, index) => (
                            <div
                              key={index}
                              className={`absolute top-1 bottom-1 rounded flex items-center justify-center text-xs font-bold text-white shadow-lg ${
                                slice.start <= currentTime ? 'opacity-100' : 'opacity-50'
                              }`}
                              style={{
                                left: `${slice.start * timeScale}px`,
                                width: `${Math.min(slice.end, currentTime + 1) * timeScale - slice.start * timeScale}px`,
                                backgroundColor: getProcessColorByID(slice.id),
                                minWidth: '20px'
                              }}
                            >
                              {slice.id}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Legend */}
          {gantt.length > 0 && (
            <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-700">
              {Array.from(new Set(gantt.map(slice => slice.id))).map(processId => (
                <div key={processId} className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: getProcessColorByID(processId) }}
                  />
                  <span className="text-sm text-gray-300">{processId}</span>
                </div>
              ))}
            </div>
          )}

          {/* No Data Message */}
          {gantt.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <div className="text-6xl mb-4">📊</div>
              <div className="text-lg font-medium mb-2">No simulation results yet</div>
              <div className="text-sm">Run a simulation to see the Gantt chart</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
