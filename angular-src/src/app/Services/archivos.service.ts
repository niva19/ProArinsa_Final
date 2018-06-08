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
export class ArchivosService {

  constructor(private http: HttpClient) { }

  Reemplazar_Archivos(val): Observable<any>  {
    return this.http.post('http://localhost:3000/api/replacefiles', val, httpOptions).pipe(map(val => val))
  }

  Obtener_Archivos(val): Observable<any> {
    return this.http.post('http://localhost:3000/api/searchfiles', val, httpOptions).pipe(map(val => val))
  }

  Guardar_Archivo(archivo): Observable<any> {
    return this.http.post('http://localhost:3000/api/savefiles', archivo, httpOptions).pipe(map(val => val))
  }

  Desenlazar_Archivo(paths): Observable<any> {
    return this.http.post('http://localhost:3000/api/unlink', paths, httpOptions).pipe(map(val => val))
  }

  Papelera(): Observable<any> {
    return this.http.get('http://localhost:3000/api/getunlinkfiles', httpOptions).pipe(map(val => val))
  }

  Recuperar_Archivo(file): Observable<any> {
    return this.http.post('http://localhost:3000/api/recoveryfile', file,httpOptions).pipe(map(val => val))
  }

  Eliminar_Archivo(file): Observable<any> {
    return this.http.post('http://localhost:3000/api/deletefile', file, httpOptions).pipe(map(val => val))
  }

  Verificar_Archivo_Repetidos(files): Observable<any> {
    return this.http.post('http://localhost:3000/api/verifyduplicatefiles', files, httpOptions).pipe(map(val => val))
  }

  Cambiar_Nombre_Archivo(file): Observable<any> {
    return this.http.post('http://localhost:3000/api/changefilename', file, httpOptions).pipe(map(val => val))
  }
}
