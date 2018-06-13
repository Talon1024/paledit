import { Component, OnInit, Input } from '@angular/core';
import { ColourRange } from '../palette-model/colour-range';
import { Gradient, GradientStop } from '../gradient-model/gradient';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-gradient-editor',
  templateUrl: './gradient-editor.component.html',
  styleUrls: ['./gradient-editor.component.css']
})
export class GradientEditorComponent implements OnInit {

  private gradient: Gradient;
  @Input() range: ColourRange;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.gradient = this.defaultGradient();
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

  stopPositionStyle(stop:GradientStop):SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(stop.posPercent());
  }

}
