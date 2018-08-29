import { Component, OnInit } from '@angular/core';
import { Rgb } from '../palette-model/rgb';
import { Palcolour } from '../palette-model/palcolour';
import { PaletteOperationService } from '../palette-operation.service';
import { PaletteSelectionService } from '../palette-selection.service';

@Component({
  selector: 'app-selected-colour',
  templateUrl: './selected-colour.component.html',
  styleUrls: ['./selected-colour.component.css']
})
export class SelectedColourComponent implements OnInit, Palcolour {

  public index: number;
  public selected: boolean;
  private _rgb: Rgb;
  public get rgb() { return this._rgb; }
  public set rgb(val: Rgb) {
    this._rgb = val;
    this.conflicts = this.palOp.getDuplicates(this.index);
    this.palOp.setColourAt(this.index, val);
  }
  public conflicts: number[];

  public rangeLen: number;

  constructor(private palOp: PaletteOperationService,
    private palSel: PaletteSelectionService) { }

  ngOnInit() {
    this.rangeLen = 0;
    this.palOp.palChangeObv.subscribe(() => {
      if (this.rangeLen === 1) {
        this._rgb = this.palOp.colourAt(this.index);
        this.conflicts = this.palOp.getDuplicates(this.index);
      }
    });
    this.palSel.palSelectObv.subscribe((range) => {
      if (range == null) {
        this.rangeLen = 0;
      } else {
        this.rangeLen = range.getLength();
        if (this.rangeLen === 1) {
          this.index = range.getIndices()[0];
          this._rgb = this.palOp.colourAt(this.index);
          this.conflicts = this.palOp.getDuplicates(this.index);
        }
      }
    });
  }

  get conflictStr() {
    if (this.conflicts.length > 0) {
      return this.conflicts.map((n) => `#${n.toString(10)}`).join(', ');
    } else {
      return null;
    }
  }

}
