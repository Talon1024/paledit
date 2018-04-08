import { Component, OnInit } from '@angular/core';
import { Gradient, GradientStop } from '../gradient-model/gradient';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-gradient-editor',
  templateUrl: './gradient-editor.component.html',
  styleUrls: ['./gradient-editor.component.css']
})
export class GradientEditorComponent implements OnInit {

  private gradient:Gradient;

  constructor(private sanitizer:DomSanitizer) {}

  ngOnInit() {
    this.gradient = this.defaultGradient();
  }

  defaultGradient():Gradient {
    let blackStop = new GradientStop(0, {red: 0, green: 0, blue: 0});
    let whiteStop = new GradientStop(1, {red: 255, green: 255, blue: 255});

    let gradient = new Gradient([blackStop, whiteStop]);
    return gradient;
  }

  gradientStyle():SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(this.gradient.toCssString());
  }

}
