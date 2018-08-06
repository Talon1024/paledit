import { Component, OnInit, Input } from '@angular/core';
import { ColourRange } from '../palette-model/colour-range';
import { Rgbcolour } from '../palette-model/rgb';
import { Gradient, GradientStop } from '../gradient-model/gradient';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { PaletteOperationService } from '../palette-operation.service';
import { GradientService } from '../gradient.service';

@Component({
  selector: 'app-gradient-editor',
  templateUrl: './gradient-editor.component.html',
  styleUrls: ['./gradient-editor.component.css']
})
export class GradientEditorComponent implements OnInit {

  private curStopIdx = 0;
  private curColour: string;
  private curStopPos: number;
  @Input() range: ColourRange;
  private gradient: Gradient;

  constructor(private sanitizer: DomSanitizer,
    private palOp: PaletteOperationService,
    private grad: GradientService) {}

  ngOnInit() {
    this.gradient = this.grad.gradient;
    this.setCurStopIdx(0);
  }

  // Preview-related stuff

  gradientStyle(): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(this.gradient.toCssString());
  }

  previewColourStyle(palIdx: number): SafeStyle {
    const colour = this.gradient.colourAt(palIdx, this.range);
    return this.sanitizer.bypassSecurityTrustStyle(Rgbcolour.toHex(colour));
  }

  stopPositionStyle(stop: GradientStop): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(stop.posPercent());
  }

  // Gradient stop navigation

  handleStopClickDown(e: MouseEvent, idx: number) {
    // TODO: Click and drag
    this.setCurStopIdx(idx);
  }

  nextStop() {
    let stopIdx = this.curStopIdx + 1;
    if (stopIdx >= this.grad.stopCount()) {
      stopIdx = this.grad.stopCount() - 1;
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
    this.curStopPos = this.grad.stopPos(idx);
    this.curColour = Rgbcolour.toHex(this.grad.stopColour(idx));
  }

  // Gradient modification

  addStop() {
    const stopIdx = this.grad.addStopAt(this.curStopIdx);
    this.gradient = this.grad.gradient;
    this.setCurStopIdx(stopIdx);
  }

  removeStop() {
    const stopIdx = this.grad.removeStopAt(this.curStopIdx);
    this.gradient = this.grad.gradient;
    this.setCurStopIdx(stopIdx);
  }

  setCurStopPos(data: string) {
    const newPos = parseFloat(data);
    this.curStopPos = newPos;
    const newIdx = this.grad.setStopPos(this.curStopIdx, newPos);
    this.gradient = this.grad.gradient;
    this.setCurStopIdx(newIdx);
  }

  setCurStopColor(colour: string) {
    this.curColour = colour;
    this.grad.setStopColour(this.curStopIdx, colour);
    this.gradient = this.grad.gradient;
  }

  applyGradient() {
    this.palOp.applyGradient();
  }

}
