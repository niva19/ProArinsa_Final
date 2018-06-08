import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ClientesService } from '../../services/clientes.service'
import { ReporteService } from '../../services/reporte.service'
import { CommandsService } from '../../services/commands.service'
import { Router } from '@angular/router'
import { IngresarService } from '../../services/ingresar.service'
import { ActivatedRoute } from '@angular/router'
import * as Materialize from 'angular2-materialize'

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
  providers: [IngresarService]
})
export class ClienteComponent implements OnInit {

  switch: Boolean = true
  borrar: String//variable auxiliar utilizada para guardar la cedula cuando se proceda a borrar
  ax: any[];
  detalles: any[];
  pk_cliente: String
  ruta: String

  @ViewChild('buscador')
  private buscador: ElementRef

  @ViewChild('modal2Footer')
  private modal2Footer: ElementRef

  @ViewChild('LabelNombre')
  private LabelNombre: ElementRef

  @ViewChild('LabelApellidos')
  private LabelApellidos: ElementRef

  @ViewChild('LabelCedula')
  private LabelCedula: ElementRef

  @ViewChild('LabelDireccion')
  private LabelDireccion: ElementRef

  @ViewChild('LabelTelefonoTrabajo')
  private LabelTelefonoTrabajo: ElementRef

  @ViewChild('LabelTelefonoCasa')
  private LabelTelefonoCasa: ElementRef

  @ViewChild('LabelCelular')
  private LabelCelular: ElementRef

  @ViewChild('LabelCorreoPersonal')
  private LabelCorreoPersonal: ElementRef

  @ViewChild('LabelCorreoEmpresarial')
  private LabelCorreoEmpresarial: ElementRef




  constructor(private CliService: ClientesService,
    private reporteService: ReporteService,
    private router: Router,
    private ingresarService: IngresarService,
    private renderer2: Renderer2,
    private route: ActivatedRoute,
    private commands: CommandsService) { }

  ngOnInit() {
    $('.modal').modal();
    this.getAll();
  }


  getAll() {
    this.CliService.getAll().subscribe(data => {
      this.ax = data;
    });
  }

  editClick(v: String) {
    alert(v)
  }

  LimpiarGuardar() {
    this.renderer2.removeClass(this.LabelNombre.nativeElement, "active")
    $('#Nombre').val("")

    this.renderer2.removeClass(this.LabelApellidos.nativeElement, "active")
    $('#Apellidos').val("")

    this.renderer2.removeClass(this.LabelCedula.nativeElement, "active")
    $('#Cedula').val("")

    this.renderer2.removeClass(this.LabelDireccion.nativeElement, "active")
    $('#Direccion').val("")

    this.renderer2.removeClass(this.LabelTelefonoTrabajo.nativeElement, "active")
    $('#TelefonoTrabajo').val("")

    this.renderer2.removeClass(this.LabelTelefonoCasa.nativeElement, "active")
    $('#TelefonoCasa').val("")

    this.renderer2.removeClass(this.LabelCelular.nativeElement, "active")
    $('#Celular').val("")

    this.renderer2.removeClass(this.LabelCorreoEmpresarial.nativeElement, "active")
    $('#CorreoEmpresarial').val("")

    this.renderer2.removeClass(this.LabelCorreoPersonal.nativeElement, "active")
    $('#CorreoPersonal').val("")

  }

  modal1() {
    this.switch = true;
    this.LimpiarGuardar();
    $('#modal1').modal('open');
  }

  Editar(id, ruta) {
    const cliente = {
      cedula: id
    }
    this.pk_cliente = id
    this.ruta = ruta
    this.CliService.getById(cliente).subscribe(data => {
      this.renderer2.setAttribute(this.LabelNombre.nativeElement, "class", "active")
      $('#Nombre').val(data.nombre)

      this.renderer2.setAttribute(this.LabelApellidos.nativeElement, "class", "active")
      $('#Apellidos').val(data.apellidos)

      this.renderer2.setAttribute(this.LabelCedula.nativeElement, "class", "active")
      $('#Cedula').val(data.cedula)

      this.renderer2.setAttribute(this.LabelDireccion.nativeElement, "class", "active")
      $('#Direccion').val(data.direccion)

      this.renderer2.setAttribute(this.LabelTelefonoTrabajo.nativeElement, "class", "active")
      $('#TelefonoTrabajo').val(data.telefono_trabajo)

      this.renderer2.setAttribute(this.LabelTelefonoCasa.nativeElement, "class", "active")
      $('#TelefonoCasa').val(data.telefono_casa)

      this.renderer2.setAttribute(this.LabelCelular.nativeElement, "class", "active")
      $('#Celular').val(data.celular)

      this.renderer2.setAttribute(this.LabelCorreoEmpresarial.nativeElement, "class", "active")
      $('#CorreoEmpresarial').val(data.correo_empresarial)

      this.renderer2.setAttribute(this.LabelCorreoPersonal.nativeElement, "class", "active")
      $('#CorreoPersonal').val(data.correo_personal)

      this.switch = false
      $('#modal1').modal('open');
    });
  }

