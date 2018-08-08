import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'realnum'
})
export class ReadableRealNumberPipe implements PipeTransform {

  transform(value: number, digits: number = 2): string {
    if (Number.isNaN(value)) {
      return 'NaN';
    }

    const pct = value;
    return pct.toFixed(digits);
  }

}
