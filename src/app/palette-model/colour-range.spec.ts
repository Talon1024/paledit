import { ColourRange } from './colour-range';
import { ColourSubRange } from './colour-sub-range';

describe('ColourRange', () => {
  it('should create an instance', () => {
    expect(new ColourRange()).toBeTruthy();
  });
  it('should get the correct length of a range with one sub-range', () => {
    const subRange = new ColourSubRange(16, 31);
    const range = new ColourRange([subRange]);

    const expected = 16;

    expect(range.getLength()).toEqual(expected);
  });
  it('should get the correct length of a range with more than one sub-range', () => {
    const subRange = new ColourSubRange(16, 31);
    const subRange2 = new ColourSubRange(48, 63);
    const range = new ColourRange([subRange, subRange2]);

    const expected = 32;

    expect(range.getLength()).toEqual(expected);
  });
  it('should get the palette indices of a range with one sub-range', () => {
    const subRange = new ColourSubRange(16, 32);
    const range = new ColourRange([subRange]);

    const expected = [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32];

    expect(range.getIndices()).toEqual(expected);
  });
  it('should get the palette indices of a range with more than one sub-range', () => {
    const subRange = new ColourSubRange(16, 32);
    const subRange2 = new ColourSubRange(48, 64);
    const range = new ColourRange([subRange, subRange2]);

    const expected = [
      16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, // First sub-range
      48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64 // Second sub-range
    ];

    expect(range.getIndices()).toEqual(expected);
  });
  it('should convert a palette index to a range index where the range has one sub-range', () => {
    const subRange = new ColourSubRange(16, 32);
    const range = new ColourRange([subRange]);

    const palIdx = 24;
    const expected = 8;

    expect(range.palToRangeIdx(palIdx)).toEqual(expected);
  });
  it('should convert a palette index to a range index where the range has more than one sub-range', () => {
    const subRange = new ColourSubRange(16, 31);
    const subRange2 = new ColourSubRange(48, 63);
    const range = new ColourRange([subRange, subRange2]);

    const palIdx = 60;
    const expected = 28;

    expect(range.palToRangeIdx(palIdx)).toEqual(expected);
  });
  it('should return -1 when asked to convert a palette index not within the range to a range index', () => {
    const subRange = new ColourSubRange(16, 32);
    const range = new ColourRange([subRange]);

    const palIdx = 66;
    const expected = -1;

    expect(range.palToRangeIdx(palIdx)).toEqual(expected);
  });
  it('should get the palette indices of a range with one reversed sub-range', () => {
    const subRange = new ColourSubRange(32, 16);
    const range = new ColourRange([subRange]);

    const expected = [
      32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16
    ];

    expect(range.getIndices()).toEqual(expected);
  });
  it('should get the palette indices of a range with two sub-ranges, one reversed', () => {
    const subRange = new ColourSubRange(16, 32);
    const subRange2 = new ColourSubRange(64, 48);
    const range = new ColourRange([subRange, subRange2]);

    const expected = [
      16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, // First sub-range
      64, 63, 62, 61, 60, 59, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 48 // Second sub-range
    ];

    expect(range.getIndices()).toEqual(expected);
  });
  it('should get the correct length if the range has one or more sub-ranges with 1 colour', () => {
    const subRanges = [
      new ColourSubRange(19, 19),
      new ColourSubRange(21, 21),
      new ColourSubRange(26, 26),
      new ColourSubRange(31, 31),
      new ColourSubRange(50, 50),
      new ColourSubRange(53, 53),
      new ColourSubRange(55, 55),
      new ColourSubRange(58, 58),
      new ColourSubRange(62, 62)
    ];

    const range = new ColourRange(subRanges);

    const expected = 9;

    expect(range.getLength()).toEqual(expected);
  });
  it('should get the correct indices if the range has one or more sub-ranges with 1 colour', () => {
    const subRanges = [
      new ColourSubRange(19, 19),
      new ColourSubRange(21, 21),
      new ColourSubRange(26, 26),
      new ColourSubRange(31, 31),
      new ColourSubRange(50, 50),
      new ColourSubRange(53, 53),
      new ColourSubRange(55, 55),
      new ColourSubRange(58, 58),
      new ColourSubRange(62, 62)
    ];

    const range = new ColourRange(subRanges);

    const expected = [19, 21, 26, 31, 50, 53, 55, 58, 62];

    expect(range.getIndices()).toEqual(expected);
  });
  it('should get the correct range index if the range has one or more sub-ranges with 1 colour', () => {
    const subRanges = [
      new ColourSubRange(19, 19),
      new ColourSubRange(21, 21),
      new ColourSubRange(26, 26),
      new ColourSubRange(31, 31),
      new ColourSubRange(50, 50),
      new ColourSubRange(53, 53),
      new ColourSubRange(55, 55),
      new ColourSubRange(58, 58),
      new ColourSubRange(62, 62)
    ];

    const range = new ColourRange(subRanges);
    const palIdx = 26;
    const expected = 2;

    expect(range.palToRangeIdx(palIdx)).toEqual(expected);
  });
  it('getLength() should be the same as the length of the palette indices', () => {
    const subRange = new ColourSubRange(16, 32);
    const range = new ColourRange([subRange]);

    const expected = range.getLength();
    const palIdxs = range.getIndices();

    expect(palIdxs.length).toEqual(expected);
  });
});
