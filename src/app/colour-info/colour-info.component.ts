import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Rgbcolour, Rgb, Hsv } from '../palette-model/rgb';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-colour-info',
  templateUrl: './colour-info.component.html',
  styleUrls: ['./colour-info.component.css']
})
export class ColourInfoComponent implements OnInit {

  @Input() pickable = false;

  private _rgb: Rgb;
  public get rgb() { return this._rgb; }
  @Input() public set rgb(val: Rgb) {
    this._rgb = val;
    this._hsv = Rgbcolour.hsv(val);
    this._hex = Rgbcolour.toHex(val);
  }
  @Output() rgbChange = new EventEmitter<Rgb>();

  private _hsv: Hsv;
  public get hsv() { return this._hsv; }

  private _hex: string;
  public get curHex() { return this._hex; }
  public set curHex(val: string) {
    this.rgb = Rgbcolour.fromHex(val);
    this.rgbChange.emit(this.rgb);
  }

  constructor(private sanitizer: DomSanitizer) {}

  previewColourStyle(colour: string): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(colour);
  }

  ngOnInit() {
    if (this._hex == null) {
      this._hex = '#000';
    }
    if (this._hsv == null) {
      this._hsv = {hue: 0, saturation: 0, value: 0};
    }
    if (this._rgb == null) {
      this._rgb = {red: 0, green: 0, blue: 0};
    }
  }

}
