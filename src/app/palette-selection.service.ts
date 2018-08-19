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
      ob.next(this._selectionRange);
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
      subRangeIdx = this._selectionRange.subRanges.findIndex((e) => e.contains(at));
      if (subRangeIdx === -1) { return null; }
    }
    const subRange = this._selectionRange.subRanges[subRangeIdx];
    const [start, end] = subRange.sorted();
    if (start !== end) {
      if (start === at) {
        const toChange = subRange.reversed() ? 'end' : 'start';
        subRange[toChange] += subRange.reversed() ? -1 : 1;
      } else if (end === at) {
        const toChange = subRange.reversed() ? 'start' : 'end';
        subRange[toChange] += subRange.reversed() ? 1 : -1;
      } else {
        // Split
        const beforeSubRange = new ColourSubRange(start, at - 1);
        const afterSubRange = new ColourSubRange(at + 1, end);
        this._selectionRange.subRanges.splice(subRangeIdx, 1, beforeSubRange, afterSubRange);
      }
    } else {
      this._selectionRange.subRanges.splice(subRangeIdx, 1);
    }
  }

  private selectSingle(at: number) {
    if (this._selectionRange == null) {
      this._selectionRange = this.rangeForIdx(at);
      return;
    }

    const subRangeIdx = this._selectionRange.contains(at);
    const deselect = subRangeIdx >= 0;

    if (deselect) {
      this.deselectSingle(at, subRangeIdx);
      return;
    }

    const beforeSubRange = this._selectionRange.subRanges.findIndex((subRange) => {
      const [, end] = subRange.sorted();
      if (at === end + 1) {
        return true;
      }
      return false;
    });
    const afterSubRange = this._selectionRange.subRanges.findIndex((subRange) => {
      const [start, ] = subRange.sorted();
      if (at === start - 1) {
        return true;
      }
      return false;
    });

    if (beforeSubRange !== -1 && afterSubRange !== -1) {
      // Merge two sub-ranges
      const [start, end] = [
        this._selectionRange.subRanges[beforeSubRange].sorted()[0],
        this._selectionRange.subRanges[afterSubRange].sorted()[1]
      ];
      this._selectionRange.subRanges.splice(afterSubRange, 1);
      this._selectionRange.subRanges[beforeSubRange].start = this._selectionRange.subRanges[beforeSubRange].reversed() ? end : start;
      this._selectionRange.subRanges[beforeSubRange].end = this._selectionRange.subRanges[beforeSubRange].reversed() ? start : end;
    } else if (beforeSubRange !== -1 && afterSubRange === -1) {
      const toChange = this._selectionRange.subRanges[beforeSubRange].reversed() ? 'start' : 'end';
      this._selectionRange.subRanges[beforeSubRange][toChange] += 1;
    } else if (beforeSubRange === -1 && afterSubRange !== -1) {
      const toChange = this._selectionRange.subRanges[afterSubRange].reversed() ? 'end' : 'start';
      this._selectionRange.subRanges[afterSubRange][toChange] -= 1;
    } else if (beforeSubRange === -1 && afterSubRange === -1) {
      const nextSubRange = this._selectionRange.subRanges.findIndex((subRange) => {
        const [start, ] = subRange.sorted();
        return start > at;
      });
      let insertIdx = -1;
      if (nextSubRange === -1) {
        insertIdx = this._selectionRange.subRanges.length;
      } else {
        insertIdx = nextSubRange;
      }

      this._selectionRange.subRanges.splice(insertIdx, 0, new ColourSubRange(at, at));
    }
  }

  private selectRange(rStart: number, rEnd: number) {
    if (rStart === rEnd) {
      return this.selectSingle(rStart);
    }

    let rIncrement = (rEnd - rStart) / Math.abs(rEnd - rStart);
    if (!Number.isFinite(rIncrement) && !Number.isNaN(rIncrement)) {
      rIncrement = 1;
    }

    const deselect: boolean = (function(range: ColourRange) {
      for (let i = rStart; i !== rEnd; i += rIncrement) {
        if (range.contains(i) === -1) { return false; }
      }
      return true;
    })(this._selectionRange);

    if (deselect) {
      const removeSubRanges: number[] = [this._selectionRange.contains(rStart)];
      for (let i = rStart; i !== rEnd; i += rIncrement) {
        const subRangeIdx = this._selectionRange.contains(i);
        if (subRangeIdx === -1 || removeSubRanges.includes(subRangeIdx)) { continue; }
        console.warn('More than two sub-ranges are being deselected! This is a BUG!!', subRangeIdx);
        removeSubRanges.push(subRangeIdx);
      }
      for (const subRangeIdx of removeSubRanges.reverse()) {
        this._selectionRange.subRanges.splice(subRangeIdx, 1);
      }
    } else {
      const mergeSubRanges: number[] = [];
      for (let i = rStart; i !== rEnd; i += rIncrement) {
        const subRangeIdx = this._selectionRange.contains(i);
        if (subRangeIdx === -1 || mergeSubRanges.includes(subRangeIdx)) { continue; }
        mergeSubRanges.push(subRangeIdx);
      }
      const spliceAmt = mergeSubRanges.length;
      const spliceIdx = mergeSubRanges.shift() || 0;
      const newSubRange = new ColourSubRange(rStart, rEnd);
      this._selectionRange.subRanges.splice(spliceIdx, spliceAmt, newSubRange);
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
      /*
      let subRangeIdx = -1;
      if (this._selectionRange) {
        subRangeIdx = this._selectionRange.contains(colourIndex);
      }
      */
      if (keyState['Shift'] && !keyState['Control']) {
        // Shift - de/select all colours between last index and current index inclusive
        this.selectRange(this.lastSelectedIndex, colourIndex);
      } else if (keyState['Control'] && !keyState['Shift']) {
        // Control - de/select colour at current index
        this.selectSingle(colourIndex);
      } else if (keyState['Control'] && keyState['Shift']) {
        // Unknown
      } else if (!keyState['Control'] && !keyState['Shift']) {
        this._selectionRange = this.rangeForIdx(colourIndex);
      }
    } else {
      this._selectionRange = this.rangeForIdx(colourIndex);
    }

    console.log(this._selectionRange.subRanges);
    if (this._selectionRange.subRanges.length === 0) {
      this._selectionRange = null;
    }

    this.lastSelectedIndex = colourIndex;
    for (const ob of this._palSelectObservers) {
      ob.next(this._selectionRange);
    }
    return this._selectionRange;
  }

  selectAll(all: boolean = null): ColourRange {
    if (all == null) {
      const allSelected = this._selectionRange.getLength() === 256;
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
