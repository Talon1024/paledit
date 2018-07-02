import { Injectable } from '@angular/core';

export class DoomWadLump {
  name: string;
  offset: number;
  length: number;
  data?: ArrayBuffer;
}

class DoomWadHead {
  static types = ['IWAD', 'PWAD'];
  numLumps: number;
  dirOffset: number;
}

@Injectable()
export class WadReaderService {

  lumps: DoomWadLump[];

  constructor() { }

  private bufToStr(buf: ArrayBuffer): string {
    const view = new Uint8Array(buf);

    let firstNonNull = view.findIndex((n) => n !== 0);
    if (firstNonNull === -1) { firstNonNull = 0; }

    let lastNonNull = view.findIndex((n, i) => i > firstNonNull && n === 0);
    if (lastNonNull === -1) { lastNonNull = buf.byteLength; }

    const text = view.slice(firstNonNull, lastNonNull);
    const bufStr = String.fromCharCode.apply(null, text);
    return bufStr;
  }

  getLump(name: string, number = 1): DoomWadLump | Error {
    const lumpNameCount: {[name: string]: number} = {};
    const wname = name.toUpperCase();
    for (const lump of this.lumps) {
      if (lump.name === wname) {
        lumpNameCount[lump.name] =
          lumpNameCount[lump.name] != null ?
          lumpNameCount[lump.name] + 1   : 1;
        if (lumpNameCount[lump.name] === number) {
          return lump;
        }
      }
    }
    return new TypeError(`No ${name} in this WAD!`);
  }

  readWadFile(file: File, callback: (error: any) => void) {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = () => {
      const wad = fileReader.result as ArrayBuffer;
      // const dView = new DataView(wad);
      try {
        const head = this.readWadHead(wad);
        this.lumps = this.readWadLumps(wad, head);
        callback(null);
      } catch (err) {
        callback(err);
      }
    };
    fileReader.onerror = () => {
      callback(fileReader.error);
    };
  }

  private readWadHead(wad: ArrayBuffer): DoomWadHead {
    const dView = new DataView(wad);
    const wadType = this.bufToStr(wad.slice(0, 4));
    if (!DoomWadHead.types.includes(wadType)) {
      throw new TypeError('Not a valid Doom WAD file!');
    }
    const numLumps = dView.getUint32(4, true);
    const dirOffset = dView.getUint32(8, true);
    return { numLumps, dirOffset };
  }

  private readWadLumps(wad: ArrayBuffer, head: DoomWadHead): DoomWadLump[] {
    const dView = new DataView(wad);
    const lumps = new Array<DoomWadLump>();
    // let lastSize = 0;
    let curPos = head.dirOffset;
    while (curPos < wad.byteLength) {
      const offset = dView.getUint32(curPos, true);
      const length = dView.getUint32(curPos + 4, true);
      const name = this.bufToStr(wad.slice(curPos + 8, curPos + 16));
      let data = null;
      if (length > 0) {
        data = wad.slice(offset, offset + length);
      }
      lumps.push({name, offset, length, data});
      curPos += 16;
    }
    return lumps;
  }

}
