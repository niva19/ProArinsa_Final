import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { IngresarService } from '../services/ingresar.service';
import * as Materialize from 'angular2-materialize'


@Injectable()
export class LoggedGuard implements CanActivate {
    constructor(private ingresarService: IngresarService, private router: Router) {

    }

    canActivate() {
        if (this.ingresarService.loggedIn()) {
            Materialize.toast('Ya está logeado', 3000, 'red rounded')
            this.router.navigate(['/cliente']);
            return false;
        } else {
            
            return true;
        }
    }
}