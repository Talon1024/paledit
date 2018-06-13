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
  private curStop: GradientStop;
  private curColour: string;
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

  setCurStopIdx(idx: number) {
    // console.log(`Setting stop index to ${idx}`);
    this.curStop = this.gradient.stops[idx];
    this.curColour = new Rgbcolour(this.curStop.colour).toHex();
  }

  setCurStopColor(colour: string) {
    this.curStop.colour = Rgbcolour.fromHex(this.curColour);
  }

  applyGradient() {
    this.gradientOperation.emit('apply');
  }

}
