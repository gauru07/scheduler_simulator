import { GanttSlice, ProcessInput, ProcessResult, SimulationRequest, SimulationResponse } from '../types';
import { MinHeap } from '../datastructures/minHeap';
import { finalize } from '../finalize';

export function sjf(req: SimulationRequest): SimulationResponse {
  const arrivals = [...req.processes].sort((a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id));
  const ready = new MinHeap<ProcessInput>((x, y) => {
    // shortest burst first; tie-break by arrival then id for determinism
    if (x.burst !== y.burst) return x.burst - y.burst;
    if (x.arrival !== y.arrival) return x.arrival - y.arrival;
    return x.id.localeCompare(y.id);
  });

  let t = 0;
  let i = 0;
  const gantt: GanttSlice[] = [];
  const results: ProcessResult[] = [];

  while (i < arrivals.length || !ready.empty()) {
    // If nothing is ready, jump to next arrival
    if (ready.empty() && t < (arrivals[i]?.arrival ?? Infinity)) {
      t = arrivals[i].arrival;
    }

    // Admit all processes that have arrived by time t
    while (i < arrivals.length && arrivals[i].arrival <= t) {
      ready.push(arrivals[i++]);
    }

    const p = ready.pop();
    if (!p) continue; // defensive

    const start = t;
    const end = start + p.burst;

    gantt.push({ id: p.id, start, end });

    const turnaround = end - p.arrival;
    const waiting = turnaround - p.burst;
    const response = start - p.arrival;

    results.push({
      id: p.id,
      arrival: p.arrival,
      burst: p.burst,
      priority: p.priority,
      startTime: start,
      completionTime: end,
      turnaroundTime: turnaround,
      waitingTime: waiting,
      responseTime: response,
      preemptions: 0,
    });

    t = end;
  }

  return finalize(gantt, results);
}
