import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map} from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as global from './globals';
import { mapChildrenIntoArray } from '@angular/router/src/url_tree';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  constructor(private http: HttpClient) { }

  GuardarEmpleado(empleado): Observable<any>  {
    return this.http.post(global.ROUTE + '/api/saveemployee', empleado, httpOptions).pipe(map(val => val))
  }

  getAll(): Observable<any>  {
    return this.http.get(global.ROUTE + '/api/getemployees', httpOptions).pipe(map(val => val))
  }

  getCNA(): Observable<any>  {//obtener Empleados solo con Cedula, Nombre y apellidos (CNA)
    return this.http.get(global.ROUTE + '/api/employeescna', httpOptions).pipe(map(val => val))
  }

  ///////////////////////////////////////////////////////////////////////////////////
  getById(empleado): Observable<any>  {
    return this.http.post(global.ROUTE + '/api/getemployee', empleado, httpOptions).pipe(map(val => val))
  }

  EditarEmpleado(empleado): Observable<any>  {
    return this.http.put(global.ROUTE + '/api/editemployee', empleado, httpOptions).pipe(map(val => val))
  }
  ///////////////////////////////////////////////////////////////////////////////////
  EliminarEmpleado(empleado): Observable<any> {
    return this.http.post(global.ROUTE + '/api/deleteemployee', empleado, httpOptions).pipe(map(val => val))
  }

  BuscarEmpleado(FilPar): Observable<any> {//Filtro y parametro
    return this.http.post(global.ROUTE + '/api/searchemployee', FilPar, httpOptions).pipe(map(val => val))
  }

}
