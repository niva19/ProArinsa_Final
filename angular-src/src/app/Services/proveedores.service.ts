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
export class ProveedoresService {

  constructor(private http: HttpClient) { }

  GuardarProveedor(proveedor): Observable<any>  {
    return this.http.post(global.ROUTE + '/api/providers', proveedor, httpOptions).pipe(map(val => val))
  }

  getAll(): Observable<any>  {
    return this.http.get(global.ROUTE + '/api/providers', httpOptions).pipe(map(val => val))
  }
  ///////////////////////////////////////////////////////////////////////////////////
  getById(proveedor): Observable<any>  {
    return this.http.post(global.ROUTE + '/api/getprovider', proveedor, httpOptions).pipe(map(val => val))
  }

  EditarProveedor(proveedor): Observable<any>  {
    return this.http.put(global.ROUTE + '/api/providers', proveedor, httpOptions).pipe(map(val => val))
  }
  ///////////////////////////////////////////////////////////////////////////////////
  EliminarProveedor(proveedor): Observable<any>  {
    return this.http.post(global.ROUTE + '/api/deleteproviders', proveedor, httpOptions).pipe(map(val => val))
  }

  BuscarProveedor(FilPar): Observable<any> {//Filtro y parametro
    return this.http.post(global.ROUTE + '/api/searchproviders', FilPar, httpOptions).pipe(map(val => val))
  }
}
