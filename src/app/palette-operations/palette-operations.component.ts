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
  }

  paste() {
    this.palOp.pasteColours();
  }

  reverse() {
    this.palOp.reverse();
  }
}
