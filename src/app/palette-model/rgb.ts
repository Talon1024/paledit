export class Rgbcolour {
  red:number;
  green:number;
  blue:number;

  static readonly components = [ 'red', 'green', 'blue' ];

  constructor(red:number = 0, green:number = 0, blue:number = 0) {
    this.red = red & 0xFF;
    this.green = green & 0xFF;
    this.blue = blue & 0xFF;
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
      Math.round(colour[part]);
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