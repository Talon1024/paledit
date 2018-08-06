import { Injectable } from '@angular/core';
import { Observable, Observer, TeardownLogic } from 'rxjs';

export class KeyState {
  event: KeyboardEvent;
  key: string;
  state: boolean;

  constructor(key: string, state: boolean, event: KeyboardEvent = null) {
    this.key = key;
    this.state = state;
    this.event = event;
  }
}

@Injectable()
export class KeyboardService {

  constructor() {}

  observeKeyboard(filter?: string[]): Observable<KeyState> {
    // Needed for listening for both keyup and keydown events
    return Observable.create(function (obs: Observer<KeyState>): TeardownLogic {
      function handleKeyEvent (e: KeyboardEvent) {
        if (filter && !filter.includes(e.key)) { return; }
        const emitValue = new KeyState(e.key, e.type === 'keydown' ? true : false, e);
        obs.next(emitValue);
      }

      document.addEventListener('keydown', handleKeyEvent);
      document.addEventListener('keyup', handleKeyEvent);
      return () => {
        document.removeEventListener('keydown', handleKeyEvent);
        document.removeEventListener('keyup', handleKeyEvent);
      };
    });
  }

}
