import { srtf } from '../../../src/engine/algorithms/srtf';
import { SimulationRequest } from '../../../src/engine/types';

describe('SRTF (Shortest Remaining Time First)', () => {
  test('basic preemptive scheduling', () => {
    const req: SimulationRequest = {
      algorithm: 'SRTF_PREEMPTIVE',
      processes: [
        { id: 'P1', arrival: 0, burst: 7 },
        { id: 'P2', arrival: 2, burst: 4 },
        { id: 'P3', arrival: 4, burst: 1 },
      ],
    };

    const res = srtf(req);
    
    // P1 starts at 0, P2 arrives at 2 (remaining: 5), P3 arrives at 4 (remaining: 1)
    // P3 should preempt P1 at 4, then P2 should run, then P1
    expect(res.gantt).toEqual([
      { id: 'P1', start: 0, end: 2 },
      { id: 'P2', start: 2, end: 4 },
      { id: 'P3', start: 4, end: 5 },
      { id: 'P2', start: 5, end: 7 },
      { id: 'P1', start: 7, end: 12 },
    ]);

    const byId = new Map(res.perProcess.map(r => [r.id, r]));
    expect(byId.get('P1')!.waitingTime).toBe(5); // 2 + 3 = 5
    expect(byId.get('P2')!.waitingTime).toBe(1); // 1
    expect(byId.get('P3')!.waitingTime).toBe(0); // 0

    expect(res.metrics.makespan).toBe(12);
  });

  test('immediate preemption by shorter process', () => {
    const req: SimulationRequest = {
      algorithm: 'SRTF_PREEMPTIVE',
      processes: [
        { id: 'A', arrival: 0, burst: 5 },
        { id: 'B', arrival: 1, burst: 2 },
      ],
    };

    const res = srtf(req);
    
    // A starts at 0, B arrives at 1 with shorter remaining time (2 vs 4)
    // B should preempt A immediately
    expect(res.gantt).toEqual([
      { id: 'A', start: 0, end: 1 },
      { id: 'B', start: 1, end: 3 },
      { id: 'A', start: 3, end: 7 },
    ]);

    const byId = new Map(res.perProcess.map(r => [r.id, r]));
    expect(byId.get('A')!.preemptions).toBe(1);
    expect(byId.get('B')!.preemptions).toBe(0);
  });

  test('tie-breaking: same remaining time uses arrival then id', () => {
    const req: SimulationRequest = {
      algorithm: 'SRTF_PREEMPTIVE',
      processes: [
        { id: 'P2', arrival: 0, burst: 3 },
        { id: 'P1', arrival: 0, burst: 3 },
        { id: 'P3', arrival: 1, burst: 2 },
      ],
    };

    const res = srtf(req);
    
    // At t=0: P1 and P2 both have remaining=3, P1 should win by id
    // P1 runs until t=1, then P3 arrives with remaining=2, should preempt
    // But P1 has remaining=2, P3 has remaining=2, so P1 continues (tie-break by arrival)
    expect(res.gantt).toEqual([
      { id: 'P1', start: 0, end: 3 },
      { id: 'P3', start: 3, end: 5 },
      { id: 'P2', start: 5, end: 8 },
    ]);
  });

  test('idle gap: jump to next arrival when no ready process', () => {
    const req: SimulationRequest = {
      algorithm: 'SRTF_PREEMPTIVE',
      processes: [
        { id: 'A', arrival: 5, burst: 2 },
        { id: 'B', arrival: 10, burst: 1 },
      ],
    };

    const res = srtf(req);
    expect(res.gantt).toEqual([
      { id: 'A', start: 5, end: 7 },
      { id: 'B', start: 10, end: 11 },
    ]);
  });

  test('response time calculation', () => {
    const req: SimulationRequest = {
      algorithm: 'SRTF_PREEMPTIVE',
      processes: [
        { id: 'P1', arrival: 0, burst: 5 },
        { id: 'P2', arrival: 1, burst: 1 },
        { id: 'P3', arrival: 2, burst: 3 },
      ],
    };

    const res = srtf(req);
    const byId = new Map(res.perProcess.map(r => [r.id, r]));
    
    expect(byId.get('P1')!.responseTime).toBe(0); // Starts immediately
    expect(byId.get('P2')!.responseTime).toBe(0); // Preempts P1 immediately
    expect(byId.get('P3')!.responseTime).toBe(0); // Preempts P1 immediately
  });

  test('comparison with SJF: SRTF should have better average waiting time', () => {
    const req: SimulationRequest = {
      algorithm: 'SRTF_PREEMPTIVE',
      processes: [
        { id: 'P1', arrival: 0, burst: 7 },
        { id: 'P2', arrival: 2, burst: 4 },
        { id: 'P3', arrival: 4, burst: 1 },
        { id: 'P4', arrival: 5, burst: 4 },
      ],
    };

    const res = srtf(req);
    
    // SRTF should prioritize shorter remaining times
    // Actual schedule: P1(0-2), P2(2-4), P3(4-5), P2(5-7), P4(7-11), P1(11-16)
    expect(res.gantt).toEqual([
      { id: 'P1', start: 0, end: 2 },
      { id: 'P2', start: 2, end: 4 },
      { id: 'P3', start: 4, end: 5 },
      { id: 'P2', start: 5, end: 7 },
      { id: 'P4', start: 7, end: 11 },
      { id: 'P1', start: 11, end: 16 },
    ]);

    const byId = new Map(res.perProcess.map(r => [r.id, r]));
    expect(byId.get('P1')!.waitingTime).toBe(9); // 2 + 7 = 9
    expect(byId.get('P2')!.waitingTime).toBe(1); // 1
    expect(byId.get('P3')!.waitingTime).toBe(0); // 0
    expect(byId.get('P4')!.waitingTime).toBe(2); // 2

    expect(res.metrics.avgWaitingTime).toBe(3); // (9+1+0+2)/4 = 3
  });
});
