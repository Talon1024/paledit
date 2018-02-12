export class Palcolour {
  red:number;
  green:number;
  blue:number;

  constructor(red:number = 0, green:number = 0, blue:number = 0) {
    this.red = red & 0xFF;
    this.green = green & 0xFF;
    this.blue = blue & 0xFF;
  }

  toHex():string {
    let red = this.red.toString(16);
    if (red.length < 2) red = `0${red}`;
    let green = this.green.toString(16);
    if (green.length < 2) green = `0${green}`;
    let blue = this.blue.toString(16);
    if (blue.length < 2) blue = `0${blue}`;
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
    const colourComponents = [ 'red', 'green', 'blue' ];
    let newColour = new Palcolour();

    for (let part of colourComponents) {
      newColour[part] = this[part] * thisPct + colour[part] * percentage;
    }

    return newColour;
  }

  equals(other:Palcolour):boolean {
    return other.red === this.red &&
      other.green === this.green &&
      other.blue === this.blue
  }
}
