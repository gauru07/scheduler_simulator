import { GanttSlice, ProcessInput, ProcessResult, SimulationRequest, SimulationResponse } from '../types';
import { CircularQueue } from '../datastructures/circularQueue';
import { finalize } from '../finalize';

interface RBNode {
  process: ProcessInput;
  remaining: number;
  started: boolean;
}

export function roundRobin(req: SimulationRequest): SimulationResponse {
  const quantum = req.quantum ?? 1;
  if (quantum <= 0) {
    throw new Error('Quantum must be a positive integer.');
  }

  const arrivals = [...req.processes].sort((a, b) => a.arrival - b.arrival);
  const queue = new CircularQueue<RBNode>(arrivals.length);

  const results = new Map<string, ProcessResult>();
  for (const p of req.processes) {
    results.set(p.id, {
      id: p.id,
      arrival: p.arrival,
      burst: p.burst,
      startTime: -1,
      completionTime: 0,
      turnaroundTime: 0,
      waitingTime: 0,
      responseTime: 0,
      preemptions: 0,
    });
  }

  let t = 0;
  let i = 0;
  const gantt: GanttSlice[] = [];

  const admitArrivals = (currentTime: number) => {
    while (i < arrivals.length && arrivals[i].arrival <= currentTime) {
      queue.enqueue({
        process: arrivals[i],
        remaining: arrivals[i].burst,
        started: false,
      });
      i++;
    }
  };

  while (!queue.isEmpty() || i < arrivals.length) {
    // Admit any new arrivals at the current time
    admitArrivals(t);
    
    // If queue is empty, jump to next arrival
    if (queue.isEmpty()) {
      t = arrivals[i].arrival;
      continue;
    }

    const cur = queue.dequeue()!;
    const res = results.get(cur.process.id)!;

    if (!cur.started) {
      cur.started = true;
      res.startTime = t;
      res.responseTime = t - cur.process.arrival;
    }

    const runTime = Math.min(quantum, cur.remaining);
    const start = t;
    const end = start + runTime;

    gantt.push({ id: cur.process.id, start, end });

    cur.remaining -= runTime;
    t = end;

    // Admit new arrivals that came during this execution
    admitArrivals(t);

    if (cur.remaining > 0) {
      // Process still has work to do, re-queue it
      queue.enqueue(cur);
      res.preemptions++;
    } else {
      // Process completed
      res.completionTime = t;
      res.turnaroundTime = res.completionTime - res.arrival;
      res.waitingTime = res.turnaroundTime - res.burst;
    }
  }

  return finalize(gantt, Array.from(results.values()));
}