import { Component, OnInit, Input } from '@angular/core';
import { ColourRange } from '../palette-model/colour-range';
import { Rgbcolour } from '../palette-model/rgb';
import { Gradient, GradientStop } from '../gradient-model/gradient';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { PaletteOperationService } from '../palette-operation.service';

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

  constructor(private sanitizer: DomSanitizer,
    private palOp: PaletteOperationService) {}

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

  handleStopPosChange(data: string) {
    const newPos = parseFloat(data);
    this.curStopPos = newPos;

    this.gradient.stops[this.curStopIdx].position = newPos;
    this.gradient.stops.sort((a, b) => {
      return a.position - b.position;
    });
  }

  addStop() {
    const stopCount = this.gradient.stops.length;
    let otherStopIdx = this.curStopIdx + 1;
    let newStopIdx = otherStopIdx;
    if (otherStopIdx >= stopCount) {
      otherStopIdx = this.curStopIdx - 1;
      newStopIdx = this.curStopIdx;
    }

    const newPos = (this.gradient.stops[this.curStopIdx].position + this.gradient.stops[otherStopIdx].position) / 2;
    const newColour = (
      new Rgbcolour(this.gradient.stops[this.curStopIdx].colour)
      .blend(0.5, new Rgbcolour(this.gradient.stops[otherStopIdx].colour), Rgbcolour.tint)
    );
    const newStop = new GradientStop(newPos, newColour);
    this.gradient.addStop(newStop);
    this.setCurStopIdx(newStopIdx);
  }

  removeStop() {
    const stopCount = this.gradient.stops.length;
    if (stopCount <= 2) { return; }

    this.gradient.stops.splice(this.curStopIdx, 1);
    this.gradient.stops.sort((a, b) => {
      return a.position - b.position;
    });

    this.setCurStopIdx(this.curStopIdx);
  }

  nextStop() {
    let stopIdx = this.curStopIdx + 1;
    if (stopIdx >= this.gradient.stops.length) {
      stopIdx = this.gradient.stops.length - 1;
    }
    this.setCurStopIdx(stopIdx);
  }

  prevStop() {
    let stopIdx = this.curStopIdx - 1;
    if (stopIdx < 0) {
      stopIdx = 0;
    }
    this.setCurStopIdx(stopIdx);
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
    this.palOp.applyGradient(this.gradient);
  }

}
