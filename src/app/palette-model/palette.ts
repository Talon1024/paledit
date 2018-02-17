import { Rgbcolour } from './rgb';
import { Palcolour } from "./palcolour";
import { ColourRange } from "./colour-range";
import * as base64 from "base64-js";

export class Palette {
  data:Uint8ClampedArray = new Uint8ClampedArray(768);
  ranges:ColourRange[];

  colourAt(index:number):Palcolour {
    if (index > 255 || index < 0) return null;
    let start = index * 3;

    // RGB
    let red = this.data[start];
    let green = this.data[start + 1];
    let blue = this.data[start + 2];

    let rgb:Palcolour = new Palcolour(red, green, blue);
    rgb.index = index;
    rgb.palette = this;

    return rgb;
  }

  setColour(index:number, colour:Rgbcolour) {
    let start = index * 3;
    this.data[start] = colour.red;
    this.data[start + 1] = colour.green;
    this.data[start + 2] = colour.blue;
  }

  setColourRgb(index:number, red:number, green:number, blue:number) {
    let colour = new Rgbcolour(red, green, blue);
    this.setColour(index, colour);
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

  toBase64():String {
    return base64.fromByteArray(this.data);
  }

  getLength():number {
    return 256;
  }
}
