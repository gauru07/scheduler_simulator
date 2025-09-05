import { GanttSlice, ProcessInput, ProcessResult, SimulationRequest, SimulationResponse } from '../types';
import { MinHeap } from '../datastructures/minHeap';
import { finalize } from '../finalize';

interface SRTFNode {
  process: ProcessInput;
  remaining: number;
  hasStarted: boolean;
}

/**
 * Shortest Remaining Time First (SRTF) - Preemptive version of SJF
 * Always schedules the process with the shortest remaining burst time
 */
export function srtf(req: SimulationRequest): SimulationResponse {
  const arrivals = [...req.processes].sort((a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id));
  const ready = new MinHeap<SRTFNode>((a, b) => {
    // Shortest remaining time first; tie-break by arrival then id for determinism
    if (a.remaining !== b.remaining) return a.remaining - b.remaining;
    if (a.process.arrival !== b.process.arrival) return a.process.arrival - b.process.arrival;
    return a.process.id.localeCompare(b.process.id);
  });

  let t = 0;
  let i = 0;
  const gantt: GanttSlice[] = [];
  const results = new Map<string, ProcessResult>();

  // Initialize results for all processes
  for (const p of req.processes) {
    results.set(p.id, {
      id: p.id,
      arrival: p.arrival,
      burst: p.burst,
      priority: p.priority,
      startTime: -1,
      completionTime: 0,
      turnaroundTime: 0,
      waitingTime: 0,
      responseTime: 0,
      preemptions: 0,
    });
  }

  // Helper: admit all arrivals at or before current time t
  const admitArrivals = () => {
    while (i < arrivals.length && arrivals[i].arrival <= t) {
      ready.push({
        process: arrivals[i],
        remaining: arrivals[i].burst,
        hasStarted: false
      });
      i++;
    }
  };

  while (i < arrivals.length || !ready.empty()) {
    // If no ready process, jump to next arrival
    if (ready.empty() && i < arrivals.length) {
      t = arrivals[i].arrival;
      admitArrivals();
      if (ready.empty()) continue;
    }

    admitArrivals();

    // Pick the process with shortest remaining time
    const cur = ready.pop()!;
    const res = results.get(cur.process.id)!;

    if (!cur.hasStarted) {
      cur.hasStarted = true;
      res.startTime = t;
      res.responseTime = t - cur.process.arrival;
    } else {
      res.preemptions++;
    }

    // Decide next event: either current finishes or someone new arrives
    const nextArrival = i < arrivals.length ? arrivals[i].arrival : Infinity;
    const runUntil = Math.min(t + cur.remaining, nextArrival);

    const duration = runUntil - t;
    if (duration > 0) {
      gantt.push({
        id: cur.process.id,
        start: t,
        end: runUntil,
      });
      cur.remaining -= duration;
      t = runUntil;
    }

    // Admit new arrivals that came during this execution
    admitArrivals();

    if (cur.remaining <= 0) {
      // Process completed
      res.completionTime = t;
      res.turnaroundTime = res.completionTime - res.arrival;
      res.waitingTime = res.turnaroundTime - res.burst;
    } else {
      // Process preempted, re-queue it
      ready.push(cur);
    }
  }

  return finalize(gantt, Array.from(results.values()));
}

