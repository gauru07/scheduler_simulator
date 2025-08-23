/**
 * Simple FIFO Queue implementation for FCFS algorithm
 */
export class Queue<T> {
  private items: T[] = [];

  // Add element to rear (O(1))
  enqueue(item: T): void {
    this.items.push(item);
  }

  // Remove and return element from front (O(1))
  dequeue(): T | undefined {
    return this.items.shift();
  }

  // Peek at front element without removing (O(1))
  front(): T | undefined {
    return this.items[0]; // FIX: Return first element, not entire array
  }

  // Check if queue is empty (O(1))
  empty(): boolean {
    return this.items.length === 0;
  }

  // Get size (O(1))
  size(): number {
    return this.items.length;
  }

  // Get all elements (for debugging)
  getAll(): T[] {
    return [...this.items];
  }
}
