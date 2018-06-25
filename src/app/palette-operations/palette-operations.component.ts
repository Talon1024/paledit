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
  }

  tint(pct: number) {
    const actualPct = pct / 100;
    const colour = Rgbcolour.fromHex(this.tintColour);
    this.palOp.tint(colour, actualPct);
  }

  colourize() {
    const colourizeColour = Rgbcolour.fromHex(this.colourizeColour);
    this.palOp.colourize(colourizeColour);
  }

  hueShift(by: number) {
    this.palOp.shiftHue(by);
  }

  saturate(by: number) {}
}
