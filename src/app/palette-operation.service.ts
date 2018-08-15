import { Injectable } from '@angular/core';
import { Palette } from './palette-model/palette';
import { Palcolour } from './palette-model/palcolour';
import { Rgb, Hsv, Rgbcolour } from './palette-model/rgb';
import { ColourRange } from './palette-model/colour-range';
import { ColourSubRange } from './palette-model/colour-sub-range';
import { GradientService } from './gradient.service';
import { PalcollectionOperationService } from './palcollection-operation.service';
import { Observable, Observer, TeardownLogic } from 'rxjs';

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
  public palette: Palette;
  public palColours: Palcolour[];
  public colourClipboard: Palcolour[];
  public selectionRange?: ColourRange;
  public readonly palChangeObv: Observable<Palette>;
  private _palChangeObservers: Observer<Palette>[];

  constructor(private grad: GradientService, private colOp: PalcollectionOperationService) {
    this._palChangeObservers = [];
    this.palChangeObv = Observable.create((obs: Observer<Palette>): TeardownLogic => {
      this._palChangeObservers.push(obs);
      obs.next(this.palette);
      return () => {
        const idx = this._palChangeObservers.findIndex((e) => e === obs);
        this._palChangeObservers.splice(idx, 1);
        obs.complete();
      };
    });
    this.colOp.palChangeObv.subscribe((cidx: number) => {
      const pal = this.colOp.getPal(cidx);
      if (pal) {
        this.setPalette(pal);
        for (const obs of this._palChangeObservers) {
          obs.next(this.palette);
        }
      }
    });
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
    this.updateSelection();
  }

  private updateSelection() {
    if (this.selectionRange) {
      for (const subRange of this.selectionRange.subRanges) {
        const [start, end] = subRange.sorted();
        for (let i = start; i <= end; i++) {
          this.palColours[i].selected = true;
        }
      }
    } else {
      for (const colour of this.palColours) {
        colour.selected = false;
      }
    }
  }

  setPalette(pal: Palette) {
    this.palette = pal;
    if (this.palColours == null || pal.getLength() !== this.palColours.length) {
      this.palColours = new Array(pal.getLength());
    }
    for (let i = 0; i < pal.getLength(); i++) {
      this.palColours[i] = pal.colourAt(i);
    }
  }

  private updatePalette(updated?: ColourRange) {
    const idxs: number[] = updated ? updated.getIndices() : (() => {
      const result = [];
      for (let i = 0; i < this.palColours.length; i++) {
        result.push(i);
      }
      return result;
    })();
    for (const idx of idxs) {
      const colour = this.palColours[idx].rgb;
      this.palette.setColour(idx, colour);
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
    this.updatePalette(range);
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
    this.updatePalette(range);
  }

  tint(colour: Rgb, factor: number, factorGrad: boolean = false) {
    this.rangeOperate((o) => {
      let factor2 = factor;
      if (factorGrad) {
        const fgrad = this.grad.gradient;
        factor2 = fgrad.colourAt(o.pIdx, o.range).red / 255;
      }
      const newColour = Rgbcolour.blend(o.pCol.rgb, factor2, colour, Rgbcolour.tint);
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
      let pct2 = pct;
      const colHsv = Rgbcolour.hsv(o.pCol.rgb);
      let newSat = colHsv.saturation;
      if (factorGrad) {
        const fgrad = this.grad.gradient;
        pct2 *= fgrad.colourAt(o.pIdx, o.range).red / 255;
      }
      newSat = Math.min(newSat + pct2, 1);

      const newColour = Rgbcolour.fromHSV(colHsv.hue, newSat, colHsv.value);
      o.pCol.rgb.red = newColour.red;
      o.pCol.rgb.green = newColour.green;
      o.pCol.rgb.blue = newColour.blue;
    });
  }

  shiftHue(by: number, factorGrad: boolean = false) {
    this.rangeOperate((o) => {
      let by2 = by;
      const hsv = Rgbcolour.hsv(o.pCol.rgb);
      if (factorGrad) {
        const fgrad = this.grad.gradient;
        console.log(fgrad.colourAt(o.pIdx, o.range).red / 255, by2);
        by2 *= (fgrad.colourAt(o.pIdx, o.range).red / 255);
        console.log(by2);
      }
      let newHue = hsv.hue + by2;

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

  copyColours() {
    this.colourClipboard = [];
    this.rangeOperate((o) => {
      this.colourClipboard.push(o.pCol);
    });
  }

  pasteColours() {
    for (const pCol of this.colourClipboard) {
      this.palColours[pCol.index].rgb = pCol.rgb;
    }
    this.updatePalette();
  }

  colourAt(idx: number): Rgb {
    return this.palColours[idx].rgb;
  }

  setColourAt(idx: number, colour: Rgb) {
    const range = new ColourRange([new ColourSubRange(idx, idx)]);
    this.palColours[idx].rgb = colour;
    this.updatePalette(range);
  }

}
