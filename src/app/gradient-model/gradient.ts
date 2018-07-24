import { Rgb, Rgbcolour } from '../palette-model/rgb';
import { ColourRange } from '../palette-model/colour-range';

export class GradientStop {
  position: number; // 0.0 to 1.0
  colour: Rgb;

  constructor(position: number, colour: Rgb) {
    if (position > 1.0 || position < 0.0) {
      throw new TypeError('Position must be between 0.0 and 1.0 inclusive');
    }
    this.position = position;
    this.colour = colour;
  }

  posPercent(): string {
    return `${this.position * 100}%`;
  }

  toCssGradientStopString(): string {
    return `rgb(${this.colour.red}, ${this.colour.green}, ${this.colour.blue}) ${this.posPercent()}`;
  }

  toString(): string {
    return `(${this.colour.red}, ${this.colour.green}, ${this.colour.blue}) at ${this.posPercent()}`;
  }
}

export class Gradient {
  stops: GradientStop[];
  reverse: boolean;

  constructor(stops?: GradientStop[], reverse: boolean = false) {
    if (stops) {
      this.stops = stops;
    } else {
      this.stops = [];
    }
    this.reverse = reverse;
  }


  addStop(stop: GradientStop) {
    this.stops.push(stop);
    this.stops.sort(function (a: GradientStop, b: GradientStop): number {
      return a.position - b.position;
    });
  }

  private stopPalIndex(stop: GradientStop, range: ColourRange): number {
    const length = range.getLength();
    const rangePalIdxs = range.getIndices();
    let stopPos = stop.position;
    if (this.reverse) { stopPos = 1.0 - stopPos; }

    const rangeIdx = Math.floor(stopPos * length);
    const palIdx = rangePalIdxs[rangeIdx];
    return palIdx;
  }

  getStopPalIdxs(range: ColourRange): number[] {
    const stopIdxs: number[] = new Array(this.stops.length);
    for (let i = 0; i < this.stops.length; i++) {
      const stop = this.stops[i];
      stopIdxs[i] = this.stopPalIndex(stop, range);
    }
    return stopIdxs;
  }


  private stopRangeIndex(stop: GradientStop, range: ColourRange): number {
    return this.stopIndex(stop, range.getLength());
  }

  private stopIndex(stop: GradientStop, length: number): number {
    length -= 1;
    let stopPos = stop.position;
    if (this.reverse) { stopPos = 1.0 - stopPos; }

    const rangeIdx = Math.floor(stopPos * length);
    return rangeIdx;
  }

  getStopRangeIdxs(range: ColourRange): number[] {
    return this.getStopIdxs(range.getLength());
  }

  getStopIdxs(length: number): number[] {
    const stopIdxs: number[] = new Array<number>(this.stops.length);
    for (let i = 0; i < this.stops.length; i++) {
      const stop = this.stops[i];
      stopIdxs[i] = this.stopIndex(stop, length);
    }
    return stopIdxs;
  }

  colourIn(rangeIdx: number, rangeLen: number): Rgb {
    const stopIdxs = this.getStopIdxs(rangeLen);
    const stopsAtIdx = this.stops.filter((e, i) => stopIdxs[i] === rangeIdx);
    if (stopsAtIdx.length === 0) {
      // Find colour at this index
      let nextStopGidx = stopIdxs.findIndex((e) => e >= rangeIdx);
      let prevStopGidx;

      if (nextStopGidx === -1) {
        nextStopGidx = stopIdxs.length - 1; // Last stop
        prevStopGidx = nextStopGidx;
      } else {
        prevStopGidx = nextStopGidx - 1;
      }

      if (prevStopGidx === -1) {
        prevStopGidx = 0;
      }

      const nextStop: GradientStop = this.stops[nextStopGidx];
      const prevStop: GradientStop = this.stops[prevStopGidx];
      const nextStopRidx = stopIdxs[nextStopGidx];
      const prevStopRidx = stopIdxs[prevStopGidx];

      let blendFactor = (rangeIdx - prevStopRidx) / (nextStopRidx - prevStopRidx);
      if (!Number.isFinite(blendFactor)) {
        blendFactor = 0.0;
      }

      const prevColour = prevStop.colour;
      const nextColour = nextStop.colour;
      const resultColour = Rgbcolour.blend(prevColour, blendFactor, nextColour, Rgbcolour.tint);

      return {red: resultColour.red, green: resultColour.green, blue: resultColour.blue};
    } else {
      // Average colours of all stops at this index
      let sumRed = 0, sumGreen = 0, sumBlue = 0, colourCount = 0;
      for (const stop of stopsAtIdx) {
        sumRed += stop.colour.red;
        sumGreen += stop.colour.green;
        sumBlue += stop.colour.blue;
        colourCount += 1;
      }
      const avgRed = Math.round(sumRed / colourCount);
      const avgGreen = Math.round(sumGreen / colourCount);
      const avgBlue = Math.round(sumBlue / colourCount);

      return {red: avgRed, green: avgGreen, blue: avgBlue};
    }
  }

  colourAt(palIdx: number, palRange: ColourRange): Rgb {
    if (!palRange) { return; }
    const rangeLen = palRange.getLength();

    // Is the index within the range?
    const rangeIdx = palRange.palToRangeIdx(palIdx);
    if (rangeIdx < 0) { return; }

    return this.colourIn(rangeIdx, rangeLen);
  }

  toCssString(direction: string = 'to right'): string {
    if (this.stops.length >= 2) {
      const stopList = [];
      for (const stop of this.stops) {
        stopList.push(`${stop.toCssGradientStopString()}`);
      }
      const stopListStr = stopList.join(', ');
      return `linear-gradient(${direction}, ${stopListStr})`;
    } else {
      return '';
    }
  }
}
