import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ColourRange } from '../palette-model/colour-range';
import { Rgbcolour } from '../palette-model/rgb';
import { Palette } from '../palette-model/palette';
import { Gradient, GradientStop } from '../gradient-model/gradient';
import { GradientOperation } from '../gradient-model/gradient-operation';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-gradient-editor',
  templateUrl: './gradient-editor.component.html',
  styleUrls: ['./gradient-editor.component.css']
})
export class GradientEditorComponent implements OnInit {

  private gradient: Gradient;
  private curStopIdx = 0;
  private curColour: string;
  private curStopPos: number;
  @Input() range: ColourRange;
  @Input() targetPalette?: Palette;
  @Output() gradientOperation = new EventEmitter<GradientOperation>();

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.gradient = this.defaultGradient();
    this.setCurStopIdx(0);
  }

  defaultGradient(): Gradient {
    const blackStop = new GradientStop(0, {red: 0, green: 0, blue: 0});
    const whiteStop = new GradientStop(1, {red: 255, green: 255, blue: 255});

    const gradient = new Gradient([blackStop, whiteStop]);
    return gradient;
  }

  gradientStyle(): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(this.gradient.toCssString());
  }

  previewColourStyle(palIdx: number): SafeStyle {
    const colour = this.gradient.colourAt(palIdx, this.range);
    return this.sanitizer.bypassSecurityTrustStyle(colour.toHex());
  }

  stopPositionStyle(stop: GradientStop): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(stop.posPercent());
  }

  handleStopClickDown(e: MouseEvent, idx: number) {
    // Click and drag
    this.setCurStopIdx(idx);
  }

  handleStopPosChange(e: Event) {
    const targ = e.target as HTMLInputElement;

    const newPos = parseFloat(targ.value);
    this.curStopPos = newPos;

    this.gradient.stops[this.curStopIdx].position = newPos;
  }

  setCurStopIdx(idx: number) {
    this.curStopIdx = idx;
    this.curStopPos = this.gradient.stops[idx].position;
    this.curColour = new Rgbcolour(this.gradient.stops[idx].colour).toHex();
  }

  setCurStopColor(colour: string) {
    this.gradient.stops[this.curStopIdx].colour = Rgbcolour.fromHex(this.curColour);
  }

  applyGradient() {
    this.gradientOperation.emit({
      type: 'apply',
      gradient: this.gradient
    });
  }

}
