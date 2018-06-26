import { Injectable } from '@angular/core';
import { Palette } from './palette-model/palette';
import { Palcolour } from './palette-model/palcolour';
import { Rgb, Hsv, Rgbcolour } from './palette-model/rgb';
import { ColourRange } from './palette-model/colour-range';
import { ColourSubRange } from './palette-model/colour-sub-range';
import { Gradient } from './gradient-model/gradient';

interface IRangeOperationOptions {
  pCol: Palcolour;
  range: ColourRange;
}

export interface HsvUsage {
  hue: boolean;
  saturation: boolean;
  value: boolean;
}

@Injectable()
export class PaletteOperationService {

  private lastSelectedIndex: number;
  palette: Palette;
  palColours: Palcolour[];
  selectionRange?: ColourRange;

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

  private updatePalette() {
    for (const colour of this.palColours) {
      this.palette.setColour(colour.index, colour.rgb);
    }
  }

  private getRange() {
    return this.selectionRange || new ColourRange([new ColourSubRange(0, 255)]);
  }

  private rangeOperate(op: (idx: number, options?: IRangeOperationOptions) => void) {
    const range = this.getRange();
    for (const x of range.getIndices()) {
      op(x, {pCol: this.palColours[x], range: range});
    }
    this.updatePalette();
  }

  reverse() {
    const range = this.getRange();
    const indices = range.getIndices().sort((a, b) => a - b);
    for (let x = 0, y = indices.length - 1, m = Math.floor(indices.length / 2); x < m; x++, y--) {
      this.swap(indices[x], indices[y]);
    }
    this.updatePalette();
  }

  private swap(firstIdx: number, secondIdx: number) {
    if (firstIdx === secondIdx) { return; }

    const tempColour = this.palColours[firstIdx];
    this.palColours[firstIdx] = this.palColours[secondIdx];
    this.palColours[firstIdx].index = firstIdx;
    this.palColours[secondIdx] = tempColour;
    this.palColours[secondIdx].index = secondIdx;
  }

  tint(colour: Rgb, factor: number) {
    this.rangeOperate((x, o) => {
      const newColour = Rgbcolour.blend(o.pCol.rgb, factor, colour, Rgbcolour.tint);
      o.pCol.rgb.red = newColour.red;
      o.pCol.rgb.green = newColour.green;
      o.pCol.rgb.blue = newColour.blue;
    });
  }

  colourize(colour: Rgb, use?: HsvUsage) {
    if (!use) {
      use = {hue: true, saturation: true, value: false};
    }
    this.rangeOperate((x, o) => {
      const colHsv: Hsv = Rgbcolour.hsv(colour);
      const {hue, saturation, value} = colHsv;
      const otherHsv = Rgbcolour.hsv(o.pCol.rgb);
      const combined: Hsv = {
        hue: use.hue ? hue : otherHsv.hue,
        saturation: use.saturation ? saturation : otherHsv.saturation,
        value: use.value ? value : otherHsv.value
      };
      o.pCol.rgb = Rgbcolour.fromHsv(combined);
    });
  }

  saturate(pct: number) {
    this.rangeOperate((x, o) => {
      const colHsv = Rgbcolour.hsv(o.pCol.rgb);
    });
  }

  shiftHue(by: number) {
    this.rangeOperate((x, o) => {
      const hsv = Rgbcolour.hsv(o.pCol.rgb);
      let newHue = hsv.hue + by;

      if (newHue >= 360) {
        newHue -= 360;
      } else if (newHue < 0) {
        newHue += 360;
      }

      const newColour = Rgbcolour.fromHSV(newHue, hsv.saturation, hsv.value);
      o.pCol.rgb.red = newColour.red;
      o.pCol.rgb.green = newColour.green;
      o.pCol.rgb.blue = newColour.blue;
    });
  }

  applyGradient(gradient: Gradient) {
    this.rangeOperate((x, o) => {
      const colour = gradient.colourAt(x, o.range);
      this.palColours[x].rgb.red = colour.red;
      this.palColours[x].rgb.green = colour.green;
      this.palColours[x].rgb.blue = colour.blue;
    });
  }

}
