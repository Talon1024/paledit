import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'real'
})
export class ReadableRealNumberPipe implements PipeTransform {

  transform(value: number, args?: any): string {
    if (Number.isNaN(value)) {
      return 'NaN';
    }

    const pct = value;
    return pct.toFixed(2);
  }

}
