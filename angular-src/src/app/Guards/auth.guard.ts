import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { IngresarService } from '../services/ingresar.service';
import * as Materialize from 'angular2-materialize'


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private ingresarService: IngresarService, private router: Router) {

    }

    canActivate() {
        if (this.ingresarService.loggedIn()) {
            return true;
        } else {
            Materialize.toast('Inicie sesión para continuar', 3000, 'red rounded')
            this.router.navigate(['/ingresar']);
            return false;
        }
    }
}