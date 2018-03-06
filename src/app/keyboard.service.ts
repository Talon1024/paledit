import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

export class KeyState {
  event:KeyboardEvent;
  key:string;
  state:boolean;

  constructor(key:string, state:boolean, event:KeyboardEvent = null) {
    this.key = key;
    this.state = state;
    this.event = event;
  }
}

@Injectable()
export class KeyboardService {

  keyStateObservable:Observable<KeyState>;

  constructor() {
    // Needed for listening for both keyup and keydown events
    this.keyStateObservable = Observable.create((obs:Observer<KeyState>) => {
      document.addEventListener("keydown", function (e:KeyboardEvent) {
        let emitValue = new KeyState(e.key, true, e);
        obs.next(emitValue);
      });
      document.addEventListener("keyup", function (e:KeyboardEvent) {
        let emitValue = new KeyState(e.key, false, e);
        obs.next(emitValue);
      });
    });
  }

}
