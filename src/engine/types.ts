export type Algorithm =
  | 'FCFS'
  | 'SJF_NON_PREEMPTIVE'
  | 'SRTF_PREEMPTIVE'
  | 'PRIORITY_NON_PREEMPTIVE'
  | 'PRIORITY_PREEMPTIVE'
  | 'ROUND_ROBIN';

export interface ProcessInput {
  id: string;
  arrival: number;
  burst: number;
  priority?: number;
}

export interface SimulationRequest {
  algorithm: Algorithm;
  processes: ProcessInput[];
  quantum?: number;
  contextSwitchCost?: number;
  priorityLowerIsHigher?: boolean;
}

export interface GanttSlice {
  id: string;
  start: number; // inclusive
  end: number;   // exclusive
}

export interface ProcessResult {
  id: string;
  arrival: number;
  burst: number;
  priority?: number;
  startTime: number;
  completionTime: number;
  turnaroundTime: number;
  waitingTime: number;
  responseTime: number;
  preemptions: number;
}

export interface Metrics {
  avgWaitingTime: number;
  avgTurnaroundTime: number;
  avgResponseTime: number;
  throughput: number;
  makespan: number;
  cpuUtilization: number;
}

export interface SimulationResponse {
  gantt: GanttSlice[];
  perProcess: ProcessResult[];
  metrics: Metrics;
  timeline: number[];
}
