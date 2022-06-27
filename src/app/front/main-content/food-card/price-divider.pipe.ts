import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceDivider'
})
export class PriceDividerPipe implements PipeTransform {

  transform(value: number): string {
    return value.toLocaleString();
  }

}
