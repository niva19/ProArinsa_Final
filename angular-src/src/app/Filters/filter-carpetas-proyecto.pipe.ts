import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterCarpetasProyecto'
})
export class FilterCarpetasProyectoPipe implements PipeTransform {

  transform(arr: any[], term: any): any {
    if(term == undefined) return arr;
    return arr.filter(item => {
      return (item.nombre_carpeta.toLowerCase().includes(term.toLowerCase()))
              ? true : false
    });
  }

}
