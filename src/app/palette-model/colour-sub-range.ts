export class ColourSubRange {
  start:number;
  end:number;

  getLength():number {
    return Math.abs(this.end - this.start);
  }
}
