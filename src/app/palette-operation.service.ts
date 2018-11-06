import { Injectable } from '@angular/core';
import { Palette } from './palette-model/palette';
import { Rgb, Rgbcolour } from './palette-model/rgb';
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

interface IUndoStep {
  palette: Palette;
  colIdx: number;
}

export interface IPaletteUpdate {
  pal: Palette;
  new: boolean;
}

@Injectable()
export class PaletteOperationService {

  private prevPalette: Palette;
  private palette: Palette;
  private undoHistory: IUndoStep[];
  private colourClipboard: ICopiedColour[];
  public get numCopiedColours() { return this.colourClipboard.length || 0; }
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
    this.undoHistory = [];
  }

  setPalette(pal: Palette) {
    if (this.palette) {
      this.prevPalette = Palette.fromData(this.palette.data, this.palette.numColours);
    }
    this.palette = pal;
    this.palSel.numColours = pal.numColours;
    for (const obs of this._palChangeObservers) {
      obs.next({pal: this.palette, new: true});
    }
  }

  private updatePalette(undoable: boolean) {
    if (undoable) {
      this.undoHistory.push({
        palette: this.prevPalette,
        colIdx: this.colOp.palIndex
      });
    }
    for (const obs of this._palChangeObservers) {
      obs.next({pal: this.palette, new: false});
    }
  }

  undo(): boolean {
    const undoStep = this.undoHistory.pop();
    console.log(undoStep);
    if (undoStep) {
      this.colOp.setPal(undoStep.colIdx, undoStep.palette);
      return true;
    } else {
      return false;
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
    this.prevPalette = Palette.fromData(this.palette.data, this.palette.numColours);
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
    this.updatePalette(true);
  }

  reverse() {
    this.prevPalette = Palette.fromData(this.palette.data, this.palette.numColours);
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
    this.updatePalette(true);
  }

  tint(colour: Rgb, pct: number, factorGrad: boolean = false) {
    this.prevPalette = Palette.fromData(this.palette.data, this.palette.numColours);
    this.rangeOperate((o) => {
      let factor = pct;
      if (factorGrad) { factor *= o.factor; }
      const pCol = this.palette.colourAt(o.pIdx);
      return Rgbcolour.blend(pCol, factor, colour, Rgbcolour.tint);
    });
  }

  colourize(colour: Rgb, use: HsvUsage, factorGrad: boolean = false) {
    this.prevPalette = Palette.fromData(this.palette.data, this.palette.numColours);
    this.rangeOperate((o) => {
      const {hue, saturation, value} = Rgbcolour.hsv(colour);
      const pCol = this.palette.colourAt(o.pIdx);
      const origHsv = Rgbcolour.hsv(pCol);

      let factor = 1.0;
      if (factorGrad) { factor = o.factor; }

      const newColour = Rgbcolour.fromHsv({
        hue: use.hue ? hue : origHsv.hue,
        saturation: use.saturation ? saturation : origHsv.saturation,
        value: use.value ? value : origHsv.value
      });

      const combined: Rgb = Rgbcolour.blend(pCol, factor, newColour, Rgbcolour.tint);

      return combined;
    });
  }

  saturate(pct: number, factorGrad: boolean = false) {
    this.prevPalette = Palette.fromData(this.palette.data, this.palette.numColours);
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
    this.prevPalette = Palette.fromData(this.palette.data, this.palette.numColours);
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
    this.prevPalette = Palette.fromData(this.palette.data, this.palette.numColours);
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

  pasteColoursInPlace() {
    if (this.numCopiedColours === 0) { return; }
    this.prevPalette = Palette.fromData(this.palette.data, this.palette.numColours);
    for (const pCol of this.colourClipboard) {
      this.palette.setColour(pCol.idx, pCol.rgb);
    }
    this.updatePalette(true);
  }

  pasteColoursResize() {
    if (this.numCopiedColours === 0) { return; }
    this.prevPalette = Palette.fromData(this.palette.data, this.palette.numColours);
    const range = this.getRange();
    const origSize = this.colourClipboard.length;
    const newSize = range.getLength();
    const indices = range.getIndices();

    const colours = this.colourClipboard
      .sort((a, b) => a.idx - b.idx)
      .map((col, idx) => {
        col.idx = Math.floor(idx / (this.colourClipboard.length - 1) * newSize);
        return col;
      });

    if (newSize !== origSize) {
      if (origSize === 1) {
        const colour = colours[0].rgb;
        for (let idx = 0; idx < newSize; idx++) {
          this.palette.setColour(indices[idx], colour);
        }
      } else {
        for (let idx = 0; idx < newSize; idx++) {
          const coloursAtCurIdx = colours.filter((col) => col.idx === idx);
          if (coloursAtCurIdx.length === 0) {
            // Calculate colour in between two colours
            const nextColourIdxIdx = colours.findIndex((col) => {
              return col.idx > idx;
            });
            const nextColourIdx = colours[nextColourIdxIdx].idx;
            const prevColourIdx = colours[nextColourIdxIdx - 1].idx;
            const nextColour = colours[nextColourIdxIdx].rgb;
            const prevColour = colours[nextColourIdxIdx - 1].rgb;

            const blendFactor = (idx - prevColourIdx) / (nextColourIdx - prevColourIdx);
            const averageColour = Rgbcolour.blend(prevColour, blendFactor, nextColour, Rgbcolour.tint);

            this.palette.setColour(indices[idx], averageColour);
          } else {
            const blendFactor = 1 / coloursAtCurIdx.length;

            // Calculate average colour
            let averageColour: Rgb;
            if (coloursAtCurIdx.length === 1) {
              averageColour = coloursAtCurIdx[0].rgb;
            } else {
              averageColour = coloursAtCurIdx.reduce<Rgb>((avg, col) => {
                return Rgbcolour.blend(avg, blendFactor, col.rgb, Rgbcolour.tint);
              }, coloursAtCurIdx[0].rgb);
            }

            this.palette.setColour(indices[idx], averageColour);
          }
        }
      }
    } else {
      // Move
      this.pasteColoursMove();
      return;
    }

    this.updatePalette(true);
  }

  pasteColoursMove() {
    if (this.numCopiedColours === 0) { return; }
    this.prevPalette = Palette.fromData(this.palette.data, this.palette.numColours);
    const range = this.getRange();
    const indices = range.getIndices();
    const end = Math.min(this.colourClipboard.length, indices.length);
    for (let idx = 0; idx < end; idx++) {
      this.palette.setColour(indices[idx], this.colourClipboard[idx].rgb);
    }

    this.updatePalette(true);
  }

  colourAt(idx: number): Rgb {
    return this.palette.colourAt(idx);
  }

  setColourAt(idx: number, colour: Rgb) {
    this.prevPalette = Palette.fromData(this.palette.data, this.palette.numColours);
    this.palette.setColour(idx, colour);
    this.updatePalette(true);
  }

  getLength(): number {
    if (this.palette) {
      return this.palette.numColours;
    }
    return 0;
  }

  getDuplicates(idx: number): number[] {
    const rgb = this.palette.colourAt(idx);
    const dups = [];
    for (let i = 0; i < this.palette.numColours; i++) {
      if (i === idx) { continue; }
      const rgb2 = this.palette.colourAt(i);
      if (Rgbcolour.equals(rgb, rgb2)) { dups.push(i); }
    }
    return dups;
  }

}
