import { Rgb } from './rgb';

export class Palette {
  private _data: Uint8Array;
  public get data() { return this._data; }
  private _numColours: number;
  public get numColours() { return this._numColours; }
  public get byteLength() { return this._data.length; }

  static fromData(data: Uint8Array, palLength: number): Palette {
    const pal = new Palette();
    if (data.length !== palLength * 3) { return null; }
    pal._data = data;
    pal._numColours = palLength;
    return pal;
  }

  colourAt(index: number): Rgb {
    if (index > this._numColours || index < 0) { return null; }
    const start = index * 3;

    // RGB
    const red = this._data[start];
    const green = this._data[start + 1];
    const blue = this._data[start + 2];

    return {red, green, blue};
  }

  setColour(index: number, colour: Rgb) {
    const start = index * 3;
    ['red', 'green', 'blue'].map((comp) => {
      if (colour[comp] > 255) {
        colour[comp] = 255;
      } else if (colour[comp] < 0) {
        colour[comp] = 0;
      }
    });
    this._data[start] = colour.red;
    this._data[start + 1] = colour.green;
    this._data[start + 2] = colour.blue;
  }

  setColourRgb(index: number, red: number, green: number, blue: number) {
    const colour = {red, green, blue};
    this.setColour(index, colour);
  }
}
