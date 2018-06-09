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
export class CarpetasService {

  constructor(private http: HttpClient) { }

  Reemplazar_Carpetas(val): Observable<any>  {
    return this.http.post(global.ROUTE + '/api/replacefolders', val, httpOptions).pipe(map(val => val))
  }
  
  Obtener_Carpetas(proyecto): Observable<any>  {
    return this.http.post(global.ROUTE + '/api/getfolders', proyecto, httpOptions).pipe(map(val => val))
  }

  Guardar_Carpeta(carpeta): Observable<any> {
    return this.http.post(global.ROUTE + '/api/savefolder', carpeta, httpOptions).pipe(map(val => val))
  }
  
  Eliminar_Carpeta(carpeta): Observable<any> {
    return this.http.post(global.ROUTE + '/api/deletefolder', carpeta, httpOptions).pipe(map(val => val))
  }

  Obtener_Arbol(carpeta): Observable<any> {
    return this.http.post(global.ROUTE + '/api/getfoldertree', carpeta, httpOptions).pipe(map(val => val))
  }

  Mover_Archivos(values): Observable<any> {
    return this.http.post(global.ROUTE + '/api/movefiles', values, httpOptions).pipe(map(val => val))
  }

  Editar_nombre_Carpeta(values): Observable<any> {
    return this.http.post(global.ROUTE + '/api/editfoldername', values, httpOptions).pipe(map(val => val))
  }

  Papelera(): Observable<any> {
    return this.http.get(global.ROUTE + '/api/getunlinkfolders', httpOptions).pipe(map(val => val))
  }

  Eliminar_Carpeta_Permanentemente(carpeta): Observable<any> {
    return this.http.post(global.ROUTE + '/api/deletepermanentfolder', carpeta, httpOptions).pipe(map(val => val))
  }

  Recuperar_Carpetas(carpetas): Observable<any> {
    return this.http.post(global.ROUTE + '/api/recoveryfolders', carpetas, httpOptions).pipe(map(val => val))
  }
}
