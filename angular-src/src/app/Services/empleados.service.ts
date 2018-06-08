import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map} from 'rxjs/operators';
import { Observable } from 'rxjs';
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
    return this.http.post('http://localhost:3000/api/saveemployee', empleado, httpOptions).pipe(map(val => val))
  }

  getAll(): Observable<any>  {
    return this.http.get('http://localhost:3000/api/getemployees', httpOptions).pipe(map(val => val))
  }

  getCNA(): Observable<any>  {//obtener Empleados solo con Cedula, Nombre y apellidos (CNA)
    return this.http.get('http://localhost:3000/api/employeescna', httpOptions).pipe(map(val => val))
  }

  ///////////////////////////////////////////////////////////////////////////////////
  getById(empleado): Observable<any>  {
    return this.http.post('http://localhost:3000/api/getemployee', empleado, httpOptions).pipe(map(val => val))
  }

  EditarEmpleado(empleado): Observable<any>  {
    return this.http.put('http://localhost:3000/api/editemployee', empleado, httpOptions).pipe(map(val => val))
  }
  ///////////////////////////////////////////////////////////////////////////////////
  EliminarEmpleado(empleado): Observable<any> {
    return this.http.post('http://localhost:3000/api/deleteemployee', empleado, httpOptions).pipe(map(val => val))
  }

  BuscarEmpleado(FilPar): Observable<any> {//Filtro y parametro
    return this.http.post('http://localhost:3000/api/searchemployee', FilPar, httpOptions).pipe(map(val => val))
  }

}
