export interface Rgb {
  red:number;
  green:number;
  blue:number;
}

export interface Hsv {
  hue:number;
  saturation:number;
  value:number;
}

export class Rgbcolour implements Rgb {
  red:number;
  green:number;
  blue:number;

  static readonly components = [ 'red', 'green', 'blue' ];

  // Rgb type guard
  static isRgb(rgb:number | Rgb): rgb is Rgb {
      return (
        rgb.hasOwnProperty("red") &&
        rgb.hasOwnProperty("green") &&
        rgb.hasOwnProperty("blue"));
  }

  constructor(redOrRgb:number | Rgb = 0, green:number = 0, blue:number = 0) {
    if (Rgbcolour.isRgb(redOrRgb)) {
      this.red = redOrRgb.red;
      this.green = redOrRgb.green;
      this.blue = redOrRgb.blue;
    } else {
      this.red = (<number>redOrRgb) & 0xFF;
      this.green = green & 0xFF;
      this.blue = blue & 0xFF;
    }
  }

  static fromHSV(hue:number, saturation:number, value:number):Rgbcolour {
    if (hue >= 360 || hue < 0) return new Rgbcolour(0,0,0);

    // https://en.wikipedia.org/wiki/HSL_and_HSV#From_HSV
    let chroma = value * saturation;
    let colourSection = hue / 60.0;
    let x = chroma * (1 - Math.abs(colourSection % 2 - 1));

    let hueSections = new Array<Rgb>(6);
    hueSections[0] = {red: chroma, green: x, blue: 0};
    hueSections[1] = {red: x, green: chroma, blue: 0};
    hueSections[2] = {red: 0, green: chroma, blue: x};
    hueSections[3] = {red: 0, green: x, blue: chroma};
    hueSections[4] = {red: x, green: 0, blue: chroma};
    hueSections[5] = {red: chroma, green: 0, blue: x};

    let m = value - chroma;
    let colour = hueSections[Math.floor(colourSection)];
    return new Rgbcolour(colour.red + m, colour.green + m, colour.blue + m);
  }

  hsv():Hsv {
    // Modified from:
    // https://github.com/Qix-/color-convert/blob/master/conversions.js#L97
    /*
    Copyright (c) 2011-2016 Heather Arthur <fayearthur@gmail.com>

    Permission is hereby granted, free of charge, to any person obtaining
    a copy of this software and associated documentation files (the
    "Software"), to deal in the Software without restriction, including
    without limitation the rights to use, copy, modify, merge, publish,
    distribute, sublicense, and/or sell copies of the Software, and to
    permit persons to whom the Software is furnished to do so, subject to
    the following conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.
    */
    var r = this.red;
    var g = this.green;
    var b = this.blue;
    var min = Math.min(r, g, b);
    var max = Math.max(r, g, b);
    var delta = max - min;
    var h;
    var s;

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

  value():number {
    return Math.max(this.red, this.green, this.blue);
  }

  toHex():string {
    let rgb = new Rgbcolour();
    for (let part of Rgbcolour.components) {
      rgb[part] = this[part].toString(16);
      if (rgb[part].length < 2) rgb[part] = `0${rgb[part]}`;
    }
    let { red, green, blue } = rgb;
    return `#${red}${green}${blue}`;
  }

  opposite(minDiff:number = 0):Rgbcolour {
    let red = 0xFF - this.red;
    let green = 0xFF - this.green;
    let blue = 0xFF - this.blue;
    if (Math.abs(this.red - red) < minDiff) {
      red += this.red > 128 ? -minDiff : minDiff;
    }
    if (Math.abs(this.green - green) < minDiff) {
      green += this.green > 128 ? -minDiff : minDiff;
    }
    if (Math.abs(this.blue - blue) < minDiff) {
      blue += this.blue > 128 ? -minDiff : minDiff;
    }
    return new Rgbcolour(red, green, blue);
  }

  getStyles():Object {
    return {
      'background-color': this.toHex(),
      'color': this.opposite(64).toHex()
    };
  }

  static round(colour:Rgbcolour):Rgbcolour {
    for (let part of Rgbcolour.components) {
      colour[part] = Math.round(colour[part]);
    }
    return colour;
  }

  blend(percentage:number, colour:Rgbcolour, func:(p:number, c:Rgbcolour, d:Rgbcolour) => Rgbcolour):Rgbcolour {
    return Rgbcolour.round(func(percentage, this, colour));
  }

  static tint(percentage:number, colour:Rgbcolour, otherColour:Rgbcolour):Rgbcolour {
    const thisPct = 1 - percentage;
    let newColour = new Rgbcolour();
    for (let part of Rgbcolour.components) {
      newColour[part] = colour[part] * thisPct + otherColour[part] * percentage;
    }
    return newColour;
  }

  static add(percentage:number, colour:Rgbcolour, otherColour:Rgbcolour):Rgbcolour {
    let newColour = new Rgbcolour();
    for (let part of Rgbcolour.components) {
      newColour[part] = colour[part] + otherColour[part] * percentage;
    }
    return newColour;
  }

  equals(other:Rgbcolour):boolean {
    return other.red === this.red &&
      other.green === this.green &&
      other.blue === this.blue
  }
}
