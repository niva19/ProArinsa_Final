import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterProveedor'
})
export class FilterProveedorPipe implements PipeTransform {

  transform(arr: any[], term: any): any {
    if(term == undefined) return arr;
    return arr.filter(item => {
      return (item.empresa.toLowerCase().includes(term.toLowerCase()) || 
              item.contacto.toLowerCase().includes(term.toLowerCase()) ||
              item.telefono.toLowerCase().includes(term.toLowerCase()) ||
              item.correo.toLowerCase().includes(term.toLowerCase()))
              ? true : false
    });
  }

}
