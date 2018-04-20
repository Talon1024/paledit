import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Palcollection } from '../palette-model/palcollection';

@Component({
  selector: 'app-palette-navigator',
  templateUrl: './palette-navigator.component.html',
  styleUrls: ['./palette-navigator.component.css']
})
export class PaletteNavigatorComponent implements OnInit {

  @Output() palIndexChange = new EventEmitter<number>();
  private colPalIndex:number; // User input (actually index + 1)
  @Input() maxPal:number;

  constructor() { }

  ngOnInit() {
    this.colPalIndex = 1;
  }

  nextPal() {
    if (this.colPalIndex < this.maxPal) this.colPalIndex += 1;
    this.setPalIndex(this.colPalIndex);
  }

  prevPal() {
    if (this.colPalIndex > 1) this.colPalIndex -= 1;
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

  setPalIndex(palIndex:number) {
    this.palIndexChange.emit(palIndex - 1);
  }

}
