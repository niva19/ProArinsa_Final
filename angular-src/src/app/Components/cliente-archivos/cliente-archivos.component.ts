import { Component, OnInit, ViewChild } from '@angular/core';
import { ReporteService } from '../../services/reporte.service'
import { ClienteArchivosService } from '../../services/cliente-archivos.service'
import { Router } from '@angular/router'
import { ActivatedRoute } from '@angular/router'
import { CommandsService } from '../../services/commands.service'
import * as Materialize from 'angular2-materialize'


declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-cliente-archivos',
  templateUrl: './cliente-archivos.component.html',
  styleUrls: ['./cliente-archivos.component.css']
})
export class ClienteArchivosComponent implements OnInit {

  archivos_descarga: any[] = [];
  flag: boolean = true
  upload_files: any[] = []
  archivos: any[]
  ruta: String
  archivos_eliminar: any[] = []

  @ViewChild('myInput')
  myInputVariable: any;

  constructor(private reporteService: ReporteService,
    private clienteArchivosService: ClienteArchivosService,
    private router: Router,
    private route: ActivatedRoute,
    private commands: CommandsService) { }

  ngOnInit() {
    $('.modal').modal();
    $('.dropdown-button').dropdown();
    this.Archivos();
    this.Get_path();
  }

  Get_path() {
    this.clienteArchivosService.Obtener_Ruta({ cliente: localStorage.getItem("id_cliente") })
      .subscribe(ruta => {
        this.ruta = ruta.ruta
        this.ruta += '.archivos_cliente'
      })
  }

  Archivos() {
    this.clienteArchivosService.Obtener_Archivos({ cliente: localStorage.getItem("id_cliente") }).subscribe(archivos => {

      archivos.forEach(archivo => {
        var extension = ""
        for (var i = archivo.nombre_archivo.length - 1; i > -1; i--) {
          if (archivo.nombre_archivo.charAt(i) != '.') extension += archivo.nombre_archivo.charAt(i)
          else break
        }

        archivo["extension"] = this.invertir(extension)
        archivo["nombre"] = archivo.nombre_archivo.substring(0,i)
      })
      this.archivos = archivos
    })
  }

  modal1() {
    $('#modal1').modal({
      ready: function () {
        $('ul.tabs').tabs();
      }
    })
    this.upload_files = []
    $('#modal1').modal('open');
  }

  onChange(event: any) {
    let files = event.target.files
    if (files.length != 0) {
      Object.keys(files).forEach(key => {
        let file = files[key]
        var extension = ""
        for (var i = file.name.length - 1; i > -1; i--) {
          if (file.name.charAt(i) != '.') extension += file.name.charAt(i)
          else break
        }
        this.upload_files.push({ name: file.name, path: file.path, ext: this.invertir(extension) })
      });
    }
    this.upload_files = this.removeDuplicates(this.upload_files, "path");
    this.myInputVariable.nativeElement.value = "";
  }

  invertir(cadena) {
    var x = cadena.length;
    var cadenaInvertida = "";

    while (x >= 0) {
      cadenaInvertida += cadena.charAt(x);
      x--;
    }
    return cadenaInvertida;
  }

  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

  delete_upload_file(name) {
    for (var i = 0; i < this.upload_files.length; i++) {
      if (this.upload_files[i].name == name) break
    }
    this.upload_files.splice(i, 1);
  }

  Confirmar_Descargar() {
    this.archivos_descarga = []
    let checkboxes = $('.chk:checkbox:checked');
    if (checkboxes.length == 0)
      Materialize.toast(`Debe elejir al menos un archivo`, 3000, 'red rounded');
    else {
      (checkboxes.length == 1)
        ? $('#mensaje_descarga').text("¿Está seguro que desea descargar este elemento?")
        : $('#mensaje_descarga').text(`¿Está seguro que desea descargar estos ${checkboxes.length} elementos?`);
      $('#descargar').modal('open');
    }
  }

