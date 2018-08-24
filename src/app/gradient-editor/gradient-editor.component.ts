import { Component, OnInit } from '@angular/core';
import { Rgb, Rgbcolour } from '../palette-model/rgb';
import { Gradient, GradientStop } from '../gradient-model/gradient';
import { DomSanitizer, SafeStyle, SafeUrl } from '@angular/platform-browser';
import { PaletteOperationService } from '../palette-operation.service';
import { PaletteSelectionService } from '../palette-selection.service';
import { GradientService } from '../gradient.service';

interface RgbEx extends Rgb {
  hex: string;
  hue: number;
  saturation: number;
  value: number;
}

@Component({
  selector: 'app-gradient-editor',
  templateUrl: './gradient-editor.component.html',
  styleUrls: ['./gradient-editor.component.css']
})
export class GradientEditorComponent implements OnInit {

  public curStopIdx = 0;
  public curColour: string;
  public curStopPos: number;

  public selectedColours: RgbEx[];
  public selectedColourCount: number;

  public gradient: Gradient;

  public gradJsonUrl: SafeUrl;
  public readonly gradJsonFname: string = 'gradient.json';

  constructor(private sanitizer: DomSanitizer,
    private palOp: PaletteOperationService,
    private palSel: PaletteSelectionService,
    private grad: GradientService) {}

  ngOnInit() {
    this.gradient = this.grad.gradient;
    this.setCurStopIdx(0);
    this.selectedColours = [];
    this.palSel.palSelectObv.subscribe((sr) => {
      let count = 0;
      if (sr != null) {
        count = sr.getLength();
      }
      this.selectedColourCount = count;
      this.updateGradientPreview();
    });
  }

  // Preview-related stuff

  gradientStyle(): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(this.gradient.toCssString());
  }

  previewColourStyle(colour: RgbEx): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(colour.hex);
  }

  stopPositionStyle(stop: GradientStop): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(stop.posPercent());
  }

  private updateGradientPreview() {
    this.selectedColours = [];
    for (let i = 0; i < this.selectedColourCount; i++) {
      const {red, green, blue} = this.gradient.colourIn(i, this.selectedColourCount);
      const {hue, saturation, value} = Rgbcolour.hsv({red, green, blue});
      const hex = Rgbcolour.toHex({red, green, blue});
      this.selectedColours.push({red, green, blue, hue, saturation, value, hex});
    }
  }

  // Gradient stop navigation

  handleStopClickDown(_e: MouseEvent, idx: number) {
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

  reverseGradient() {
    const stopIdx = this.grad.stopCount() - this.curStopIdx - 1;
    this.grad.reverse();
    this.gradient = this.grad.gradient;
    this.setCurStopIdx(stopIdx);
  }

  exportGradient() {
    const json = this.grad.export();
    const url = `data:application/json,${json}`;
    this.gradJsonUrl = this.sanitizer.bypassSecurityTrustUrl(url);
  }

  importGradient(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const reader = new FileReader();
      const file = input.files[0];
      reader.readAsText(file);
      reader.onload = () => {
        this.grad.import(reader.result);
        this.gradient = this.grad.gradient;
        this.updateGradientPreview();
      };
    }
  }

}
