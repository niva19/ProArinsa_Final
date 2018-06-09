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
export class ClienteArchivosService {

  constructor(private http: HttpClient) { }

  Reemplazar_Archivos(files): Observable<any>  {
    return this.http.post(global.ROUTE + '/api/replacecustomerfile', files, httpOptions).pipe(map(val => val)) 
  }
  Recuperar_Archivo(files): Observable<any>  {
    return this.http.post(global.ROUTE + '/api/recoverycustomerfile', files, httpOptions).pipe(map(val => val)) 
  }
  Eliminar_Archivo(files): Observable<any>  {
    return this.http.post(global.ROUTE + '/api/deletecustomerfile', files, httpOptions).pipe(map(val => val))
  }
  Papelera(): Observable<any>  {
    return this.http.get(global.ROUTE + '/api/getunlinkcustomerfiles', httpOptions).pipe(map(val => val))
  }
  Desenlazar_Archivo(paths): Observable<any>  {
    return this.http.post(global.ROUTE + '/api/unlinkcustomerfiles', paths, httpOptions).pipe(map(val => val))
  }
  
  Obtener_Archivos(archivo): Observable<any>  {
    return this.http.post(global.ROUTE + '/api/getcustomerfiles', archivo, httpOptions).pipe(map(val => val))
  }

  Guardar_Archivo(archivo): Observable<any>  {
    return this.http.post(global.ROUTE + '/api/savecustomerfiles', archivo, httpOptions).pipe(map(val => val))
  }

  Cambiar_Nombre_Archivo(file): Observable<any>  {
    return this.http.post(global.ROUTE + '/api/changecustomerfilename', file, httpOptions).pipe(map(val => val))
  }

  Descargar_Archivo(files): Observable<any>  {
    return this.http.post(global.ROUTE + '/api/downloadfile', files, httpOptions).pipe(map(val => val))
  }

  Abrir_Archivo(path): Observable<any>  {
    return this.http.post(global.ROUTE + '/api/openfile', path, httpOptions).pipe(map(val => val))
  }

  Obtener_Ruta(val): Observable<any>  {
    return this.http.post(global.ROUTE + '/api/getpath', val, httpOptions).pipe(map(val => val))
  }
}
