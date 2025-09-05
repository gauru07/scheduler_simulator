import { GanttSlice, ProcessInput, ProcessResult, SimulationRequest, SimulationResponse, MLFQLevel } from '../types';
import { MinHeap } from '../datastructures/minHeap';
import { CircularQueue } from '../datastructures/circularQueue';
import { finalize } from '../finalize';

interface MLFQNode {
  process: ProcessInput;
  remaining: number;
  currentLevel: number;
  timeInCurrentLevel: number;
  hasStarted: boolean;
  lastBoostTime: number;
}

/**
 * Multilevel Feedback Queue (MLFQ) Scheduling
 * Multiple priority levels with different algorithms and quantum sizes
 * Processes start at highest priority and move down if they use full quantum
 * Aging: processes can be boosted back to higher priority levels
 */
export function mlfq(req: SimulationRequest): SimulationResponse {
  // Default MLFQ configuration if not provided
  const levels: MLFQLevel[] = req.mlfqLevels || [
    { quantum: 1, algorithm: 'ROUND_ROBIN' },   // Level 0: Highest priority
    { quantum: 2, algorithm: 'ROUND_ROBIN' },   // Level 1: Medium priority  
    { quantum: 4, algorithm: 'FCFS' },          // Level 2: Lowest priority
  ];
  
  const boostInterval = req.boostInterval || 10; // Boost every 10 time units

  const arrivals = [...req.processes].sort((a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id));
  
  // Create queues for each level
  const queues: (MinHeap<MLFQNode> | CircularQueue<MLFQNode>)[] = [];
  for (let i = 0; i < levels.length; i++) {
    if (levels[i].algorithm === 'FCFS') {
      // For FCFS, we'll use a simple array-based approach
      queues.push(new MinHeap<MLFQNode>((a, b) => a.process.arrival - b.process.arrival));
    } else {
      // For Round Robin, use circular queue
      queues.push(new CircularQueue<MLFQNode>(req.processes.length));
    }
  }

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
      const node: MLFQNode = {
        process: arrivals[i],
        remaining: arrivals[i].burst,
        currentLevel: 0, // Start at highest priority
        timeInCurrentLevel: 0,
        hasStarted: false,
        lastBoostTime: t
      };
      
      if (levels[0].algorithm === 'FCFS') {
        (queues[0] as MinHeap<MLFQNode>).push(node);
      } else {
        (queues[0] as CircularQueue<MLFQNode>).enqueue(node);
      }
      i++;
    }
  };

  // Helper: boost all processes to highest priority
  const boostProcesses = () => {
    for (let level = 1; level < queues.length; level++) {
      const queue = queues[level];
      const processesToBoost: MLFQNode[] = [];
      
      // Collect all processes from this level
      if (levels[level].algorithm === 'FCFS') {
        const heap = queue as MinHeap<MLFQNode>;
        while (!heap.empty()) {
          const node = heap.pop();
          if (node) processesToBoost.push(node);
        }
      } else {
        const circularQueue = queue as CircularQueue<MLFQNode>;
        while (!circularQueue.isEmpty()) {
          const node = circularQueue.dequeue();
          if (node) processesToBoost.push(node);
        }
      }
      
      // Move them to highest priority level
      for (const node of processesToBoost) {
        node.currentLevel = 0;
        node.timeInCurrentLevel = 0;
        node.lastBoostTime = t;
        
        if (levels[0].algorithm === 'FCFS') {
          (queues[0] as MinHeap<MLFQNode>).push(node);
        } else {
          (queues[0] as CircularQueue<MLFQNode>).enqueue(node);
        }
      }
    }
  };

  // Helper: find highest priority non-empty queue
  const findNextProcess = (): MLFQNode | null => {
    for (let level = 0; level < queues.length; level++) {
      const queue = queues[level];
      let node: MLFQNode | null = null;
      
      if (levels[level].algorithm === 'FCFS') {
        const heap = queue as MinHeap<MLFQNode>;
        if (!heap.empty()) {
          node = heap.pop()!;
        }
      } else {
        const circularQueue = queue as CircularQueue<MLFQNode>;
        if (!circularQueue.isEmpty()) {
          node = circularQueue.dequeue()!;
        }
      }
      
      if (node) return node;
    }
    return null;
  };

  while (i < arrivals.length || queues.some(q => 
    levels[queues.indexOf(q)].algorithm === 'FCFS' 
      ? !(q as MinHeap<MLFQNode>).empty()
      : !(q as CircularQueue<MLFQNode>).isEmpty()
  )) {
    // Check for boost
    if (t > 0 && t % boostInterval === 0) {
      boostProcesses();
    }

    // Admit new arrivals
    admitArrivals();
    
    // If no ready process, jump to next arrival
    const nextProcess = findNextProcess();
    if (!nextProcess && i < arrivals.length) {
      t = arrivals[i].arrival;
      continue;
    }
    
    if (!nextProcess) break;

    const cur = nextProcess;
    const res = results.get(cur.process.id)!;
    const level = cur.currentLevel;
    const quantum = levels[level].quantum;

    if (!cur.hasStarted) {
      cur.hasStarted = true;
      res.startTime = t;
      res.responseTime = t - cur.process.arrival;
    } else {
      res.preemptions++;
    }

    // Calculate run time based on quantum and remaining time
    const runTime = Math.min(quantum, cur.remaining);
    const start = t;
    const end = start + runTime;

    gantt.push({ id: cur.process.id, start, end });

    cur.remaining -= runTime;
    cur.timeInCurrentLevel += runTime;
    t = end;

    // Admit new arrivals that came during this execution
    admitArrivals();

    if (cur.remaining <= 0) {
      // Process completed
      res.completionTime = t;
      res.turnaroundTime = res.completionTime - res.arrival;
      res.waitingTime = res.turnaroundTime - res.burst;
    } else {
      // Process needs to be re-queued
      if (runTime >= quantum && level < levels.length - 1) {
        // Used full quantum, demote to next level
        cur.currentLevel = level + 1;
        cur.timeInCurrentLevel = 0;
      }
      
      // Re-queue at current level
      const targetQueue = queues[cur.currentLevel];
      if (levels[cur.currentLevel].algorithm === 'FCFS') {
        (targetQueue as MinHeap<MLFQNode>).push(cur);
      } else {
        (targetQueue as CircularQueue<MLFQNode>).enqueue(cur);
      }
    }
  }

  return finalize(gantt, Array.from(results.values()));
}

