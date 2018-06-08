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
export class ClientesService {

  constructor(private http: HttpClient) { }

  GuardarCliente(cliente): Observable<any> {
    return this.http.post('http://localhost:3000/api/customers', cliente, httpOptions).pipe(map(val => val))
  }

  getAll(): Observable<any>  {
    return this.http.get('http://localhost:3000/api/customers', httpOptions).pipe(map(val => val))
  }

  Detalles(cliente): Observable<any> {    
    return this.http.post('http://localhost:3000/api/getdetailcustomer', cliente, httpOptions).pipe(map(val => val))
  }
  ///////////////////////////////////////////////////////////////////////////////////
  getById(cliente): Observable<any> {   
    return this.http.post('http://localhost:3000/api/getcustomer', cliente, httpOptions).pipe(map(val => val))
  }

  EditarCliente(cliente): Observable<any>  {
    return this.http.put('http://localhost:3000/api/customers', cliente, httpOptions).pipe(map(val => val))
  }
  ///////////////////////////////////////////////////////////////////////////////////
  EliminarCliente(cliente): Observable<any> {
    return this.http.post('http://localhost:3000/api/deletecustomers', cliente, httpOptions).pipe(map(val => val))
  }

  BuscarCliente(FilPar): Observable<any> {//Filtro y parametro
    return this.http.post('http://localhost:3000/api/searchcustomers', FilPar, httpOptions).pipe(map(val => val))
  }

  getCNA(): Observable<any>  {//obtener clientes solo con Cedula, Nombre y apellidos (CNA)
    return this.http.get('http://localhost:3000/api/customerscna', httpOptions).pipe(map(val => val))
  }
}
