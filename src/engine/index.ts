import { SimulationRequest, SimulationResponse } from './types';
import { fcfs } from './algorithms/fcfs';
import { sjf } from './algorithms/sjf';

export function runSimulation(req: SimulationRequest): SimulationResponse {
  switch (req.algorithm) {
    case 'FCFS':
      return fcfs(req);
    case 'SJF_NON_PREEMPTIVE':
      return sjf(req);
    default:
      throw new Error(`Unsupported algorithm: ${req.algorithm}`);
  }
}
