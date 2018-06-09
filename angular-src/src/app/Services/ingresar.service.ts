import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map} from 'rxjs/operators';
import { Observable} from 'rxjs';
import * as global from './globals';
import * as CryptoJS from 'crypto-js';
import { mapChildrenIntoArray } from '@angular/router/src/url_tree';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class IngresarService {

  empleado: any
  secretKey = 'notToday'

  constructor(private http: HttpClient) { }

  logear(empleado): Observable<any> {
    return this.http.post(global.ROUTE + '/api/empleados', empleado, httpOptions).pipe(map(val => val))
  }

  getAllEmployers() {
    return this.http.get(global.ROUTE + '/api/getemployees', httpOptions).pipe(map(val => val))
  }

  store(value) {
    console.log(value)
    return CryptoJS.AES.encrypt(value, this.secretKey)
  }

  loggedIn() {
    return (localStorage.getItem('dni') && localStorage.getItem('privilegio')) ? true : false
  }

  updateName() {
    if (localStorage.getItem('dni')) {
      return localStorage.getItem('nombre');
    } else {
      return '';
    }
  }

  get(key) {
    var encryptedData = window.localStorage.getItem(key)
    if (encryptedData) {
      var bytes = CryptoJS.AES.decrypt(encryptedData.toString(), this.secretKey)
      var plaintext = bytes.toString(CryptoJS.enc.Utf8)
      return plaintext
    }
    return null;
  }

  isGerente() {
    var isGer = this.get('privilegio')
    if (isGer == 'true')
      return true
    return false
  }

}
