import { Component, OnInit, ViewChild, ElementRef, Renderer2, Renderer } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { ProyectosService } from '../../services/proyectos.service'
import { ClientesService } from '../../services/clientes.service'
import { EmpleadosService } from '../../services/empleados.service'
import { ReporteService } from '../../services/reporte.service'
import { IngresarService } from '../../services/ingresar.service'
import { Router } from '@angular/router'
import { CommandsService } from '../../services/commands.service'
import * as Materialize from 'angular2-materialize'

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css'],
  providers: [IngresarService]
})
export class ProyectosComponent implements OnInit {
  // ################################## ATRIBUTOS ##################################
  nombreProyecto: String
  direccion: String
  tipoProyecto: String = ""
  tipoObra: String
  descripcion: String
  estado: String
  banco: String
  switch: Boolean = true
  detalles: any[]
  ax: any[]
  ruta: String
  term: any
  p: any
  fechaInicio: any
  fechaFinaliza: any

  filtro: any
  parametro: String
  RegOrArt: String = "Sin asignar"
  financiamento: String = "Sin asignar"

  pk_proyecto: String

  @ViewChild('buscador')
  private buscador: ElementRef

  @ViewChild('LabelNombreProyecto')
  private LabelNombreProyecto: ElementRef

  @ViewChild('Labeldireccion')
  private Labeldireccion: ElementRef

  @ViewChild('Labeldescripcion')
  private Labeldescripcion: ElementRef

  @ViewChild('Labelbanco')
  private Labelbanco: ElementRef

  @ViewChild('LabelFechaInicio')
  private LabelFechaInicio: ElementRef

  @ViewChild('LabelFechaFinaliza')
  private LabelFechaFinaliza: ElementRef

  @ViewChild('inputnombreProyecto')
  private inputnombreProyecto: ElementRef

  @ViewChild('inputdireccion')
  private inputdireccion: ElementRef

  @ViewChild('inputdescripcion')
  private inputdescripcion: ElementRef

  @ViewChild('inputbanco')
  private inputbanco: ElementRef

  // @ViewChild('abc')
  // private abc: ElementRef

  // ################################## METODOS ##################################

  // --------------------------------- CONSTRUCTOR ---------------------------------
  constructor(private ProyService: ProyectosService,
    private clientesService: ClientesService,
    private reporteService: ReporteService,
    private empleadosService: EmpleadosService,
    private ingresarService: IngresarService,
    private router: Router,
    private renderer2: Renderer2,
    private renderer: Renderer,
    private route: ActivatedRoute,
    private commands: CommandsService) { }

  ngOnInit() {
    // $('.dropdown-button').dropdown();
    $('.modal').modal();
    $('select').material_select();
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
    this.ProyService.getAll({ cedula: localStorage.getItem("id_cliente") }).subscribe(data => {
      this.ax = data;
    });
  }


  editClick(v: String) {
    alert(v)
  }
  // --------------------------------- LIMPIAR FORMULARIO ---------------------------------
  LimpiarGuardar() {
    $('#FormAgregar').trigger("reset");
  }

  modal1() {
    this.switch = true;
    this.LimpiarGuardar();
    $('#modal1').modal('open');
  }

