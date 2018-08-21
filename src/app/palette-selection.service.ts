import { Injectable } from '@angular/core';
import { Observable, Observer, TeardownLogic } from 'rxjs';
import { ColourRange } from './palette-model/colour-range';
import { ColourSubRange } from './palette-model/colour-sub-range';

type RangeDeselectAction = '' | 'remove' | 'ltrim' | 'rtrim' | 'split';
type SelectionType = '' | 'range' | 'single' | 'interval';

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
  private _interval: number;
  public set interval(value: number) {
    this._interval = Math.abs(Math.floor(value));
  }
  public get interval() { return this._interval; }
  public numColours: number;

  private lastSelectedIndex: number;
  private lastSelectionType: SelectionType;

  constructor() {
    this._palSelectObservers = [];
    this._interval = 2;
    this.lastSelectionType = '';
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

    const beforeSubRange = this._selectionRange.contains(at - 1);
    const afterSubRange = this._selectionRange.contains(at + 1);

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
    /*
    // Get increment value in a way that accounts for rStart being less than rEnd
    const rIncrement = (rEnd - rStart) / Math.abs(rEnd - rStart);
    */
    const rIncrement = 1;
    let rReversed = false;

    if (rEnd < rStart) {
      // Ensure rStart is lower so that it comes first
      [rStart, rEnd] = [rEnd, rStart];
      rReversed = true;
    }
    if (rStart + rIncrement === rEnd) {
      return this.selectSingle(rStart);
    }

    if (this._selectionRange == null && rStart != null) {
      this._selectionRange = new ColourRange([new ColourSubRange(rStart, rEnd)]);
      return;
    }

    const beforeSubRange = this._selectionRange.contains(rStart - rIncrement);
    const afterSubRange = this._selectionRange.contains(rEnd + rIncrement);

    const deselect: boolean = (function(range: ColourRange) {
      const increment = rReversed ? -1 : 1;
      const start = rReversed ? rEnd + increment : rStart + increment;
      const end = rReversed ? rStart + increment : rEnd + increment;
      for (let i = start; i !== end; i += increment) {
        if (range.contains(i) === -1) { return false; }
      }
      return true;
    })(this._selectionRange);

    if (deselect) {
      /*
      if (rReversed) {
        rEnd -= rIncrement;
      } else {
        rStart += rIncrement;
      }
      */
      let action: RangeDeselectAction = '';

      const subRangeIdx = this._selectionRange.contains(rStart);
      const subRangeStart = this._selectionRange.subRanges[subRangeIdx].start;
      const subRangeEnd = this._selectionRange.subRanges[subRangeIdx].end;
      if (subRangeStart === rStart && subRangeEnd === rEnd) {
        action = 'remove';
      } else if (rStart === subRangeStart && subRangeEnd >= rEnd) {
        action = 'ltrim';
      } else if (rEnd === subRangeEnd && subRangeStart <= rStart) {
        action = 'rtrim';
      } else if (rStart > subRangeStart && rEnd < subRangeEnd) {
        action = 'split';
      }

      if (action === '') {
        console.warn('Nothing to do!');
      }

      if (action === 'ltrim') {
        this._selectionRange.subRanges[subRangeIdx].start = rEnd + 1;
      } else if (action === 'rtrim') {
        this._selectionRange.subRanges[subRangeIdx].end = rStart - 1;
      } else if (action === 'remove') {
        this._selectionRange.subRanges.splice(subRangeIdx, 1);
      } else if (action === 'split') {
        // Modify original sub-range
        let newStart = rEnd + 1;
        const newEnd = this._selectionRange.subRanges[subRangeIdx].end;
        let oldEnd = rStart - 1;
        if (rReversed) {
          newStart += 1;
        } else {
          oldEnd -= 1;
        }
        const newSubRange = new ColourSubRange(newStart, newEnd);
        this._selectionRange.subRanges[subRangeIdx].end = oldEnd;
        this._selectionRange.subRanges.splice(subRangeIdx + 1, 0, newSubRange);
      }
    } else {
      // Select
      const mergeSubRanges: number[] = [];
      if (beforeSubRange !== -1) {
        rStart = this._selectionRange.subRanges[beforeSubRange].sorted()[0];
        mergeSubRanges.push(beforeSubRange);
      }
      if (afterSubRange !== -1) {
        rEnd = this._selectionRange.subRanges[afterSubRange].sorted()[1];
        mergeSubRanges.push(afterSubRange);
      }
      for (let i = rStart; i !== rEnd + rIncrement; i += rIncrement) {
        const subRangeIdx = this._selectionRange.contains(i);
        if (subRangeIdx === -1 || mergeSubRanges.includes(subRangeIdx)) { continue; }
        mergeSubRanges.push(subRangeIdx);
      }
      const spliceAmt = mergeSubRanges.length;
      const spliceIdx = mergeSubRanges.sort((a, b) => a - b).shift() || 0;
      const newSubRange = new ColourSubRange(rStart, rEnd);
      this._selectionRange.subRanges.splice(spliceIdx, spliceAmt, newSubRange);
    }
  }

  private selectEveryXthColour(start: number, end: number) {
    for (let i = start; i <= end; i += this._interval) {
      const subRangeIdx = this._selectionRange.contains(i);
      if (subRangeIdx === -1) {
        this.selectSingle(i);
      }
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
      if (keyState['Shift'] && !keyState['Control']) {
        // Shift - de/select all colours between last index and current index inclusive
        this.selectRange(this.lastSelectedIndex, colourIndex);
        this.lastSelectionType = 'range';
      } else if (keyState['Control'] && !keyState['Shift']) {
        // Control - de/select colour at current index
        this.selectSingle(colourIndex);
        this.lastSelectionType = 'single';
      } else if (keyState['Control'] && keyState['Shift']) {
        this.selectEveryXthColour(this.lastSelectedIndex, colourIndex);
        this.lastSelectionType = 'interval';
      } else if (!keyState['Control'] && !keyState['Shift']) {
        this._selectionRange = this.rangeForIdx(colourIndex);
        this.lastSelectionType = 'single';
      }
    } else {
      this._selectionRange = this.rangeForIdx(colourIndex);
      this.lastSelectionType = 'single';
    }

    console.log(keyState, this._selectionRange.subRanges);
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
      const allSelected = this._selectionRange.getLength() === this.numColours;
      all = !allSelected;
    }

    if (all) {
      this._selectionRange = new ColourRange([new ColourSubRange(0, this.numColours)]);
    } else {
      this._selectionRange = null;
    }

    for (const ob of this._palSelectObservers) {
      ob.next(this._selectionRange);
    }
    return this._selectionRange;
  }
}
