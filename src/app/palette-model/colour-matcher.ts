import { Palette } from './palette';
import { Rgb } from './rgb';

export class ColourMatcher {
  constructor () {}

  findMatch(colour:Rgb, palette:Palette, by:(c:Rgb, p:Palette) => number):number {
    return by(colour, palette);
  }

  findMatchRGB(colour:Rgb, palette:Palette):number {
    let closestMatch = 0;
    let lowestDiff = 768;
    let lowestDiffIdx = 0;
    for (let c = 0; c < palette.getLength(); c++) {
      let palColour = palette.colourAt(c);
      let rDiff = Math.abs(colour.red - palColour.red);
      let gDiff = Math.abs(colour.green - palColour.green);
      let bDiff = Math.abs(colour.blue - palColour.blue);
      let aggregateDiff = rDiff + gDiff + bDiff;
      if (aggregateDiff < lowestDiff) {
        lowestDiff = aggregateDiff;
        lowestDiffIdx = c;
      }
    }
    return lowestDiffIdx;
  }

}
