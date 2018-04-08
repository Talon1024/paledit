export class ColourSubRange {
  private _start:number;
  private _end:number;
  get start():number { return this._start; }
  get end():number { return this._end; }
  set start(value:number) {
    if (!this._end) this._start = value;
    if (this._end && value > this._end) {
      this._start = this._end;
      this._end = value;
    }
  }
  set end(value:number) {
    if (!this._start) this._end = value;
    if (this._start && value < this._start) {
      this._end = this._start;
      this._start = value;
    }
  }

  constructor(start:number = 0, end:number = 0) {
    if (start > end) {
      this._start = end & 0xFF;
      this._end = start & 0xFF;
    } else {
      this._start = start & 0xFF;
      this._end = end & 0xFF;
    }
  }

  getLength():number {
    return this._end - this._start;
  }

  contains(palIdx:number) {
    return palIdx >= this._start && palIdx <= this._end;
  }
}
