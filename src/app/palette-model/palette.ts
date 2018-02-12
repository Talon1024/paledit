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

    return rgb;
  }

  static fromData(data:Uint8ClampedArray):Palette {
    let pal = new Palette();
    if (data.length !== 768) return null;
    pal.data = data;
    return pal;
  }

  getLength():number {
    return 256;
  }
}
