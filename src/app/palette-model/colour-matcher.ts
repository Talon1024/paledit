import { Palette } from './palette';
import { Rgb } from './rgb';

export class ColourMatcher {
  constructor () {}

  findMatch(colour: Rgb, palette: Palette, by: (c: Rgb, p: Palette) => number): number {
    return by(colour, palette);
  }

  findMatchRGB(colour: Rgb, palette: Palette): number {
    const closestMatch = 0;
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

}
