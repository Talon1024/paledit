import { Rgb } from './rgb';

export class Palette {
  data: Uint8ClampedArray;
  length: number;

  static fromData(data: Uint8ClampedArray, palLength: number): Palette {
    const pal = new Palette();
    if (data.length !== palLength * 3) { return null; }
    pal.data = data;
    pal.length = palLength;
    return pal;
  }

  colourAt(index: number): Rgb {
    if (index > this.getLength() || index < 0) { return null; }
    const start = index * 3;

    // RGB
    const red = this.data[start];
    const green = this.data[start + 1];
    const blue = this.data[start + 2];

    return {red, green, blue};
  }

  setColour(index: number, colour: Rgb) {
    const start = index * 3;
    this.data[start] = colour.red;
    this.data[start + 1] = colour.green;
    this.data[start + 2] = colour.blue;
  }

  setColourRgb(index: number, red: number, green: number, blue: number) {
    const colour = {red, green, blue};
    this.setColour(index, colour);
  }

  toData(): Uint8ClampedArray {
    return this.data;
  }

  getLength(): number {
    return this.length;
  }
}
