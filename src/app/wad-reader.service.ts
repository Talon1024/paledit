import { Injectable } from '@angular/core';

class DoomWadLump {
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

  private bufToStr(buf: ArrayBuffer) {
    const view = new Uint8Array(buf);
    let bufStr = String.fromCharCode.apply(null, view);
    bufStr = bufStr.trim('\x00', 1);
    return bufStr;
  }

  getLump(name: string, number = 1): DoomWadLump {
    const lumpNameCount: {[name: string]: number} = {};
    for (const lump of this.lumps) {
      if (lump.name === name) {
        lumpNameCount[lump.name] = lumpNameCount[lump.name] ? lumpNameCount[lump.name] + 1 : 1;
        if (lumpNameCount[lump.name] === number) {
          return lump;
        }
      }
    }
    return null;
  }

  readWadFile(file: File, callback: (error: any, result: ArrayBuffer) => void) {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = () => {
      const wad = fileReader.result as ArrayBuffer;
      // const dView = new DataView(wad);
      const head = this.readWadHead(wad);
      this.lumps = this.readWadLumps(wad, head);
    };
  }

  private readWadHead(wad: ArrayBuffer): DoomWadHead {
    const dView = new DataView(wad);
    const wadType = this.bufToStr(wad.slice(0, 4));
    if (!DoomWadHead.types.includes(wadType)) {
      return null;
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
