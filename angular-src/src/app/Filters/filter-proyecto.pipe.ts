import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterProyecto'
})
export class FilterProyectoPipe implements PipeTransform {

  transform(arr: any[], term: any): any {
    if(term == undefined) return arr;
    return arr.filter(item => {
      return (item.nombreproyecto.toLowerCase().includes(term.toLowerCase())) 
              ? true : false
    });
  }

}
