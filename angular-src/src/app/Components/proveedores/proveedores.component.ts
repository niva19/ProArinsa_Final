import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ProveedoresService } from '../../services/proveedores.service'
import { ReporteService } from '../../services/reporte.service'
import { Router } from '@angular/router'
import * as Materialize from 'angular2-materialize'

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {
  pk:String
  empresa: String
  contacto: String
  telefono: String
  correo: String
  producto: String
  switch: Boolean = true
  borrar: String//variable auxiliar utilizada para guardar la cedula cuando se proceda a borrar
  ax: any[];
  filtro: any
  parametro: String
  detalles: any
  planilla_eliminar: String
  term: any
  p: any

  @ViewChild('buscador')
  private buscador: ElementRef

  @ViewChild('LabelEmpresa')
  private LabelEmpresa: ElementRef

  @ViewChild('LabelContacto')
  private LabelContacto: ElementRef

  @ViewChild('LabelCorreo')
  private LabelCorreo: ElementRef

  @ViewChild('LabelTelefono')
  private LabelTelefono: ElementRef

  @ViewChild('LabelProducto')
  private LabelProducto: ElementRef

  @ViewChild('inputEmpresa')
  private inputEmpresa: ElementRef

  @ViewChild('inputContacto')
  private inputContacto: ElementRef

  @ViewChild('inputCorreo')
  private inputCorreo: ElementRef

  @ViewChild('inputTelefono')
  private inputTelefono: ElementRef

  @ViewChild('inputProducto')
  private inputProducto: ElementRef

  constructor(private ProveeService: ProveedoresService, 
    private reporteService: ReporteService,
    private router: Router, 
    private renderer2: Renderer2) { }

  ngOnInit() {
    $('.modal').modal();
 
    this.getAll();
  }

  getAll() {
    this.ProveeService.getAll().subscribe(data => {
      this.ax = data;      
    });
  }

  editClick(v: String) {
    alert(v)
  }

  LimpiarGuardar() {
    this.renderer2.removeClass(this.LabelEmpresa.nativeElement, "active")
    this.empresa = ""

    this.renderer2.removeClass(this.LabelContacto.nativeElement, "active")
    this.contacto = ""

    this.renderer2.removeClass(this.LabelCorreo.nativeElement, "active")
    this.correo = ""

    this.renderer2.removeClass(this.LabelTelefono.nativeElement, "active")
    this.telefono = ""

    this.renderer2.removeClass(this.LabelProducto.nativeElement, "active")
    this.producto = ""
  }

  modal1() {
    this.switch = true;
    this.LimpiarGuardar();
    $('#modal1').modal('open');
  }

  Editar(id) {
    const proveedor = {
      empresa: id
    }
    
    this.ProveeService.getById(proveedor).subscribe(data => {
      this.renderer2.setAttribute(this.LabelEmpresa.nativeElement, "class", "active")
      this.empresa = data.empresa
      this.pk = this.empresa

      this.renderer2.setAttribute(this.LabelContacto.nativeElement, "class", "active")
      this.contacto = data.contacto

      this.renderer2.setAttribute(this.LabelCorreo.nativeElement, "class", "active")
      this.correo = data.correo

      this.renderer2.setAttribute(this.LabelTelefono.nativeElement, "class", "active")
      this.telefono = data.telefono

      this.renderer2.setAttribute(this.LabelProducto.nativeElement, "class", "active")
      this.producto = data.producto

      this.switch = false
      $('#modal1').modal('open');
    });
  }

  Eliminar() {
    const proveedor = {
      empresa: this.planilla_eliminar
    }
    const reporte = {
      nombre: localStorage.getItem('nombre') + ' (' + localStorage.getItem('dni') + ')',
      accion: 'Eliminar',
      modulo: 'Proveedores',
      alterado: this.planilla_eliminar
    }
    this.ProveeService.EliminarProveedor(proveedor).subscribe(data => {
      if (data.success) {
        this.getAll();
        $('#modal2').modal('close');
        Materialize.toast('El proveedor se borró exitosamente', 3000, 'green rounded')
        //NOW ADDING TO HISTORY
        this.reporteService.addReport(reporte).subscribe(data => {
          if (!data.success) {
            Materialize.toast('Error al guardar historial', 3000, 'red rounded')
          }
        })
        //END OF history
      }
      else {
        alert("algo salio mal")
      }
    });
  }

  Confirmar_Eliminar(id) {
    this.planilla_eliminar = id
    $('#modal2').modal('open');
  }
 
  ProveedoresSubmit() {
    const proveedor = {
      pk:this.pk,
      empresa: this.empresa,
      contacto: this.contacto,
      telefono: this.telefono,
      correo: this.correo,
      producto: this.producto
    }
    const reporte = {
      nombre: localStorage.getItem('nombre') + ' (' + localStorage.getItem('dni') + ')',
      accion: 'NONE',
      modulo: 'Proveedores',
      alterado: this.pk
    }
    if (this.ValidateForm()) {
      if (this.switch) {//si el switch esta en true guarda
        reporte.alterado = this.empresa
        this.ProveeService.GuardarProveedor(proveedor).subscribe(data => {
          if (data.success) {
            this.getAll();
            $('#modal1').modal('close');
            Materialize.toast('El proveedor se guardó exitosamente', 3000, 'green rounded')
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
            Materialize.toast('Error, la empresa ya esta registrada!', 3000, 'red rounded')
          }
        });
      }
      else {//si el switch esta en false edita
        this.ProveeService.EditarProveedor(proveedor).subscribe(data => {
          this.getAll();
          this.switch = true;
          $('#modal1').modal('close');
          Materialize.toast('El proveedor se guardó exitosamente', 3000, 'green rounded')
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
    if (this.inputEmpresa.nativeElement.value == '')
      return false
    if (this.inputContacto.nativeElement.value == '')
      return false
    if (this.inputTelefono.nativeElement.value == '')
        return false
    if (this.inputCorreo.nativeElement.value == '')
      return false
    if (this.inputProducto.nativeElement.value == '')
      return false
    return true
  }

  Detalles(v) {
    let proveedor = {
      empresa: v.empresa
    }
    //this.detalles = this.ax;
    this.ProveeService.getById(proveedor).subscribe(detalles => {
      this.detalles = [detalles]
      $('#modal4').modal('open');
    })
  }    

}
