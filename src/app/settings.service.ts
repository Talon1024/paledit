import { Injectable } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Injectable()
export class SettingsService {

  constructor(private sanitizer:DomSanitizer) {}

  private _palColumns:number = 16;
  get palColumns():number {
    return this._palColumns;
  }

  set palColumns(value:number) {
    if (Number.isNaN(value) || !Number.isInteger(value)) return;
    if (value > 0) this._palColumns = value;
  }

  palColumnStyle():SafeStyle {
    let style = `repeat(${this.palColumns}, 1fr)`;
    return this.sanitizer.bypassSecurityTrustStyle(style);
  }

}
