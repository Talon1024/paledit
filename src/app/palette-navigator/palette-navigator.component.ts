import { Component, OnInit } from '@angular/core';
import { PalcollectionOperationService } from '../palcollection-operation.service';

@Component({
  selector: 'app-palette-navigator',
  templateUrl: './palette-navigator.component.html',
  styleUrls: ['./palette-navigator.component.css']
})
export class PaletteNavigatorComponent implements OnInit {

  public colPalIndex: number; // User input (actually index + 1)
  public palCount: number;

  constructor(private colOp: PalcollectionOperationService) { }

  ngOnInit() {
    this.palCount = 1;
    this.colPalIndex = 1;
    this.colOp.palCountObv.subscribe((c: number) => {
      this.palCount = c;
    });
    this.colOp.palChangeObv.subscribe((x: number) => {
      this.colPalIndex = x + 1;
    });
  }

  nextPal() {
    this.colOp.nextPal();
  }

  prevPal() {
    this.colOp.prevPal();
  }

  firstPal() {
    this.colOp.firstPal();
  }

  lastPal() {
    this.colOp.lastPal();
  }

  addPal() {
    this.colOp.addPal(this.colPalIndex - 1);
  }

  removePal() {
    this.colOp.removePal(this.colPalIndex - 1);
  }

  setPalIndex(palIndex: number) {
    this.colOp.goToPal(palIndex - 1);
  }

}
