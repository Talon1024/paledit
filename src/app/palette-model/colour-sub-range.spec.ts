import { ColourSubRange } from './colour-sub-range';

describe('ColourSubRange', () => {
  it('should create an instance', () => {
    expect(new ColourSubRange()).toBeTruthy();
  });
  it('should get the correct length', () => {
    let range = new ColourSubRange(10, 16);
    let expected = 6;

    expect(range.getLength()).toEqual(expected);
  });
  it('should get the correct length where start > end', () => {
    let range = new ColourSubRange(16, 10);
    let expected = 6;

    expect(range.getLength()).toEqual(expected);
  });
  it('should return true when asked whether 22 is in between 16 and 32', () => {
    let range = new ColourSubRange(16, 32);
    let indexInRange = 22;

    expect(range.contains(indexInRange)).toBe(true);
  });
  it('should return false when asked whether 69 is in between 16 and 32', () => {
    let range = new ColourSubRange(16, 32);
    let indexInRange = 69;

    expect(range.contains(indexInRange)).toBe(false);
  });
  it('should always have a start value less than the end value when start value is reassigned', () => {
    let range = new ColourSubRange(16, 32);
    range.start = 48;

    expect(range.start).toEqual(32);
    expect(range.end).toEqual(48);
  });
  it('should always have an end value greater than the start value when end value is reassigned', () => {
    let range = new ColourSubRange(16, 32);
    range.end = 8;

    expect(range.start).toEqual(8);
    expect(range.end).toEqual(16);
  });
});
