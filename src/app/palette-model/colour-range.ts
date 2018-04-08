import { ColourSubRange } from './colour-sub-range';

export class ColourRange {
  subRanges:ColourSubRange[];
  constructor(subRanges:ColourSubRange[] = []) {
    this.subRanges = subRanges;
  }

  getIndices():number[] {
    let indices = [];
    for (let subRange of this.subRanges) {
      for (let i = subRange.start; i <= subRange.end; i++) {
        indices.push(i);
      }
    }
    return indices;
  }

  palToRangeIdx(palIdx:number) {
    if (!this.subRanges.some((r) => r.contains(palIdx))) return -1;
    let subRangeIdx = this.subRanges.findIndex((r) => r.contains(palIdx));
    let rangeIdx = palIdx - this.subRanges[subRangeIdx].start;
    if (subRangeIdx > 0) {
      for (let i = 0; i < subRangeIdx; i++) {
        rangeIdx += this.subRanges[i].getLength();
      }
    }
    return rangeIdx;
  }

  getLength():number {
    let length = 0;
    for (let subRange of this.subRanges) {
      length += subRange.getLength();
    }
    return length;
  }
}
