import { PalTranslation, Rgbrange } from './translation';
import { ColourSubRange } from './colour-sub-range';
import { Rgbcolour } from './rgb';

describe('PalTranslation', () => {
  it('should create an instance', () => {
    expect(new PalTranslation()).toBeTruthy();
  });
  it('should stringify a palette translation correctly', () => {
    // https://zdoom.org/wiki/Translation#Palette_range_to_palette_range
    const trans = new PalTranslation();
    trans.source = new ColourSubRange(16, 32);
    trans.dest = new ColourSubRange(100, 128);

    const expected = '16:32=100:128';
    expect(trans.toString()).toEqual(expected);
  });
  it('should stringify a direct Palette to RGB translation correctly', () => {
    // https://zdoom.org/wiki/Translation#Direct_color_translations
    const trans = new PalTranslation();
    trans.source = new ColourSubRange(16, 32);
    trans.dest = new Rgbrange();
    trans.dest.start = Rgbcolour.makeRgb(100, 140, 255);
    trans.dest.end = Rgbcolour.makeRgb(255, 140, 0);

    const expected = '16:32=[100,140,255]:[255,140,0]';
    expect(trans.toString()).toEqual(expected);
  });
  it('should stringify a desaturated Palette to RGB translation correctly', () => {
    // https://zdoom.org/wiki/Translation#Desaturated_color_translations
    const trans = new PalTranslation();
    trans.source = new ColourSubRange(16, 32);
    trans.dest = new Rgbrange();
    trans.dest.effect = '%';
    trans.dest.start = {red: 0.2, green: 0.4, blue: 1.0};
    trans.dest.end = {red: 1.0, green: 0.4, blue: 0.0};

    const expected = '16:32=%[0.2,0.4,1]:[1,0.4,0]';
    expect(trans.toString()).toEqual(expected);
  });
  it('should stringify a blended Palette to RGB translation correctly', () => {
    // https://zdoom.org/wiki/Translation#Blended_translations
    const trans = new PalTranslation();
    trans.source = new ColourSubRange(16, 32);
    trans.dest = new Rgbrange();
    trans.dest.start = Rgbcolour.makeRgb(255, 140, 0);
    trans.dest.effect = '#';

    const expected = '16:32=#[255,140,0]';
    expect(trans.toString()).toEqual(expected);
  });
  it('should stringify a tinted Palette to RGB translation correctly', () => {
    // https://zdoom.org/wiki/Translation#Tinted_translations
    const trans = new PalTranslation();
    trans.source = new ColourSubRange(16, 32);
    trans.dest = new Rgbrange();
    trans.dest.start = Rgbcolour.makeRgb(255, 140, 0);
    trans.dest.effect = '@39';

    const expected = '16:32=@39[255,140,0]';
    expect(trans.toString()).toEqual(expected);
  });
  it('should parse a palette translation', () => {
    const palTrans = '16:32=100:128';

    const expected = new PalTranslation();
    expected.source = new ColourSubRange(16, 32);
    expected.dest = new ColourSubRange(100, 128);

    const parsed = PalTranslation.parse(palTrans);

    expect(parsed).toEqual(expected);
  });
  it('should parse a direct palette to RGB translation', () => {
    const transtr = '16:32=[100,140,255]:[255,160,0]';

    const expected = new PalTranslation();
    expected.source = new ColourSubRange(16, 32);
    expected.dest = new Rgbrange();
    expected.dest.start = {red: 100, green: 140, blue: 255};
    expected.dest.end = {red: 255, green: 160, blue: 0};
    expected.dest.effect = '';

    const parsed = PalTranslation.parse(transtr);

    expect(parsed).toEqual(expected);
  });
  it('should parse a desaturated palette to RGB translation', () => {
    const transtr = '16:32=%[0.2,0.4,1.0]:[1.0,0.4,0.0]';

    const expected = new PalTranslation();
    expected.source = new ColourSubRange(16, 32);
    expected.dest = new Rgbrange();
    expected.dest.start = {red: 0.2, green: 0.4, blue: 1.0};
    expected.dest.end = {red: 1.0, green: 0.4, blue: 0.0};
    expected.dest.effect = '%';

    const parsed = PalTranslation.parse(transtr);

    expect(parsed).toEqual(expected);
  });
  it('should parse a blended palette to RGB translation', () => {
    const transtr = '16:32=#[255,140,0]';

    const expected = new PalTranslation();
    expected.source = new ColourSubRange(16, 32);
    expected.dest = new Rgbrange();
    expected.dest.start = {red: 255, green: 140, blue: 0};
    expected.dest.effect = '#';

    const parsed = PalTranslation.parse(transtr);

    expect(parsed).toEqual(expected);
  });
  it('should parse a tinted palette to RGB translation', () => {
    const transtr = '16:32=@39[255,140,0]';

    const expected = new PalTranslation();
    expected.source = new ColourSubRange(16, 32);
    expected.dest = new Rgbrange();
    expected.dest.start = {red: 255, green: 140, blue: 0};
    expected.dest.effect = '@39';

    const parsed = PalTranslation.parse(transtr);

    expect(parsed).toEqual(expected);
  });
});
