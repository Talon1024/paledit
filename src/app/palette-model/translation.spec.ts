import { PalTranslation, Rgbrange } from './translation';
import { ColourSubRange } from './colour-sub-range';
import { Rgbcolour } from './rgb';

describe('PalTranslation', () => {
  it('should create an instance', () => {
    expect(new PalTranslation()).toBeTruthy();
  });
  it('should stringify a palette translation correctly', () => {
    let trans = new PalTranslation();
    trans.source = new ColourSubRange(16, 32);
    trans.dest = new ColourSubRange(100, 128);

    let expected = "16:32=100:128";
    expect(trans.toString()).toEqual(expected);
  });
  it('should stringify a direct Palette to RGB translation correctly', () => {
    let trans = new PalTranslation();
    trans.source = new ColourSubRange(16, 32);
    trans.dest = new Rgbrange();
    trans.dest.start = new Rgbcolour(100, 140, 255);
    trans.dest.end = new Rgbcolour(255, 140, 0);

    let expected = "16:32=[100,140,255]:[255,140,0]";
    expect(trans.toString()).toEqual(expected);
  });
  it('should stringify a desaturated Palette to RGB translation correctly', () => {
    let trans = new PalTranslation();
    trans.source = new ColourSubRange(16, 32);
    trans.dest = new Rgbrange();
    trans.dest.effect = "%";
    trans.dest.start = {red: 0.2, green: 0.4, blue: 1.0};
    trans.dest.end = {red: 1.0, green: 0.4, blue: 0.0};

    let expected = "16:32=%[0.2,0.4,1]:[1,0.4,0]";
    expect(trans.toString()).toEqual(expected);
  });
  it('should stringify a blended Palette to RGB translation correctly', () => {
    let trans = new PalTranslation();
    trans.source = new ColourSubRange(16, 32);
    trans.dest = new Rgbrange();
    trans.dest.start = new Rgbcolour(255, 140, 0);
    trans.dest.effect = "#";

    let expected = "16:32=#[255,140,0]";
    expect(trans.toString()).toEqual(expected);
  });
});