  ClienteSubmit() {
    const cliente = {
      nombre: $('#Nombre').val(),
      apellidos: $('#Apellidos').val(),
      cedula: $('#Cedula').val(),
      direccion: $('#Direccion').val(),
      telefono_trabajo: $('#TelefonoTrabajo').val(),
      telefono_casa: $('#TelefonoCasa').val(),
      celular: $('#Celular').val(),
      correo_personal: $('#CorreoPersonal').val(),
      correo_empresarial: $('#CorreoEmpresarial').val(),
    }
    const reporte = {
      nombre: localStorage.getItem('nombre') + ' (' + localStorage.getItem('dni') + ')',
      accion: 'Agregar',
      modulo: 'Clientes',
      alterado: $('#Cedula').val()
    }
    if (this.ValidateForm()) {
      if (this.switch) {//si el switch esta en true guarda
        this.CliService.GuardarCliente(cliente).subscribe(data => {
          if (data.success) {
            this.ax.push({ nombre: cliente.nombre, apellidos: cliente.apellidos, cedula: cliente.cedula })

            var real_path = `mkdir %userprofile%\\Documents\\SistemaPROARINSA\\${cliente.cedula}`
            this.commands.Exec_Command_Sync(real_path)
            real_path += "\\archivos_cliente";
            this.commands.Exec_Command_Sync(real_path)

            $('#modal1').modal('close');
            Materialize.toast('Los datos se guardaron exitosamente', 3000, 'green rounded')
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
        cliente["key"] = this.pk_cliente
        var update_ruta = this.update_ruta(this.ruta, cliente.cedula)
        cliente["oldruta"] = this.ruta
        cliente["ruta"] = update_ruta

        this.CliService.EditarCliente(cliente).subscribe(data => {
          if (!data.success) {
            Materialize.toast('Error, la cedula ya existe', 3000, 'red rounded')
          }
          else {

            if(this.ruta != update_ruta){
              this.commands.Exec_Command_Sync(`ren ${this.points_to_slash(this.ruta)} ${cliente.cedula}`)
            }

            this.getAll()
            this.switch = true;
            $('#modal1').modal('close');
            Materialize.toast('Los datos se editaron exitosamente', 3000, 'green rounded')
            //NOW ADDING TO HISTORY
            reporte.accion = 'Editar';
            this.reporteService.addReport(reporte).subscribe(data => {
              if (!data.success) {
                Materialize.toast('Error al guardar historial', 3000, 'red rounded')
              }
            })
            //END OF history
          }
        });
      }
    }
    else {
      Materialize.toast('Complete los espacios para continuar', 3000, 'red rounded')
    }

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

  update_ruta(ruta, cedula) {
    for (var i = ruta.length - 1; i > -1; i--) {
      if (ruta.charAt(i) == ".") break
    }
    return ruta.substring(0, i + 1) + cedula
  }

  Only_Numbers(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  Proyecto(id) {
    localStorage.setItem("id_cliente", id)
    this.router.navigate(["/proyecto"], { relativeTo: this.route });
  }

  Archivos(id) {
    localStorage.setItem("id_cliente", id)
    this.router.navigate(["/cliente_archivos"], { relativeTo: this.route });
  }

  Detalles(id) {
    this.CliService.Detalles({ cedula: id }).subscribe(data => {
      this.detalles = data;
      $('#Detalles').modal('open');
    });
  }

  ValidateForm() {

    if ($('#Nombre').val() == '')
      return false
    if ($('#Apellidos').val() == '')
      return false
    if ($('#Cedula').val() == '')
      return false
    if ($('#Direccion').val() == '')
      return false
    if ($('#TelefonoTrabajo').val() == '')
      return false
    if ($('#Celular').val() == '')
      return false
    if ($('#CorreoEmpresarial').val() == '')
      return false

    return true
  }

  Is_Gerente() {
    return (this.ingresarService.isGerente()) ? true : false
  }
}

