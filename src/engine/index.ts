import { SimulationRequest, SimulationResponse } from './types';
import { fcfs } from './algorithms/fcfs';
import { sjf } from './algorithms/sjf';
import { priorityNon, priorityPre } from './algorithms/priority';
import { roundRobin } from './algorithms/roundRobin';
import { srtf } from './algorithms/srtf';
import { mlfq } from './algorithms/mlfq';

export function runSimulation(req: SimulationRequest): SimulationResponse {
  switch (req.algorithm) {
    case 'FCFS':
      return fcfs(req);
    case 'SJF_NON_PREEMPTIVE':
      return sjf(req);
    case 'SRTF_PREEMPTIVE':
      return srtf(req);
    case 'PRIORITY_NON_PREEMPTIVE':
      return priorityNon(req);
    case 'PRIORITY_PREEMPTIVE':
      return priorityPre(req);
    case 'ROUND_ROBIN':
      return roundRobin(req);
    case 'MLFQ':
      return mlfq(req);
    default:
      throw new Error(`Unsupported algorithm: ${req.algorithm}`);
  }
}
