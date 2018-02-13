import { Palcolour } from './palcolour';

describe('Palcolour', () => {
  it('should create an instance', () => {
    expect(new Palcolour()).toBeTruthy();
  });
  it('should create a 50% tint between red and blue', () => {
    let red = new Palcolour(255);
    let blue = new Palcolour(0, 0, 255);

    let blended = red.blend(.5, blue, Palcolour.tint);
    expect(blended.equals(new Palcolour(128, 0, 128))).toBe(true);
  });
  it('should create a 50% tint between orange and sky blue', () => {
    let skyblue = new Palcolour(100, 140, 255);
    let orange = new Palcolour(255, 160, 0);

    let blended = skyblue.blend(.5, orange, Palcolour.tint);
    expect(blended.equals(new Palcolour(178, 150, 128))).toBe(true);
  });
});
