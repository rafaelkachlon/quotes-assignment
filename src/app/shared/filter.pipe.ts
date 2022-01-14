import {Pipe, PipeTransform} from '@angular/core';
import {FilterModel} from './filter.model';

@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {
  transform(array: any[], filter: FilterModel): any {
    const {field, values} = filter;
    return array.filter(x => values.includes(x[field]));
  }
}
