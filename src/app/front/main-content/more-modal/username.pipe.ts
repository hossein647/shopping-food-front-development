import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'username'
})
export class UsernamePipe implements PipeTransform {

  transform(value: string): string {
    return value.split('').slice(0, value.length - 10).join('');
  }

}
