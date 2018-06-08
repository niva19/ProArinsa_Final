import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { PlanillaService } from '../../services/planilla.service'
import { ReporteService } from '../../services/reporte.service'
import { ActivatedRoute } from '@angular/router'
import { Router } from '@angular/router'
import * as Materialize from 'angular2-materialize'

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-planilla',
  templateUrl: './planilla.component.html',
  styleUrls: ['./planilla.component.css']
})
export class PlanillaComponent implements OnInit {
  nombre: String
  apellidos: String
  dni: String
  puesto: String
  telefono: String
  tipoSalario: String
  montoSalario: String
  switch: Boolean = true
  borrar: String//variable auxiliar utilizada para guardar la cedula cuando se proceda a borrar
  ax: any[];
  detalles: any
  nombreproyecto: String = localStorage.getItem("nombre_proyecto")
  planilla_eliminar: String


  @ViewChild('buscador')
  private buscador: ElementRef

  @ViewChild('LabelNombre')
  private LabelNombre: ElementRef

  @ViewChild('LabelApellidos')
  private LabelApellidos: ElementRef

  @ViewChild('LabelDNI')
  private LabelDNI: ElementRef

  @ViewChild('LabelTelefono')
  private LabelTelefono: ElementRef

  @ViewChild('LabelFechaEntrada')
  private LabelFechaEntrada: ElementRef

  @ViewChild('LabelFechaSalida')
  private LabelFechaSalida: ElementRef

  @ViewChild('LabelMontoSalario')
  private LabelMontoSalario: ElementRef

  @ViewChild('inputNombre')
  private inputNombre: ElementRef

  @ViewChild('inputApellidos')
  private inputApellidos: ElementRef

  @ViewChild('inputDNI')
  private inputDNI: ElementRef

  @ViewChild('inputTelefono')
  private inputTelefono: ElementRef

  @ViewChild('inputMontoSalario')
  private inputMontoSalario: ElementRef

  constructor(private PlaniService: PlanillaService,
    private reporteService: ReporteService,
    private router: Router, 
    private route: ActivatedRoute,
    private renderer2: Renderer2) { }

