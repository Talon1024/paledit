import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Gradient, GradientStop } from '../gradient-model/gradient';

@Component({
  selector: 'app-gradient-slider',
  templateUrl: './gradient-slider.component.html',
  styleUrls: ['./gradient-slider.component.css']
})
export class GradientSliderComponent implements OnInit {

  @Input() gradient: Gradient;
  @Input() curStopIdx: number;
  @Output() select = new EventEmitter<number>();

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
  }

  gradientStyle(): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(this.gradient.toCssString());
  }

  stopPositionStyle(stop: GradientStop): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(stop.posPercent());
  }

  handleStopClickDown(idx: number) {
    this.select.emit(idx);
  }

}
