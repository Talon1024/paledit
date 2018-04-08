import { ColourSubRange } from './colour-sub-range';

export class ColourRange {
  subRanges:ColourSubRange[];
  constructor(subRanges:ColourSubRange[] = []) {
    this.subRanges = subRanges;
  }

  getIndices():number[] {
    let indices = [];
    for (let subRange of this.subRanges) {
      let reverse = subRange.start > subRange.end;
      let [start, end] = subRange.sorted();
      for (let i = start; i != end; i += reverse ? -1 : 1) {
        indices.push(i);
      }
      indices.push(reverse ? start : end);
    }
    return indices;
  }

  palToRangeIdx(palIdx:number) {
    if (!this.contains(palIdx)) return -1;
    let subRangeIdx = this.subRanges.findIndex((r) => r.contains(palIdx));

    let [start,] = this.subRanges[subRangeIdx].sorted();
    let rangeIdx = palIdx - start;
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

  contains(palIdx:number):boolean {
    return this.subRanges.some((r) => r.contains(palIdx));
  }
}
