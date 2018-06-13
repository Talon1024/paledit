import { Injectable } from '@angular/core';
import * as base64 from 'base64-js';
import { Palcollection } from './palette-model/palcollection';
import { Observable } from 'rxjs/Observable';
//  import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { bindNodeCallback } from 'rxjs/observable/bindNodeCallback';

@Injectable()
export class PaletteIoService {

  constructor() {}

  // Wrapper for rxjs bindNodeCallback
  private readPaletteFile(file: File, callback: (error: any, result: Palcollection) => void) {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = () => {
      const data = new Uint8ClampedArray(<ArrayBuffer>fileReader.result);
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
    const observableFile = bindNodeCallback(this.readPaletteFile);
    return observableFile(file);
  }

  savePalCollection(collection: Palcollection): string {
    const colData = collection.toData();
    const data64 = base64.fromByteArray(colData);
    return data64;
  }

  private handleError<T>(operation: string = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      // this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

}
