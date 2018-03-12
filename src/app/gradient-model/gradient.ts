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
}

export class Gradient {
  stops:GradientStop[];
  stopIdxs:number[];
  palRange?:ColourRange;
  reverse:boolean = false;

  stopIndex(stop:GradientStop):number {
    let length = this.palRange.getLength();
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
    this.updateStopIdxs();
  }

  updateStopIdxs() {
    for (let i = 0; i < this.stops.length; i++) {
      let stop = this.stops[i];
      this.stopIdxs[i] = this.stopIndex(stop);
    }
  }

  colourAt(idx:number):Rgbcolour {
    let colour = new Rgbcolour();
    let length = this.palRange.getLength();
    let prevStop:GradientStop;
    let nextStop:GradientStop;

    return colour;
  }
}
