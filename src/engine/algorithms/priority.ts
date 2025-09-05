import { GanttSlice, ProcessInput, ProcessResult, SimulationRequest, SimulationResponse } from '../types';
import { MinHeap } from '../datastructures/minHeap';
import { finalize } from '../finalize';

interface Node {
  process: ProcessInput;
  remaining: number;
  hasStarted: boolean;
}

/** Non-preemptive Priority Scheduling (unchanged) */
export function priorityNon(req: SimulationRequest): SimulationResponse {
  const arrivals = [...req.processes].sort((a, b) => a.arrival - b.arrival);
  const pLowerFirst = req.priorityLowerIsHigher !== false;
  const ready = new MinHeap<ProcessInput>((a, b) => {
    const pa = a.priority ?? 0, pb = b.priority ?? 0;
    if (pa !== pb) return pLowerFirst ? pa - pb : pb - pa;
    if (a.arrival !== b.arrival) return a.arrival - b.arrival;
    return a.id.localeCompare(b.id);
  });

  let t = 0, i = 0;
  const gantt: GanttSlice[] = [], results: ProcessResult[] = [];

  while (i < arrivals.length || !ready.empty()) {
    if (ready.empty() && t < (arrivals[i]?.arrival ?? Infinity)) t = arrivals[i].arrival;
    while (i < arrivals.length && arrivals[i].arrival <= t) ready.push(arrivals[i++]);
    const p = ready.pop();
    if (!p) continue;
    const start = t, end = start + p.burst;
    gantt.push({ id: p.id, start, end });
    results.push({
      id: p.id,
      arrival: p.arrival,
      burst: p.burst,
      priority: p.priority,
      startTime: start,
      completionTime: end,
      turnaroundTime: end - p.arrival,
      waitingTime: end - p.arrival - p.burst,
      responseTime: start - p.arrival,
      preemptions: 0,
    });
    t = end;
  }
  return finalize(gantt, results);
}

/** Preemptive Priority Scheduling (full event-driven fix) */
export function priorityPre(req: SimulationRequest): SimulationResponse {
  const arrivals = [...req.processes].sort((a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id));
  const pLowerFirst = req.priorityLowerIsHigher !== false;
  const ready = new MinHeap<Node>((a, b) => {
    const pa = a.process.priority ?? 0, pb = b.process.priority ?? 0;
    if (pa !== pb) return pLowerFirst ? pa - pb : pb - pa;
    if (a.process.arrival !== b.process.arrival) return a.process.arrival - b.process.arrival;
    return a.process.id.localeCompare(b.process.id);
  });

  let t = 0, i = 0;
  const gantt: GanttSlice[] = [];
  const results = new Map<string, ProcessResult>();
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

    // Pick the highest priority ready process
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

    // Edge: If a process arrives at this instant, make sure to admit first
    // This branch may never hit due to admitArrivals earlier

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

    admitArrivals();

    if (cur.remaining <= 0) {
      res.completionTime = t;
      res.turnaroundTime = res.completionTime - res.arrival;
      res.waitingTime = res.turnaroundTime - res.burst;
    } else {
      ready.push(cur);
    }
  }

  return finalize(gantt, Array.from(results.values()));
}
