import { MinHeap } from '../../src/engine/datastructures/minHeap';

test('minheap sanity', () => {
  const h = new MinHeap<number>((a, b) => a - b);
  [5, 3, 8, 1, 9, 2].forEach(x => h.push(x));
  expect(h.peek()).toBe(1);
  const out: number[] = [];
  while (!h.empty()) out.push(h.pop()!);
  expect(out).toEqual([1, 2, 3, 5, 8, 9]);
});
