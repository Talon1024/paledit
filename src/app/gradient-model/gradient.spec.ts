import { Gradient, GradientStop } from './gradient';
import { ColourRange } from '../palette-model/colour-range';
import { ColourSubRange } from '../palette-model/colour-sub-range';
import { Rgbcolour } from '../palette-model/rgb';

describe('Gradient', () => {
  // Test data
  let blackStop = new GradientStop(0.0, {red: 0, green: 0, blue: 0});
  let whiteStop = new GradientStop(1.0, {red: 255, green: 255, blue: 255});

  it("should create an instance", () => {
    let gradient = new Gradient();
    expect(gradient).toBeTruthy();
  });
  it("should create an instance given stops", () => {
    let gradient = new Gradient([blackStop, whiteStop]);
    expect(gradient).toBeTruthy();
  });
  it("should have the correct indices for the default gradient", () => {
    let gradient = new Gradient([blackStop, whiteStop]);

    let rangeStart = 16;
    let rangeEnd = 32;
    let subRange = new ColourSubRange(rangeStart, rangeEnd);
    let colourRange = new ColourRange([subRange]);

    gradient.palRange = colourRange;

    let expected = [16, 32];

    expect(gradient.stopIdxs).toEqual(expected);
  });
  it("should get the correct colour at the midpoint of an 11-colour palette range", () => {
    // Default gradient
    let blackStop = new GradientStop(0.0, {red: 0, green: 0, blue: 0});
    let whiteStop = new GradientStop(1.0, {red: 255, green: 255, blue: 255});

    let gradient = new Gradient([blackStop, whiteStop]);

    // Set up colour range/subrange
    // 15 colours to keep things simple
    let rangeStart = 16;
    let rangeEnd = 31;

    let subRange = new ColourSubRange(rangeStart, rangeEnd);
    let colourRange = new ColourRange();
    colourRange.subRanges = [subRange];

    gradient.palRange = colourRange;

    // Now for the actual test
    let expected = new Rgbcolour(128, 128, 128);

    expect(gradient.colourAt(rangeStart + 7)).toEqual(expected);
  });
});