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

  previewColourStyle(palIdx: number): SafeStyle {
    const colour = this.gradient.colourAt(palIdx, this.range);
    return this.sanitizer.bypassSecurityTrustStyle(Rgbcolour.toHex(colour));
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
    const newColour = Rgbcolour.blend(this.gradient.stops[this.curStopIdx].colour,
      0.5, this.gradient.stops[otherStopIdx].colour, Rgbcolour.tint);
    const newStop = new GradientStop(newPos, newColour);
    this.gradient.addStop(newStop);
    this.setCurStopIdx(newStopIdx);
  }

  removeStop() {
    const stopCount = this.gradient.stops.length;
    if (stopCount <= 2) { return; }
    let stopIdx = this.curStopIdx;

    this.gradient.stops.splice(stopIdx, 1);
    this.gradient.stops.sort((a, b) => {
      return a.position - b.position;
    });

    if (stopIdx === stopCount - 1) {
      stopIdx -= 1;
    }

    this.setCurStopIdx(stopIdx);
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
    this.curColour = Rgbcolour.toHex(this.gradient.stops[idx].colour);
  }

  setCurStopColor(colour: string) {
    this.curColour = colour;
    this.gradient.stops[this.curStopIdx].colour = Rgbcolour.fromHex(this.curColour);
  }

  applyGradient() {
    this.palOp.applyGradient(this.gradient);
  }

}
