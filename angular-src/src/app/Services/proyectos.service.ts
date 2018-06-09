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
export class ProyectosService {

  constructor(private http: HttpClient) { }

  GuardarProyecto(proyecto): Observable<any>  {
    return this.http.post(global.ROUTE + '/api/saveproject', proyecto, httpOptions).pipe(map(val => val))
  }

  getAll(cliente): Observable<any>  {
    return this.http.post(global.ROUTE + '/api/getprojects', cliente, httpOptions).pipe(map(val => val))
  }
  ///////////////////////////////////////////////////////////////////////////////////
  getById(proyecto): Observable<any>  {
    return this.http.post(global.ROUTE + '/api/getproject', proyecto, httpOptions).pipe(map(val => val))
  }

  Detalles(id): Observable<any> {
    return this.http.post(global.ROUTE + '/api/detailproject', id, httpOptions).pipe(map(val => val))
  }

  EditarProyecto(proyecto): Observable<any>  {
    return this.http.put(global.ROUTE + '/api/editproject', proyecto, httpOptions).pipe(map(val => val))
  }
  ///////////////////////////////////////////////////////////////////////////////////
  EliminarProyecto(proyecto): Observable<any> {
    return this.http.post(global.ROUTE + '/api/deleteproject', proyecto, httpOptions).pipe(map(val => val))
  }

  BuscarProyecto(FilPar): Observable<any> {//Filtro y parametro
    return this.http.post(global.ROUTE + '/api/searchproject', FilPar, httpOptions).pipe(map(val => val))
  }
}
