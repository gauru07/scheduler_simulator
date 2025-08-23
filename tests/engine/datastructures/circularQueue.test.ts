import { CircularQueue } from '../../../src/engine/datastructures/circularQueue';

describe('CircularQueue', () => {
  test('wrap behavior', () => {
    const cq = new CircularQueue<string>(3);
    expect(cq.enqueue('A')).toBe(true);
    expect(cq.enqueue('B')).toBe(true);
    expect(cq.enqueue('C')).toBe(true);
    expect(cq.enqueue('D')).toBe(false); // full
    expect(cq.dequeue()).toBe('A');
    expect(cq.enqueue('D')).toBe(true); // wraps
    expect(cq.dequeue()).toBe('B');
    expect(cq.dequeue()).toBe('C');
    expect(cq.dequeue()).toBe('D');
    expect(cq.isEmpty()).toBe(true);
  });
});
