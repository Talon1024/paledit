import { Component, OnInit } from '@angular/core';
import { PaletteOperationService, HsvUsage } from '../palette-operation.service';
import { Rgbcolour } from '../palette-model/rgb';

@Component({
  selector: 'app-palette-operations',
  templateUrl: './palette-operations.component.html',
  styleUrls: ['./palette-operations.component.css']
})
export class PaletteOperationsComponent implements OnInit {

  public gradFactor: boolean;
  public tintColour: string;
  public colourizeColour: string;
  public colourizeUse: HsvUsage;
  public numCopiedColours: number;

  constructor(private palOp: PaletteOperationService) { }

  ngOnInit() {
    this.tintColour = '#ff8080';
    this.colourizeColour = '#80ff80';
    this.colourizeUse = {
      hue: true,
      saturation: true,
      value: false
    };
    this.gradFactor = false;
    this.numCopiedColours = 0;
  }

  tint(pct: string) {
    const actualPct = parseFloat(pct) / 100;
    const colour = Rgbcolour.fromHex(this.tintColour);
    this.palOp.tint(colour, actualPct, this.gradFactor);
  }

  colourize() {
    const colour = Rgbcolour.fromHex(this.colourizeColour);
    this.palOp.colourize(colour, this.colourizeUse, this.gradFactor);
  }

  hueShift(by: string) {
    const degs = parseFloat(by);
    this.palOp.shiftHue(degs, this.gradFactor);
  }

  saturate(by: string) {
    const amt = parseFloat(by);
    this.palOp.saturate(amt, this.gradFactor);
  }

  copy() {
    this.palOp.copyColours();
    this.numCopiedColours = this.palOp.numCopiedColours;
  }

  paste() {
    this.palOp.pasteColoursInPlace();
  }

  resizePaste() {
    this.palOp.pasteColoursResize();
  }

  movePaste() {
    this.palOp.pasteColoursMove();
  }

  reverse() {
    this.palOp.reverse();
  }
}
