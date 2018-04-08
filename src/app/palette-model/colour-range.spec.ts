import { ColourRange } from './colour-range';
import { ColourSubRange } from './colour-sub-range';

describe('ColourRange', () => {
  it('should create an instance', () => {
    expect(new ColourRange()).toBeTruthy();
  });
  it('should get the correct length of a range with one sub-range', () => {
    let subRange = new ColourSubRange(16, 32);
    let range = new ColourRange([subRange]);

    let expected = 16;

    expect(range.getLength()).toEqual(expected);
  });
  it('should get the correct length of a range with more than one sub-range', () => {
    let subRange = new ColourSubRange(16, 32);
    let subRange2 = new ColourSubRange(48, 64);
    let range = new ColourRange([subRange, subRange2]);

    let expected = 32;

    expect(range.getLength()).toEqual(expected);
  });
  it('should get the palette indices of a range with one sub-range', () => {
    let subRange = new ColourSubRange(16, 32);
    let range = new ColourRange([subRange]);

    let expected = [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32];

    expect(range.getIndices()).toEqual(expected);
  });
  it('should get the palette indices of a range with more than one sub-range', () => {
    let subRange = new ColourSubRange(16, 32);
    let subRange2 = new ColourSubRange(48, 64);
    let range = new ColourRange([subRange, subRange2]);

    let expected = [
      16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, // First sub-range
      48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64 // Second sub-range
    ];

    expect(range.getIndices()).toEqual(expected);
  });
});
