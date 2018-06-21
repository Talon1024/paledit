import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Palcollection } from '../palette-model/palcollection';
import { PalcollectionOperationService } from '../palcollection-operation.service';

@Component({
  selector: 'app-palette-navigator',
  templateUrl: './palette-navigator.component.html',
  styleUrls: ['./palette-navigator.component.css']
})
export class PaletteNavigatorComponent implements OnInit {

  @Output() palIndexChange = new EventEmitter<number>();
  private colPalIndex: number; // User input (actually index + 1)
  maxPal: number;

  constructor(private colOp: PalcollectionOperationService) { }

  ngOnInit() {
    this.colPalIndex = 1;
    this.maxPal = this.colOp.numPals();
  }

  nextPal() {
    if (this.colPalIndex < this.maxPal) { this.colPalIndex += 1; }
    this.setPalIndex(this.colPalIndex);
  }

  prevPal() {
    if (this.colPalIndex > 1) { this.colPalIndex -= 1; }
    this.setPalIndex(this.colPalIndex);
  }

  firstPal() {
    this.colPalIndex = 1;
    this.setPalIndex(this.colPalIndex);
  }

  lastPal() {
    this.colPalIndex = this.maxPal;
    this.setPalIndex(this.colPalIndex);
  }

  addPal() {
    this.colOp.addPal(this.colPalIndex - 1);
    this.maxPal += 1;
    this.colPalIndex += 1;
    this.setPalIndex(this.colPalIndex);
  }

  removePal() {
    if (this.colOp.removePal(this.colPalIndex - 1)) {
      if (this.colPalIndex === this.maxPal) {
        this.colPalIndex -= 1;
      }
      this.maxPal -= 1;
      this.setPalIndex(this.colPalIndex);
    }
  }

  setPalIndex(palIndex: number) {
    this.palIndexChange.emit(palIndex - 1);
  }

}
