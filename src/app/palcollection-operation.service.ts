import { Injectable } from '@angular/core';
import { Palette } from './palette-model/palette';
import { Palcollection } from './palette-model/palcollection';

@Injectable()
export class PalcollectionOperationService {

  collection: Palcollection;

  constructor() { }

  createWithInitialPalette(pal: Palette) {
    this.collection = Palcollection.withInitialPal(pal);
  }

  createFromData(data: Uint8ClampedArray) {
    this.collection = Palcollection.fromData(data);
  }

  getPal(idx: number): Palette {
    return this.collection.palettes[idx];
  }

  numPals(): number {
    return this.collection.palettes.length;
  }

  addPal(atIdx: number, pal?: Palette) {
    if (pal == null) {
      pal = new Palette();
      pal.data = new Uint8ClampedArray(this.collection.palettes[atIdx].data);
    }
    this.collection.palettes.splice(atIdx, 0, pal);
  }

  removePal(atIdx: number): boolean {
    if (this.numPals() === 1) { return false; }
    this.collection.palettes.splice(atIdx, 1);
    return true;
  }

}
