import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ColourRange } from '../palette-model/colour-range';
import { Rgbcolour, Rgb, Hsv } from '../palette-model/rgb';
import { PaletteOperationService } from '../palette-operation.service';

@Component({
  selector: 'app-selected-colour',
  templateUrl: './selected-colour.component.html',
  styleUrls: ['./selected-colour.component.css']
})
export class SelectedColourComponent implements OnInit, OnChanges {

  @Input() range: ColourRange;
  private rangeLen: number;
  private curColour: string;
  private curRgb: Rgb;
  private curHsv: Hsv;
  @Output() colourChange = new EventEmitter<Rgb>();

  constructor(private palOp: PaletteOperationService) { }

  ngOnInit() {
    this.rangeLen = 0;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('range')) {
      if (changes['range'].currentValue != null) {
        this.rangeLen = (changes['range'].currentValue as ColourRange).getLength();
      } else {
        this.rangeLen = 0;
      }

      if (this.rangeLen === 1) {
        const idx = this.range.getIndices()[0];
        const colour = Rgbcolour.toHex(this.palOp.colourAt(idx));
        this.setHex(colour);
      }
    }
  }

  private setHex(hex: string) {
    this.curColour = hex;
    this.curRgb = Rgbcolour.fromHex(hex);
    this.curHsv = Rgbcolour.hsv(this.curRgb);
  }

  setCurColour(hex: string) {
    this.setHex(hex);
    const idx = this.range.getIndices()[0];
    this.palOp.setColourAt(idx, this.curRgb);
    this.colourChange.emit(this.curRgb);
  }

}
