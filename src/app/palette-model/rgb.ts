export interface Rgb {
  red: number;
  green: number;
  blue: number;
}

export interface Hsv {
  hue: number;
  saturation: number;
  value: number;
}

export class Rgbcolour {
  static readonly components = [ 'red', 'green', 'blue' ];

  static makeRgb(red: number = 0, green: number = 0, blue: number = 0): Rgb {
    return {red, green, blue};
  }

  // Rgb type guard
  static isRgb(rgb: number | Rgb): rgb is Rgb {
      return (
        rgb.hasOwnProperty('red') &&
        rgb.hasOwnProperty('green') &&
        rgb.hasOwnProperty('blue'));
  }

  static round(colour: Rgb): Rgb {
    for (const part of Rgbcolour.components) {
      colour[part] = Math.round(colour[part]);
    }
    return colour;
  }

  static tint(percentage: number, colour: Rgb, otherColour: Rgb): Rgb {
    const thisPct = 1 - percentage;
    const newColour = Rgbcolour.makeRgb();
    for (const part of Rgbcolour.components) {
      newColour[part] = colour[part] * thisPct + otherColour[part] * percentage;
    }
    return newColour;
  }

  static add(percentage: number, colour: Rgb, otherColour: Rgb): Rgb {
    const newColour = Rgbcolour.makeRgb();
    for (const part of Rgbcolour.components) {
      newColour[part] = colour[part] + otherColour[part] * percentage;
    }
    return newColour;
  }

  static fromHSV(hue: number, saturation: number, value: number): Rgb {
    if (hue >= 360 || hue < 0) { return {red: 0, green: 0, blue: 0}; }

    // https: //en.wikipedia.org/wiki/HSL_and_HSV#From_HSV
    const chroma = value * saturation;
    const colourSection = hue / 60.0;
    const x = chroma * (1 - Math.abs(colourSection % 2 - 1));

    const hueSections = new Array<Rgb>(6);
    hueSections[0] = {red: chroma, green: x, blue: 0};
    hueSections[1] = {red: x, green: chroma, blue: 0};
    hueSections[2] = {red: 0, green: chroma, blue: x};
    hueSections[3] = {red: 0, green: x, blue: chroma};
    hueSections[4] = {red: x, green: 0, blue: chroma};
    hueSections[5] = {red: chroma, green: 0, blue: x};

    const m = value - chroma;
    const colour = hueSections[Math.floor(colourSection)];
    return Rgbcolour.makeRgb(colour.red + m, colour.green + m, colour.blue + m);
  }

  static fromHex(hex: string): Rgb {
    const newColour = Rgbcolour.makeRgb();
    if (hex.startsWith('#')) {
      hex = hex.substr(1);
    }
    newColour.red = Number.parseInt(hex.substr(0, 2), 16) % 256;
    newColour.green = Number.parseInt(hex.substr(2, 2), 16) % 256;
    newColour.blue = Number.parseInt(hex.substr(4, 2), 16) % 256;
    return newColour;
  }

  static hsv(colour: Rgb): Hsv {
    // Modified from:
    // https: //github.com/Qix-/color-convert/blob/master/conversions.js#L97
    /*
    Copyright (c) 2011-2016 Heather Arthur <fayearthur@gmail.com>

    Permission is hereby granted, free of charge, to any person obtaining
    a copy of this software and associated documentation files (the
    'Software'), to deal in the Software without restriction, including
    without limitation the rights to use, copy, modify, merge, publish,
    distribute, sublicense, and/or sell copies of the Software, and to
    permit persons to whom the Software is furnished to do so, subject to
    the following conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.
    */
    const r = colour.red;
    const g = colour.green;
    const b = colour.blue;
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    const delta = max - min;
    let h;
    let s;

    if (max === 0) {
      s = 0;
    } else {
      s = delta / max;
    }

    if (max === min) {
      h = 0;
    } else if (r === max) {
      h = (g - b) / delta;
    } else if (g === max) {
      h = 2 + (b - r) / delta;
    } else if (b === max) {
      h = 4 + (r - g) / delta;
    }

    h = Math.min(h * 60, 360);

    if (h < 0) {
      h += 360;
    }

    return {
      hue: h,
      saturation: s,
      value: max
    };
  }

  static toHex(colour: Rgb): string {
    const rgb = {red: '', green: '', blue: ''};
    for (const part of Rgbcolour.components) {
      rgb[part] = colour[part].toString(16);
      if (rgb[part].length < 2) { rgb[part] = `0${rgb[part]}`; }
    }
    const { red, green, blue } = rgb;
    return `#${red}${green}${blue}`;
  }

  static opposite(colour: Rgb, minDiff: number = 0): Rgb {
    let red = 0xFF - colour.red;
    let green = 0xFF - colour.green;
    let blue = 0xFF - colour.blue;
    if (Math.abs(colour.red - red) < minDiff) {
      red += colour.red > 128 ? -minDiff : minDiff;
    }
    if (Math.abs(colour.green - green) < minDiff) {
      green += colour.green > 128 ? -minDiff : minDiff;
    }
    if (Math.abs(colour.blue - blue) < minDiff) {
      blue += colour.blue > 128 ? -minDiff : minDiff;
    }
    return Rgbcolour.makeRgb(red, green, blue);
  }

  static getStyles(colour: Rgb): Object {
    return {
      'background-color': Rgbcolour.toHex(colour),
      'color': Rgbcolour.toHex(Rgbcolour.opposite(colour, 64))
    };
  }

  static blend(colour: Rgb, percentage: number, other: Rgb, func: (p: number, c: Rgb, d: Rgb) => Rgb): Rgb {
    return Rgbcolour.round(func(percentage, colour, other));
  }

  static equals(colour: Rgb, other: Rgb): boolean {
    return other.red === colour.red &&
      other.green === colour.green &&
      other.blue === colour.blue;
  }
}