  // --------------------------------- EDITAR PROYECTO ---------------------------------
  Editar(nom, ruta) {
    const proyecto = {
      nombreProyecto: nom
    }
    this.pk_proyecto = nom
    this.ruta = ruta
    this.ProyService.getById(proyecto).subscribe(data => {
      this.renderer2.setAttribute(this.LabelNombreProyecto.nativeElement, "class", "active")
      this.nombreProyecto = data.nombreproyecto


      this.renderer2.setAttribute(this.Labeldireccion.nativeElement, "class", "active")
      this.direccion = data.direccion

      this.renderer2.setAttribute(this.Labeldescripcion.nativeElement, "class", "active")
      this.descripcion = data.descripcion

      this.renderer2.setAttribute(this.Labelbanco.nativeElement, "class", "active")
      this.banco = data.banco

      // this.tipoProyecto = data.tipoproyecto
      this.tipoObra = data.tipoobra
      this.estado = data.estado

      $("#TipoProyecto").val(data.tipoproyecto)

      this.renderer2.setAttribute(this.LabelFechaInicio.nativeElement, "class", "active")
      $('#fechaInicio').val(data.fechainicio)

      this.renderer2.setAttribute(this.LabelFechaFinaliza.nativeElement, "class", "active")
      $('#fechaFinaliza').val(data.fechafinaliza)

      this.switch = false
      $('#modal1').modal('open');
    });
  }
  // --------------------------------- ELIMINAR PROYECTO ---------------------------------
  Eliminar(nom) {
    const proyecto = {
      nombreProyecto: nom
    }
    const reporte = {
      nombre: localStorage.getItem('nombre') + ' (' + localStorage.getItem('dni') + ')',
      accion: 'Eliminar',
      modulo: 'Proyectos',
      alterado: nom
    }
    this.ProyService.EliminarProyecto(proyecto).subscribe(data => {
      if (data.success) {
        this.getAll();
        $('#modal2').modal('close');
        Materialize.toast('El proyecto se borró exitosamente', 3000, 'green rounded')
        //NOW ADDING TO HISTORY
        this.reporteService.addReport(reporte).subscribe(data => {
          if (!data.success) {
            Materialize.toast('Error al guardar historial', 3000, 'red rounded')
          }
        })
        //END OF history
      }
      else {
        alert("Error en el servidor")
      }
    });
  }

  // --------------------------------- SUBMIT PROYECTO ---------------------------------
  ProyectoSubmit() {
    if (this.ValidateForm()) {
      const proyecto = {
        nombreProyecto: this.nombreProyecto,
        direccion: this.direccion,
        tipoProyecto: $("#TipoProyecto").val(),
        tipoObra: this.tipoObra,
        descripcion: this.descripcion,
        fechaInicio: $('#fechaInicio').val(),
        fechaFinaliza: $('#fechaFinaliza').val(),
        estado: this.estado,
        banco: this.banco,
        cliente: localStorage.getItem("id_cliente")
      }
      const reporte = {
        nombre: localStorage.getItem('nombre') + ' (' + localStorage.getItem('dni') + ')',
        accion: 'NONE',
        modulo: 'Proyectos',
        alterado: this.nombreProyecto
      }

      if (this.switch) {//si el switch esta en true guarda
        this.ProyService.GuardarProyecto(proyecto).subscribe(data => {
          if (data.success) {
            this.getAll()
            this.commands.Exec_Command_Sync(`mkdir ${data.ruta}`)
            this.commands.Exec_Command_Sync(`mkdir ${data.ruta}\\publico`)
            this.commands.Exec_Command_Sync(`mkdir ${data.ruta}\\privado`)

            $('#modal1').modal('close');
            Materialize.toast('El proyecto se guardó exitosamente', 3000, 'green rounded')
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
            Materialize.toast('Error, nombre repetido', 3000, 'red rounded')
          }
        });
      }
      else {//si el switch esta en false edita
        var update_ruta = this.update_ruta(this.ruta)
        proyecto["key"] = this.pk_proyecto
        proyecto["oldruta"] = this.ruta
        proyecto["ruta"] = update_ruta

        this.ProyService.EditarProyecto(proyecto).subscribe(data => {
          if (data.success) {

            this.commands.Exec_Command_Sync(`ren ${this.points_to_slash(this.ruta)} ${this.nombreProyecto}`)

            this.getAll()
            this.switch = true;
            $('#modal1').modal('close');
            Materialize.toast('El proyecto se guardó exitosamente', 3000, 'green rounded')
            //NOW ADDING TO HISTORY
            reporte.accion = 'Editar';
            this.reporteService.addReport(reporte).subscribe(data => {
              if (!data.success) {
                Materialize.toast('Error al guardar historial', 3000, 'red rounded')
              }
            })
            //END OF history
          }
          else Materialize.toast('Error en el servidor', 3000, 'red rounded')
        });
      }
    }
    else {
      Materialize.toast('Complete los espacios para continuar', 3000, 'red rounded')
    }

  }

