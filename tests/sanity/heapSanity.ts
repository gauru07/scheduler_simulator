export class Queue<T> {
  private items: T[] = [];
  enqueue(item: T): void { this.items.push(item); }
  dequeue(): T | undefined { return this.items.shift(); }
  front(): T | undefined { return this.items[0]; } // Fixed: return first item, not the array
  empty(): boolean { return this.items.length === 0; }
  size(): number { return this.items.length; }
  getAll(): T[] { return [...this.items]; }
}