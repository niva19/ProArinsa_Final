import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPlanilla'
})
export class FilterPlanillaPipe implements PipeTransform {

  transform(arr: any[], term: any): any {
    if(term == undefined) return arr;
    return arr.filter(item => {
      return (item.dni.toLowerCase().includes(term.toLowerCase()) || 
              item.nombre.toLowerCase().includes(term.toLowerCase()) ||
              item.apellidos.toLowerCase().includes(term.toLowerCase()) ||
              item.puesto.toLowerCase().includes(term.toLowerCase()) ||
              item.telefono.toLowerCase().includes(term.toLowerCase()) ||
              item.fechaentrada.toLowerCase().includes(term.toLowerCase()) ||
              item.fechasalida.toLowerCase().includes(term.toLowerCase()) ||
              item.tiposalario.toLowerCase().includes(term.toLowerCase()) ||
              item.montosalario.toLowerCase().includes(term.toLowerCase())
              )
              ? true : false
    });
  }

}
