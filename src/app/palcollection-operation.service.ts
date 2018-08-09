import { Injectable } from '@angular/core';
import { Palette } from './palette-model/palette';
import { Palcollection } from './palette-model/palcollection';
import { Observable, Observer, TeardownLogic } from 'rxjs';

@Injectable()
export class PalcollectionOperationService {

  get collection(): Palcollection { return this._collection; }
  set collection(value: Palcollection) {
    this.collection = value;
    for (const obs of this._palCountObservers) {
      obs.next(this.palCount());
    }
  }
  private _collection: Palcollection;
  public readonly palCountObv: Observable<number>;
  private _palCountObservers: Observer<number>[];

  constructor() {
    this.palCountObv = Observable.create((obs: Observer<number>): TeardownLogic => {
      this._palCountObservers.push(obs);
      obs.next(this.palCount());
      return () => {
        const idx = this._palCountObservers.findIndex((e) => e === obs);
        this._palCountObservers.splice(idx, 1);
        obs.complete();
      };
    });
    this._palCountObservers = [];
  }

  createWithInitialPalette(pal: Palette) {
    this._collection = Palcollection.withInitialPal(pal);
    for (const obs of this._palCountObservers) {
      obs.next(1);
    }
  }

  createFromData(data: Uint8ClampedArray) {
    this._collection = Palcollection.fromData(data);
    for (const obs of this._palCountObservers) {
      obs.next(this.palCount());
    }
  }

  getPal(idx: number): Palette {
    return this._collection.palettes[idx];
  }

  palCount(): number {
    return this._collection ? this._collection.palettes.length : 0;
  }

  addPal(atIdx: number, pal?: Palette) {
    if (pal == null) {
      pal = new Palette();
      pal.data = new Uint8ClampedArray(this._collection.palettes[atIdx].data);
    }
    this._collection.palettes.splice(atIdx, 0, pal);
    for (const obs of this._palCountObservers) {
      obs.next(this.palCount());
    }
  }

  removePal(atIdx: number): boolean {
    if (this.palCount() === 1) { return false; }
    this._collection.palettes.splice(atIdx, 1);
    for (const obs of this._palCountObservers) {
      obs.next(this.palCount());
    }
    return true;
  }

}
