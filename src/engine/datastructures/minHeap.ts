export class MinHeap<T> {
  private heap: T[] = [];
  private compare: (a: T, b: T) => number;

  constructor(compareFn: (a: T, b: T) => number) {
    this.compare = compareFn;
  }

  private parent(i: number): number {
    return Math.floor((i - 1) / 2);
  }

  private left(i: number): number {
    return 2 * i + 1;
  }

  private right(i: number): number {
    return 2 * i + 2;
  }

  private swap(i: number, j: number): void {
    const tmp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = tmp;
  }

  private heapifyUp(i: number): void {
    while (i > 0) {
      const p = this.parent(i);
      if (this.compare(this.heap[i], this.heap[p]) < 0) {
        this.swap(i, p);
        i = p;
      } else {
        break;
      }
    }
  }

  private heapifyDown(i: number): void {
    const n = this.heap.length;
    while (true) {
      const l = this.left(i);
      const r = this.right(i);
      let smallest = i;

      if (l < n && this.compare(this.heap[l], this.heap[smallest]) < 0) {
        smallest = l;
      }
      if (r < n && this.compare(this.heap[r], this.heap[smallest]) < 0) {
        smallest = r;
      }
      if (smallest === i) break;

      this.swap(i, smallest);
      i = smallest;
    }
  }

  push(x: T): void {
    this.heap.push(x);
    this.heapifyUp(this.heap.length - 1);
  }

  pop(): T | undefined {
    const n = this.heap.length;
    if (n === 0) return undefined;
    if (n === 1) return this.heap.pop();

    const min = this.heap[0];
    // Move last element to root, then heapify down
    this.heap[0] = this.heap.pop() as T;
    this.heapifyDown(0);
    return min;
  }

  peek(): T | undefined {
    return this.heap.length > 0 ? this.heap[0] : undefined;
  }

  empty(): boolean {
    return this.heap.length === 0;
  }

  size(): number {
    return this.heap.length;
  }

  getAll(): T[] {
    return [...this.heap];
  }
}