  Descargar_Archivo() {
    $('#descargar').modal('close');
    let checkboxes = $('.chk:checkbox:checked');

    (checkboxes.length == 1)
      ? $('#mensaje_barra_descarga').text("Descargando Archivo")
      : $('#mensaje_barra_descarga').text(`Descargando Archivos`);

    $("#descargando_archivo").modal("open")
    for (let i = 0; i < checkboxes.length; i++) {
      this.archivos_descarga.push({
        ruta: `${this.points_to_slash(this.ruta)}\\`,
        nombre_archivo: `\"${checkboxes[i].attributes[4].nodeValue}\"`,
        ext: "." + this.get_extension2(checkboxes[i].attributes[4].nodeValue)
      })
    }
    this.Descargar_Archivo_Service(this.archivos_descarga)

    setTimeout(() => {
      $("#descargando_archivo").modal("close");
      (checkboxes.length == 1)
        ? Materialize.toast('Archivo descargado', 3000, 'green rounded')
        : Materialize.toast('Archivos descargados', 3000, 'green rounded')

      this.set_flag(true)
    }, 1200);
  }

  Descargar_Archivo_Service(files) {
    for (let i = 0; i < files.length; i++) {
      this.commands.Exec_Command_Sync(`copy ${files[i].ruta}\"${files[i].nombre_archivo}\" %userprofile%\\Downloads\\\"${files[i].nombre_archivo.replace(files[i].ext,"")}_descarga${files[i].ext}\"`)
    }
  }

  Confirmar_Eliminar() {
    this.archivos_eliminar = []
    let checkboxes = $('.chk:checkbox:checked');
    if (checkboxes.length == 0)
      Materialize.toast(`Debe elejir al menos un archivo`, 3000, 'red rounded');
    else {
      (checkboxes.length == 1)
        ? $('#mensaje_eliminar').text("¿Está seguro que desea eliminar este elemento?")
        : $('#mensaje_eliminar').text(`¿Está seguro que desea eliminar estos ${checkboxes.length} elementos?`);
      $('#eliminar').modal('open');
    }
  }

  Desenlazar_Archivo() {
    let checkboxes = $('.chk:checkbox:checked')

    for (let i = 0; i < checkboxes.length; i++) {
      this.archivos_eliminar.push(checkboxes[i].attributes[4].nodeValue)
    }

    const reporte = {
      nombre: localStorage.getItem('nombre') + ' (' + localStorage.getItem('dni') + ')',
      accion: 'Desenlazar',
      modulo: 'Archivos_Cliente',
      alterado: 'NONE'
    }

    let path_files = this.archivos_eliminar.map(file_name => {
      return `${this.points_to_slash(this.ruta)}\\\"${file_name}\"`
    })

    this.clienteArchivosService.Desenlazar_Archivo({
      path_files: path_files,
      files: this.archivos_eliminar,
      ruta_padre: localStorage.getItem("id_cliente")
    }).subscribe(res => {
      if (res.success) {
        Materialize.toast(`Los archivos se desenlazaron correctamente`, 3000, 'green rounded')
        this.Archivos()
        this.set_flag(true)
      }
      else Materialize.toast(`Error, no se pudo desenlazar los archivos`, 3000, 'red rounded')

      res.arr.forEach(e => {
        //NOW ADDING TO HISTORY
        reporte.alterado = e;
        this.reporteService.addReport(reporte).subscribe(data => {
          if (!data.success) {
            Materialize.toast('Error al guardar historial', 3000, 'red rounded')
          }
        })
        //END OF history
      });
    })
  }

