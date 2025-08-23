import { sjf } from '../../../src/engine/algorithms/sjf';
import { SimulationRequest } from '../../../src/engine/types';

describe('SJF (Non-Preemptive)', () => {
  test('basic case with staggered arrivals', () => {
    const req: SimulationRequest = {
      algorithm: 'SJF_NON_PREEMPTIVE',
      processes: [
        { id: 'P1', arrival: 0, burst: 7 },
        { id: 'P2', arrival: 2, burst: 4 },
        { id: 'P3', arrival: 4, burst: 1 },
      ],
    };

    const res = sjf(req);
    // After P1 starts at 0, at t=2 P2 arrives, at t=4 P3 arrives.
    // When P1 completes at 7, choose shortest among ready (P2:4, P3:1) -> P3 first.
    expect(res.gantt).toEqual([
      { id: 'P1', start: 0, end: 7 },
      { id: 'P3', start: 7, end: 8 },
      { id: 'P2', start: 8, end: 12 },
    ]);

    const byId = new Map(res.perProcess.map(r => [r.id, r]));
    expect(byId.get('P1')!.waitingTime).toBe(0);
    expect(byId.get('P3')!.waitingTime).toBe(7 - 4);
    expect(byId.get('P2')!.waitingTime).toBe(8 - 2);

    expect(res.metrics.makespan).toBe(12);
  });

  test('tie-breaking: same burst uses arrival then id', () => {
    const req: SimulationRequest = {
      algorithm: 'SJF_NON_PREEMPTIVE',
      processes: [
        { id: 'P2', arrival: 0, burst: 3 },
        { id: 'P1', arrival: 0, burst: 3 },
        { id: 'P3', arrival: 0, burst: 3 },
      ],
    };

    const res = sjf(req);
    // All same burst and arrival -> order by id: P1, P2, P3 (since at t=0, we sort, but we also push all; comparator breaks ties by id)
    expect(res.gantt).toEqual([
      { id: 'P1', start: 0, end: 3 },
      { id: 'P2', start: 3, end: 6 },
      { id: 'P3', start: 6, end: 9 },
    ]);

    const byId = new Map(res.perProcess.map(r => [r.id, r]));
    expect(byId.get('P1')!.waitingTime).toBe(0);
    expect(byId.get('P2')!.waitingTime).toBe(3);
    expect(byId.get('P3')!.waitingTime).toBe(6);
  });

  test('idle gap: jump to next arrival when no ready process', () => {
    const req: SimulationRequest = {
      algorithm: 'SJF_NON_PREEMPTIVE',
      processes: [
        { id: 'A', arrival: 5, burst: 2 },
        { id: 'B', arrival: 10, burst: 1 },
      ],
    };

    const res = sjf(req);
    expect(res.gantt).toEqual([
      { id: 'A', start: 5, end: 7 },
      { id: 'B', start: 10, end: 11 },
    ]);
  });
});
