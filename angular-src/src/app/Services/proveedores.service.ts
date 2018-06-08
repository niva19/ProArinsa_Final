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
export class ProveedoresService {

  constructor(private http: HttpClient) { }

  GuardarProveedor(proveedor): Observable<any>  {
    return this.http.post('http://localhost:3000/api/providers', proveedor, httpOptions).pipe(map(val => val))
  }

  getAll(): Observable<any>  {
    return this.http.get('http://localhost:3000/api/providers', httpOptions).pipe(map(val => val))
  }
  ///////////////////////////////////////////////////////////////////////////////////
  getById(proveedor): Observable<any>  {
    return this.http.post('http://localhost:3000/api/getprovider', proveedor, httpOptions).pipe(map(val => val))
  }

  EditarProveedor(proveedor): Observable<any>  {
    return this.http.put('http://localhost:3000/api/providers', proveedor, httpOptions).pipe(map(val => val))
  }
  ///////////////////////////////////////////////////////////////////////////////////
  EliminarProveedor(proveedor): Observable<any>  {
    return this.http.post('http://localhost:3000/api/deleteproviders', proveedor, httpOptions).pipe(map(val => val))
  }

  BuscarProveedor(FilPar): Observable<any> {//Filtro y parametro
    return this.http.post('http://localhost:3000/api/searchproviders', FilPar, httpOptions).pipe(map(val => val))
  }
}
