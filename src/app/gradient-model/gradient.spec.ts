import { Gradient, GradientStop } from './gradient';
import { ColourRange } from '../palette-model/colour-range';
import { ColourSubRange } from '../palette-model/colour-sub-range';
import { Rgbcolour } from '../palette-model/rgb';

describe('Gradient', () => {
  // Test data
  const blackStop = new GradientStop(0.0, {red: 0, green: 0, blue: 0});
  const whiteStop = new GradientStop(1.0, {red: 255, green: 255, blue: 255});

  it('should create an instance', () => {
    const gradient = new Gradient();
    expect(gradient).toBeTruthy();
  });
  it('should create an instance given stops', () => {
    const gradient = new Gradient([blackStop, whiteStop]);
    expect(gradient).toBeTruthy();
  });
  it('should have the correct indices for the default gradient', () => {
    const gradient = new Gradient([blackStop, whiteStop]);

    const rangeStart = 16;
    const rangeEnd = 32;
    const subRange = new ColourSubRange(rangeStart, rangeEnd);
    const colourRange = new ColourRange([subRange]);

    const actual = gradient.getStopRangeIdxs(colourRange);
    const expected = [0, 16];

    expect(actual).toEqual(expected);
  });
  it('should get the correct colour at the midpoint of a 16-colour paconstte range', () => {
    // Default gradient
    const gradient = new Gradient([blackStop, whiteStop]);

    // Set up colour range/subrange
    // 16 colours to keep things simple
    const rangeStart = 16;
    const rangeEnd = 32;

    const subRange = new ColourSubRange(rangeStart, rangeEnd);
    const colourRange = new ColourRange();
    colourRange.subRanges = [subRange];

    // Now for the actual test
    const expected = new Rgbcolour(128, 128, 128);

    expect(gradient.colourAt(rangeStart + 8, colourRange)).toEqual(expected);
  });
  it('should get the correct colour at the midpoint between red and green', () => {
    // Default gradient
    const redStop = new GradientStop(0.0, {red: 255, green: 0, blue: 0});
    const greenStop = new GradientStop(0.5, {red: 0, green: 255, blue: 0});
    const blueStop = new GradientStop(1.0, {red: 0, green: 0, blue: 255});

    const gradient = new Gradient([redStop, greenStop, blueStop]);

    // Set up colour range/subrange
    // 16 colours to keep things simple
    const rangeStart = 16;
    const rangeEnd = 32;

    const subRange = new ColourSubRange(rangeStart, rangeEnd);
    const colourRange = new ColourRange();
    colourRange.subRanges = [subRange];

    // Now for the actual test
    const expected = new Rgbcolour(128, 128, 0);
    const palIdx = 4 + rangeStart;

    expect(gradient.colourAt(palIdx, colourRange)).toEqual(expected);
  });
  it('should get the correct colour at the beginning gradient stop', () => {
    // Default gradient
    const gradient = new Gradient([blackStop, whiteStop]);

    // Set up colour range/subrange
    const rangeStart = 16;
    const rangeEnd = 32;

    const subRange = new ColourSubRange(rangeStart, rangeEnd);
    const colourRange = new ColourRange();
    colourRange.subRanges = [subRange];

    // Now for the actual test
    const expected = new Rgbcolour(0, 0, 0);

    expect(gradient.colourAt(rangeStart, colourRange)).toEqual(expected);
  });
  it('should get the correct colour at the end gradient stop', () => {
    // Default gradient

    const gradient = new Gradient([blackStop, whiteStop]);

    // Set up colour range/subrange
    const rangeStart = 16;
    const rangeEnd = 32;

    const subRange = new ColourSubRange(rangeStart, rangeEnd);
    const colourRange = new ColourRange();
    colourRange.subRanges = [subRange];

    // Now for the actual test
    const expected = new Rgbcolour(255, 255, 255);

    expect(gradient.colourAt(rangeEnd, colourRange)).toEqual(expected);
  });
  it('should get the correct colour at a gradient stop', () => {
    // Default gradient
    const redStop = new GradientStop(0.0, {red: 255, green: 0, blue: 0});
    const greenStop = new GradientStop(0.5, {red: 0, green: 255, blue: 0});
    const blueStop = new GradientStop(1.0, {red: 0, green: 0, blue: 255});

    const gradient = new Gradient([redStop, greenStop, blueStop]);

    // Set up colour range/subrange
    const rangeStart = 16;
    const rangeEnd = 32;

    const subRange = new ColourSubRange(rangeStart, rangeEnd);
    const colourRange = new ColourRange();
    colourRange.subRanges = [subRange];

    // Now for the actual test
    const expected = new Rgbcolour(0, 255, 0);

    expect(gradient.colourAt(Math.floor((rangeStart + rangeEnd) / 2), colourRange)).toEqual(expected);
  });
  it('should convert to a CSS string', () => {
    const gradient = new Gradient([blackStop, whiteStop]);

    const expected = 'linear-gradient(to right, rgb(0, 0, 0) 0%, rgb(255, 255, 255) 100%)';

    expect(gradient.toCssString()).toEqual(expected);
  });
});
