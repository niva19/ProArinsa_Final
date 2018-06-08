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
export class PlanillaService {

  constructor(private http: HttpClient) { }

  GuardarPlanilla(planilla): Observable<any> {
    return this.http.post('http://localhost:3000/api/saveworker', planilla, httpOptions).pipe(map(val => val))
  }

  getAll(proyecto): Observable<any> {
    return this.http.post('http://localhost:3000/api/workers', proyecto, httpOptions).pipe(map(val => val))
  }
  ///////////////////////////////////////////////////////////////////////////////////
  getById(planilla): Observable<any> {
    return this.http.post('http://localhost:3000/api/getworker', planilla, httpOptions).pipe(map(val => val))
  }

  EditarPlanilla(planilla): Observable<any> {
    return this.http.put('http://localhost:3000/api/workers', planilla, httpOptions).pipe(map(val => val))
  }
  ///////////////////////////////////////////////////////////////////////////////////
  EliminarPlanilla(planilla): Observable<any>{
    return this.http.post('http://localhost:3000/api/deleteworkers', planilla, httpOptions).pipe(map(val => val))
  }

  BuscarPlanilla(FilPar): Observable<any>{//Filtro y parametro
    return this.http.post('http://localhost:3000/api/searchworkers', FilPar, httpOptions).pipe(map(val => val))
  }
}
