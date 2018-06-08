import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { EmpleadosService } from '../../services/empleados.service'
import { ReporteService } from '../../services/reporte.service'
import { Router } from '@angular/router'

import * as Materialize from 'angular2-materialize'

declare var jQuery: any;
declare var $: any;


@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit {

  nombre: String
  apellidos: String
  dni: String
  direccion: String
  telefono: String
  correo: String
  usuario: String
  contrasena: String
  isGerente: String
  fechaEntrada: String
  fechaSalida: String
  tipoSalario: String
  montoSalario: String
  switch: Boolean = true
  borrar: String//variable auxiliar utilizada para guardar la cedula cuando se proceda a borrar
  ax: any[];
  filtro: any
  parametro: String
  empleado_eliminar: String

  @ViewChild('empleadoSeleccionado')
  private empleadoSeleccionado: ElementRef

  @ViewChild('buscador')
  private buscador: ElementRef

  @ViewChild('modal4Footer')
  private modal4Footer: ElementRef

  @ViewChild('LabelNombre')
  private LabelNombre: ElementRef

  @ViewChild('LabelApellidos')
  private LabelApellidos: ElementRef

  @ViewChild('LabelDni')
  private LabelDni: ElementRef

  @ViewChild('Labeldireccion')
  private Labeldireccion: ElementRef

  @ViewChild('LabelCorreo')
  private LabelCorreo: ElementRef

  @ViewChild('LabelTelefono')
  private LabelTelefono: ElementRef

  @ViewChild('LabelPrivilegios')
  private LabelPrivilegios: ElementRef

  @ViewChild('LabelUsuario')
  private LabelUsuario: ElementRef

  @ViewChild('LabelContrasena')
  private LabelContrasena: ElementRef

  @ViewChild('LabelIsGerente')
  private LabelIsGerente: ElementRef

  @ViewChild('LabelFechaEntrada')
  private LabelFechaEntrada: ElementRef

  @ViewChild('LabelFechaSalida')
  private LabelFechaSalida: ElementRef

  @ViewChild('LabelMontoSalario')
  private LabelMontoSalario: ElementRef

  @ViewChild('inputnombre')
  private inputnombre: ElementRef

  @ViewChild('inputPrivilegio')
  private inputPrivilegio: ElementRef

  @ViewChild('inputapellidos')
  private inputapellidos: ElementRef

  @ViewChild('inputDni')
  private inputDni: ElementRef

  @ViewChild('inputdireccion')
  private inputdireccion: ElementRef

  @ViewChild('inputcorreo')
  private inputcorreo: ElementRef

  @ViewChild('inputtelefono')
  private inputTelefono: ElementRef

  @ViewChild('inputprivilegios')
  private inputPrivilegios: ElementRef

  @ViewChild('inputusuario')
  private inputUsuario: ElementRef

  @ViewChild('inputcontrasena')
  private inputContrasena: ElementRef

  @ViewChild('inputIsGerente')
  private inputIsGerente: ElementRef

  @ViewChild('inputFechaEntrada')
  private inputFechaEntrada: ElementRef

  @ViewChild('inputFechaSalida')
  private inputFechaSalida: ElementRef

  @ViewChild('inputTipoSalario')
  private inputTipoSalario: ElementRef

  @ViewChild('inputMontoSalario')
  private inputMontoSalario: ElementRef

  constructor(private EmpService: EmpleadosService, private router: Router, private reporteService: ReporteService, private renderer2: Renderer2) { }

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
    this.EmpService.getAll().subscribe(data => {
      this.ax = data;
    });
  }

  editClick(v: String) {
    alert(v)
  }

  LimpiarGuardar() {
    this.renderer2.removeClass(this.LabelNombre.nativeElement, "active")
    this.nombre = ""

    this.renderer2.removeClass(this.LabelApellidos.nativeElement, "active")
    this.apellidos = ""

    this.renderer2.removeClass(this.LabelDni.nativeElement, "active")
    this.renderer2.removeAttribute(this.inputDni.nativeElement, 'disabled');
    this.dni = ""

    this.renderer2.removeClass(this.Labeldireccion.nativeElement, "active")
    this.direccion = ""

    this.renderer2.removeClass(this.LabelCorreo.nativeElement, "active")
    this.correo = ""

    this.renderer2.removeClass(this.LabelTelefono.nativeElement, "active")
    this.telefono = ""

    this.renderer2.removeClass(this.LabelUsuario.nativeElement, "active")
    this.usuario = ""

    this.renderer2.removeClass(this.LabelContrasena.nativeElement, "active")
    this.contrasena = ""

    //this.renderer2.removeClass(this.LabelIsGerente.nativeElement, "active")
    this.isGerente = "no"

    this.renderer2.removeClass(this.LabelFechaEntrada.nativeElement, "active")
    $('#fechaEntrada').val("")

    this.renderer2.removeClass(this.LabelFechaSalida.nativeElement, "active")
    $('#fechaSalida').val("")

    this.tipoSalario = ""

    this.renderer2.removeClass(this.LabelMontoSalario.nativeElement, "active")
    this.montoSalario = ""
  }

  modal1() {
    this.switch = true;
    this.LimpiarGuardar();
    $('#modal1').modal('open');
  }

  Limpiar() {
    this.renderer2.removeClass(this.LabelNombre.nativeElement, "active")
    this.empleadoSeleccionado.nativeElement.innerHTML = ""
  }

  Editar(id) {
    const empleado = {
      dni: id
    }
    this.EmpService.getById(empleado).subscribe(data => {
      this.renderer2.setAttribute(this.LabelNombre.nativeElement, "class", "active")
      this.nombre = data.nombre

      this.renderer2.setAttribute(this.LabelApellidos.nativeElement, "class", "active")
      this.apellidos = data.apellidos

      this.renderer2.setAttribute(this.LabelDni.nativeElement, "class", "active")
      this.renderer2.setAttribute(this.inputDni.nativeElement, 'disabled', 'true');
      this.dni = data.dni

      this.renderer2.setAttribute(this.Labeldireccion.nativeElement, "class", "active")
      this.direccion = data.direccion

      this.renderer2.setAttribute(this.LabelTelefono.nativeElement, "class", "active")
      this.telefono = data.telefono

      this.renderer2.setAttribute(this.LabelCorreo.nativeElement, "class", "active")
      this.correo = data.correo

      this.renderer2.setAttribute(this.LabelUsuario.nativeElement, "class", "active")
      this.usuario = data.usuario

      this.renderer2.setAttribute(this.LabelContrasena.nativeElement, "class", "active")
      this.contrasena = data.contrasena

      this.renderer2.setAttribute(this.LabelIsGerente.nativeElement, "class", "active")
      if (data.isgerente) {
        this.isGerente = 'si'
      }
      else {
        this.isGerente = 'no'
      }

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
    if (localStorage.getItem("dni") == this.empleado_eliminar) {
      Materialize.toast('Error no puede borrar este usuario', 3000, 'red rounded')
    }
    else {
      const empleado = {
        dni: this.empleado_eliminar
      }
      const reporte = {
        nombre: localStorage.getItem('nombre') + ' (' + localStorage.getItem('dni') + ')',
        accion: 'Eliminar',
        modulo: 'Usuarios',
        alterado: this.empleado_eliminar
      }
      this.EmpService.EliminarEmpleado(empleado).subscribe(data => {
        if (data.success) {
          this.getAll();
          $('#modal2').modal('close');
          Materialize.toast('El empleado se borró exitosamente', 3000, 'green rounded')
          //NOW ADDING TO HISTORY
          this.reporteService.addReport(reporte).subscribe(data => {
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

  Confirmar_Eliminar(id) {
    this.empleado_eliminar = id
    $('#modal2').modal('open');
  }

  EmpleadoSubmit() {
    var x
    if (this.isGerente == 'si') {
      x = true
    } else {
      x = false
    }
    const empleado = {
      nombre: this.nombre,
      apellidos: this.apellidos,
      dni: this.dni,
      direccion: this.direccion,
      telefono: this.telefono,
      correo: this.correo,
      usuario: this.usuario,
      contrasena: this.contrasena,
      isgerente: x,
      fechaentrada: $('#fechaEntrada').val(),
      fechasalida: $('#fechaSalida').val(),
      tiposalario: this.tipoSalario,
      montosalario: this.montoSalario
    }
    const reporte = {
      nombre: localStorage.getItem('nombre') + ' (' + localStorage.getItem('dni') + ')',
      accion: 'NONE',
      modulo: 'Usuarios',
      alterado: this.dni
    }
    if (this.ValidateForm()) {
      if (this.switch) {//si el switch esta en true guarda
        this.EmpService.GuardarEmpleado(empleado).subscribe(data => {
          if (data.success) {
            this.getAll();
            $('#modal1').modal('close');
            Materialize.toast('El empleado se guardó exitosamente', 3000, 'green rounded')
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
            Materialize.toast('Error, cedula repetida', 3000, 'red rounded')
          }
        });
      }
      else {//si el switch esta en false edita
        this.EmpService.EditarEmpleado(empleado).subscribe(data => {
          this.getAll();
          this.switch = true;
          $('#modal1').modal('close');
          Materialize.toast('El empleado se editó exitosamente', 3000, 'green rounded')
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
      Materialize.toast('Complete los espacios, para continuar', 3000, 'red rounded')
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
    if (this.inputnombre.nativeElement.value == '')
      return false
    if (this.inputapellidos.nativeElement.value == '')
      return false
    if (this.inputDni.nativeElement.value == '')
      return false
    if (this.inputdireccion.nativeElement.value == '')
      return false
    if (this.inputTelefono.nativeElement.value == '')
      return false
    if (this.inputcorreo.nativeElement.value == '')
      return false
    if (this.inputUsuario.nativeElement.value == '')
      return false
    if (this.inputContrasena.nativeElement.value == '')
      return false
    if (this.inputIsGerente.nativeElement.value == '')
      return false
    if ($('#fechaEntrada').val() == '')
      return false
    if (this.inputTipoSalario.nativeElement.value == '')
      return false
    if (this.inputMontoSalario.nativeElement.value == '')
      return false
    return true
  }

  buscar() {
    this.parametro = ''
    if (this.buscador.nativeElement.value == "todos")
      this.getAll();
    else {
      this.filtro = this.buscador.nativeElement.value
      $('#modal3').modal('open');
    }
  }

  BuscarPorFiltro() {
    const FilPar = {
      parametro: this.parametro,
      filtro: this.filtro
    }
    this.EmpService.BuscarEmpleado(FilPar).subscribe(data => {
      this.ax = data
      if (this.ax.length == 0)
        Materialize.toast('Sin resultados', 3000, 'red rounded')
      $('#modal3').modal('close');
    });
  }

}
