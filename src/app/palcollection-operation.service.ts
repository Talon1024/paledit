import { Injectable } from '@angular/core';
import { Palette } from './palette-model/palette';
import { Palcollection } from './palette-model/palcollection';
import { Observable, Observer, TeardownLogic } from 'rxjs';

@Injectable()
export class PalcollectionOperationService {

  get collection(): Palcollection { return this._collection; }
  set collection(value: Palcollection) {
    this._collection = value;
    for (const obs of this._palCountObservers) {
      obs.next(this.palCount());
    }
    for (const obs of this._palChangeObservers) {
      obs.next(0);
    }
  }
  private _collection: Palcollection;
  public readonly palCountObv: Observable<number>;
  public readonly palChangeObv: Observable<number>;
  private _palCountObservers: Observer<number>[];
  private _palChangeObservers: Observer<number>[];
  private palIndex: number;

  constructor() {
    function makeObservable<T>(obsArray: Observer<T>[], getInitialValue: () => T): Observable<T> {
      return Observable.create((obs: Observer<T>): TeardownLogic => {
        obsArray.push(obs);
        obs.next(getInitialValue());
        return function() {
          const idx = obsArray.findIndex((e) => e === obs);
          obsArray.splice(idx, 1);
          obs.complete();
        };
      });
    }

    this._palCountObservers = [];
    this.palCountObv = makeObservable<number>(this._palCountObservers, () => this.palCount());

    this.palIndex = 0;
    this._palChangeObservers = [];
    this.palChangeObv = makeObservable<number>(this._palChangeObservers, () => this.palIndex);
  }

  clampIndex(idx: number): number {
    idx = Math.min(Math.max(idx, 0), this.palCount() - 1);
    return idx;
  }

  createFromPlaypal(data: Uint8Array) {
    this._collection = Palcollection.fromPlaypal(data);
    for (const obs of this._palCountObservers) {
      obs.next(this.palCount());
    }
    for (const obs of this._palChangeObservers) {
      obs.next(0);
    }
  }

  getPal(idx: number): Palette {
    if (this._collection) {
      return this._collection.palettes[idx];
    }
  }

  palCount(): number {
    if (this._collection) {
      return this._collection.palettes.length;
    }
    return 0;
  }

  addPal(atIdx: number, pal?: Palette) {
    if (pal == null) {
      pal = this._collection.palettes[atIdx];
    }
    this._collection.palettes.splice(atIdx, 0, pal);
    this.palIndex += 1;
    for (const obs of this._palCountObservers) {
      obs.next(this.palCount());
    }
    for (const obs of this._palChangeObservers) {
      obs.next(this.palIndex);
    }
  }

  removePal(atIdx: number): boolean {
    if (this.palCount() === 1) { return false; }
    this._collection.palettes.splice(atIdx, 1);
    this.palIndex -= 1;
    if (this.palIndex < 0) { this.palIndex = 0; }
    for (const obs of this._palCountObservers) {
      obs.next(this.palCount());
    }
    for (const obs of this._palChangeObservers) {
      obs.next(this.palIndex);
    }
    return true;
  }

  goToPal(idx: number) {
    this.palIndex = this.clampIndex(idx);
    for (const obs of this._palChangeObservers) {
      obs.next(this.palIndex);
    }
  }

  nextPal() {
    this.goToPal(this.palIndex + 1);
  }

  prevPal() {
    this.goToPal(this.palIndex - 1);
  }

  firstPal() {
    this.goToPal(0);
  }

  lastPal() {
    this.goToPal(this.palCount() - 1);
  }

}
