import { Injectable } from '@angular/core';
import { Palette } from './palette-model/palette';
import { Palcolour } from './palette-model/palcolour';
import { Rgb, Hsv, Rgbcolour } from './palette-model/rgb';
import { ColourRange } from './palette-model/colour-range';
import { ColourSubRange } from './palette-model/colour-sub-range';
import { GradientService } from './gradient.service';
import { Gradient, GradientStop } from './gradient-model/gradient';

interface IRangeOperationOptions {
  pIdx: number;
  rIdx: number;
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

  constructor(private grad: GradientService) {
    this.palColours = new Array(256);
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

  selectAll(): ColourRange {
    let allSelected = true;
    for (const colour of this.palColours) {
      if (!colour.selected) {
        allSelected = false;
        break;
      }
    }

    const newSel = !allSelected;
    for (const colour of this.palColours) {
      colour.selected = newSel;
    }
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
    if (pal.getLength() !== this.palColours.length) {
      this.palColours = new Array(pal.getLength());
    }
    for (let i = 0; i < pal.getLength(); i++) {
      this.palColours[i] = pal.colourAt(i);
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

  private rangeOperate(op: (options: IRangeOperationOptions) => void) {
    const range = this.getRange();
    for (const x of range.getIndices()) {
      op({
        pIdx: x,
        rIdx: range.palToRangeIdx(x),
        pCol: this.palColours[x],
        range: range
      });
    }
    this.updatePalette();
  }

  reverse() {
    const swap = (firstIdx: number, secondIdx: number) => {
      if (firstIdx === secondIdx) { return; }

      const tempColour = this.palColours[firstIdx].rgb;
      this.palColours[firstIdx].rgb = this.palColours[secondIdx].rgb;
      this.palColours[secondIdx].rgb = tempColour;
    };

    const range = this.getRange();
    const indices = range.getIndices().sort((a, b) => a - b);
    for (let x = 0, y = indices.length - 1, m = Math.floor(indices.length / 2); x < m; x++, y--) {
      swap(indices[x], indices[y]);
    }
    this.updatePalette();
  }

  tint(colour: Rgb, factor: number, factorGrad: boolean = false) {
    this.rangeOperate((o) => {
      if (factorGrad) {
        const fgrad = this.grad.gradient;
        factor = fgrad.colourAt(o.pIdx, o.range).red / 255;
      }
      const newColour = Rgbcolour.blend(o.pCol.rgb, factor, colour, Rgbcolour.tint);
      o.pCol.rgb.red = newColour.red;
      o.pCol.rgb.green = newColour.green;
      o.pCol.rgb.blue = newColour.blue;
    });
  }

  colourize(colour: Rgb, use: HsvUsage, factorGrad: boolean = false) {
    /*
    if (!use) {
      use = {hue: true, saturation: true, value: false};
    }
    */
    this.rangeOperate((o) => {
      const {hue, saturation, value} = Rgbcolour.hsv(colour);
      const origHsv = Rgbcolour.hsv(o.pCol.rgb);

      let factor;
      if (factorGrad) {
        const fgrad = this.grad.gradient;
        factor = fgrad.colourAt(o.pIdx, o.range).red / 255;
      } else {
        factor = 1.0;
      }

      const combined: Hsv = {
        hue: use.hue ? hue * factor + origHsv.hue * (1.0 - factor) : origHsv.hue,
        saturation: use.saturation ? saturation * factor + origHsv.saturation * (1.0 - factor) : origHsv.saturation,
        value: use.value ? value * factor + origHsv.value * (1.0 - factor) : origHsv.value
      };

      o.pCol.rgb = Rgbcolour.fromHsv(combined);
    });
  }

  saturate(pct: number, factorGrad: boolean = false) {
    this.rangeOperate((o) => {
      const colHsv = Rgbcolour.hsv(o.pCol.rgb);
      let newSat = colHsv.saturation;
      if (factorGrad) {
        const fgrad = this.grad.gradient;
        pct *= fgrad.colourAt(o.pIdx, o.range).red / 255;
      }
      newSat = Math.min(newSat + pct, 1);

      const newColour = Rgbcolour.fromHSV(colHsv.hue, newSat, colHsv.value);
      o.pCol.rgb.red = newColour.red;
      o.pCol.rgb.green = newColour.green;
      o.pCol.rgb.blue = newColour.blue;
    });
  }

  shiftHue(by: number, factorGrad: boolean = false) {
    this.rangeOperate((o) => {
      const hsv = Rgbcolour.hsv(o.pCol.rgb);
      if (factorGrad) {
        const fgrad = this.grad.gradient;
        by *= fgrad.colourAt(o.pIdx, o.range).red / 255;
      }
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

  applyGradient() {
    this.rangeOperate((o) => {
      const grad = this.grad.gradient;
      const colour = grad.colourAt(o.pIdx, o.range);
      this.palColours[o.pIdx].rgb.red = colour.red;
      this.palColours[o.pIdx].rgb.green = colour.green;
      this.palColours[o.pIdx].rgb.blue = colour.blue;
    });
  }

}
