import { Component, OnInit } from '@angular/core';
import { ProyectosService } from '../../services/proyectos.service'
import { ArchivosService } from '../../services/archivos.service'
import { CarpetasService } from '../../services/carpetas.service'
import { ClienteArchivosService } from '../../services/cliente-archivos.service'
import { ReporteService } from '../../services/reporte.service'
import * as Materialize from 'angular2-materialize'

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {

  repeat_proyect_folders: { folders: any; i: number; length: number; };
  repeat_proyect_file: any
  customer_files: any = [];
  files: any[]
  folders: any[]
  file: String
  archivo_aux: any = { ruta_padre: "", nombre_carpeta: "", nombre_archivo: "" }
  files_arr: any[] = []
  folders_arr: any[] = []
  duplicate_file: any
  //true = carpeta, false = archivo
  chk: String = ".chk_folders"
  ruta_actual: String
  repeat_customer_file: any
  term: any
  p: any
  term2: any
  term3: any


  constructor(private Archivos_Service: ArchivosService,
    private reporteService: ReporteService,
    private Carpetas_Service: CarpetasService,
    private clienteArchivosService: ClienteArchivosService) { }

  ngOnInit() {
    $('.tabs').tabs();
    $(".tabs .indicator ").css("background-color", "black");
    $('.modal').modal();
    $('#remplazar_omitir').modal({
      dismissible: false
    })
    this.getAll();
    this.get_carpetas();
    this.get_cliente_archivos();
  }
  /*1*/
  getAll() {
    this.Archivos_Service.Papelera().subscribe(files => {
      this.files = files;
    });
  }

  get_carpetas() {
    this.Carpetas_Service.Papelera().subscribe(folders => {
      this.folders = folders
    });
  }
  /*1*/

  get_cliente_archivos() {
    this.clienteArchivosService.Papelera().subscribe(customer_files => {
      this.customer_files = customer_files
    });
  }

  /*PLANTILLA*/
  Confirmar_Eliminar() {
    if (this.chk == ".chk_folders") {
      this.Confirmar_Eliminar_Carpetas()
    }
    else if (this.chk == ".chk_proyect_files") {
      this.Confirmar_Eliminar_Archivos_Proyecto();
    }
    else if (this.chk == ".chk_customer_files") {
      this.Confirmar_Eliminar_Archivos_Cliente()
    }
  }

  /*1*/
  Confirmar_Eliminar_Carpetas() {
    let checkboxes = $('.chk_folders:checkbox:checked');
    (checkboxes.length == 1)
      ? $('#mensaje_eliminar_carpetas').text("¿Está seguro que desea eliminar este elemento de forma permanente?")
      : $('#mensaje_eliminar_carpetas').text(`¿Está seguro que desea eliminar estos ${checkboxes.length} elementos de forma permanente?`);
    $('#eliminar_carpetas').modal('open');
  }
  Eliminar_Carpetas() {
    let checkboxes = $('.chk_folders:checked')

    this.files_arr = []
    var names = []
    for (let i = 0; i < checkboxes.length; i++) {
      let id = checkboxes[i].attributes[4].nodeValue
      this.files_arr.push(this.folders[id].id)
      names.push(this.folders[id].nombre_carpeta)
    }
  
    const reporte = {
      nombre: localStorage.getItem('nombre') + ' (' + localStorage.getItem('dni') + ')',
      accion: 'Eliminar',
      modulo: 'Papelera-Carpetas',
      alterado: 'NONE'
    }

    this.Carpetas_Service.Eliminar_Carpeta_Permanentemente(this.files_arr).subscribe(res => {
      this.unselect_all()
      if (res.success) {
        Materialize.toast(`Los carpetas se eliminaron exitosamente`, 3000, 'green rounded')
        this.get_carpetas()
      }
      else Materialize.toast(`Error, no se eliminaron las carpetas`, 3000, 'red rounded')

      names.forEach(e => {
        //NOW ADDING TO HISTORY
        reporte.alterado = e
        this.reporteService.addReport(reporte).subscribe(data => {
          if (!data.success) {
            Materialize.toast('Error al guardar historial', 3000, 'red rounded')
          }
        })
        //END OF history
      });

    })
  }
  /*1*/

  /*2*/
  Confirmar_Eliminar_Archivos_Proyecto() {
    let checkboxes = $('.chk_proyect_files:checkbox:checked');
    (checkboxes.length == 1)
      ? $('#mensaje_eliminar_archivos_proyecto').text("¿Está seguro que desea eliminar este elemento de forma permanente?")
      : $('#mensaje_eliminar_archivos_proyecto').text(`¿Está seguro que desea eliminar estos ${checkboxes.length} elementos de forma permanente?`);
    $('#eliminar_archivos_proyecto').modal('open');
  }
  Eliminar_Archivos_Proyecto() {
    let checkboxes = $('.chk_proyect_files:checked')

    this.files_arr = []
    for (let i = 0; i < checkboxes.length; i++) {
      let id = checkboxes[i].attributes[4].nodeValue
      this.files_arr.push({
        id: this.files[id].id,
        nombre_archivo: this.files[id].nombre_archivo
      })
    }

    const reporte = {
      nombre: localStorage.getItem('nombre') + ' (' + localStorage.getItem('dni') + ')',
      accion: 'Eliminar',
      modulo: 'Papelera-Archivos-Proyecto',
      alterado: 'NONE'
    }

    this.Archivos_Service.Eliminar_Archivo(this.files_arr).subscribe(res => {
      this.unselect_all()
      if (res.success) {
        Materialize.toast(`Los archivos se eliminaron exitosamente`, 3000, 'green rounded')
        this.getAll()
      }
      else Materialize.toast(`Error, no se eliminaron los archivos`, 3000, 'red rounded')

      res.arr.forEach(e => {
        //NOW ADDING TO HISTORY
        reporte.alterado = e.nombre_archivo;
        this.reporteService.addReport(reporte).subscribe(data => {
          if (!data.success) {
            Materialize.toast('Error al guardar historial', 3000, 'red rounded')
          }
        })
        //END OF history
      });
    });
  }
  /*2*/

  /*3*/
  Confirmar_Eliminar_Archivos_Cliente() {
    let checkboxes = $('.chk_customer_files:checkbox:checked');
    (checkboxes.length == 1)
      ? $('#mensaje_eliminar_archivos_cliente').text("¿Está seguro que desea eliminar este elemento de forma permanente?")
      : $('#mensaje_eliminar_archivos_cliente').text(`¿Está seguro que desea eliminar estos ${checkboxes.length} elementos de forma permanente?`);
    $('#eliminar_archivos_cliente').modal('open');
  }
  Eliminar_Archivos_Cliente() {
    let checkboxes = $('.chk_customer_files:checked')

    this.files_arr = []
    for (let i = 0; i < checkboxes.length; i++) {
      let id = checkboxes[i].attributes[4].nodeValue
      this.files_arr.push({
        id: this.customer_files[id].id,
        nombre_archivo: this.customer_files[id].nombre_archivo
      })
    }

    const reporte = {
      nombre: localStorage.getItem('nombre') + ' (' + localStorage.getItem('dni') + ')',
      accion: 'Eliminar',
      modulo: 'Papelera-Archivos-Cliente',
      alterado: 'NONE'
    }

    this.clienteArchivosService.Eliminar_Archivo(this.files_arr).subscribe(res => {
      this.unselect_all()
      if (res.success) {
        Materialize.toast(`Los archivos se eliminaron exitosamente`, 3000, 'green rounded')
        this.get_cliente_archivos()
      }
      else Materialize.toast(`Error, no se eliminaron los archivos`, 3000, 'red rounded')

      res.arr.forEach(e => {
        //NOW ADDING TO HISTORY
        reporte.alterado = e.nombre_archivo;
        this.reporteService.addReport(reporte).subscribe(data => {
          if (!data.success) {
            Materialize.toast('Error al guardar historial', 3000, 'red rounded')
          }
        })
        //END OF history
      });
    });
  }
  /*3*/

  /*PLANTILLA*/
  Confirmar_Recuperar() {
    if (this.chk == ".chk_folders") {
      this.Confirmar_Recuperar_Carpetas()
    }
    else if (this.chk == ".chk_proyect_files") {
      this.Confirmar_Recuperar_Archivos_Proyecto();
    }
    else if (this.chk == ".chk_customer_files") {
      this.Confirmar_Recuperar_Archivos_Cliente()
    }
  }

  /*1*/
  Confirmar_Recuperar_Carpetas() {
    let checkboxes = $('.chk_folders:checkbox:checked');
    (checkboxes.length == 1)
      ? $('#mensaje_recuperar_carpetas').text("¿Está seguro de recuperar este elemento?")
      : $('#mensaje_recuperar_carpetas').text(`¿Está seguro de recuperar estos ${checkboxes.length} elementos?`);
    $('#recuperar_carpetas').modal('open');
  }
  Recuperar_Carpetas() {
    let checkboxes = $('.chk_folders:checked')

    this.folders_arr = []
    for (let i = 0; i < checkboxes.length; i++) {
      let id = checkboxes[i].attributes[4].nodeValue
      let values = this.update_folder_path(this.folders[id].ruta, this.folders[id].nombreproyecto)
      this.folders_arr.push({
        id: parseInt(this.folders[id].id),
        nombre_carpeta: this.folders[id].nombre_carpeta,
        update_path: values[0],
        slash_path: this.points_to_slash(values[1]),
        update_full_path: values[1]
      })
    }

    const reporte = {
      nombre: localStorage.getItem('nombre') + ' (' + localStorage.getItem('dni') + ')',
      accion: 'Recuperar',
      modulo: 'Papelera-Carpetas',
      alterado: 'NONE'
    }

    this.Carpetas_Service.Recuperar_Carpetas(this.folders_arr).subscribe(res => {
      if (res.success) {
        this.unselect_all();
        this.get_carpetas()

        //START OF history
        res.not_repeat_folders.forEach(e => {
          reporte.alterado = e.nombre_carpeta;
          this.reporteService.addReport(reporte).subscribe(data => {
            if (!data.success) {
              Materialize.toast('Error al guardar historial', 3000, 'red rounded')
            }
          })
          //END OF history
        });

        if (res.repeat_folders.length != 0) {
          if (res.repeat_folders.length != 0) {
            this.repeat_proyect_folders = { folders: null, i: 0, length: 0 }
            this.repeat_proyect_folders.folders = res.repeat_folders
            this.repeat_proyect_folders.length = res.repeat_folders.length - 1
  
            let folders = res.repeat_folders
            $('#mensaje_remplazar_omitir_carpetas').text(`El destino ya posee una carpeta llamada \"${folders[0].nombre_carpeta}\"`);
            $('#remplazar_omitir_carpetas').modal('open')
          }
        }
      }
      else Materialize.toast(`No se recuperaron las carpetas`, 3000, 'red rounded')
    })
  }
  rem_or_omi_Carpeta(option) {
    let folders = this.repeat_proyect_folders.folders
    let i = this.repeat_proyect_folders.i
    folders[i]['option'] = option

    if (i == this.repeat_proyect_folders.length) {
      this.repeat_proyect_folders = folders.filter(e => e.option == "reemplazar")
      $('#remplazar_omitir_carpetas').modal('close')
      this.Reemplazar_carpetas()
    }
    else {
      this.repeat_proyect_folders.i++;
      i++;
      $('#remplazar_omitir_carpetas').modal('close')
      setTimeout(() => {
        $('#mensaje_remplazar_omitir_carpetas').text(`El destino ya posee una carpeta llamada \"${folders[i].nombre_carpeta}\"`);
        $('#remplazar_omitir_carpetas').modal('open')
      }, 400);
    }
  }
  Reemplazar_carpetas(){
    const reporte = {
      nombre: localStorage.getItem('nombre') + ' (' + localStorage.getItem('dni') + ')',
      accion: 'Recuperar',
      modulo: 'Papelera-Carpetas',
      alterado: 'NONE'
    }

    this.Carpetas_Service.Reemplazar_Carpetas(this.repeat_proyect_folders).subscribe(res => {
      if (res.success) {
        this.unselect_all();
        this.get_carpetas()

        //START OF history
        res.folders.forEach(e => {
          reporte.alterado = e.nombre_carpeta;
          this.reporteService.addReport(reporte).subscribe(data => {
            if (!data.success) {
              Materialize.toast('Error al guardar historial', 3000, 'red rounded')
            }
          })
          //END OF history
        });
      }
      else Materialize.toast('No se recuperaron las carpetas', 3000, 'red rounded')
    });
  }
  /*1*/

  /*2*/
  Confirmar_Recuperar_Archivos_Proyecto() {
    let checkboxes = $('.chk_proyect_files:checkbox:checked');
    (checkboxes.length == 1)
      ? $('#mensaje_recuperar_archivos_proyecto').text("¿Está seguro de recuperar este elemento?")
      : $('#mensaje_recuperar_archivos_proyecto').text(`¿Está seguro de recuperar estos ${checkboxes.length} elementos?`);
    $('#recuperar_archivos_proyecto').modal('open');
  }
  Recuperar_Archivos_Proyecto() {
    let checkboxes = $('.chk_proyect_files:checkbox:checked')

    this.files_arr = []
    for (let i = 0; i < checkboxes.length; i++) {
      let id = checkboxes[i].attributes[4].nodeValue
      this.files_arr.push(this.files[id])
      let obj = this.get_update_path(this.files[id].ruta_padre, this.files[id].nombre_proyecto)
      this.files_arr[i]["ruta_padre"] = obj.ruta_points
      this.files_arr[i]["ruta_slash"] = obj.ruta_slash
    }

    const reporte = {
      nombre: localStorage.getItem('nombre') + ' (' + localStorage.getItem('dni') + ')',
      accion: 'Recuperar',
      modulo: 'Papelera-Archivos-Proyecto',
      alterado: 'NONE'
    }

    this.Archivos_Service.Recuperar_Archivo(this.files_arr).subscribe(res => {
      if (res.success) {
        this.unselect_all();
        this.getAll();

        //START OF history
        res.not_repeat_files.forEach(e => {
          reporte.alterado = e.nombre_archivo;
          this.reporteService.addReport(reporte).subscribe(data => {
            if (!data.success) {
              Materialize.toast('Error al guardar historial', 3000, 'red rounded')
            }
          })
          //END OF history
        });

        if (res.repeat_files.length != 0) {
          this.repeat_proyect_file = { files: null, i: 0, length: 0 }
          this.repeat_proyect_file.files = res.repeat_files
          this.repeat_proyect_file.length = res.repeat_files.length - 1

          let files = res.repeat_files
          $('#mensaje_remplazar_omitir_archivos_proyecto').text(`El destino ya posee un archivo llamado \"${files[0].nombre_archivo}\"`);
          $('#remplazar_omitir_archivos_proyecto').modal('open')
        }
      }
      else Materialize.toast('Error no se pudo recuperar los archivos', 3000, 'red rounded')
    });
  }
  rem_or_omi_Archivos_proyecto(option) {
    let files = this.repeat_proyect_file.files
    let i = this.repeat_proyect_file.i
    files[i]['option'] = option

    if (i == this.repeat_proyect_file.length) {
      this.repeat_proyect_file = files.filter(e => e.option == "reemplazar")
      .map(e => {
        return {
          id: e.id,
          nombre_archivo: e.nombre_archivo,
          ruta_slash: e.ruta_slash
        }
      })
      $('#remplazar_omitir_archivos_proyecto').modal('close')
      this.Reemplazar_archivos_proyecto()
    }
    else {
      this.repeat_proyect_file.i++;
      i++;
      $('#remplazar_omitir_archivos_proyecto').modal('close')
      setTimeout(() => {
        $('#mensaje_remplazar_omitir_archivos_proyecto').text(`El destino ya posee un archivo llamado \"${files[i].nombre_archivo}\"`);
        $('#remplazar_omitir_archivos_proyecto').modal('open')
      }, 400);
    }
  }
  Reemplazar_archivos_proyecto(){
    const reporte = {
      nombre: localStorage.getItem('nombre') + ' (' + localStorage.getItem('dni') + ')',
      accion: 'Recuperar',
      modulo: 'Papelera-Archivos-Proyecto',
      alterado: 'NONE'
    }

    this.Archivos_Service.Reemplazar_Archivos(this.repeat_proyect_file).subscribe(res => {
      if (res.success) {
        this.unselect_all();
        this.getAll()

        //START OF history
        res.files.forEach(e => {
          reporte.alterado = e.nombre_archivo;
          this.reporteService.addReport(reporte).subscribe(data => {
            if (!data.success) {
              Materialize.toast('Error al guardar historial', 3000, 'red rounded')
            }
          })
          //END OF history
        });
      }
      else Materialize.toast('Error no se puedo recuperar los archivos', 3000, 'red rounded')
    });
  }
  /*2*/

  /*3*/
  Confirmar_Recuperar_Archivos_Cliente() {
    let checkboxes = $('.chk_customer_files:checkbox:checked');
    (checkboxes.length == 1)
      ? $('#mensaje_recuperar_archivos_cliente').text("¿Está seguro de recuperar este elemento?")
      : $('#mensaje_recuperar_archivos_cliente').text(`¿Está seguro de recuperar estos ${checkboxes.length} elementos?`);
    $('#recuperar_archivos_cliente').modal('open');
  }
  Recuperar_Archivos_Cliente() {
    let checkboxes = $('.chk_customer_files:checkbox:checked')

    this.files_arr = []
    for (let i = 0; i < checkboxes.length; i++) {
      let id = checkboxes[i].attributes[4].nodeValue
      this.files_arr.push({
        cedula: this.customer_files[id].cedula,
        nombre_archivo: this.customer_files[id].nombre_archivo,
        id: this.customer_files[id].id,
        ruta_slash: this.points_to_slash(this.customer_files[id].ruta)
      })
    }

    const reporte = {
      nombre: localStorage.getItem('nombre') + ' (' + localStorage.getItem('dni') + ')',
      accion: 'Recuperar',
      modulo: 'Papelera-Archivos-Cliente',
      alterado: 'NONE'
    }

    this.clienteArchivosService.Recuperar_Archivo(this.files_arr).subscribe(res => {
      if (res.success) {
        this.unselect_all();
        this.get_cliente_archivos()

        //START OF history
        res.not_repeat_files.forEach(e => {
          reporte.alterado = e.nombre_archivo;
          this.reporteService.addReport(reporte).subscribe(data => {
            if (!data.success) {
              Materialize.toast('Error al guardar historial', 3000, 'red rounded')
            }
          })
          //END OF history
        });

        if (res.repeat_files.length != 0) {
          this.repeat_customer_file = { files: null, i: 0, length: 0 }
          this.repeat_customer_file.files = res.repeat_files
          this.repeat_customer_file.length = res.repeat_files.length - 1

          let files = res.repeat_files
          $('#mensaje_remplazar_omitir_archivos_cliente').text(`El destino ya posee un archivo llamado \"${files[0].nombre_archivo}\"`);
          $('#remplazar_omitir_archivos_cliente').modal('open')
        }
      }
      else Materialize.toast('Error no se pudo recuperar los archivos', 3000, 'red rounded')
      
    });
  }
  rem_or_omi_Archivos_Cliente(option) {
    let files = this.repeat_customer_file.files
    let i = this.repeat_customer_file.i
    files[i]['option'] = option

    if (i == this.repeat_customer_file.length) {
      this.repeat_customer_file = files.filter(e => e.option == "reemplazar")
      .map(e => {
        return {
          id: e.id,
          nombre_archivo: e.nombre_archivo,
          ruta_slash: e.ruta_slash
        }
      })
      $('#remplazar_omitir_archivos_cliente').modal('close')
      this.Reemplazar_archivos_cliente()
    }
    else {
      this.repeat_customer_file.i++;
      i++;
      $('#remplazar_omitir_archivos_cliente').modal('close')
      setTimeout(() => {
        $('#mensaje_remplazar_omitir_archivos_cliente').text(`El destino ya posee un archivo llamado \"${files[i].nombre_archivo}\"`);
        $('#remplazar_omitir_archivos_cliente').modal('open')
      }, 400);
    }
  }
  Reemplazar_archivos_cliente(){
    const reporte = {
      nombre: localStorage.getItem('nombre') + ' (' + localStorage.getItem('dni') + ')',
      accion: 'Recuperar',
      modulo: 'Papelera-Archivos-Cliente',
      alterado: 'NONE'
    }

    this.clienteArchivosService.Reemplazar_Archivos(this.repeat_customer_file).subscribe(res => {
      if (res.success) {
        this.unselect_all();
        this.get_cliente_archivos()

        //START OF history
        res.files.forEach(e => {
          reporte.alterado = e.nombre_archivo;
          this.reporteService.addReport(reporte).subscribe(data => {
            if (!data.success) {
              Materialize.toast('Error al guardar historial', 3000, 'red rounded')
            }
          })
          //END OF history
        });
      }
      else Materialize.toast('Error no se puedo recuperar los archivos', 3000, 'red rounded')
    });
  }
  /*3*/

  update_folder_path(str, nombre_proyecto) {
    var cont = 0;
    var p1, p2;
    for (var i = 0; i < str.length; i++) {
      if (str.charAt(i) == '.') cont++;
      if (cont == 6) {
        p1 = i;
        cont++;
      }
      else if (cont == 8) {
        p2 = i;
        break;
      }
    }

    for (var j = str.length; j > -1; j--) {
      if (str.charAt(j) == '.') break;
    }

    var half_path = `${str.substring(0, p1)}.${nombre_proyecto}`
    var full_path = `${half_path}.${str.substring(p2 + 1, j)}`
    return [half_path, full_path]
  }

  get_update_path(str, nombre_proyecto) {
    var userprofile = "%"
    var i;
    for (i = 0; i < str.length; i++) {
      if (str.charAt(i) == '.') break
      userprofile += str.charAt(i)
    }
    userprofile += "%"
    userprofile = `${userprofile}.${str.substring(i + 1, str.lenght)}`

    var cont = 0;
    var p1, p2;
    for (i = 0; i < userprofile.length; i++) {
      if (userprofile.charAt(i) == '.') cont++
      if (cont == 6) {
        p1 = i;
        cont++
      }
      if (cont == 8) {
        p2 = i
        break
      }
    }

    var proyecto = userprofile.substring(p1 + 1, p2)

    if (proyecto == nombre_proyecto) {
      return { ruta_points: str, ruta_slash: userprofile.split('.').join('\\') }
    }

    else {
      var ruta_points = `${userprofile.substring(0, p1 + 1)}${nombre_proyecto}${userprofile.substring(p2, userprofile.length)}`
      var ruta_slash = ruta_points.split('.').join('\\');
      ruta_points = ruta_points.split('%').join('');
      return { ruta_points: ruta_points, ruta_slash: ruta_slash }
    }

  }

  ver_ruta(ruta) {
    this.ruta_actual = this.get_path(ruta)
    $('#modal_ruta').modal('open');
  }

  get_path(str) {

    var cont = 0;
    for (var i = 0; i < str.length; i++) {
      if (str.charAt(i) == '.') cont++
      if (cont == 6) break;
    }

    var points = str.substring(i + 1, str.lenght)
    points = points.split('.').join('\\');
    return points
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



  Anyone_checked() {
    return ($(`${this.chk}:checkbox:checked`).length != 0) ? true : false
  }

  select_all() {
    $(this.chk).prop('checked', true)
  }

  unselect_all() {
    $(this.chk).prop('checked', false)
  }

  Ir_Opciones() {
    $('#opciones').modal('open');
  }

  change_chk(chk) {
    this.unselect_all()
    this.chk = chk
  }
}
