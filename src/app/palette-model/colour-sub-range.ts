export class ColourSubRange {
  start: number;
  end: number;

  constructor(start: number = 0, end: number = 0) {
    this.start = Math.floor(start % 256);
    this.end = Math.floor(end % 256);
  }

  getLength(): number {
    return Math.abs(this.end - this.start) + 1;
  }

  sorted(): number[] {
    const start = Math.min(this.start, this.end);
    const end = Math.max(this.start, this.end);

    return [start, end];
  }

  contains(palIdx: number): boolean {
    const [start, end] = this.sorted();
    return palIdx >= start && palIdx <= end;
  }

  reversed(): boolean {
    return this.start > this.end;
  }
}
