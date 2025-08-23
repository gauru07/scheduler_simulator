import { GanttSlice, ProcessInput, ProcessResult, SimulationRequest, SimulationResponse } from '../types';
import { finalize } from '../finalize';

export function fcfs(req: SimulationRequest): SimulationResponse {
  const procs = [...req.processes].sort((a, b) => a.arrival - b.arrival);
  let time = 0;
  const gantt: GanttSlice[] = [];
  const results: ProcessResult[] = [];

  for (const p of procs) {
    if (time < p.arrival) {
      time = p.arrival; // idle jump
    }
    const start = time;
    const end = start + p.burst;

    gantt.push({ id: p.id, start, end });

    const turnaroundTime = end - p.arrival;
    const waitingTime = turnaroundTime - p.burst;
    const responseTime = start - p.arrival;

    results.push({
      id: p.id,
      arrival: p.arrival,
      burst: p.burst,
      priority: p.priority,
      startTime: start,
      completionTime: end,
      turnaroundTime,
      waitingTime,
      responseTime,
      preemptions: 0,
    });

    time = end;
  }

  return finalize(gantt, results);
}
