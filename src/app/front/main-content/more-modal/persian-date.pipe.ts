import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'persianDate'
})
export class PersianDatePipe implements PipeTransform {

  transform(value: string): string {
    return new Date(value).toLocaleString(
      'fa-IR', 
      { year: 'numeric', month: '2-digit', day: '2-digit' }
    )
  }
}
