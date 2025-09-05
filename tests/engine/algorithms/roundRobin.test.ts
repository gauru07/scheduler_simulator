import { roundRobin } from '../../../src/engine/algorithms/roundRobin';
import { SimulationRequest } from '../../../src/engine/types';

describe('Round Robin Scheduling', () => {
  test('simple quantum scheduling', () => {
    const req: SimulationRequest = {
      algorithm: 'ROUND_ROBIN',
      quantum: 2,
      processes: [
        { id: 'P1', arrival: 0, burst: 5 },
        { id: 'P2', arrival: 1, burst: 3 },
        { id: 'P3', arrival: 2, burst: 1 },
      ],
    };
    const res = roundRobin(req);
    expect(res.gantt).toEqual([
      { id: 'P1', start: 0, end: 2 },
      { id: 'P2', start: 2, end: 4 },
      { id: 'P3', start: 4, end: 5 },
      { id: 'P1', start: 5, end: 7 },
      { id: 'P2', start: 7, end: 8 },
      { id: 'P1', start: 8, end: 9 },
    ]);
  });

  test('idle gap and late arrival', () => {
    const req: SimulationRequest = {
      algorithm: 'ROUND_ROBIN',
      quantum: 3,
      processes: [
        { id: 'P1', arrival: 0, burst: 4 },
        { id: 'P2', arrival: 10, burst: 3 },
      ],
    };
    const res = roundRobin(req);
    expect(res.gantt).toEqual([
      { id: 'P1', start: 0, end: 4 },
      { id: 'P2', start: 10, end: 13 },
    ]);
  });
});
