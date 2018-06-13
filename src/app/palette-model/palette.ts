import { Rgbcolour } from './rgb';
import { Palcolour } from './palcolour';
import { ColourRange } from './colour-range';

export class Palette {
  data: Uint8ClampedArray = new Uint8ClampedArray(768);
  ranges: ColourRange[];

  static fromData(data: Uint8ClampedArray): Palette {
    const pal = new Palette();
    if (data.length !== 768) { return null; }
    pal.data = data;
    return pal;
  }

  colourAt(index: number): Palcolour {
    if (index > 255 || index < 0) { return null; }
    const start = index * 3;

    // RGB
    const red = this.data[start];
    const green = this.data[start + 1];
    const blue = this.data[start + 2];

    const rgb: Palcolour = new Palcolour(red, green, blue);
    rgb.index = index;
    rgb.palette = this;

    return rgb;
  }

  setColour(index: number, colour: Rgbcolour) {
    const start = index * 3;
    this.data[start] = colour.red;
    this.data[start + 1] = colour.green;
    this.data[start + 2] = colour.blue;
  }

  setColourRgb(index: number, red: number, green: number, blue: number) {
    const colour = new Rgbcolour(red, green, blue);
    this.setColour(index, colour);
  }

  toData(): Uint8ClampedArray {
    return this.data;
  }

  getLength(): number {
    return 256;
  }
}
