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
  range: ColourRange;
  factor: number;
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

export interface IPaletteUpdate {
  pal: Palette;
  new: boolean;
}

@Injectable()
export class PaletteOperationService {

  private palette: Palette;
  private colourClipboard: ICopiedColour[];
  public readonly palChangeObv: Observable<IPaletteUpdate>;
  private _palChangeObservers: Observer<IPaletteUpdate>[];

  constructor(
      private grad: GradientService,
      private colOp: PalcollectionOperationService,
      private palSel: PaletteSelectionService
    ) {
    this._palChangeObservers = [];
    this.palChangeObv = Observable.create((obs: Observer<IPaletteUpdate>): TeardownLogic => {
      this._palChangeObservers.push(obs);
      obs.next({pal: this.palette, new: true});
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
      }
    });
  }

  setPalette(pal: Palette) {
    this.palette = pal;
    for (const obs of this._palChangeObservers) {
      obs.next({pal: this.palette, new: true});
    }
  }

  private getRange(): ColourRange {
    let range = this.palSel.selectionRange;
    if (!range) {
      range = new ColourRange([new ColourSubRange(0, this.getLength() - 1)]);
    }
    return range;
  }

  private rangeOperate(op: (options: IRangeOperationOptions) => Rgb) {
    const range = this.getRange();
    const grad = this.grad.gradient;
    const rangeLen = range.getLength();
    for (const x of range.getIndices()) {
      const rangeIdx = range.palToRangeIdx(x);
      this.palette.setColour(x, op({
        pIdx: x,
        range: range,
        factor: grad.colourIn(rangeIdx, rangeLen).red / 255
      }));
    }
    for (const obs of this._palChangeObservers) {
      obs.next({pal: this.palette, new: false});
    }
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
    for (const obs of this._palChangeObservers) {
      obs.next({pal: this.palette, new: false});
    }
  }

  tint(colour: Rgb, pct: number, factorGrad: boolean = false) {
    this.rangeOperate((o) => {
      let factor = pct;
      if (factorGrad) { factor *= o.factor; }
      const pCol = this.palette.colourAt(o.pIdx);
      return Rgbcolour.blend(pCol, factor, colour, Rgbcolour.tint);
    });
  }

  colourize(colour: Rgb, use: HsvUsage, factorGrad: boolean = false) {
    this.rangeOperate((o) => {
      const {hue, saturation, value} = Rgbcolour.hsv(colour);
      const pCol = this.palette.colourAt(o.pIdx);
      const origHsv = Rgbcolour.hsv(pCol);

      let factor = 1.0;
      if (factorGrad) { factor = o.factor; }

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
        pct2 *= o.factor;
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
      if (factorGrad) { by2 *= o.factor; }
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
    const grad = this.grad.gradient;
    this.rangeOperate((o) => {
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
    for (const obs of this._palChangeObservers) {
      obs.next({pal: this.palette, new: false});
    }
  }

  colourAt(idx: number): Rgb {
    return this.palette.colourAt(idx);
  }

  setColourAt(idx: number, colour: Rgb) {
    this.palette.setColour(idx, colour);
    for (const obs of this._palChangeObservers) {
      obs.next({pal: this.palette, new: false});
    }
  }

  getLength(): number {
    if (this.palette) {
      return this.palette.getLength();
    }
    return 0;
  }

  getDuplicates(idx: number): number[] {
    const rgb = this.palette.colourAt(idx);
    const dups = [];
    for (let i = 0; i < this.palette.getLength(); i++) {
      if (i === idx) { continue; }
      const rgb2 = this.palette.colourAt(i);
      if (Rgbcolour.equals(rgb, rgb2)) { dups.push(i); }
    }
    return dups;
  }

}
