import { Rgbcolour } from './rgb';

describe('Rgbcolour', () => {
  it('should create an instance', () => {
    expect(new Rgbcolour()).toBeTruthy();
  });
  it('should create an instance from red, green, and blue values', () => {

    const colour = new Rgbcolour(100, 140, 255);

    expect(colour.red).toEqual(100);
    expect(colour.green).toEqual(140);
    expect(colour.blue).toEqual(255);
  });
  it('should create an instance from an Rgb object', () => {
    const rgb = {red: 100, green: 140, blue: 255};
    const colour = new Rgbcolour(rgb);

    expect(colour.red).toEqual(100);
    expect(colour.green).toEqual(140);
    expect(colour.blue).toEqual(255);
  });
  it('should add 100% red and 50% blue together to create pink', () => {
    const red = new Rgbcolour(255);
    const blue = new Rgbcolour(0, 0, 128);
    const expected = new Rgbcolour(255, 0, 128);

    const blended = red.blend(1, blue, Rgbcolour.add);
    expect(blended.equals(expected)).toBe(true);
  });
  it('should create a 50% tint between orange and sky blue', () => {
    const skyblue = new Rgbcolour(100, 140, 255);
    const orange = new Rgbcolour(255, 160, 0);
    const expected = new Rgbcolour(178, 150, 128);

    const blended = skyblue.blend(.5, orange, Rgbcolour.tint);
    expect(blended.equals(expected)).toBe(true);
  });
  it('should create a 50% tint between red and green', () => {
    const red = new Rgbcolour(255, 0, 0);
    const green = new Rgbcolour(0, 255, 0);
    const expected = new Rgbcolour(128, 128, 0);

    const blended = red.blend(.5, green, Rgbcolour.tint);
    expect(blended.equals(expected)).toBe(true);
  });
  it('should convert HSV to RGB', () => {
    const expected = new Rgbcolour(255, 0, 0);
    const actual = Rgbcolour.fromHSV(0, 1.0, 255);

    expect(actual).toEqual(expected);
  });
  it('should get HSV for red colour', () => {
    const colour = new Rgbcolour(255, 0, 0);
    const expected = {
      hue: 0,
      saturation: 1.0,
      value: 255
    };

    expect(colour.hsv()).toEqual(expected);
  });
  it('should get HSV for green colour', () => {
    const colour = new Rgbcolour(0, 255, 0);
    const expected = {
      hue: 120,
      saturation: 1.0,
      value: 255
    };

    expect(colour.hsv()).toEqual(expected);
  });
  it('should get HSV for blue colour', () => {
    const colour = new Rgbcolour(0, 0, 255);
    const expected = {
      hue: 240,
      saturation: 1.0,
      value: 255
    };

    expect(colour.hsv()).toEqual(expected);
  });
  it('should get HSV for orange colour', () => {
    const colour = new Rgbcolour(255, 128, 0);
    const expected = {
      hue: 30,
      saturation: 1.0,
      value: 255
    };

    expect(colour.hsv()).toEqual(expected);
  });
  it('should get HSV for sky blue colour', () => {
    const colour = new Rgbcolour(100, 140, 255);
    const expected = {
      hue: 225,
      saturation: 0.609375,
      value: 255
    };

    expect(colour.hsv()).toEqual(expected);
  });
  it('should return same HSV that was used to make the colour', () => {
    const expected = {
      hue: 110,
      saturation: 0.75,
      value: 192
    };
    const colour = Rgbcolour.fromHSV(expected.hue, expected.saturation, expected.value);

    expect(colour.hsv()).toEqual(expected);
  });
});
