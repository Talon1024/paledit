import { Directive, Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Gradient, GradientStop } from '../gradient-model/gradient';

@Directive({selector: 'app-gradient'})
export class GradientDirective {
  constructor(public el: ElementRef) {
  }
}

@Component({
  selector: 'app-gradient-slider',
  templateUrl: './gradient-slider.component.html',
  styleUrls: ['./gradient-slider.component.css']
})
export class GradientSliderComponent implements OnInit {

  @Input() gradient: Gradient;
  @Input() curStopIdx: number;
  @Output() select = new EventEmitter<number>();
  @Output() dragStop = new EventEmitter<number>();
  @ViewChild(GradientDirective) gradChild: GradientDirective;

  private readonly holdDragTime = 200;
  private dragTimer: number;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
  }

  gradientStyle(): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(this.gradient.toCssString());
  }

  stopPositionStyle(stop: GradientStop): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(stop.posPercent());
  }

  handleStopClickDown(e: MouseEvent, idx: number) {
    this.select.emit(idx);
    this.dragTimer = window.setTimeout(() => {
      const clamp = (n) => Math.max(0.0, Math.min(1.0, n));
      const curStop = this.gradient.stops[this.curStopIdx];

      const gradElement = this.gradChild.el.nativeElement as HTMLElement;

      const gradWidth = gradElement.clientWidth;
      const gradLeft =  gradElement.getBoundingClientRect().left;
      console.log('Drag started', gradWidth, gradLeft, e.clientX);
    }, this.holdDragTime);
  }

  handleStopClickUp(e: MouseEvent, idx: number) {
    if (this.dragTimer) {
      window.clearTimeout(this.dragTimer);
    }
  }

}
