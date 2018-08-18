import { Injectable } from '@angular/core';
import { Palette } from './palette-model/palette';
import { Rgb, Hsv, Rgbcolour } from './palette-model/rgb';
import { ColourRange } from './palette-model/colour-range';
import { ColourSubRange } from './palette-model/colour-sub-range';
import { GradientService } from './gradient.service';
import { PalcollectionOperationService } from './palcollection-operation.service';
import { PaletteSelectionService } from './palette-selection.service';
import { Observable, Observer, TeardownLogic } from 'rxjs';

interface IRangeOperationOptions {
  pIdx: number;
  rIdx: number;
  range: ColourRange;
}

export interface HsvUsage {
  hue: boolean;
  saturation: boolean;
  value: boolean;
}

interface ICopiedColour {
  rgb: Rgb;
  idx: number;
}

@Injectable()
export class PaletteOperationService {

  private palette: Palette;
  private colourClipboard: ICopiedColour[];
  public readonly palChangeObv: Observable<Palette>;
  private _palChangeObservers: Observer<Palette>[];

  constructor(
      private grad: GradientService,
      private colOp: PalcollectionOperationService,
      private palSel: PaletteSelectionService
    ) {
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

  setPalette(pal: Palette) {
    this.palette = pal;
    for (const obs of this._palChangeObservers) {
      obs.next(pal);
    }
  }

  private getRange(): ColourRange {
    if (this.palSel.selectionRange == null) {
      this.palSel.selectionRange = new ColourRange([
        new ColourSubRange(0, this.palette.getLength())
      ]);
    }
    return this.palSel.selectionRange;
  }

  private rangeOperate(op: (options: IRangeOperationOptions) => Rgb) {
    const range = this.getRange();
    for (const x of range.getIndices()) {
      this.palette.setColour(x, op({
        pIdx: x,
        rIdx: range.palToRangeIdx(x),
        range: range
      }));
    }
    // this.updatePalette(range);
  }

  reverse() {
    const swap = (firstIdx: number, secondIdx: number) => {
      if (firstIdx === secondIdx) { return; }

      const firstColour = this.palette.colourAt(firstIdx);
      const otherColour = this.palette.colourAt(secondIdx);
      this.palette.setColour(firstIdx, otherColour);
      this.palette.setColour(secondIdx, firstColour);
    };

    const range = this.getRange();
    const indices = range.getIndices().sort((a, b) => a - b);
    for (let x = 0, y = indices.length - 1, m = Math.floor(indices.length / 2); x < m; x++, y--) {
      swap(indices[x], indices[y]);
    }
    // this.updatePalette(range);
  }

  tint(colour: Rgb, factor: number, factorGrad: boolean = false) {
    this.rangeOperate((o) => {
      let factor2 = factor;
      if (factorGrad) {
        const fgrad = this.grad.gradient;
        factor2 = fgrad.colourAt(o.pIdx, o.range).red / 255;
      }
      const pCol = this.palette.colourAt(o.pIdx);
      return Rgbcolour.blend(pCol, factor2, colour, Rgbcolour.tint);
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
      const pCol = this.palette.colourAt(o.pIdx);
      const origHsv = Rgbcolour.hsv(pCol);

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

      return Rgbcolour.fromHsv(combined);
    });
  }

  saturate(pct: number, factorGrad: boolean = false) {
    this.rangeOperate((o) => {
      let pct2 = pct;
      const pCol = this.palette.colourAt(o.pIdx);
      const colHsv = Rgbcolour.hsv(pCol);
      let newSat = colHsv.saturation;
      if (factorGrad) {
        const fgrad = this.grad.gradient;
        pct2 *= fgrad.colourAt(o.pIdx, o.range).red / 255;
      }
      newSat = Math.min(newSat + pct2, 1);

      return Rgbcolour.fromHSV(colHsv.hue, newSat, colHsv.value);
    });
  }

  shiftHue(by: number, factorGrad: boolean = false) {
    this.rangeOperate((o) => {
      let by2 = by;
      const pCol = this.palette.colourAt(o.pIdx);
      const hsv = Rgbcolour.hsv(pCol);
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

      return Rgbcolour.fromHSV(newHue, hsv.saturation, hsv.value);
    });
  }

  applyGradient() {
    this.rangeOperate((o) => {
      const grad = this.grad.gradient;
      return grad.colourAt(o.pIdx, o.range);
    });
  }

  copyColours() {
    this.colourClipboard = [];
    const range = this.getRange();
    for (const idx of range.getIndices()) {
      const rgb = this.palette.colourAt(idx);
      this.colourClipboard.push({rgb, idx});
    }
  }

  pasteColours() {
    for (const pCol of this.colourClipboard) {
      this.palette.setColour(pCol.idx, pCol.rgb);
    }
  }

  colourAt(idx: number): Rgb {
    return this.palette.colourAt(idx);
  }

  setColourAt(idx: number, colour: Rgb) {
    this.palette.setColour(idx, colour);
  }

}