  ngOnInit() {
    $('.modal').modal();

    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year,
      today: 'Today',
      clear: 'Clear',
      close: 'Ok',
      container: 'body',
      monthsFull: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      weekdaysFull: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
      weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
      closeOnSelect: false // Close upon selecting a date,
    });

    this.getAll();
  }

  getAll() {
    this.PlaniService.getAll({proyecto: localStorage.getItem("nombre_proyecto")}).subscribe(data => {
      this.ax = data;
    });
  }

  editClick(v: String) {
    alert(v)
  }

  LimpiarGuardar() {
    $('#FormAgregar').trigger("reset");
    this.renderer2.removeClass(this.LabelDNI.nativeElement, "active")
    this.renderer2.removeAttribute(this.inputDNI.nativeElement, 'disabled');
    this.dni = ""
  }

  modal1() {
    this.switch = true;
    this.LimpiarGuardar();
    $('#modal1').modal('open');
  }

  Editar(id) {
    const Planilla = {
      dni: id
    }
    this.PlaniService.getById(Planilla).subscribe(data => {

      this.renderer2.setAttribute(this.LabelNombre.nativeElement, "class", "active")
      this.nombre = data.nombre

      this.renderer2.setAttribute(this.LabelApellidos.nativeElement, "class", "active")
      this.apellidos = data.apellidos

      this.renderer2.setAttribute(this.LabelDNI.nativeElement, "class", "active")
      this.renderer2.setAttribute(this.inputDNI.nativeElement, 'disabled', 'true');
      this.dni = data.dni

      this.puesto = data.puesto

      this.renderer2.setAttribute(this.LabelTelefono.nativeElement, "class", "active")
      this.telefono = data.telefono

      this.renderer2.setAttribute(this.LabelFechaEntrada.nativeElement, "class", "active")
      $('#fechaEntrada').val(data.fechaentrada)

      this.renderer2.setAttribute(this.LabelFechaSalida.nativeElement, "class", "active")
      $('#fechaSalida').val(data.fechasalida)

      this.tipoSalario = data.tiposalario

      this.renderer2.setAttribute(this.LabelMontoSalario.nativeElement, "class", "active")
      this.montoSalario = data.montosalario

      this.switch = false
      $('#modal1').modal('open');
    });
  }

  Eliminar() {
    const Planilla = {
      dni: this.planilla_eliminar,
      nombreproyecto: this.nombreproyecto
    }
    const reporte = {
      nombre: localStorage.getItem('nombre') + ' (' + localStorage.getItem('dni') + ')',
      accion: 'Eliminar',
      modulo: 'Planilla',
      alterado: this.planilla_eliminar
    }
    this.PlaniService.EliminarPlanilla(Planilla).subscribe(data => {
      if (data.success) {
        this.getAll();
        $('#modal2').modal('close');
        Materialize.toast('El empleado se elimino exitosamente', 3000, 'green rounded')
        //NOW ADDING TO HISTORY
        this.reporteService.addReport(reporte).subscribe(data => {
          if (!data.success) {
            Materialize.toast('Error al guardar historial', 3000, 'red rounded')
          }
        })
        //END OF history
      }
      else {
        alert("Error al eliminar")
      }
    });
  }

  Confirmar_Eliminar(id) {
    this.planilla_eliminar = id
    $('#modal2').modal('open');
  }

  PlanillaSubmit() {
    const Planilla = {
      nombre: this.nombre,
      apellidos: this.apellidos,
      dni: this.dni,
      puesto: this.puesto,
      telefono: this.telefono,
      fechaEntrada: $('#fechaEntrada').val(),
      fechaSalida: $('#fechaSalida').val(),
      tipoSalario: this.tipoSalario,
      montoSalario: this.montoSalario,
      nombreproyecto: this.nombreproyecto
    }
    const reporte = {
      nombre: localStorage.getItem('nombre') + ' (' + localStorage.getItem('dni') + ')',
      accion: 'NONE',
      modulo: 'Planilla',
      alterado: this.dni
    }
    if (this.ValidateForm()) {
      if (this.switch) {//si el switch esta en true guarda
        this.PlaniService.GuardarPlanilla(Planilla).subscribe(data => {
          if (data.success) {
            this.getAll();
            $('#modal1').modal('close');
            Materialize.toast('El empleado se guardo exitosamente', 3000, 'green rounded')
            //NOW ADDING TO HISTORY
            reporte.accion = 'Agregar';
            this.reporteService.addReport(reporte).subscribe(data => {
              if (!data.success) {
                Materialize.toast('Error al guardar historial', 3000, 'red rounded')
              }
            })
            //END OF history
          }
          else {
            Materialize.toast('Error, DNI repetido', 3000, 'red rounded')
          }
        });
      }
      else {//si el switch esta en false edita
        this.PlaniService.EditarPlanilla(Planilla).subscribe(data => {
          this.getAll();
          this.switch = true;
          $('#modal1').modal('close');
          Materialize.toast('El empleado se guardo exitosamente', 3000, 'green rounded')
          //NOW ADDING TO HISTORY
          reporte.accion = 'Editar';
          this.reporteService.addReport(reporte).subscribe(data => {
            if (!data.success) {
              Materialize.toast('Error al guardar historial', 3000, 'red rounded')
            }
          })
          //END OF history
        });
      }
    }
    else {
      Materialize.toast('Complete los espacios para continuar', 3000, 'red rounded')
    }
  }

  Only_Numbers(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  ValidateForm() {
    if (this.inputNombre.nativeElement.value == '')
      return false
    if (this.inputApellidos.nativeElement.value == '')
      return false
    if (this.inputDNI.nativeElement.value == '')
      return false
    if (this.puesto == '')
      return false
    if (this.inputTelefono.nativeElement.value == '')
      return false
    if ($('#fechaEntrada').val() == '')
      return false
    if (this.tipoSalario == '')
      return false
    if (this.inputMontoSalario.nativeElement.value == '')
      return false
    return true
  }


  Detalles(v) {
    let planilla = {
      dni: v.dni
    }
    this.PlaniService.getById(planilla).subscribe(detalles => {
      this.detalles = [detalles]
      $('#modal4').modal('open');
    })
  }

  atras(){
    this.router.navigate(["/proyecto"], { relativeTo: this.route })
  }

}
