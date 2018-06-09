import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ReporteService } from '../../services/reporte.service'
import { Router } from '@angular/router'

import * as Materialize from 'angular2-materialize'
declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {

  ax: any[]
  term: any
  p: any

  @ViewChild('modal1Footer')
  private modal1Footer: ElementRef

  constructor(private repService: ReporteService, private router: Router, private renderer2: Renderer2) { }

  ngOnInit() {
    $('.tooltipped').tooltip();
    $('.modal').modal();
    this.getAll();
  }

  getAll() {
    this.repService.getAll().subscribe(data => {
      console.log(data)
      this.ax = data;
    });
  }

  Confirmar_Limpiar() {
    $('#modal1').modal('open');
  }

  limpiar() {
    const reporte = {
      nombre: localStorage.getItem('nombre') + ' (' + localStorage.getItem('dni') + ')',
      accion: 'Limpiar',
      modulo: 'Historial',
      alterado: 'Historial'
    }
    this.repService.limpiaReport().subscribe(data => {
      if (data.success) {
        this.getAll();
        $('#modal1').modal('close');
        Materialize.toast('El historial se limpió exitosamente', 3000, 'green rounded')
        //NOW ADDING TO HISTORY
        this.repService.addReport(reporte).subscribe(data => {
          if (!data.success) {
            Materialize.toast('Error al guardar historial', 3000, 'red rounded')
          }
        })
        //END OF history
      }
      else {
        Materialize.toast('Algo salio mal', 3000, 'red rounded')
      }
    });
  }

}
