import { Rgb, Rgbcolour } from '../palette-model/rgb';
import { ColourRange } from '../palette-model/colour-range';

export class GradientStop {
  position:number; // 0.0 to 1.0
  colour:Rgb;
}

export class Gradient {
  stops:GradientStop[];
  palRange?:ColourRange;
  reverse:boolean = false;

  stopIndex(stop:GradientStop):number {
    let length = this.palRange.getLength();
    let idx = stop.position * length;
    if (this.reverse) idx = 1.0 - idx;
    return idx;
  }

  colourAt(idx:number):Rgbcolour {
    let colour = new Rgbcolour();
    let length = this.palRange.getLength();
    return colour;
  }
}
