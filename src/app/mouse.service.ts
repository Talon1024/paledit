import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

@Injectable()
export class MouseService {

  constructor() {}

  observeElement(element:EventTarget):Observable<MouseEvent> {
    return Observable.create((obs:Observer<MouseEvent>) => {
      document.addEventListener("mouseenter", (e:MouseEvent) => {
        obs.next(e);
      });
      document.addEventListener("mousedown", (e:MouseEvent) => {
        obs.next(e);
      });
      document.addEventListener("mouseleave", (e:MouseEvent) => {
        obs.next(e);
      });
      document.addEventListener("mouseup", (e:MouseEvent) => {
        obs.next(e);
      });
    });
  }

  observeSelectedElement(selector:string):Observable<MouseEvent> {
    let element = document.querySelector(selector);
    return this.observeElement(element);
  }

}
