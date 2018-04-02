import { Rgb, Rgbcolour } from '../palette-model/rgb';
import { ColourRange } from '../palette-model/colour-range';

export class GradientStop {
  position:number; // 0.0 to 1.0
  colour:Rgb;

  constructor(position:number, colour:Rgb) {
    if (position > 1.0 || position < 0.0)
      throw new TypeError('Position must be between 0.0 and 1.0 inclusive');

    this.position = position;
    this.colour = colour;
  }

  posPercent():string {
    return `${this.position * 100}%`;
  }

  toCssGradientStopString():string {
    return `rgb(${this.colour.red}, ${this.colour.green}, ${this.colour.blue}) ${this.posPercent()}`;
  }
}

export class Gradient {
  stops:GradientStop[];
  stopIdxs:number[];
  private _palRange?:ColourRange;
  get palRange() { return this._palRange; }
  set palRange(value:ColourRange) {
    // Update stop indices when user assigns palette range
    this._palRange = value;
    if (value) this.updateStopIdxs();
  }
  reverse:boolean;

  constructor(stops?:GradientStop[], reverse:boolean = false) {
    if (stops) {
      this.stops = stops;
      this.stopIdxs = [];
    } else {
      this.stops = [];
      this.stopIdxs = [];
    }
    this.reverse = reverse;
  }

  stopIndex(stop:GradientStop):number {
    let length = this._palRange.getLength();
    let stopPos = stop.position;
    if (this.reverse) stopPos = 1.0 - stopPos;
    let idx = stopPos * length;
    return idx;
  }

  addStop(stop:GradientStop) {
    this.stops.push(stop);
    this.stops.sort(function (a:GradientStop, b:GradientStop):number {
      return a.position - b.position;
    });
    if (this._palRange) this.updateStopIdxs();
  }

  updateStopIdxs() {
    for (let i = 0; i < this.stops.length; i++) {
      let stop = this.stops[i];
      this.stopIdxs[i] = this.stopIndex(stop);
    }
  }

  colourAt(idx:number):Rgbcolour {
    //let length = this.palRange.getLength();
    let nextStopIdx = this.stopIdxs.find((e) => e >= idx);
    let prevStopIdx = this.stopIdxs[this.stopIdxs.indexOf(nextStopIdx) - 1];
    let nextStop:GradientStop = this.stops[nextStopIdx];
    let prevStop:GradientStop = this.stops[prevStopIdx];

    let stopIdxDiff = nextStopIdx - prevStopIdx;
    let blendFactor = idx / stopIdxDiff;

    let colour = new Rgbcolour(prevStop.colour);
    colour = colour.blend(blendFactor, new Rgbcolour(nextStop.colour), Rgbcolour.tint);

    return colour;
  }

  toCssString(direction:string = "to right"):string {
    if (this.stops.length >= 2) {
      let stopList = [];
      for (let stop of this.stops) {
        stopList.push(`${stop.toCssGradientStopString()}`);
      }
      let stopListStr = stopList.join(", ");
      return `linear-gradient(${direction}, ${stopListStr})`;
    } else {
      return "";
    }
  }
}
