import { Rgbcolour } from './rgb';

describe('Rgbcolour', () => {
  it('should create an instance', () => {
    expect(new Rgbcolour()).toBeTruthy();
  });
  it('should create a 50% tint between red and blue', () => {
    let red = new Rgbcolour(255);
    let blue = new Rgbcolour(0, 0, 255);
    let expected = new Rgbcolour(128, 0, 128);

    let blended = red.blend(.5, blue, Rgbcolour.tint);
    console.log(blended);
    expect(blended.equals(expected)).toBe(true);
  });
  it('should create a 50% tint between orange and sky blue', () => {
    let skyblue = new Rgbcolour(100, 140, 255);
    let orange = new Rgbcolour(255, 160, 0);
    let expected = new Rgbcolour(178, 150, 128);

    let blended = skyblue.blend(.5, orange, Rgbcolour.tint);
    expect(blended.equals(expected)).toBe(true);
  });
});
