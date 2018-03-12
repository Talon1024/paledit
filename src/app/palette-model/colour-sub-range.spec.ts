import { ColourSubRange } from './colour-sub-range';

describe('ColourSubRange', () => {
  it('should create an instance', () => {
    expect(new ColourSubRange()).toBeTruthy();
  });
  it('should get the correct length', () => {
    let range = new ColourSubRange();
    range.start = 10;
    range.end = 16;
    let expected = 6;

    expect(range.getLength()).toEqual(expected);
  });
  it('should get the correct length where start > end', () => {
    let range = new ColourSubRange();
    range.start = 16;
    range.end = 10;
    let expected = 6;

    expect(range.getLength()).toEqual(expected);
  });
});
