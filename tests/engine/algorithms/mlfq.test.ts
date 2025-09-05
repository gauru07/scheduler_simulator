import { mlfq } from '../../../src/engine/algorithms/mlfq';
import { SimulationRequest } from '../../../src/engine/types';

describe('MLFQ (Multilevel Feedback Queue)', () => {
  test('basic MLFQ with default levels', () => {
    const req: SimulationRequest = {
      algorithm: 'MLFQ',
      processes: [
        { id: 'P1', arrival: 0, burst: 3 },
        { id: 'P2', arrival: 1, burst: 2 },
        { id: 'P3', arrival: 2, burst: 1 },
      ],
    };

    const res = mlfq(req);
    
    // Default levels: [RR(q=1), RR(q=2), FCFS(q=4)]
    // P1 starts at level 0, uses quantum 1, then moves to level 1
    // P2 arrives, gets level 0, uses quantum 1, then moves to level 1
    // P3 arrives, gets level 0, completes in quantum 1
    expect(res.gantt).toEqual([
      { id: 'P1', start: 0, end: 1 },
      { id: 'P2', start: 1, end: 2 },
      { id: 'P3', start: 2, end: 3 },
      { id: 'P1', start: 3, end: 5 },
      { id: 'P2', start: 5, end: 6 },
    ]);

    const byId = new Map(res.perProcess.map(r => [r.id, r]));
    expect(byId.get('P1')!.preemptions).toBe(1); // Preempted once
    expect(byId.get('P2')!.preemptions).toBe(1); // Preempted once
    expect(byId.get('P3')!.preemptions).toBe(0); // Completed in one quantum
  });

  test('custom MLFQ levels', () => {
    const req: SimulationRequest = {
      algorithm: 'MLFQ',
      mlfqLevels: [
        { quantum: 2, algorithm: 'ROUND_ROBIN' },
        { quantum: 4, algorithm: 'FCFS' },
      ],
      processes: [
        { id: 'P1', arrival: 0, burst: 6 },
        { id: 'P2', arrival: 1, burst: 3 },
      ],
    };

    const res = mlfq(req);
    
    // Level 0: RR(q=2), Level 1: FCFS(q=4)
    // P1 starts at level 0, uses quantum 2, then moves to level 1
    // P2 arrives, gets level 0, uses quantum 2, then moves to level 1
    // At level 1, FCFS order: P1 then P2
    expect(res.gantt).toEqual([
      { id: 'P1', start: 0, end: 2 },
      { id: 'P2', start: 2, end: 4 },
      { id: 'P1', start: 4, end: 8 },
      { id: 'P2', start: 8, end: 9 },
    ]);
  });

  test('aging/boost mechanism', () => {
    const req: SimulationRequest = {
      algorithm: 'MLFQ',
      boostInterval: 5,
      processes: [
        { id: 'P1', arrival: 0, burst: 8 },
        { id: 'P2', arrival: 1, burst: 2 },
      ],
    };

    const res = mlfq(req);
    
    // P1 starts at level 0, uses quantum 1, moves to level 1
    // P2 arrives, gets level 0, completes in quantum 1
    // P1 continues at level 1, then gets boosted back to level 0 at t=5
    expect(res.gantt).toEqual([
      { id: 'P1', start: 0, end: 1 },
      { id: 'P2', start: 1, end: 2 },
      { id: 'P1', start: 2, end: 4 },
      { id: 'P2', start: 4, end: 5 },
      { id: 'P1', start: 5, end: 10 },
    ]);
  });

  test('process completion before quantum expires', () => {
    const req: SimulationRequest = {
      algorithm: 'MLFQ',
      mlfqLevels: [
        { quantum: 3, algorithm: 'ROUND_ROBIN' },
        { quantum: 5, algorithm: 'FCFS' },
      ],
      processes: [
        { id: 'P1', arrival: 0, burst: 2 }, // Completes before quantum 3
        { id: 'P2', arrival: 1, burst: 4 }, // Uses full quantum 3, moves to level 1
      ],
    };

    const res = mlfq(req);
    
    // P1 completes in 2 time units (less than quantum 3), stays at level 0
    // P2 uses full quantum 3, moves to level 1, completes in 1 more time unit
    expect(res.gantt).toEqual([
      { id: 'P1', start: 0, end: 2 },
      { id: 'P2', start: 2, end: 6 },
    ]);

    const byId = new Map(res.perProcess.map(r => [r.id, r]));
    expect(byId.get('P1')!.preemptions).toBe(0); // Completed before quantum
    expect(byId.get('P2')!.preemptions).toBe(1); // Preempted once
  });

  test('idle time handling', () => {
    const req: SimulationRequest = {
      algorithm: 'MLFQ',
      processes: [
        { id: 'P1', arrival: 0, burst: 2 },
        { id: 'P2', arrival: 5, burst: 1 },
      ],
    };

    const res = mlfq(req);
    
    // P1 completes at t=2, then idle until P2 arrives at t=5
    expect(res.gantt).toEqual([
      { id: 'P1', start: 0, end: 2 },
      { id: 'P2', start: 5, end: 6 },
    ]);
  });

  test('multiple processes at different levels', () => {
    const req: SimulationRequest = {
      algorithm: 'MLFQ',
      mlfqLevels: [
        { quantum: 1, algorithm: 'ROUND_ROBIN' },
        { quantum: 2, algorithm: 'ROUND_ROBIN' },
        { quantum: 3, algorithm: 'FCFS' },
      ],
      processes: [
        { id: 'P1', arrival: 0, burst: 5 }, // Will move through all levels
        { id: 'P2', arrival: 1, burst: 2 }, // Will move to level 1
        { id: 'P3', arrival: 2, burst: 1 }, // Will complete at level 0
      ],
    };

    const res = mlfq(req);
    
    // Complex scheduling with multiple levels
    // P1: level 0 (0-1), level 1 (1-3), level 2 (3-6)
    // P2: level 0 (1-2), level 1 (2-4)
    // P3: level 0 (2-3)
    expect(res.gantt).toEqual([
      { id: 'P1', start: 0, end: 1 },
      { id: 'P2', start: 1, end: 2 },
      { id: 'P3', start: 2, end: 3 },
      { id: 'P1', start: 3, end: 5 },
      { id: 'P2', start: 5, end: 6 },
      { id: 'P1', start: 6, end: 8 },
    ]);
  });

  test('response time calculation', () => {
    const req: SimulationRequest = {
      algorithm: 'MLFQ',
      processes: [
        { id: 'P1', arrival: 0, burst: 3 },
        { id: 'P2', arrival: 1, burst: 1 },
      ],
    };

    const res = mlfq(req);
    const byId = new Map(res.perProcess.map(r => [r.id, r]));
    
    expect(byId.get('P1')!.responseTime).toBe(0); // Starts immediately
    expect(byId.get('P2')!.responseTime).toBe(0); // Starts immediately after P1's quantum
  });

  test('metrics calculation', () => {
    const req: SimulationRequest = {
      algorithm: 'MLFQ',
      processes: [
        { id: 'P1', arrival: 0, burst: 4 },
        { id: 'P2', arrival: 1, burst: 2 },
      ],
    };

    const res = mlfq(req);
    
    expect(res.metrics.makespan).toBeGreaterThan(0);
    expect(res.metrics.throughput).toBeGreaterThan(0);
    expect(res.metrics.avgWaitingTime).toBeGreaterThanOrEqual(0);
    expect(res.metrics.avgTurnaroundTime).toBeGreaterThanOrEqual(0);
    expect(res.metrics.avgResponseTime).toBeGreaterThanOrEqual(0);
  });
});
