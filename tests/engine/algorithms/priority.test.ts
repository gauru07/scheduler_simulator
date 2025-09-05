import { priorityNon, priorityPre } from '../../../src/engine/algorithms/priority';
import { SimulationRequest } from '../../../src/engine/types';

describe('Priority Scheduling', () => {
  test('non-preemptive, classic example', () => {
    const req: SimulationRequest = {
      algorithm: 'PRIORITY_NON_PREEMPTIVE',
      processes: [
        { id: 'P1', arrival: 0, burst: 5, priority: 2 },
        { id: 'P2', arrival: 1, burst: 3, priority: 1 },
        { id: 'P3', arrival: 2, burst: 4, priority: 3 },
      ],
    };
    const res = priorityNon(req);
    expect(res.gantt).toEqual([
      { id: 'P1', start: 0, end: 5 },
      { id: 'P2', start: 5, end: 8 },
      { id: 'P3', start: 8, end: 12 },
    ]);
  });

  test('preemptive, immediate steal', () => {
    const req: SimulationRequest = {
      algorithm: 'PRIORITY_PREEMPTIVE',
      processes: [
        { id: 'A', arrival: 0, burst: 6, priority: 3 },
        { id: 'B', arrival: 1, burst: 4, priority: 1 },
        { id: 'C', arrival: 2, burst: 3, priority: 2 },
      ],
    };
    const res = priorityPre(req);
    expect(res.gantt).toEqual([
      { id: 'A', start: 0, end: 1 },
      { id: 'B', start: 1, end: 5 },
      { id: 'C', start: 5, end: 8 },
      { id: 'A', start: 8, end: 13}, 
    ]);
  });

  test('preemptive, priorityLowerIsHigher false', () => {
    const req: SimulationRequest = {
      algorithm: 'PRIORITY_PREEMPTIVE',
      priorityLowerIsHigher: false,
      processes: [
        { id: 'X', arrival: 0, burst: 4, priority: 2 },
        { id: 'Y', arrival: 2, burst: 2, priority: 4 },
      ],
    };
    const res = priorityPre(req);
    expect(res.gantt).toEqual([
      { id: 'X', start: 0, end: 2 },
      { id: 'Y', start: 2, end: 4 },
      { id: 'X', start: 4, end: 6 },
    ]);
  });
});