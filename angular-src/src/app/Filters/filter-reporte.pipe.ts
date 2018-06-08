import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterReporte'
})
export class FilterReportePipe implements PipeTransform {

  transform(arr: any[], term: any): any {
    if(term == undefined) return arr;
    return arr.filter(item => {
      return (item.fecha.toLowerCase().includes(term.toLowerCase()) ||
              item.hora.toLowerCase().includes(term.toLowerCase()) ||
              item.nombre.toLowerCase().includes(term.toLowerCase()) ||
              item.modulo.toLowerCase().includes(term.toLowerCase()) ||
              item.accion.toLowerCase().includes(term.toLowerCase()) ||
              item.alterado.toLowerCase().includes(term.toLowerCase())
            )? true : false
    });
  }

}
