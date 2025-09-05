"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useSimulation } from '@/contexts/SimulationContext';
import { Clock, Timer, TrendingUp, BarChart3 } from 'lucide-react';

export function MetricsDisplay() {
  const { results } = useSimulation();

  if (!results) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Run a simulation to see performance metrics.
          </div>
        </CardContent>
      </Card>
    );
  }

  const { metrics, perProcess } = results;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Avg Waiting Time</p>
                <p className="text-lg font-semibold text-gray-900">
                  {metrics.avgWaitingTime.toFixed(2)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <Timer className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Avg Turnaround Time</p>
                <p className="text-lg font-semibold text-gray-900">
                  {metrics.avgTurnaroundTime.toFixed(2)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Throughput</p>
                <p className="text-lg font-semibold text-gray-900">
                  {metrics.throughput.toFixed(3)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
              <BarChart3 className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Makespan</p>
                <p className="text-lg font-semibold text-gray-900">
                  {metrics.makespan}
                </p>
              </div>
            </div>
          </div>

          {/* Per-Process Details */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Process Details</h4>
            <div className="space-y-2">
              {perProcess.map((process) => (
                <div key={process.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {process.id}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{process.id}</p>
                      <p className="text-xs text-gray-600">
                        Arrival: {process.arrival}, Burst: {process.burst}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">
                      WT: {process.waitingTime} | TT: {process.turnaroundTime}
                    </p>
                    <p className="text-xs text-gray-600">
                      RT: {process.responseTime} | Preemptions: {process.preemptions}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

