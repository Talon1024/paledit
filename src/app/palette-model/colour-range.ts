import { ColourSubRange } from './colour-sub-range';

export class ColourRange {
  subRanges: ColourSubRange[];
  constructor(subRanges: ColourSubRange[] = []) {
    this.subRanges = subRanges;
  }

  getIndices(): number[] {
    const indices = [];
    for (const subRange of this.subRanges) {
      const reverse = subRange.start > subRange.end;
      for (let i = subRange.start; i !== subRange.end; i += reverse ? -1 : 1) {
        indices.push(i);
      }
      indices.push(subRange.end);
    }
    return indices;
  }

  palToRangeIdx(palIdx: number) {
    if (!this.contains(palIdx)) { return -1; }
    const subRangeIdx = this.subRanges.findIndex((r) => r.contains(palIdx));

    const [start, ] = this.subRanges[subRangeIdx].sorted();
    let rangeIdx = palIdx - start;
    if (subRangeIdx > 0) {
      for (let i = 0; i < subRangeIdx; i++) {
        rangeIdx += this.subRanges[i].getLength();
      }
    }
    return rangeIdx;
  }

  getLength(): number {
    let length = 0;
    for (const subRange of this.subRanges) {
      length += subRange.getLength();
    }
    return length;
  }

  contains(palIdx: number): number {
    return this.subRanges.findIndex((r) => r.contains(palIdx));
  }
}
