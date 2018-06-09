import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { IngresarService } from '../../services/ingresar.service'
import * as Materialize from 'angular2-materialize'

declare var jQuery: any;
declare var $: any;
declare var angular: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  username: String

  constructor(public ingresarService: IngresarService, private router: Router) {

  }

  ngOnInit() {
    $('.modal').modal();
    $(".button-collapse").sideNav();
    $(".dropdown-button").dropdown();
  }

  //PARA CERRAR SESION
  onLogoutClick() {
    Materialize.toast('Sesión cerrada correctamente', 4000, 'green rounded')
    localStorage.clear()
    this.router.navigate(['/ingresar'])
    return false
  }
}
