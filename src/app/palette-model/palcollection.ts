import { Palette } from './palette';

class PalTintColour {
  red: number;
  green: number;
  blue: number;
  maxpct: number;
}

class PalTintSpec {
  consecutive: number;
  colour: PalTintColour;
}

export class Palcollection {
  palettes: Palette[];

  constructor() {
    this.palettes = new Array();
  }

  static fromPlaypal(data: Uint8Array): Palcollection {
    const validPals = Math.max(1, Math.floor(data.length / 768));
    const palCollection = new Palcollection();
    if (data.byteLength < 768) {
      const palBytes = new Uint8Array(768);
      palBytes.set(data, 0);
      palCollection.palettes[0] = Palette.fromData(palBytes, 256);
    } else {
      for (let i = 0; i < validPals; i++) {
        const curSlice: Uint8Array = data.slice(i * 768, i * 768 + 768);
        palCollection.palettes[i] = Palette.fromData(curSlice, 256);
      }
    }
    return palCollection;
  }

  toPlaypal(): Uint8Array {
    const palByteLength = this.palettes.map((p) => p.byteLength)
      .reduce((n, nn) => n + nn);
    const palBytes: Uint8Array = new Uint8Array(this.palettes.length * 768);
    let curPal = 0;
    let curOffset = 0;
    for (const pal of this.palettes) {
      palBytes.set(pal.data, curOffset);
      curPal += 1;
      curOffset += pal.byteLength;
    }
    return palBytes;
  }

  /*
  generateFor(tintTypes: string, palette: Palette) {
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
    const tintLetters = '0BPGHZWO';
    const tintRgb: PalTintColour[] = [
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

    const palettes = [];
    const palsToMake: PalTintSpec[] = [];
    let numSpaces = 0;
    let consecutivePals = 0;
    let prevPalLetter = '';

    for (let pal = 0; pal < tintTypes.length; pal++) {
      const tintTypeChar = tintTypes.charAt(pal);

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

      const tintType = tintRgb[tintLetters.indexOf(tintTypeChar)];
      prevPalLetter = tintTypeChar;
    }
  }
  */

}
