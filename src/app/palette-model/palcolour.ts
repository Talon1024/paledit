export class Palcolour {
  red:number;
  green:number;
  blue:number;

  readonly colourComponents = [ 'red', 'green', 'blue' ];

  constructor(red:number = 0, green:number = 0, blue:number = 0) {
    this.red = red & 0xFF;
    this.green = green & 0xFF;
    this.blue = blue & 0xFF;
  }

  toHex():string {
    let rgb = {red:0, green:0, blue:0};
    for (let part of this.colourComponents) {
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

  blend(percentage:number, func:(p:number, c:Palcolour) => Palcolour):Palcolour {
    return func(percentage, this);
  }

  tint(percentage:number, colour:Palcolour):Palcolour {
    const thisPct = 1 - percentage;
    let newColour = new Palcolour();
    for (let part of this.colourComponents) {
      newColour[part] = this[part] * thisPct + colour[part] * percentage;
    }
    return newColour;
  }

  add(percentage:number, colour:Palcolour):Palcolour {
    let newColour = new Palcolour();
    for (let part of this.colourComponents) {
      newColour[part] = this[part] + colour[part] * percentage;
    }
    return newColour;
  }

  equals(other:Palcolour):boolean {
    return other.red === this.red &&
      other.green === this.green &&
      other.blue === this.blue
  }
}
