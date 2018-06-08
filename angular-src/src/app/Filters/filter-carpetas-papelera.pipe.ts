import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterCarpetasPapelera'
})
export class FilterCarpetasPapeleraPipe implements PipeTransform {

  transform(arr: any[], term: any): any {
    if(term == undefined) return arr;
    return arr.filter(item => {
      return (item.nombre_carpeta.toLowerCase().includes(term.toLowerCase()) ||
              item.nombreproyecto.toLowerCase().includes(term.toLowerCase()))
              ? true : false
    });
  }

}