  update_ruta(ruta) {
    for (var i = ruta.length - 1; i > -1; i--) {
      if (ruta.charAt(i) == ".") break
    }
    return ruta.substring(0, i + 1) + this.nombreProyecto
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
    if (this.inputnombreProyecto.nativeElement.value == '')
      return false
    if (this.inputdireccion.nativeElement.value == '')
      return false
    if ($('#TipoProyecto').val() == "Sin Asignar")
      return false
    if (this.tipoObra == '')
      return false
    if (this.inputdescripcion.nativeElement.value == '')
      return false
    if ($('#fechaInicio').val() == '')
      return false
    if (this.estado == '')
      return false
    if (this.inputbanco.nativeElement.value == '')
      return false

    return true
  }

  points_to_slash(str) {
    var userprofile = "%"
    var i;
    for (i = 0; i < str.length; i++) {
      if (str.charAt(i) == '.') break
      userprofile += str.charAt(i)
    }
    userprofile += "%"
    userprofile = `${userprofile}.${str.substring(i + 1, str.lenght)}`
    userprofile = userprofile.split('.').join('\\');
    return userprofile
  }

  Ir_Archivos(ruta, nombre) {
    let gerente = this.ingresarService.isGerente();
    localStorage.setItem("ruta_proyecto", ruta);
    localStorage.setItem("nombre_proyecto", nombre);
    // this.data.Set_Ruta_Proyecto(ruta);
    (gerente)
      ? this.router.navigate(["/gerente_bridge"], { relativeTo: this.route })
      : this.router.navigate(["/archivos"], { relativeTo: this.route })
  }

  Ir_Empleados(nombre) {
    localStorage.setItem("nombre_proyecto", nombre)
    this.router.navigate(["/planilla"], { relativeTo: this.route })
  }

  Detalles(id) {
    this.ProyService.Detalles({ id: id }).subscribe(res => {
      this.detalles = res
      $('#modal4').modal('open')
    })
  }

  TipoFinanciamiento() {
    this.RegOrArt = ""
    this.financiamento = ""
    if (this.tipoProyecto == "Subsidios") {
      $('#modal5').modal('open')
    }
    else {
      $('#TipoProyecto').val(this.tipoProyecto)
    }

  }

  listo() {

    if(this.RegOrArt == "" || this.financiamento == ""){
      Materialize.toast('Debe elegir una opcion', 3000, 'red rounded')
    }
    else{
      $('#TipoProyecto').val(`${this.tipoProyecto}/${this.RegOrArt}/${this.financiamento}`)
      $('#modal5').modal('close')
    }
    
  }

  IsArticulo59() {
    return (this.RegOrArt == "Articulo 59") ? true : false
  }

  IsRegulares() {
    return (this.RegOrArt == "Regulares") ? true : false
  }

  isInput() {
    return (this.filtro == "nombreProyecto" ||
      this.filtro == "banco") ? true : false
  }

  isTipoObra() {
    return (this.filtro == "tipoObra") ? true : false
  }

  isEstadoProyecto() {
    return (this.filtro == "estado") ? true : false
  }

  isCliente() {
    return (this.filtro == "cliente") ? true : false
  }

  isProfResponsable() {
    return (this.filtro == "profResponsable") ? true : false
  }

  atras() {
    this.router.navigate(["/cliente"], { relativeTo: this.route })
  }

  Is_Gerente(){
    return (this.ingresarService.isGerente()) ? true: false
  }
}




