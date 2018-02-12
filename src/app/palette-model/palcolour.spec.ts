import { Palcolour } from './palcolour';

describe('Palcolour', () => {
  it('should create an instance', () => {
    expect(new Palcolour()).toBeTruthy();
  });
  it('should create a 50% blend between red and blue', () => {
    let red = new Palcolour(255);
    let blue = new Palcolour(0, 0, 255);

    let blended = red.tint(.5, blue);
    expect(blended).toBe(new Palcolour(128, 0, 128));
  });
});
