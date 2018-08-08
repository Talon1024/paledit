import { Injectable } from '@angular/core';
import { Palette } from './palette-model/palette';
import { Palcollection } from './palette-model/palcollection';

@Injectable()
export class PalcollectionOperationService {

  get collection(): Palcollection { return this._collection; }
  private _collection: Palcollection;

  constructor() { }

  createWithInitialPalette(pal: Palette) {
    this._collection = Palcollection.withInitialPal(pal);
  }

  createFromData(data: Uint8ClampedArray) {
    this._collection = Palcollection.fromData(data);
  }

  getPal(idx: number): Palette {
    return this._collection.palettes[idx];
  }

  numPals(): number {
    return this._collection.palettes.length;
  }

  addPal(atIdx: number, pal?: Palette) {
    if (pal == null) {
      pal = new Palette();
      pal.data = new Uint8ClampedArray(this._collection.palettes[atIdx].data);
    }
    this._collection.palettes.splice(atIdx, 0, pal);
  }

  removePal(atIdx: number): boolean {
    if (this.numPals() === 1) { return false; }
    this._collection.palettes.splice(atIdx, 1);
    return true;
  }

}
