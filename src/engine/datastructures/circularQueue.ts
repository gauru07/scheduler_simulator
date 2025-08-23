/**
 * Circular Queue implementation for Round Robin algorithm
 * Fixed size with circular wrapping
 */
export class CircularQueue<T> {
  private items: (T | undefined)[];
  private front: number = -1;
  private rear: number = -1;
  private count: number = 0;
  private capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.items = new Array(capacity);
  }

  // Check if queue is full (O(1))
  isFull(): boolean {
    return this.count === this.capacity;
  }

  // Check if queue is empty (O(1))
  isEmpty(): boolean {
    return this.count === 0;
  }

  // Add element to rear (O(1))
  enqueue(item: T): boolean {
    if (this.isFull()) {
      return false; // Queue is full
    }

    if (this.isEmpty()) {
      this.front = 0;
      this.rear = 0;
    } else {
      this.rear = (this.rear + 1) % this.capacity;
    }

    this.items[this.rear] = item;
    this.count++;
    return true;
  }

  // Remove and return element from front (O(1))
  dequeue(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }

    const item = this.items[this.front];
    this.items[this.front] = undefined;
    
    if (this.count === 1) {
      this.front = -1;
      this.rear = -1;
    } else {
      this.front = (this.front + 1) % this.capacity;
    }
    
    this.count--;
    return item;
  }

  // Peek at front element without removing (O(1))
  peek(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[this.front];
  }

  // Get current size (O(1))
  size(): number {
    return this.count;
  }

  // Get all elements in order (for debugging) (O(n))
  getAll(): T[] {
    if (this.isEmpty()) {
      return [];
    }

    const result: T[] = [];
    let current = this.front;
    
    for (let i = 0; i < this.count; i++) {
      result.push(this.items[current]!);
      current = (current + 1) % this.capacity;
    }
    
    return result;
  }
}
