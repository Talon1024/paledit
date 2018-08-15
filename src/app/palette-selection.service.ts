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
  private selectionRange: ColourRange;
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

  selectPalColour(colourIndex: number, keyState: {[key: string]: boolean}): ColourRange | null {
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

    // closures to help selection
    function subRangeForIdx(idx: number): ColourSubRange {
      return new ColourSubRange(idx, idx);
    }

    function rangeForIdx(idx: number): ColourRange {
      return new ColourRange([subRangeForIdx(idx)]);
    }

    function deselect(range: ColourRange, at: number, subRangeIdx?: number): ColourRange {
      if (subRangeIdx == null) {
        subRangeIdx = range.subRanges.findIndex((e) => e.contains(at));
        if (subRangeIdx === -1) { return null; }
      }
      const subRange = range.subRanges[subRangeIdx];
      const [start, end] = subRange.sorted();
      if (start !== end) {
        if (start === end && start === at) {
          range.subRanges.splice(subRangeIdx, 1);
          if (range.subRanges.length === 0) {
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
          range.subRanges.splice(subRangeIdx, 1, beforeSubRange, afterSubRange);
        }
      }
      return range;
    }

    function select(range: ColourRange, at: number): ColourRange {
      const beforeSubRange = range.subRanges.findIndex((subRange) => {
        const [start, ] = subRange.sorted();
        if (at === start - 1) {
          return true;
        }
        return false;
      });
      const afterSubRange = range.subRanges.findIndex((subRange) => {
        const [, end] = subRange.sorted();
        if (at === end + 1) {
          return true;
        }
        return false;
      });
      if (beforeSubRange !== -1 && afterSubRange !== -1) {
        // Merge two sub-ranges
        const [start, end] = [
          range.subRanges[beforeSubRange].sorted()[0],
          range.subRanges[afterSubRange].sorted()[1]
        ];
        range.subRanges.splice(afterSubRange, 1);
        range.subRanges[beforeSubRange].start = range.subRanges[beforeSubRange].reversed() ? end : start;
        range.subRanges[beforeSubRange].end = range.subRanges[beforeSubRange].reversed() ? start : end;
      } else {

      }
    }

    function selectRange(range: ColourRange, rStart: number, rEnd: number): ColourRange {
      if (rStart === rEnd) {
        return select(range, rStart);
      }
      let rCur = rStart;
      let increment = rEnd - rCur;
      if (increment >= 1) {
        increment = 1;
      } else {
        increment = -1;
      }
      rCur += increment;

      // Are all these colours selected or not?
      let allSelected = true;
      while (rCur !== rEnd) {
        rCur += increment;
        if (!range.contains(rCur)) { allSelected = false; }
      }

      // Select (or deselect) all the colours
      rCur = rStart;

      /*
      this.palColours[rCur].selected = select;
      while (rCur !== rEnd) {
        rCur += increment;
        this.palColours[rCur].selected = select;
      }
      */
    }

    // Selection logic, partly derived from above pseudocode
    if (this.lastSelectedIndex >= 0) {
      let subRangeIdx = -1;
      if (this.selectionRange) {
        subRangeIdx = this.selectionRange.subRanges.findIndex((e) => e.contains(colourIndex));
      }
      if (keyState['Shift'] && !keyState['Control']) {
        // Shift - de/select all colours between last index and current index inclusive
        selectRange(this.lastSelectedIndex, colourIndex);
      } else if (keyState['Control'] && !keyState['Shift']) {
        // Control - de/select colour at current index
        deselect()
      } else if (keyState['Control'] && keyState['Shift']) {
        // Unknown
      } else if (!keyState['Control'] && !keyState['Shift']) {
        this.selectionRange = rangeForIdx(colourIndex);
      }
    } else {
      this.selectionRange = rangeForIdx(colourIndex);
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
