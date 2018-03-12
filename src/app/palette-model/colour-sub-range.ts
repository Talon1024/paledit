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
}
