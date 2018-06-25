import { Component, OnInit } from '@angular/core';
import { PaletteOperationService } from '../palette-operation.service';
import { Rgb, Rgbcolour } from '../palette-model/rgb';

@Component({
  selector: 'app-palette-operations',
  templateUrl: './palette-operations.component.html',
  styleUrls: ['./palette-operations.component.css']
})
export class PaletteOperationsComponent implements OnInit {

  private tintColour: string;
  private colourizeColour: string;

  constructor(private palOp: PaletteOperationService) { }

  ngOnInit() {
    this.tintColour = '#ffffff';
    this.colourizeColour = '#ffffff';
  }

  tint(pct: string) {
    const actualPct = parseFloat(pct) / 100;
    const colour = Rgbcolour.fromHex(this.tintColour);
    this.palOp.tint(colour, actualPct);
  }

  colourize() {
    const colour = Rgbcolour.fromHex(this.colourizeColour);
    this.palOp.colourize(colour);
  }

  hueShift(by: string) {
    const degs = parseFloat(by);
    this.palOp.shiftHue(degs);
  }

  saturate(by: number) {}
}
