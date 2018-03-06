import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

@Injectable()
export class KeyboardService {

  keyStateObservable:Observable<Object>;

  constructor() {
    // Needed for listening for both keyup and keydown events
    this.keyStateObservable = Observable.create((obs:Observer<Object>) => {
      document.addEventListener("keydown", function (e:KeyboardEvent) {
        let emitValue = {};
        emitValue[e.key] = true;
        obs.next(emitValue);
      });
      document.addEventListener("keyup", function (e:KeyboardEvent) {
        let emitValue = {};
        emitValue[e.key] = false;
        obs.next(emitValue);
      });
    });
  }

}
