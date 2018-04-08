export class ColourSubRange {
  start:number;
  end:number;

  constructor(start:number = 0, end:number = 0) {
    this.start = start & 0xFF;
    this.end = end & 0xFF;
  }

  getLength():number {
    return Math.abs(this.end - this.start);
  }

  sorted():number[] {
    let start = Math.min(this.start, this.end);
    let end = Math.max(this.start, this.end);

    return [start, end];
  }

  contains(palIdx:number):boolean {
    let [start, end] = this.sorted();
    return palIdx >= start && palIdx <= end;
  }
}
