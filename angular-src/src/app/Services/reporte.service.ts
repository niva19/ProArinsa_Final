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
export class ReporteService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any>  {
    return this.http.get('http://localhost:3000/api/getreportes', httpOptions).pipe(map(val => val))
  }

  addReport(reporte): Observable<any>  {
    return this.http.post('http://localhost:3000/api/savereport', reporte, httpOptions).pipe(map(val => val))
  }

  limpiaReport(): Observable<any>  {
    return this.http.get('http://localhost:3000/api/limpiareport', httpOptions).pipe(map(val => val))
  }
}
