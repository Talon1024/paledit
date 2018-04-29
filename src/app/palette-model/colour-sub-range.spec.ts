import { ColourSubRange } from './colour-sub-range';

describe('ColourSubRange', () => {
  it('should create an instance', () => {
    expect(new ColourSubRange()).toBeTruthy();
  });
  it('should get the correct length', () => {
    let range = new ColourSubRange(10, 15);
    let expected = 6;

    expect(range.getLength()).toEqual(expected);
  });
  it('should get the correct length where start > end', () => {
    let range = new ColourSubRange(15, 10);
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
  it('should return the right start/end values when start > end', () => {
    let range = new ColourSubRange(32, 16);
    let [start, end] = range.sorted();
    let expectedStart = 16;
    let expectedEnd = 32;

    expect(start).toEqual(expectedStart);
    expect(end).toEqual(expectedEnd);
  });
});
