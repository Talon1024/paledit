import { Rgb, Rgbcolour } from '../palette-model/rgb';
import { ColourRange } from '../palette-model/colour-range';

export interface IGradientStop {
  position: number;
  colour: Rgb;
}

export class GradientStop implements IGradientStop {
  position: number; // 0.0 to 1.0
  colour: Rgb;

  constructor(position: number, colour: Rgb) {
    if (position > 1.0 || position < 0.0) {
      throw new TypeError('Position must be between 0.0 and 1.0 inclusive');
    }
    this.position = position;
    this.colour = colour;
  }

  static fromObject(ob: IGradientStop): GradientStop {
    return new GradientStop(ob.position, ob.colour);
  }

  toObject() {
    return {position: this.position, colour: this.colour};
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

export interface IGradient {
  stops: GradientStop[];
}

export class Gradient {
  stops: GradientStop[];

  constructor(stops?: IGradientStop[]) {
    if (stops) {
      this.stops = stops.map((s) => GradientStop.fromObject(s));
    } else {
      this.stops = [];
    }
    this.stops.sort(Gradient.sortFunction);
  }

  static sortFunction(a: GradientStop, b: GradientStop): number {
    return a.position - b.position;
  }

  static fromObject(ob: IGradient): Gradient {
    return new Gradient(ob.stops);
  }

  toObject(): IGradient {
    return {stops: this.stops};
  }

  addStop(stop: GradientStop) {
    this.stops.push(stop);
    this.stops.sort(Gradient.sortFunction);
  }

  private stopPalIndex(stop: GradientStop, range: ColourRange): number {
    const length = range.getLength();
    const rangePalIdxs = range.getIndices();
    const stopPos = stop.position;

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
    const stopPos = stop.position;

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
    const stopsAtIdx = this.stops.filter((_, i) => stopIdxs[i] === rangeIdx);
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
