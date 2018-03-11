import { Rgbcolour } from './rgb';

describe('Rgbcolour', () => {
  it('should create an instance', () => {
    expect(new Rgbcolour()).toBeTruthy();
  });
  it('should add 100% red and 50% blue together to create pink', () => {
    let red = new Rgbcolour(255);
    let blue = new Rgbcolour(0, 0, 128);
    let expected = new Rgbcolour(255, 0, 128);

    let blended = red.blend(1, blue, Rgbcolour.add);
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
