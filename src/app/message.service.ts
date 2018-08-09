import { Injectable } from '@angular/core';
import { Observable, Observer, TeardownLogic } from 'rxjs';

export type MessageLevel = 'info' | 'warning' | 'error';
export interface IMessage {
  text: string;
  level: MessageLevel;
  date: Date;
}

@Injectable()
export class MessageService {

  public readonly observable: Observable<IMessage>;
  private _observers: Observer<IMessage>[];
  /*
  private _messages: IMessage[] = [];
  get messages() {
    return this._messages;
  }
  */

  constructor() {
    this.observable = Observable.create((ob: Observer<IMessage>): TeardownLogic => {
      this._observers.push(ob);
      return () => {
        const idx = this._observers.findIndex((e) => e === ob);
        this._observers.splice(idx, 1);
        ob.complete();
      };
    });
    this._observers = [];
  }

  add(text: string, level: MessageLevel) {
    // this._messages.push({text, level, date: new Date()});
    for (const ob of this._observers) {
      ob.next({text, level, date: new Date()});
    }
  }

  info(text: string) {
    const level = 'info';
    this.add(text, level);
  }

  warning(text: string) {
    const level = 'warning';
    this.add(text, level);
  }

  error(text: string) {
    const level = 'error';
    this.add(text, level);
  }

}
