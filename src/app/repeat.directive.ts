import { Input, Directive, TemplateRef, ViewContainerRef } from '@angular/core';

interface RepeatContext {
  index: number;
  count: number;
}

@Directive({
  selector: '[appRepeat]'
})
export class RepeatDirective {

  private lastValue: number;

  constructor(private _viewContainerRef: ViewContainerRef,
    private _templateRef: TemplateRef<RepeatContext>) {}

  @Input()
  set appRepeat(value: number) {
    value = Math.abs(value);
    if (value === this.lastValue) { return; }

    this.lastValue = value;
    this._viewContainerRef.clear();
    for (let i = 0; i < value; i++) {
      const context: RepeatContext = {
        count: value, index: i
      };
      this._viewContainerRef.createEmbeddedView(this._templateRef, context, i);
    }
  }

}
