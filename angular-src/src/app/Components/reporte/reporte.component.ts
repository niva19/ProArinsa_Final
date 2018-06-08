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

  ax: any[];

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
      this.ax = data;
    });
  }

  Confirmar_Limpiar() {
    let button = this.renderer2.createElement('a');
    this.renderer2.removeChild(this.modal1Footer.nativeElement, this.modal1Footer.nativeElement.children[1]);
    this.renderer2.setAttribute(button, "class", "modal-action")
    this.renderer2.setAttribute(button, "class", "modal-close")
    this.renderer2.setAttribute(button, "class", "waves-effect")
    this.renderer2.setAttribute(button, "class", "waves-green")
    this.renderer2.setAttribute(button, "class", "btn-flat")
    let txt = this.renderer2.createText("Confirmar")
    this.renderer2.appendChild(button, txt)
    this.renderer2.listen(button, 'click', () => {
      this.limpiar()
    })
    this.renderer2.appendChild(this.modal1Footer.nativeElement, button);
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
