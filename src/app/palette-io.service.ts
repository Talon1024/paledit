import { Injectable } from '@angular/core';
import * as base64 from 'base64-js';
import { Palcollection } from './palette-model/palcollection';
import { Observable, bindNodeCallback } from 'rxjs';
import { WadReaderService, DoomWadLump } from './wad-reader.service';

@Injectable()
export class PaletteIoService {

  constructor(private wadIo: WadReaderService) {}

  private readFromWadFile = (file: File, callback: (error: any, result: Palcollection) => void) => {
    this.wadIo.readWadFile(file, (e) => {
      if (e) { callback(e, null); }

      const playpal = this.wadIo.getLump('PLAYPAL');
      if (playpal instanceof Error) {
        callback(playpal as Error, null);
      }
      const data = new Uint8ClampedArray((playpal as DoomWadLump).data);

      let collection = null, error = null;
      try {
        collection = Palcollection.fromData(data);
      } catch (e) {
        error = e;
      }
      callback(error, collection);
    });
  }

  // Wrapper for rxjs bindNodeCallback
  private readPaletteFile(file: File, callback: (error: any, result: Palcollection) => void) {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = () => {
      const data = new Uint8ClampedArray(fileReader.result as ArrayBuffer);
      let collection = null, error = null;
      try {
        collection = Palcollection.fromData(data);
      } catch (e) {
        error = e;
      }
      callback(error, collection);
    };
    fileReader.onerror = () => {
      callback(fileReader.error, null);
    };
  }

  getPaletteFile(file: File): Observable<Palcollection> {
    const fname = file.name.toLowerCase();
    let observableFile: (f: File) => Observable<Palcollection>;
    if (fname.endsWith('wad')) {
      observableFile = bindNodeCallback(this.readFromWadFile);
    } else {
      observableFile = bindNodeCallback(this.readPaletteFile);
    }
    return observableFile(file);
  }

  savePalCollection(collection: Palcollection): string {
    const colData = collection.toData();
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
