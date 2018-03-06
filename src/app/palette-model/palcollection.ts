import { Palette } from './palette';

class PalTintColour {
  red:number;
  green:number;
  blue:number;
  maxpct:number;
}

class PalTintSpec {
  consecutive:number;
  colour:PalTintColour;
}

export class Palcollection {
  palettes:Palette[];

  constructor() {
    this.palettes = new Array();
  }

  static withInitialPal(pal:Palette):Palcollection {
    let palCollection = new Palcollection();
    palCollection.palettes = [pal];
    return palCollection;
  }

  static fromData(data:Uint8ClampedArray):Palcollection {
    let validPals = Math.max(1, Math.floor(data.length / 768));
    let palCollection = new Palcollection();
    if (data.byteLength < 768) {
      let palBytes = new Uint8ClampedArray(768);
      palBytes.set(data, 0);
      palCollection.palettes[0] = Palette.fromData(palBytes);
    } else {
      for (let i = 0; i < validPals; i++) {
        let curSlice:Uint8ClampedArray = data.slice(i * 768, i * 768 + 768);
        palCollection.palettes[i] = Palette.fromData(curSlice);
      }
    }
    return palCollection;
  }

  toData():Uint8ClampedArray {
    let palBytes:Uint8ClampedArray = new Uint8ClampedArray(this.palettes.length * 768);
    let curPal = 0;
    for (let pal of this.palettes) {
      for (let palIdx = 0; palIdx < 768; palIdx++) {
        palBytes[curPal * 768 + palIdx] = this.palettes[curPal].data[palIdx];
      }

      curPal += 1;
    }
    return palBytes;
  }

  copyRangesTo(palFrom:number, palTo:number) {
    this.palettes[palTo].ranges = this.palettes[palFrom].ranges.slice();
  }

  generateFor(tintTypes:string, palette:Palette) {
    // tintTypes is a DSL
    // 0 - normal palette
    // B - bonus/pickup (yellow tint)
    // P - pain (red tint)
    // G - radsuit (12.5% green tint)
    // H - serpent staff (green tint)
    // Z - frozen (blue tint)
    // W - wraithverge (white tint)
    // O - bloodscourge (red/orange tint)
    // space to force break/restart in tint percentage

    // tintTypes can also be the name of a supported game (doom, heretic)
    const tintLetters = "0BPGHZWO";
    const tintRgb:PalTintColour[] = [
      {red: 0, green: 0, blue: 0, maxpct: 1},
      {red: 255, green: 255, blue: 0, maxpct: 1},
      {red: 255, green: 0, blue: 0, maxpct: 1},
      {red: 0, green: 255, blue: 0, maxpct: .5},
      {red: 0, green: 255, blue: 0, maxpct: .8},
      {red: 0, green: 0, blue: 128, maxpct: .5},
      {red: 128, green: 128, blue: 128, maxpct: 1},
      {red: 128, green: 96, blue: 0, maxpct: 1}
    ];

    const tintGame = tintTypes.toLowerCase();
    if (tintGame === 'doom' || tintGame === 'heretic') {
      tintTypes = '0PPPPPPPPBBBBG';
    }

    var palettes = [];
    var palsToMake:PalTintSpec[] = [];
    var numSpaces = 0;
    var consecutivePals = 0;
    var prevPalLetter = '';

    for (let pal = 0; pal < tintTypes.length; pal++) {
      let tintTypeChar = tintTypes.charAt(pal);

      if (tintTypeChar === '0') {
        continue;
      } else if (tintTypeChar === ' ') {
        consecutivePals = 0;
        numSpaces += 1;
      } else if (tintTypeChar !== prevPalLetter) {
        consecutivePals = 0;
      } else if (tintTypeChar === prevPalLetter) {
        consecutivePals += 1;
      }

      let tintType = tintRgb[tintLetters.indexOf(tintTypeChar)];
      prevPalLetter = tintTypeChar;
    }
  }

}
