import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PalcollectionOperationService } from '../palcollection-operation.service';

@Component({
  selector: 'app-palette-navigator',
  templateUrl: './palette-navigator.component.html',
  styleUrls: ['./palette-navigator.component.css']
})
export class PaletteNavigatorComponent implements OnInit {

  @Output() palIndexChange = new EventEmitter<number>();
  private colPalIndex: number; // User input (actually index + 1)
  public numPals: number;

  constructor(private colOp: PalcollectionOperationService) { }

  ngOnInit() {
    this.numPals = 1;
    this.colPalIndex = 1;
  }

  nextPal() {
    if (this.colPalIndex < this.colOp.numPals()) { this.colPalIndex += 1; }
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
    this.colPalIndex = this.colOp.numPals();
    this.setPalIndex(this.colPalIndex);
  }

  addPal() {
    this.colOp.addPal(this.colPalIndex - 1);
    this.colPalIndex += 1;
    this.setPalIndex(this.colPalIndex);
  }

  removePal() {
    if (this.colOp.removePal(this.colPalIndex - 1)) {
      // Already removed a palette
      if (this.colPalIndex === this.colOp.numPals() + 1) {
        this.colPalIndex -= 1;
      }
      this.setPalIndex(this.colPalIndex);
    }
  }

  setPalIndex(palIndex: number) {
    this.palIndexChange.emit(palIndex - 1);
  }

}
