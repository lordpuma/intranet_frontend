import { Pipe, PipeTransform } from '@angular/core';

interface Result {
  average: number;
  min: number;
}

@Pipe({
  name: 'orderResults'
})
export class OrderResultsPipe implements PipeTransform {

  transform(value: [Result], args?: any): any {
    // return value.sort((a :Result, b :Result) => {return a.min > b.min});
    return null;
  }

}
