import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'localTime'})
export class LocalTimePipe implements PipeTransform {
  transform(value: Date): Date {
    return new Date(value + 'Z');
  }
}
