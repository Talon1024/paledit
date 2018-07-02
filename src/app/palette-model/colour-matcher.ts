import { Palette } from './palette';
import { Rgb } from './rgb';

export class ColourMatcher {
  constructor () {}

  static findMatch(colour: Rgb, palette: Palette, by: (c: Rgb, p: Palette) => number): number {
    return by(colour, palette);
  }

  static findMatchSubtract(colour: Rgb, palette: Palette): number {
    let lowestDiff = 768;
    let lowestDiffIdx = 0;
    for (let c = 0; c < palette.getLength(); c++) {
      const palColour = palette.colourAt(c);
      const rDiff = Math.abs(colour.red - palColour.rgb.red);
      const gDiff = Math.abs(colour.green - palColour.rgb.green);
      const bDiff = Math.abs(colour.blue - palColour.rgb.blue);
      const aggregateDiff = rDiff + gDiff + bDiff;
      if (aggregateDiff < lowestDiff) {
        lowestDiff = aggregateDiff;
        lowestDiffIdx = c;
      }
    }
    return lowestDiffIdx;
  }

  static findMatchSquare(colour: Rgb, palette: Palette): number {
    const square = (x) => x * x;
    let lowestDiff = 196608;
    let lowestDiffIdx = 0;
    for (let i = 0; i < palette.getLength(); i++) {
      const palColour = palette.colourAt(i).rgb;
      const diff =
        square(colour.red - palColour.red) +
        square(colour.green - palColour.green) +
        square(colour.blue - palColour.blue);

      if (diff < lowestDiff) {
        lowestDiff = diff;
        lowestDiffIdx = i;
      }
    }
    return lowestDiffIdx;
  }

}
