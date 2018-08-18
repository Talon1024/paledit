import { Component, OnInit } from '@angular/core';
import { Rgbcolour, Rgb, Hsv } from '../palette-model/rgb';
import { Palcolour } from '../palette-model/palcolour';
import { PaletteOperationService } from '../palette-operation.service';
import { PaletteSelectionService } from '../palette-selection.service';

@Component({
  selector: 'app-selected-colour',
  templateUrl: './selected-colour.component.html',
  styleUrls: ['./selected-colour.component.css']
})
export class SelectedColourComponent implements OnInit {

  public rangeLen: number;
  private idx: number;
  public palColour: Palcolour;
  public curHex: string;
  public curHsv: Hsv;

  constructor(private palOp: PaletteOperationService,
    private palSel: PaletteSelectionService) { }

  ngOnInit() {
    this.rangeLen = 0;
    this.palOp.palChangeObv.subscribe(() => {
      if (this.rangeLen === 1) {
        const colour = this.palOp.colourAt(this.idx);
        this.setRgb(colour, this.idx);
      }
    });
    this.palSel.palSelectObv.subscribe((range) => {
      if (range == null) {
        this.rangeLen = 0;
      } else {
        this.rangeLen = range.getLength();
        if (this.rangeLen === 1) {
          this.idx = range.getIndices()[0];
          const colour = this.palOp.colourAt(this.idx);
          this.setRgb(colour, this.idx);
        }
      }
    });
  }

  private setRgb(rgb: Rgb, idx: number) {
    this.curHex = Rgbcolour.toHex(rgb);
    this.curHsv = Rgbcolour.hsv(rgb);
    this.palColour = {
      index: idx,
      selected: true,
      rgb,
      conflicts: this.palOp.getDuplicates(idx)
    };
  }

  setCurColour(hex: string) {
    const rgb = Rgbcolour.fromHex(hex);
    this.setRgb(rgb, this.idx);
    this.palOp.setColourAt(this.idx, rgb);
  }

}
