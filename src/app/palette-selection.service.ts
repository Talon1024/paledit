import { Injectable } from '@angular/core';
import { Observable, Observer, TeardownLogic } from 'rxjs';
import { ColourRange } from './palette-model/colour-range';
import { ColourSubRange } from './palette-model/colour-sub-range';

@Injectable({
  providedIn: 'root'
})
export class PaletteSelectionService {

  public readonly palSelectObv: Observable<ColourRange>;
  private _palSelectObservers: Observer<ColourRange>[];
  private _selectionRange: ColourRange;
  public get selectionRange(): ColourRange { return this._selectionRange; }
  public set selectionRange(value: ColourRange) {
    this._selectionRange = value;
    for (const obs of this._palSelectObservers) {
      obs.next(value);
    }
  }
  private lastSelectedIndex: number;

  constructor() {
    this._palSelectObservers = [];
    this.palSelectObv = Observable.create((ob: Observer<ColourRange>): TeardownLogic => {
      ob.next(this.selectionRange);
      this._palSelectObservers.push(ob);
      return () => {
        const obIdx = this._palSelectObservers.findIndex((e) => e === ob);
        this._palSelectObservers.splice(obIdx, 1);
      };
    });
  }

  private subRangeForIdx(idx: number): ColourSubRange {
    return new ColourSubRange(idx, idx);
  }

  private rangeForIdx(idx: number): ColourRange {
    return new ColourRange([this.subRangeForIdx(idx)]);
  }

  private deselectSingle(at: number, subRangeIdx?: number) {
    if (subRangeIdx == null) {
      subRangeIdx = this.selectionRange.subRanges.findIndex((e) => e.contains(at));
      if (subRangeIdx === -1) { return null; }
    }
    const subRange = this.selectionRange.subRanges[subRangeIdx];
    const [start, end] = subRange.sorted();
    if (start !== end) {
      if (start === end && start === at) {
        this.selectionRange.subRanges.splice(subRangeIdx, 1);
        if (this.selectionRange.subRanges.length === 0) {
          return null;
        }
      } else if (start === at) {
        subRange.start += subRange.reversed() ? 1 : -1;
      } else if (end === at) {
        subRange.end -= subRange.reversed() ? 1 : -1;
      } else {
        // Split
        const beforeSubRange = new ColourSubRange(start, at - 1);
        const afterSubRange = new ColourSubRange(at + 1, end);
        this.selectionRange.subRanges.splice(subRangeIdx, 1, beforeSubRange, afterSubRange);
      }
    }
  }

  private selectSingle(at: number) {
    if (this.selectionRange == null) {
      this.selectionRange = this.rangeForIdx(at);
      return;
    }

    const deselect = this.selectionRange.contains(at);

    if (deselect) {
      this.deselectSingle(at, deselect);
      return;
    }

    const beforeSubRange = this.selectionRange.subRanges.findIndex((subRange) => {
      const [start, ] = subRange.sorted();
      if (at === start - 1) {
        return true;
      }
      return false;
    });
    const afterSubRange = this.selectionRange.subRanges.findIndex((subRange) => {
      const [, end] = subRange.sorted();
      if (at === end + 1) {
        return true;
      }
      return false;
    });
    if (beforeSubRange !== -1 && afterSubRange !== -1) {
      // Merge two sub-ranges
      const [start, end] = [
        this.selectionRange.subRanges[beforeSubRange].sorted()[0],
        this.selectionRange.subRanges[afterSubRange].sorted()[1]
      ];
      this.selectionRange.subRanges.splice(afterSubRange, 1);
      this.selectionRange.subRanges[beforeSubRange].start = this.selectionRange.subRanges[beforeSubRange].reversed() ? end : start;
      this.selectionRange.subRanges[beforeSubRange].end = this.selectionRange.subRanges[beforeSubRange].reversed() ? start : end;
    } else {

    }
  }

  private selectRange(rStart: number, rEnd: number) {
    if (rStart === rEnd) {
      return this.selectSingle(rStart);
    }

    const rIncrement = rEnd - rStart / Math.abs(rEnd - rStart);
    const deselect: boolean = (() => {
      for (let i = rStart; i !== rEnd; i += rIncrement) {
        if (!this.selectionRange.contains(i)) { return false; }
      }
      return true;
    })();

    if (deselect) {
      // this.deselectRange(rStart, rEnd);
    } else {
      const mergeSubRanges = [];
      for (let i = rStart; i !== rEnd; i += rIncrement) {
        const subRangeIdx = this._selectionRange.contains(i);
        if (mergeSubRanges.includes(subRangeIdx)) { continue; }
        mergeSubRanges.push(subRangeIdx);
      }
      const spliceIdx = mergeSubRanges.shift() || 0;
      const spliceAmt = mergeSubRanges.length;
    }
  }

  select(colourIndex: number, keyState: {[key: string]: boolean}): ColourRange | null {
    /*
    If nothing is selected:
    select the colour

    If a colour is selected:
      If shift is being held down:
        If all colours from the last index from the new index are selected:
          deselect all of the colours from the last index to the given index.
        otherwise:
          select from the last index to the given index.
      If ctrl is being held down:
        if the colour is selected:
          deselect the colour
        otherwise:
          select the colour.
    otherwise:
      deselect the previous selected colour.
      select the colour
    */

    // Selection logic, partly derived from above pseudocode
    if (this.lastSelectedIndex >= 0) {
      let subRangeIdx = -1;
      if (this.selectionRange) {
        subRangeIdx = this.selectionRange.contains(colourIndex);
      }
      if (keyState['Shift'] && !keyState['Control']) {
        // Shift - de/select all colours between last index and current index inclusive
        this.selectRange(this.lastSelectedIndex, colourIndex);
      } else if (keyState['Control'] && !keyState['Shift']) {
        // Control - de/select colour at current index
        this.selectSingle(colourIndex);
      } else if (keyState['Control'] && keyState['Shift']) {
        // Unknown
      } else if (!keyState['Control'] && !keyState['Shift']) {
        this.selectionRange = this.rangeForIdx(colourIndex);
      }
    } else {
      this.selectionRange = this.rangeForIdx(colourIndex);
    }

    this.lastSelectedIndex = colourIndex;
    return this.selectionRange;
  }

  selectAll(all: boolean = null): ColourRange {
    if (all == null) {
      const allSelected = this.selectionRange.getLength() === 256;
      all = !allSelected;
    }

    let range;
    if (all) {
      range = new ColourRange([new ColourSubRange(0, 255)]);
    } else {
      range = null;
    }

    for (const ob of this._palSelectObservers) {
      ob.next(range);
    }
    return range;
  }
}
