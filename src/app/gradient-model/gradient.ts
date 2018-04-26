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
  reverse:boolean;

  constructor(stops?:GradientStop[], reverse:boolean = false) {
    if (stops) {
      this.stops = stops;
    } else {
      this.stops = [];
    }
    this.reverse = reverse;
  }


  addStop(stop:GradientStop) {
    this.stops.push(stop);
    this.stops.sort(function (a:GradientStop, b:GradientStop):number {
      return a.position - b.position;
    });
  }

  private stopIndex(stop:GradientStop, range:ColourRange):number {
    let length = range.getLength();
    let rangePalIdxs = range.getIndices();
    let stopPos = stop.position;
    if (this.reverse) stopPos = 1.0 - stopPos;

    let rangeIdx = Math.floor(stopPos * length);
    let palIdx = rangePalIdxs[rangeIdx];
    return palIdx;
  }

  getStopIdxs(range:ColourRange):number[] {
    let stopIdxs:number[] = new Array(this.stops.length);
    for (let i = 0; i < this.stops.length; i++) {
      let stop = this.stops[i];
      stopIdxs[i] = this.stopIndex(stop, range);
    }
    return stopIdxs;
  }

  colourAt(palIdx:number, palRange:ColourRange):Rgbcolour {
    if (!palRange) return;
    let rangeLen = palRange.getLength();
    let stopIdxs:number[] = this.getStopIdxs(palRange);

    // Is the index within the range?
    let rangeIdx = palRange.palToRangeIdx(palIdx);
    if (rangeIdx < 0) return;

    stopIdxs = stopIdxs.map((i) => palRange.palToRangeIdx(i));

    let stopsAtIdx = this.stops.filter((e, i) => stopIdxs[i] === rangeIdx);
    if (stopsAtIdx.length === 0) {
      // Find colour at this index
      let nextStopGidx = stopIdxs.findIndex((e) => e >= rangeIdx);
      let prevStopGidx = nextStopGidx - 1;
      let nextStop:GradientStop = this.stops[nextStopGidx];
      let prevStop:GradientStop = this.stops[prevStopGidx];
      let nextStopRidx = stopIdxs[nextStopGidx];
      let prevStopRidx = stopIdxs[prevStopGidx];

      let blendFactor = rangeIdx / (nextStopRidx - prevStopRidx);

      let prevColour = new Rgbcolour(prevStop.colour);
      let nextColour = new Rgbcolour(nextStop.colour);
      let resultColour = prevColour.blend(blendFactor, nextColour, Rgbcolour.tint);

      return resultColour;
    } else {
      // Average colours of all stops at this index
      let sumRed = 0, sumGreen = 0, sumBlue = 0, colourCount = 0;
      for (let stop of stopsAtIdx) {
        sumRed += stop.colour.red;
        sumGreen += stop.colour.green;
        sumBlue += stop.colour.blue;
        colourCount += 1;
      }
      let avgRed = Math.round(sumRed / colourCount);
      let avgGreen = Math.round(sumGreen / colourCount);
      let avgBlue = Math.round(sumBlue / colourCount);

      return new Rgbcolour(avgRed, avgGreen, avgBlue);
    }
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
