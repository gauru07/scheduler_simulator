import { MinHeap } from '../../../src/engine/datastructures/minHeap';

describe('MinHeap', () => {
  let heap: MinHeap<number>;

  beforeEach(() => {
    heap = new MinHeap<number>((a, b) => a - b);
  });

  test('should start empty', () => {
    expect(heap.empty()).toBe(true);
    expect(heap.size()).toBe(0);
    expect(heap.peek()).toBeUndefined();
  });

  test('should insert and maintain min heap property', () => {
    heap.push(5);
    heap.push(3);
    heap.push(8);
    heap.push(1);

    expect(heap.size()).toBe(4);
    expect(heap.peek()).toBe(1); // minimum should be at top
  });

  test('should pop elements in ascending order', () => {
    const values = [5, 3, 8, 1, 9, 2];
    values.forEach(val => heap.push(val));

    const sorted = [];
    while (!heap.empty()) {
      sorted.push(heap.pop());
    }

    expect(sorted).toEqual([1, 2, 3, 5, 8, 9]);
  });

  test('should work with custom comparator for objects', () => {
    interface Process {
      id: string;
      burst: number;
    }

    const processHeap = new MinHeap<Process>((a, b) => a.burst - b.burst);
    
    processHeap.push({ id: 'P1', burst: 5 });
    processHeap.push({ id: 'P2', burst: 2 });
    processHeap.push({ id: 'P3', burst: 8 });

    expect(processHeap.peek()?.id).toBe('P2'); // shortest burst first
    expect(processHeap.pop()?.burst).toBe(2);
    expect(processHeap.pop()?.burst).toBe(5);
  });
});
