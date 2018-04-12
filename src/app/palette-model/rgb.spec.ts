import { Rgbcolour } from './rgb';

describe('Rgbcolour', () => {
  it('should create an instance', () => {
    expect(new Rgbcolour()).toBeTruthy();
  });
  it('should create an instance from red, green, and blue values', () => {

    let colour = new Rgbcolour(100, 140, 255);

    expect(colour.red).toEqual(100);
    expect(colour.green).toEqual(140);
    expect(colour.blue).toEqual(255);
  });
  it('should create an instance from an Rgb object', () => {
    let rgb = {red: 100, green: 140, blue: 255};
    let colour = new Rgbcolour(rgb);

    expect(colour.red).toEqual(100);
    expect(colour.green).toEqual(140);
    expect(colour.blue).toEqual(255);
  });
  it('should add 100% red and 50% blue together to create pink', () => {
    let red = new Rgbcolour(255);
    let blue = new Rgbcolour(0, 0, 128);
    let expected = new Rgbcolour(255, 0, 128);

    let blended = red.blend(1, blue, Rgbcolour.add);
    expect(blended.equals(expected)).toBe(true);
  });
  it('should create a 50% tint between orange and sky blue', () => {
    let skyblue = new Rgbcolour(100, 140, 255);
    let orange = new Rgbcolour(255, 160, 0);
    let expected = new Rgbcolour(178, 150, 128);

    let blended = skyblue.blend(.5, orange, Rgbcolour.tint);
    expect(blended.equals(expected)).toBe(true);
  });
  it('should create a 50% tint between red and green', () => {
    let red = new Rgbcolour(255, 0, 0);
    let green = new Rgbcolour(0, 255, 0);
    let expected = new Rgbcolour(128, 128, 0);

    let blended = red.blend(.5, green, Rgbcolour.tint);
    expect(blended.equals(expected)).toBe(true);
  });
  it('Convert HSV to RGB', () => {
    let expected = new Rgbcolour(255, 0, 0);
    let actual = Rgbcolour.fromHSV(0, 1.0, 255);

    expect(actual).toEqual(expected);
  });
  it('Get HSV for red colour', () => {
    let colour = new Rgbcolour(255, 0, 0);
    let expected = {
      hue: 0,
      saturation: 1.0,
      value: 255
    };

    expect(colour.hsv()).toEqual(expected);
  });
  it('Get HSV for green colour', () => {
    let colour = new Rgbcolour(0, 255, 0);
    let expected = {
      hue: 120,
      saturation: 1.0,
      value: 255
    };

    expect(colour.hsv()).toEqual(expected);
  });
  it('Get HSV for blue colour', () => {
    let colour = new Rgbcolour(0, 0, 255);
    let expected = {
      hue: 240,
      saturation: 1.0,
      value: 255
    };

    expect(colour.hsv()).toEqual(expected);
  });
  it('Get HSV for orange colour', () => {
    let colour = new Rgbcolour(255, 128, 0);
    let expected = {
      hue: 30,
      saturation: 1.0,
      value: 255
    };

    expect(colour.hsv()).toEqual(expected);
  });
  it('Get HSV for sky blue colour', () => {
    let colour = new Rgbcolour(100, 140, 255);
    let expected = {
      hue: 225,
      saturation: 0.607843137254902,
      value: 255
    };

    expect(colour.hsv()).toEqual(expected);
  });
});
