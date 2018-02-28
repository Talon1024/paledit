import { ColourSubRange } from './colour-sub-range';
import { Rgbcolour } from './rgb';

class Rgbrange {
  start:Rgbcolour;
  end?:Rgbcolour; // Optional ONLY for tint
  effect?:string; // %, #, @
}

export class PalTranslation {
  source:ColourSubRange;
  dest:ColourSubRange | Rgbrange;

  static parse(transtr:string):PalTranslation {
    let result = new PalTranslation();
    let RE_PAL = /(\d+):(\d+)/g;
    let RE_RGB = /\[(\d+),(\d+),(\d+)\]/g;
    let tint = "@amount";
    let parserPos = 0;
    let matchStr = transtr;

    let match = RE_PAL.exec(matchStr);
    if (matchStr[RE_PAL.lastIndex] != '=') return result;

    result.source.start = Number.parseInt(match[1], 10);
    result.source.end = Number.parseInt(match[2], 10);

    parserPos = RE_PAL.lastIndex + 1;
    matchStr = transtr.substring(parserPos);
    RE_PAL.lastIndex = 0;

    if (RE_PAL.test(matchStr)) {
      RE_PAL.lastIndex = 0;
      match = RE_PAL.exec(matchStr);
      result.dest = new ColourSubRange();
      result.dest.start = Number.parseInt(match[1], 10);
      result.dest.end = Number.parseInt(match[2], 10);
    } else if (RE_RGB.test(matchStr)) {
      RE_RGB.lastIndex = 0;
      match = RE_RGB.exec(matchStr);
      result.dest = new Rgbrange();
      if (matchStr.search(tint) >= 0) {
        result.dest.effect = tint;
      }
    } else {
      console.warn("Invalid destination for translation!");
      return result;
    }

    return result;
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
      if (effect != '@') {
        dstPart += `:[${this.dest.end.red},${this.dest.end.green},${this.dest.end.blue}]`;
      }
    } else {
      dstPart = `${this.dest.start}:${this.dest.end}`;
    }
    return `${srcPart}=${dstPart}`;
  }
}