  Enlazar_Archivos() {
    if (this.upload_files.length != 0) {

      let archivos = this.upload_files.map(file => {
        return {
          realPath: file.path,
          cedula: localStorage.getItem("id_cliente"),
          nombre_archivo: file.name,
          destiny: this.ruta
        };
      })
      const reporte = {
        nombre: localStorage.getItem('nombre') + ' (' + localStorage.getItem('dni') + ')',
        accion: 'Agregar',
        modulo: 'Cliente_Archivos',
        alterado: 'NONE'
      }

      this.clienteArchivosService.Guardar_Archivo(archivos).subscribe(res => {
        var flag = false;
        var aux_arr = []

        for (let i = 0; i < res.arr.length; i++) {
          if (!res.arr[i].success) {
            if (res.arr[i].err.code == "23505") {
              Materialize.toast(`El archivo "${this.upload_files[i].name}" ya existe`, 5000, 'red rounded')
              flag = true;
              aux_arr.push(false)
            }
          }
          else {
            Materialize.toast(`El archivo "${this.upload_files[i].name}" se enlazo al proyecto exitosamente`, 3000, 'green rounded')
            aux_arr.push(true)

            this.get_extension(archivos[i])

            this.archivos.push(archivos[i])
            //NOW ADDING TO HISTORY
            reporte.alterado = this.upload_files[i].name;
            this.reporteService.addReport(reporte).subscribe(data => {
              if (!data.success) {
                Materialize.toast('Error al guardar historial', 3000, 'red rounded')
              }
            })
            //END OF history
          }
        }
        this.limpiar_upload_files(aux_arr);
        (!flag) ? $('#modal1').modal('close') : null;
      })
    }
    else Materialize.toast('Debe elegir al menos un archivo', 3000, 'red rounded')
  }


  get_extension(archivo) {
    var extension = ""
    for (var i = archivo.nombre_archivo.length - 1; i > -1; i--) {
      if (archivo.nombre_archivo.charAt(i) != '.') extension += archivo.nombre_archivo.charAt(i)
      else break
    }
    archivo["extension"] = this.invertir(extension)
    archivo["nombre"] = archivo.nombre_archivo.substring(0,i)
  }

  get_extension2(nombre_archivo) {
    var extension = ""
    for (var i = nombre_archivo.length - 1; i > -1; i--) {
      if (nombre_archivo.charAt(i) != '.') extension += nombre_archivo.charAt(i)
      else break
    }
    return this.invertir(extension)
  }

  limpiar_upload_files(arr) {
    for (var i = arr.length - 1; i >= 0; i--) {
      if (arr[i]) this.upload_files.splice(i, 1);
    }
  }

  set_flag(val) {
    this.flag = val
  }

  eliminar() {

  }

  unselect_all() {
    $('.chk').prop('checked', false);
  }

  select_all() {
    $('.chk').prop('checked', true);
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

  get_path_destination_folder(origin, folder_name) {
    for (var i = origin.length; i > -1; i--) {
      if (origin.charAt(i) == '.') break;
    }
    return `${origin.substring(0, i)}.${folder_name}`
  }



  Abrir_Archivo(file) {
    this.commands.Exec_Command_Sync(`start ${this.points_to_slash(this.ruta)}\\\"${file.nombre_archivo}\"`)
    Materialize.toast('Abriendo archivo', 3000, 'green rounded')
  }


  mostar_editar_nombre(num) {
    $("#t" + num).css("display", "none")
    $("#i" + num).css("display", "block")
    $("#input" + num).focus()
  }

  editar_nombre(num, file) {
    var new_name = $("#input" + num).val()
    if (new_name == "") {
      Materialize.toast(`Error, debe ingresar un nombre`, 3000, 'red rounded')
      return;
    }
    if (file.nombre != new_name) {
      this.clienteArchivosService.Cambiar_Nombre_Archivo({
        ruta_padre: this.ruta,
        new_name: `${new_name}.${this.archivos[num]["extension"]}`,
        nombre_archivo: file.nombre_archivo,
        real_path: this.points_to_slash(this.ruta),
        cedula: localStorage.getItem("id_cliente")
      }).subscribe(res => {

        if (res.success) {
          $("#i" + num).css("display", "none")
          $("#t" + num).css("display", "block")
          this.archivos[num]["nombre"] = new_name
          this.archivos[num]["nombre_archivo"] = `${new_name}.${this.archivos[num]["extension"]}`
        }
        else Materialize.toast(`Error, ya existe un archivo llamado "${new_name}"`, 3000, 'red rounded')
      })
    }
    else {
      $("#i" + num).css("display", "none")
      $("#t" + num).css("display", "block")
    }
  }

  atras(){
    this.router.navigate(["/cliente"], { relativeTo: this.route })
  }
}
