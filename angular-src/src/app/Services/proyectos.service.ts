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
export class ProyectosService {

  constructor(private http: HttpClient) { }

  GuardarProyecto(proyecto): Observable<any>  {
    return this.http.post('http://localhost:3000/api/saveproject', proyecto, httpOptions).pipe(map(val => val))
  }

  getAll(cliente): Observable<any>  {
    return this.http.post('http://localhost:3000/api/getprojects', cliente, httpOptions).pipe(map(val => val))
  }
  ///////////////////////////////////////////////////////////////////////////////////
  getById(proyecto): Observable<any>  {
    return this.http.post('http://localhost:3000/api/getproject', proyecto, httpOptions).pipe(map(val => val))
  }

  Detalles(id): Observable<any> {
    return this.http.post('http://localhost:3000/api/detailproject', id, httpOptions).pipe(map(val => val))
  }

  EditarProyecto(proyecto): Observable<any>  {
    return this.http.put('http://localhost:3000/api/editproject', proyecto, httpOptions).pipe(map(val => val))
  }
  ///////////////////////////////////////////////////////////////////////////////////
  EliminarProyecto(proyecto): Observable<any> {
    return this.http.post('http://localhost:3000/api/deleteproject', proyecto, httpOptions).pipe(map(val => val))
  }

  BuscarProyecto(FilPar): Observable<any> {//Filtro y parametro
    return this.http.post('http://localhost:3000/api/searchproject', FilPar, httpOptions).pipe(map(val => val))
  }
}
