export class ColourSubRange {
  start:number;
  end:number;

  constructor(start:number = 0, end:number = 0) {
    if (start > end) {
      this.start = end & 0xFF;
      this.end = start & 0xFF;
    } else {
      this.start = start & 0xFF;
      this.end = end & 0xFF;
    }
  }

  getLength():number {
    return this.end - this.start;
  }

  contains(palIdx:number) {
    return palIdx >= this.start && palIdx <= this.end;
  }
}
