import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { TeardownLogic } from 'rxjs/Subscription';

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
  appFocused:boolean;

  constructor() {
    this.appFocused = true;
  }

  observeKeyboard(filter?:string[]):Observable<KeyState> {
    // Needed for listening for both keyup and keydown events
    return Observable.create(function (obs:Observer<KeyState>):TeardownLogic {
      var handleKeyEvent = (e:KeyboardEvent) => {
        if (!this.appFocused) return;
        if (filter && !filter.includes(e.key)) return;
        let emitValue = new KeyState(e.key, e.type === "keydown" ? true : false, e);
        obs.next(emitValue);
      }

      var focusChange = (e:Event) => {
        this.appFocused = document.hidden;
      }

      document.addEventListener("visibilitychange", focusChange);
      document.addEventListener("keydown", handleKeyEvent);
      document.addEventListener("keyup", handleKeyEvent);
      return () => {
        document.removeEventListener("keydown", handleKeyEvent);
        document.removeEventListener("keyup", handleKeyEvent);
      }
    });
  }

}
