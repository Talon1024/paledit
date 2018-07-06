import { Injectable } from '@angular/core';

export type MessageLevel = 'info' | 'warning' | 'error';
export interface IMessage {
  text: string;
  level: MessageLevel;
  date: Date;
}

@Injectable()
export class MessageService {

  private _messages: IMessage[] = [];
  get messages() {
    return this._messages;
  }

  constructor() { }

  add(text: string, level: MessageLevel) {
    this._messages.push({text, level, date: new Date()});
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
