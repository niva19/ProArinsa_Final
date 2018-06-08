import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterClienteArchivos'
})
export class FilterClienteArchivosPipe implements PipeTransform {

  transform(arr: any[], term: any): any {
    if(term == undefined) return arr;
    return arr.filter(item => {
      return (item.nombre_archivo.toLowerCase().includes(term.toLowerCase())) 
              ? true : false
    });
  }

}
