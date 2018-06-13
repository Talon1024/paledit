import { ColourSubRange } from './colour-sub-range';

describe('ColourSubRange', () => {
  it('should create an instance', () => {
    expect(new ColourSubRange()).toBeTruthy();
  });
  it('should get the correct length', () => {
    const range = new ColourSubRange(10, 15);
    const expected = 6;

    expect(range.getLength()).toEqual(expected);
  });
  it('should get the correct length where start > end', () => {
    const range = new ColourSubRange(15, 10);
    const expected = 6;

    expect(range.getLength()).toEqual(expected);
  });
  it('should return true when asked whether 22 is in between 16 and 32', () => {
    const range = new ColourSubRange(16, 32);
    const indexInRange = 22;

    expect(range.contains(indexInRange)).toBe(true);
  });
  it('should return false when asked whether 69 is in between 16 and 32', () => {
    const range = new ColourSubRange(16, 32);
    const indexInRange = 69;

    expect(range.contains(indexInRange)).toBe(false);
  });
  it('should return the right start/end values when start > end', () => {
    const range = new ColourSubRange(32, 16);
    const [start, end] = range.sorted();
    const expectedStart = 16;
    const expectedEnd = 32;

    expect(start).toEqual(expectedStart);
    expect(end).toEqual(expectedEnd);
  });
});
