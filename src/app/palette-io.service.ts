import { Injectable } from '@angular/core';
import * as base64 from 'base64-js';
import { Palcollection } from './palette-model/palcollection';
import { Observable } from 'rxjs';
//import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { bindNodeCallback } from 'rxjs/observable/bindNodeCallback';

@Injectable()
export class PaletteIoService {

  private fileReader:FileReader;

  constructor() {
    this.fileReader = this.fileReader || new FileReader();
  }

  // Wrapper for rxjs bindNodeCallback
  private readPaletteFile(file:File, callback:(error:any, result:Palcollection) => void) {
    let fileReader = this.fileReader;
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = () => {
      let data = new Uint8ClampedArray(<ArrayBuffer>fileReader.result);
      let collection = null, error = null;
      try {
        collection = Palcollection.fromData(data);
      } catch (e) {
        error = e;
      }
      callback(error, collection);
    }
    fileReader.onerror = () => {
      callback(fileReader.error, null);
    }
  }

  getPaletteFile(file:File):Observable<Palcollection> {
    var observableFile = bindNodeCallback(this.readPaletteFile);
    return observableFile(file);
  }

  savePalCollection(collection:Palcollection):Observable<string> {
    let colData = collection.toData();
    let data64 = base64.fromByteArray(colData);
    return of(data64);
  }

  private handleError<T>(operation:string = 'operation', result?: T) {
    return (error:any):Observable<T> => {
      console.error(error);
      //this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

}
