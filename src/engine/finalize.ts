import { GanttSlice, Metrics, ProcessResult, SimulationResponse } from './types';

function mergeContiguous(gantt: GanttSlice[]): GanttSlice[] {
  if (gantt.length === 0) return [];
  const out: GanttSlice[] = [];
  let cur = { ...gantt[0] };
  for (let i = 1; i < gantt.length; i++) {
    const s = gantt[i];
    if (s.id === cur.id && s.start === cur.end) {
      cur.end = s.end; // merge
    } else {
      out.push(cur);
      cur = { ...s };
    }
  }
  out.push(cur);
  return out;
}

export function finalize(gantt: GanttSlice[], results: ProcessResult[]): SimulationResponse {
  // sort gantt by start
  const sorted = [...gantt].sort((a, b) => a.start - b.start);
  const merged = mergeContiguous(sorted);

  const makespan = merged.length ? Math.max(...merged.map(s => s.end)) : 0;
  const n = results.length;

  const avgWaitingTime = n ? results.reduce((a, r) => a + r.waitingTime, 0) / n : 0;
  const avgTurnaroundTime = n ? results.reduce((a, r) => a + r.turnaroundTime, 0) / n : 0;
  const avgResponseTime = n ? results.reduce((a, r) => a + r.responseTime, 0) / n : 0;
  const throughput = makespan > 0 ? n / makespan : 0;

  const metrics: Metrics = {
    avgWaitingTime,
    avgTurnaroundTime,
    avgResponseTime,
    throughput,
    makespan,
    cpuUtilization: 1, // v2: adjust if modeling idle
  };

  return {
    gantt: merged,
    perProcess: results.sort((a, b) => a.id.localeCompare(b.id)),
    metrics,
    timeline: [],
  };
}
