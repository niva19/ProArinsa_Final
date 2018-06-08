import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterArchivosProyectoPapelera'
})
export class FilterArchivosProyectoPapeleraPipe implements PipeTransform {

  transform(arr: any[], term: any): any {
    if(term == undefined) return arr;
    return arr.filter(item => {
      return (item.nombre_archivo.toLowerCase().includes(term.toLowerCase()) ||
              item.nombre_proyecto.toLowerCase().includes(term.toLowerCase()))
              ? true : false
    });
  }

}
