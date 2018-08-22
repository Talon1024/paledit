import { Injectable } from '@angular/core';
import * as base64 from 'base64-js';
import { Palcollection } from './palette-model/palcollection';
import { Observable, Observer, TeardownLogic, bindNodeCallback } from 'rxjs';
import { WadReaderService, DoomWadLump } from './wad-reader.service';

@Injectable()
export class PaletteIoService {

  public readonly loadStateObv: Observable<boolean>;
  private _loadStateObservers: Observer<boolean>[];

  constructor(private wadIo: WadReaderService) {
    this._loadStateObservers = [];
    this.loadStateObv = Observable.create((obs: Observer<boolean>): TeardownLogic => {
      this._loadStateObservers.push(obs);
      obs.next(false);
      return () => {
        const idx = this._loadStateObservers.findIndex((e) => e === obs);
        this._loadStateObservers.splice(idx, 1);
      };
    });
  }

  private readFromWadFile = (file: File, callback: (error: any, result: Palcollection) => void) => {
    for (const obs of this._loadStateObservers) {
      obs.next(true);
    }
    this.wadIo.readWadFile(file, (e) => {
      if (e) { callback(e, null); }

      const playpal = this.wadIo.getLump('PLAYPAL');
      if (playpal instanceof Error) {
        for (const obs of this._loadStateObservers) {
          obs.next(false);
        }
        return callback(playpal as Error, null);
      }
      const data = new Uint8Array((playpal as DoomWadLump).data);
      const col = Palcollection.fromPlaypal(data);
      for (const obs of this._loadStateObservers) {
        obs.next(false);
      }
      callback(null, col);
    });
  }

  // Wrapper for rxjs bindNodeCallback
  private readPaletteFile = (file: File, callback: (error: any, result: Palcollection) => void) => {
    for (const obs of this._loadStateObservers) {
      obs.next(true);
    }
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = () => {
      const data = new Uint8Array(fileReader.result as ArrayBuffer);
      const col = Palcollection.fromPlaypal(data);
      for (const obs of this._loadStateObservers) {
        obs.next(false);
      }
      callback(null, col);
    };
    fileReader.onerror = () => {
      for (const obs of this._loadStateObservers) {
        obs.next(false);
      }
      callback(fileReader.error, null);
    };
  }

  getPaletteFile(file: File): Observable<Palcollection> {
    const fname = file.name.toLowerCase();
    let observableFile: (f: File) => Observable<Palcollection>;
    if (fname.endsWith('.wad')) {
      observableFile = bindNodeCallback(this.readFromWadFile);
    } else {
      observableFile = bindNodeCallback(this.readPaletteFile);
    }
    return observableFile(file);
  }

  savePalCollection(collection: Palcollection): string {
    const colData = collection.toPlaypal();
    const data64 = base64.fromByteArray(colData);
    return data64;
  }

/*
  private handleError<T>(operation: string = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      // this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
*/
}
