import { ColourSubRange } from './colour-sub-range';

export class ColourRange {
  subRanges:ColourSubRange[];

  getIndices():number[] {
    let indices = [];
    for (let subRange of this.subRanges) {
      for (let i = subRange.start; i < subRange.end; i++) {
        indices.push(i);
      }
    }
    return indices;
  }
}
