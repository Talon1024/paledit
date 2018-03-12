import { ColourSubRange } from './colour-sub-range';
import { Rgb } from './rgb';

export class Rgbrange {
  start:Rgb;
  end?:Rgb; // Optional ONLY for tint
  effect?:string = ""; // %, #, @<number>

  constructor(start:Rgb = null, end:Rgb = null, effect:string = "") {
    this.start = start;
    this.end = end;
    this.effect = effect;
  }
}

export class PalTranslation {
  source:ColourSubRange;
  dest:ColourSubRange | Rgbrange;

  static parse(transtr:string):PalTranslation {
    let result = new PalTranslation();
    let RE_PAL = /(\d+):(\d+)/g;
    let RE_RGB = /\[([\d.]+),([\d.]+),([\d.]+)\]/g;
    let matchStr = transtr;

    let match = RE_PAL.exec(matchStr);
    if (matchStr[RE_PAL.lastIndex] != '=') return result;

    result.source = new ColourSubRange();
    result.source.start = Number.parseInt(match[1], 10);
    result.source.end = Number.parseInt(match[2], 10);

    matchStr = transtr.substring(RE_PAL.lastIndex + 1);
    RE_PAL.lastIndex = 0;

    if (RE_PAL.test(matchStr)) {
      RE_PAL.lastIndex = 0;
      match = RE_PAL.exec(matchStr);
      result.dest = new ColourSubRange();
      result.dest.start = Number.parseInt(match[1], 10);
      result.dest.end = Number.parseInt(match[2], 10);
    } else {
      let effect = matchStr.substring(0, matchStr.indexOf("["));
      let endColour:boolean = false;
      let useFloat:boolean = false;

      result.dest = new Rgbrange();
      if (!effect.startsWith("@") && !(effect === "#") && !(effect === "%") && !(effect === "")) {
        console.warn(`Unknown effect: ${effect}`);
      } else if (effect === "%" || effect === "") {
        endColour = true;
      }
      if (effect === "%") useFloat = true;
      result.dest.effect = effect;

      matchStr = matchStr.substring(effect.length);
      match = RE_RGB.exec(matchStr);

      if (match != null) {
        result.dest.start = PalTranslation.matchToRgb(match, useFloat);
      } else {
        console.error("Invalid starting RGB values!");
        return;
      }

      if (endColour) {
        matchStr = matchStr.substring(match[0].length + 1);
        RE_RGB.lastIndex = 0;
        match = RE_RGB.exec(matchStr);
        if (match != null) {
          result.dest.end = PalTranslation.matchToRgb(match, useFloat);
        } else {
          console.error("Invalid ending RGB values!");
          return;
        }
      }
    }

    return result;
  }

  static matchToRgb(match:string[], useFloat:boolean):Rgb {
    let conv = useFloat ? "parseFloat" : "parseInt";
    return {
      red: Number[conv](match[1], 10),
      green: Number[conv](match[2], 10),
      blue: Number[conv](match[3], 10)
    };
  }

  static isRgb(range: Rgbrange | ColourSubRange):range is Rgbrange {
    return (<Rgbrange>range).start.red != undefined;
  }

  toString():string {
    var srcPart = `${this.source.start}:${this.source.end}`;
    var dstPart;
    if (PalTranslation.isRgb(this.dest)) {
      let effect = this.dest.effect || "";
      dstPart = `${effect}[${this.dest.start.red},${this.dest.start.green},${this.dest.start.blue}]`;
      if (!effect.startsWith('@') && !effect.startsWith('#')) { // tint (@amount)
        dstPart += `:[${this.dest.end.red},${this.dest.end.green},${this.dest.end.blue}]`;
      }
    } else {
      dstPart = `${this.dest.start}:${this.dest.end}`;
    }
    return `${srcPart}=${dstPart}`;
  }
}