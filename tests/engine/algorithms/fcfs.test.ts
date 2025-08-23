import { fcfs } from '../../../src/engine/algorithms/fcfs';
import { SimulationRequest } from '../../../src/engine/types';

describe('FCFS', () => {
  test('simple timeline', () => {
    const req: SimulationRequest = {
      algorithm: 'FCFS',
      processes: [
        { id: 'P1', arrival: 0, burst: 3 },
        { id: 'P2', arrival: 2, burst: 2 },
        { id: 'P3', arrival: 4, burst: 1 },
      ],
    };

    const res = fcfs(req);

    expect(res.gantt).toEqual([
      { id: 'P1', start: 0, end: 3 },
      { id: 'P2', start: 3, end: 5 },
      { id: 'P3', start: 5, end: 6 },
    ]);

    const byId = new Map(res.perProcess.map(r => [r.id, r]));
    expect(byId.get('P1')!.waitingTime).toBe(0);
    expect(byId.get('P2')!.waitingTime).toBe(1);
    expect(byId.get('P3')!.waitingTime).toBe(1);

    expect(res.metrics.makespan).toBe(6);
    expect(res.metrics.throughput).toBeCloseTo(3 / 6);
  });
});
