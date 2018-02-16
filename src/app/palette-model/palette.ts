import {Palcolour} from "./palcolour";
import {ColourRange} from "./colour-range";

export class Palette {
  data:Uint8ClampedArray = new Uint8ClampedArray(768);
  ranges:ColourRange[];

  colourAt(index:number):Palcolour {
    if (index > 255 || index < 0) return null;

    let rgb:Palcolour = new Palcolour();
    let start = index * 3;

    rgb.red = this.data[start];
    rgb.green = this.data[start + 1];
    rgb.blue = this.data[start + 2];

    rgb.index = index;
    rgb.palette = this;

    return rgb;
  }

  setColour(index:number, colour:Palcolour) {
    let start = index * 3;
    this.data[start] = colour.red;
    this.data[start + 1] = colour.green;
    this.data[start + 2] = colour.blue;
  }

  static fromData(data:Uint8ClampedArray):Palette {
    let pal = new Palette();
    if (data.length !== 768) return null;
    pal.data = data;
    return pal;
  }

  toData():Uint8ClampedArray {
    return this.data;
  }

  getLength():number {
    return 256;
  }
}
