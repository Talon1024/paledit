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
    // WIP!!
    let components:[{value:number; sortOrder:number}] = [{
      value: this.red,
      sortOrder: 0
    },
    {
      value: this.green,
      sortOrder: 0
    },
    {
      value: this.blue,
      sortOrder: 0
    }];

    for (let a = 0; a < components.length; a++) {
      for (let b = 0; b < components.length; b++) {
        if (components[b].value > components[a].value) components[b].sortOrder += 1;
      }
    }

    let sortOrders = components.map((e) => e.sortOrder);

    // Bring all sort order values to the minimum
    {
      // I don't want to use minSortOrder after this.
      let minSortOrder = Math.min.apply(this, sortOrders);
      components.forEach((c) => c.sortOrder -= minSortOrder);
    }

    let hueSections:Array<number>[] = new Array(6);
    hueSections[0] = [2, 1, 0];
    hueSections[1] = [1, 2, 0];
    hueSections[2] = [0, 2, 1];
    hueSections[3] = [0, 1, 2];
    hueSections[4] = [1, 0, 2];
    hueSections[5] = [2, 0, 1];

    // Ensure at least one element of sortOrders is 1
    sortOrders = components.map((e) => e.sortOrder);
    if (!sortOrders.includes(1)) {
      for (let a = 0; a < sortOrders.length; a++) {
        if(sortOrders[a] === 2) sortOrders = hueSections[a * 2];
      }
    }

    let hue = hueSections.indexOf(sortOrders) * 60;
    let saturation = 1.0 - (Math.min.apply(this, components.map((c) => c.value)) / 255);
    let value = Math.max.apply(this, components.map((c) => c.value));

    return {
      hue: hue,
      saturation: saturation,
      value: value
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
