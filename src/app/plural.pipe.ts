import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'plural'
})
export class PluralPipe implements PipeTransform {

  transform(value: string, count: number): string {
     if (count !== 1) {
       value += 's';
     }
     return value;
  }

}
