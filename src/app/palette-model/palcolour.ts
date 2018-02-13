class Rgbstruct {
  red:number;
  green:number;
  blue:number;

  constructor(red:number = 0, green:number = 0, blue:number = 0) {
    this.red = red & 0xFF;
    this.green = green & 0xFF;
    this.blue = blue & 0xFF;
  }
}

export class Palcolour extends Rgbstruct {

  static readonly components = [ 'red', 'green', 'blue' ];

  toHex():string {
    let rgb = new Rgbstruct();
    for (let part of Palcolour.components) {
      rgb[part] = this[part].toString(16);
      if (rgb[part].length < 2) rgb[part] = `0${rgb[part]}`;
    }
    let { red, green, blue } = rgb;
    return `#${red}${green}${blue}`;
  }

  opposite(minDiff:number = 0):Palcolour {
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
    return new Palcolour(red, green, blue);
  }

  getStyles():Object {
    return {
      'background-color': this.toHex(),
      'color': this.opposite(64).toHex()
    };
  }

  static round(colour:Palcolour):Palcolour {
    for (let part of Palcolour.components) {
      Math.round(colour[part]);
    }
    return colour;
  }

  blend(percentage:number, colour:Palcolour, func:(p:number, c:Palcolour, d:Palcolour) => Palcolour):Palcolour {
    return Palcolour.round(func(percentage, this, colour));
  }

  static tint(percentage:number, colour:Palcolour, otherColour:Palcolour):Palcolour {
    const thisPct = 1 - percentage;
    let newColour = new Palcolour();
    for (let part of Palcolour.components) {
      newColour[part] = colour[part] * thisPct + otherColour[part] * percentage;
    }
    return newColour;
  }

  static add(percentage:number, colour:Palcolour, otherColour:Palcolour):Palcolour {
    let newColour = new Palcolour();
    for (let part of Palcolour.components) {
      newColour[part] = colour[part] + otherColour[part] * percentage;
    }
    return newColour;
  }

  equals(other:Palcolour):boolean {
    return other.red === this.red &&
      other.green === this.green &&
      other.blue === this.blue
  }
}
