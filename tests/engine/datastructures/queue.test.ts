import { Queue } from '../../../src/engine/datastructures/queue';

describe('Queue', () => {
  test('FIFO order', () => {
    const q = new Queue<number>();
    expect(q.empty()).toBe(true);
    q.enqueue(1); q.enqueue(2); q.enqueue(3);
    expect(q.front()).toBe(1);
    expect(q.dequeue()).toBe(1);
    expect(q.dequeue()).toBe(2);
    expect(q.dequeue()).toBe(3);
    expect(q.empty()).toBe(true);
  });
});
