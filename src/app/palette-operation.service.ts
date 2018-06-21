import { Injectable } from '@angular/core';
import { Palette } from './palette-model/palette';
import { Palcolour } from './palette-model/palcolour';
import { ColourRange } from './palette-model/colour-range';
import { ColourSubRange } from './palette-model/colour-sub-range';
import { Gradient } from './gradient-model/gradient';

@Injectable()
export class PaletteOperationService {

  private lastSelectedIndex: number;
  palette: Palette;
  palColours: Palcolour[];
  selectionRange: ColourRange;

  constructor() { }

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
    const deselectAll = () => {
      for (const colour of this.palColours) { colour.selected = false; }
    };

    const selectRange = (rStart: number, rEnd: number) => {
      if (rStart === rEnd) { return; }

      let rCur = rStart;
      let increment = rEnd - rCur;
      if (increment >= 1) {
        increment = 1;
      } else {
        increment = -1;
      }
      rCur += increment;

      // Are all these colours selected or not?
      let allSelected: boolean = this.palColours[rCur].selected;
      while (rCur !== rEnd) {
        rCur += increment;
        if (!(this.palColours[rCur].selected)) { allSelected = false; }
      }

      // Select (or deselect) all the colours
      const select = !allSelected;
      rCur = rStart;

      this.palColours[rCur].selected = select;
      while (rCur !== rEnd) {
        rCur += increment;
        this.palColours[rCur].selected = select;
      }
    };

    // Selection logic, partly derived from above pseudocode
    if (this.lastSelectedIndex >= 0) {
      if (keyState['Shift'] && !keyState['Control']) {
        selectRange(this.lastSelectedIndex, colourIndex);
      } else if (keyState['Control'] && !keyState['Shift']) {
        this.palColours[colourIndex].selected = !this.palColours[colourIndex].selected;
      } else if (keyState['Control'] && keyState['Shift']) {
        // Unknown
      } else if (!keyState['Control'] && !keyState['Shift']) {
        deselectAll();
        this.palColours[colourIndex].selected = true;
      }
    } else {
      this.palColours[colourIndex].selected = true;
    }

    this.lastSelectedIndex = colourIndex;
    return this.selectionToRange();
  }

  selectionToRange(): ColourRange {
    const subRanges: ColourSubRange[] = [];
    let subRangeStart = 0, subRangeEnd = 0, inSubRange = false;

    for (const colour of this.palColours) {
      if (!inSubRange && colour.selected) {
        subRangeStart = colour.index;
        inSubRange = true;
      } else if (inSubRange && !colour.selected) {
        subRangeEnd = colour.index - 1;
        inSubRange = false;
        subRanges.push(new ColourSubRange(subRangeStart, subRangeEnd));
      }
    }

    if (inSubRange && this.palColours[this.palColours.length - 1].selected) {
      // The last colour of the palette is selected
      inSubRange = false;
      subRangeEnd = this.palColours.length - 1;
      subRanges.push(new ColourSubRange(subRangeStart, subRangeEnd));
    }

    if (subRanges.length > 0) {
      this.selectionRange = new ColourRange(subRanges);
    } else {
      this.selectionRange = null;
    }

    return this.selectionRange;
  }

  rangeToSelection(range: ColourRange) {
    this.selectionRange = range;
    for (const subRange of range.subRanges) {
      const [start, end] = subRange.sorted();
      for (let i = start; i <= end; i++) {
        this.palColours[i].selected = true;
      }
    }
  }

  setPalette(pal: Palette) {
    this.palette = pal;
    if (!this.palColours) {
      this.palColours = new Array(this.palette.getLength());
    }
    for (let i = 0; i < this.palette.getLength(); i++) {
      this.palColours[i] = this.palette.colourAt(i);
    }
  }

  updatePalette() {
    for (const colour of this.palColours) {
      this.palette.setColour(colour.index, colour);
    }
  }

  reverse() {
    const indices = this.selectionRange.getIndices().sort((a, b) => a - b);
    for (let x = 0, y = indices.length - 1, m = Math.floor(indices.length / 2); x < m; x++, y--) {
      this.swap(indices[x], indices[y]);
    }
    this.updatePalette();
  }

/*
  private reverseSubRange(subRange:ColourSubRange) {
    let [start, end] = subRange.sorted();
    for (let x = start, y = end, m = Math.floor(start + end / 2); x < m; x++, y--) {
      this.swap(x, y);
    }
  }
*/

  private swap(firstIdx: number, secondIdx: number) {
    const tempColour = this.palColours[firstIdx];
    this.palColours[firstIdx] = this.palColours[secondIdx];
    this.palColours[firstIdx].index = firstIdx;
    this.palColours[secondIdx] = tempColour;
    this.palColours[secondIdx].index = secondIdx;
  }

  applyGradient(gradient: Gradient) {
    for (const x of this.selectionRange.getIndices()) {
      const palColour = new Palcolour(gradient.colourAt(x, this.selectionRange));
      palColour.index = x;
      palColour.selected = true; // Applied to selection range
      palColour.palette = this.palette;
      this.palColours[x] = palColour;
    }
    this.updatePalette();
  }

}
