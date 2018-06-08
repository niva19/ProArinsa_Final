import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterCliente'
})
export class FilterClientePipe implements PipeTransform {

  transform(arr: any[], term: any): any {
    if(term == undefined) return arr;
    return arr.filter(item => {
      return (item.nombre.toLowerCase().includes(term.toLowerCase()) || 
              item.apellidos.toLowerCase().includes(term.toLowerCase()) ||
              item.cedula.toLowerCase().includes(term.toLowerCase())) 
              ? true : false
    });
  }

}
