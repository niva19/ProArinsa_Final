import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CarpetasService } from '../../services/carpetas.service'
import { ArchivosService } from '../../services/archivos.service'
import { ReporteService } from '../../services/reporte.service'
import { Router } from '@angular/router'
import { IngresarService } from '../../services/ingresar.service'
import { CommandsService } from '../../services/commands.service'
import { ActivatedRoute } from '@angular/router'
import { ElectronService } from 'ngx-electron';
import { ChildProcessService } from 'ngx-childprocess';
import * as Materialize from 'angular2-materialize'

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-archivos',
  templateUrl: './archivos.component.html',
  styleUrls: ['./archivos.component.css']
})
export class ArchivosComponent implements OnInit {

  archivos_descarga: any[] = [];
  pkProyecto: String
  archivos: any[]
  carpetas: any[]
  upload_files: any[] = []
  carpeta_lista: any[] = []
  carpeta_actual: any = { nombre_carpeta: "", ruta_padre: "" }
  archivos_eliminar: any[] = []
  carpetas_eliminar: any[] = []
  archivos_mover: any[] = []
  archivo_repetido: any
  flag: boolean = true
  flag_carpeta: boolean = true
  current_tab: boolean = true
  term: any
  p: any
  term2: any

  @ViewChild('myInput')
  myInputVariable: any;

  constructor(private Archivos_Service: ArchivosService,
    private reporteService: ReporteService,
    private Carpetas_Service: CarpetasService,
    private ingresarService: IngresarService,
    private router: Router,
    private route: ActivatedRoute,
    private commands: CommandsService,
    private _electronService: ElectronService,
    private _childProcessService: ChildProcessService) { }

  ngOnInit() {

    $('.modal').modal();
    $('#archivo_repetido').modal({
      dismissible: false
    })
    $('.tabs').tabs();
    $(".tabs .indicator ").css("background-color", "black");
    $('.dropdown-button').dropdown();
    (localStorage.getItem("carpeta_actual")) ? this.call_from_gerente_bridge() : this.call_from_proyectos()
  }

  padre_id(ruta) {
    var id = ""
    for (var i = ruta.length - 1; i > -1; i--) {
      if (ruta.charAt(i) == "\\") break
      else id += ruta.charAt(i)
    }

    return id.split("").reverse().join("")
  }


  set_flag(val) {
    this.flag = val
  }

  select_all() {
    (!this.flag) ? $('.chk').prop('checked', true) : $('.chk_carpeta').prop('checked', true)
  }

  unselect_all() {
    (!this.flag) ? $('.chk').prop('checked', false) : $('.chk_carpeta').prop('checked', false)
  }

  select() {
    (this.current_tab)
      ? this.set_flag_carpeta(false)
      : this.set_flag(false)
  }

  change_tab(tab) {
    if (tab) {
      this.set_flag(true)
      this.current_tab = true
    }
    else {
      this.set_flag_carpeta(true)
      this.current_tab = false
    }
  }

  call_from_gerente_bridge() {
    let carpeta_actual = JSON.parse(localStorage.getItem("carpeta_actual"))

    this.carpeta_actual.nombre_carpeta = carpeta_actual.nombre_carpeta
    this.carpeta_actual.ruta_padre = carpeta_actual.ruta
    this.Carpetas(this.carpeta_actual.ruta_padre)
    this.Archivos(this.carpeta_actual.ruta_padre)

    this.carpeta_lista.push({
      nombre_carpeta: this.carpeta_actual.nombre_carpeta,
      ruta_padre: this.carpeta_actual.ruta_padre
    })
  }

  get_name(carpeta) {
    var extension = ""
    for (var i = carpeta.ruta.length - 1; i > -1; i--) {
      if (carpeta.ruta.charAt(i) != '.') extension += carpeta.ruta.charAt(i)
      else break
    }
    carpeta["nombre_carpeta"] = this.invertir(extension)
  }

  call_from_proyectos() {
    let ruta = localStorage.getItem("ruta_proyecto")
    this.carpeta_actual.nombre_carpeta = "publico"
    this.carpeta_actual.ruta_padre = `${ruta}.publico`
    this.carpeta_lista.push({
      nombre_carpeta: this.carpeta_actual.nombre_carpeta,
      ruta_padre: this.carpeta_actual.ruta_padre
    })
    this.Carpetas(`${ruta}.publico`)
    this.Archivos(`${ruta}.publico`)
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

  Confirmar_Desenlazar() {
    $('#opciones').modal('close');
    this.archivos_eliminar = []
    let checkboxes = $('.chk:checkbox:checked')

    for (let i = 0; i < checkboxes.length; i++) {
      this.archivos_eliminar.push(checkboxes[i].attributes[4].nodeValue)
    }

    if (checkboxes.length == 0)
      Materialize.toast(`Debe elejir al menos un archivo`, 3000, 'red rounded');
    else {
      (checkboxes.length == 1)
        ? $('#mensaje_eliminar').text("¿Está seguro que desea eliminar este elemento?")
        : $('#mensaje_eliminar').text(`¿Está seguro que desea eliminar estos ${checkboxes.length} elementos?`);
      $('#desenlazar').modal('open');
    }
  }

  Archivos(ruta_padre) {
    this.Archivos_Service.Obtener_Archivos({ ruta_padre: ruta_padre }).subscribe(archivos => {

      archivos.forEach(archivo => {
        var extension = ""
        for (var i = archivo.nombre_archivo.length - 1; i > -1; i--) {
          if (archivo.nombre_archivo.charAt(i) != '.') extension += archivo.nombre_archivo.charAt(i)
          else break
        }

        archivo["extension"] = this.invertir(extension)
        archivo["nombre"] = archivo.nombre_archivo.substring(0, i)
      })
      this.archivos = archivos
    })
  }

  Carpetas(ruta) {
    this.Carpetas_Service.Obtener_Carpetas({ ruta: ruta }).subscribe(carpetas => {
      carpetas.forEach(element => {
        this.get_name(element)
      });
      this.carpetas = carpetas
    })
  }

  Abrir_Carpeta(carpeta) {
    this.carpeta_actual.ruta_padre = carpeta.ruta
    this.carpeta_actual.nombre_carpeta = carpeta.nombre_carpeta

    this.carpeta_lista.push({
      nombre_carpeta: this.carpeta_actual.nombre_carpeta,
      ruta_padre: this.carpeta_actual.ruta_padre
    })

    this.Carpetas(carpeta.ruta)
    this.Archivos(carpeta.ruta)
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


  Enlazar_Carpeta() {
    if ($('#nombre_carpeta').val().toUpperCase() == "PUBLICO" || $('#nombre_carpeta').val().toUpperCase() == "PRIVADO") {
      Materialize.toast(`Error, nombre invalido`, 3000, 'red rounded')
      return;
    }
    if ($('#nombre_carpeta').val() == "") {
      Materialize.toast('Debe agregar un nombre', 3000, 'red rounded')
      return;
    }
    else {
      var path = `${this.carpeta_actual.ruta_padre}.${$('#nombre_carpeta').val()}`
      let carpeta = {
        ruta: path,
        real_path: this.points_to_slash(path)
      }

      this.Carpetas_Service.Guardar_Carpeta(carpeta).subscribe(res => {
        if (res.success) {
          $('#modal1').modal('close');
          Materialize.toast('Carpeta Agregada', 3000, 'green rounded')
          this.Carpetas(this.carpeta_actual.ruta_padre)
          var nombre_aux = $("#nombre_carpeta").val()
          $("#nombre_carpeta").val("")

          const reporte = {
            nombre: localStorage.getItem('nombre') + ' (' + localStorage.getItem('dni') + ')',
            accion: 'Agregar',
            modulo: 'Carpetas',
            alterado: nombre_aux
          }

          this.reporteService.addReport(reporte).subscribe(data => {
            if (!data.success) {
              Materialize.toast('Error al guardar historial', 3000, 'red rounded')
            }
          })

        }
        else {
          if (res.err.code == "23505") {
            Materialize.toast(`La carpeta \"${$('#nombre_carpeta').val()}\" ya existe`, 3000, 'red rounded')
          }
          else Materialize.toast("error desconocido", 3000, 'red rounded')
        }

      })
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

  Enlazar_Archivos() {
    if (this.upload_files.length != 0) {

      let archivos = this.upload_files.map(file => {
        return {
          realPath: file.path,
          nombre_archivo: file.name,
          ruta_padre: this.carpeta_actual.ruta_padre
        };
      })
      const reporte = {
        nombre: localStorage.getItem('nombre') + ' (' + localStorage.getItem('dni') + ')',
        accion: 'Agregar',
        modulo: 'Archivos',
        alterado: 'NONE'
      }

      this.Archivos_Service.Guardar_Archivo(archivos).subscribe(res => {
        var flag = false
        var aux_arr = []
        var string_path = ""

        for (let i = 0; i < res.arr.length; i++) {
          if (!res.arr[i].success) {
            if (res.arr[i].err.code == "23505") {
              Materialize.toast(`El archivo "${this.upload_files[i].name}" ya existe`, 7000, 'red rounded')
              flag = true;
              aux_arr.push(false)
            }
          }
          else {
            string_path += `\"${archivos[i].realPath}\" `
            aux_arr.push(true)

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

        if (string_path != "") {
          var command_line = `for %I in (${string_path}) do copy %I ${this.points_to_slash(this.carpeta_actual.ruta_padre)}`
          this.commands.Exec_Command_Sync(command_line);
        }

        this.limpiar_upload_files(aux_arr);
        (!flag) ? $('#modal1').modal('close') : null;

        this.Archivos(this.carpeta_actual.ruta_padre)
      })
    }
    else Materialize.toast('Debe elegir al menos un archivo', 3000, 'red rounded')
  }

  // set_path(data) {
  //   data.forEach(e => {
  //     var userprofile = "%"
  //     var i;
  //     for (i = 0; i < e.ruta.length; i++) {
  //       if (e.ruta.charAt(i) == '.') break
  //       userprofile += e.ruta.charAt(i)
  //     }
  //     userprofile += "%"
  //     userprofile = `${userprofile}.${e.ruta.substring(i + 1, e.ruta.lenght)}`
  //     userprofile = userprofile.split('.').join('\\');
  //     e.ruta = userprofile
  //   });
  // }

  get_extension(archivo) {
    var extension = ""
    for (var i = archivo.nombre_archivo.length - 1; i > -1; i--) {
      if (archivo.nombre_archivo.charAt(i) != '.') extension += archivo.nombre_archivo.charAt(i)
      else break
    }
    archivo["extension"] = this.invertir(extension)
    archivo["nombre"] = archivo.nombre_archivo.substring(0, i)
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
    // var $el = $('#inputfile');
    // $el.wrap('<form>').closest('form').get(0).reset();
    // $el.unwrap();
  }

  Abrir_Archivo(file) {
    this.commands.Exec_Command_Sync(`start ${this.points_to_slash(file.ruta_padre)}\\\"${file.nombre_archivo}\"`)
    Materialize.toast('Abriendo archivo', 3000, 'green rounded')
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
        ruta: `${this.points_to_slash(this.carpeta_actual.ruta_padre)}\\`,
        nombre_archivo: `${checkboxes[i].attributes[4].nodeValue}`,
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
      this.commands.Exec_Command_Sync(`copy ${files[i].ruta}\"${files[i].nombre_archivo}\" %userprofile%\\Downloads\\\"${files[i].nombre_archivo.replace(files[i].ext, "")}_descarga${files[i].ext}\"`)
    }
  }

  Desenlazar_Archivo() {  //el archivo a desenlazar
    const reporte = {
      nombre: localStorage.getItem('nombre') + ' (' + localStorage.getItem('dni') + ')',
      accion: 'Desenlazar',
      modulo: 'Archivos',
      alterado: 'NONE'
    }

    let path_files = this.archivos_eliminar.map(file_name => {
      return `${this.points_to_slash(this.carpeta_actual.ruta_padre)}\\\"${file_name}\"`
    })

    this.Archivos_Service.Desenlazar_Archivo({
      files: this.archivos_eliminar,
      ruta_padre: this.carpeta_actual.ruta_padre,
      nombre_proyecto: localStorage.getItem("nombre_proyecto")
    }).subscribe(res => {
      if (res.success) {
        Materialize.toast(`Los archivos se desenlazaron correctamente`, 3000, 'green rounded')
        this.Archivos(this.carpeta_actual.ruta_padre)

        var path
        for (let i = 0; i < path_files.length; i++) {
          path = `move ${path_files[i]} %userprofile%\\Documents\\SistemaPROARINSA\\papelera`
          this.commands.Exec_Command_Sync(path)

          path = `ren %userprofile%\\Documents\\SistemaPROARINSA\\papelera\\\"${this.archivos_eliminar[i]}\" \"papelera${res.auto_increment.insert_archivos_papelera[i]}.${this.get_extension2(this.archivos_eliminar[i])}\"`
          this.commands.Exec_Command_Sync(path)
        }

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

  Expresion_Regular(event: any) {
    const pattern = /[a-zA-Z0-9_]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  atras() {
    if (this.carpeta_lista.length != 1) {
      this.carpeta_actual.nombre_carpeta = this.carpeta_lista[this.carpeta_lista.length - 2].nombre_carpeta
      this.carpeta_actual.ruta_padre = this.carpeta_lista[this.carpeta_lista.length - 2].ruta_padre
      this.carpeta_lista.splice(-1, 1)
      this.Carpetas(this.carpeta_actual.ruta_padre)
      this.Archivos(this.carpeta_actual.ruta_padre)
    }
    else {
      (this.ingresarService.isGerente())
        ? this.router.navigate(["/gerente_bridge"], { relativeTo: this.route })
        : this.router.navigate(["/proyecto"], { relativeTo: this.route })
    }
  }

  delete_upload_file(name) {
    for (var i = 0; i < this.upload_files.length; i++) {
      if (this.upload_files[i].name == name) break
    }
    this.upload_files.splice(i, 1);
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

  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

  mostar_editar_nombre_carpeta(num) {
    $("#tt" + num).css("display", "none")
    $("#ii" + num).css("display", "block")
    $("#input_carpeta" + num).focus()
  }

  get_path_destination_folder(origin, folder_name) {
    for (var i = origin.length; i > -1; i--) {
      if (origin.charAt(i) == '.') break;
    }
    return `${origin.substring(0, i)}.${folder_name}`
  }

  editar_nombre_carpeta(num, folder) {
    var new_name = $("#input_carpeta" + num).val()

    if (new_name == "") {
      Materialize.toast(`Error, debe ingresar un nombre`, 3000, 'red rounded')
      return;
    }

    if (new_name.toUpperCase() == "PUBLICO" || new_name.toUpperCase() == "PRIVADO") {
      Materialize.toast(`Error, nombre invalido`, 3000, 'red rounded')
      return;
    }

    let origin_slash = this.points_to_slash(folder.ruta)
    let origin_point = folder.ruta
    let destiny_point = this.get_path_destination_folder(folder.ruta, new_name)

    if (folder.nombre_carpeta != new_name) {
      this.Carpetas_Service.Editar_nombre_Carpeta({
        origin_slash: origin_slash,
        origin_point: origin_point,
        destiny_point: destiny_point,
        new_name: new_name
      }).subscribe(res => {

        if (res.success) {
          $("#ii" + num).css("display", "none")
          $("#tt" + num).css("display", "block")
          this.carpetas[num]["nombre_carpeta"] = new_name
          this.carpetas[num]["ruta"] = destiny_point
        }
        else Materialize.toast(`Error, ya existe una carpeta llamada "${new_name}"`, 3000, 'red rounded')
      })
    }
    else {
      $("#ii" + num).css("display", "none")
      $("#tt" + num).css("display", "block")
    }
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
      this.Archivos_Service.Cambiar_Nombre_Archivo({
        ruta_padre: file.ruta_padre,
        new_name: `${new_name}.${this.archivos[num]["extension"]}`,
        nombre_archivo: file.nombre_archivo,
        real_path: this.points_to_slash(file.ruta_padre)
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

  opciones() {
    let checkboxes = $('.chk:checkbox:checked')
    if (checkboxes.length != 0) {
      $('#opciones').modal('open');
    }
    else Materialize.toast('Debe elejir al menos un archivo para realizar esta acción', 3000, 'red rounded')
  }

  Confirmar_Mover_Archivos() {

    let checkboxes = $('.chk:checkbox:checked');
    if (checkboxes.length == 0)
      Materialize.toast(`Debe elejir al menos un archivo`, 3000, 'red rounded');
    else {
      this.Carpetas_Service.Obtener_Arbol({ ruta: localStorage.getItem("ruta_proyecto") }).subscribe(res => {

        $('#mcontent').html("")
        var arr = [];
        var cont = 0
        res.tree.forEach(node => {
          if (node.padre == res.nombre) {
            $('#mcontent').append('<li id="' + node.nombre_carpeta + cont + 'x">' +
              '<div class="collapsible-header"><i class="material-icons">folder</i>' +
              node.nombre_carpeta + '</div></li>'
            );
            this.id_padre(res.tree, node.nombre_carpeta, `${node.nombre_carpeta}${cont}x`)
            cont++
          }
          else {
            let li = $(`#${node.padre}`)
            li.append('<div class="collapsible-body">' +
              '<ul class="collapsible">' +
              '<li id="' + node.nombre_carpeta + cont + 'x">' +
              '<div class="collapsible-header"><i class="material-icons">folder</i>' +
              node.nombre_carpeta + '</div></li></ul></div>');
            this.id_padre(res.tree, node.nombre_carpeta, `${node.nombre_carpeta}${cont}x`)
            cont++
          }

          arr.push({ ruta: node.ruta, nombre_carpeta: node.nombre_carpeta, id: `${node.nombre_carpeta}${cont - 1}x` })
        });

        for (let i = 0; i < arr.length; i++) {
          if (this.carpeta_actual.nombre_carpeta != arr[i].nombre_carpeta) {
            document.getElementById(arr[i].id)
              .addEventListener("click", function (e) {
                e.stopPropagation()
                $('#carpeta_destino').val(arr[i].nombre_carpeta)
                $('#carpeta_oculta').val(arr[i].ruta)
              });
          }
          else {
            let child = $("#" + arr[i].id).children()[0]
            child.className += " blue-text";
            document.getElementById(arr[i].id)
              .addEventListener("click", function (e) {
                e.stopPropagation()
              });
          }
        }

        $('#carpeta_destino').val("");
        $('.collapsible').collapsible();
        $(".collapsible-header").addClass("active");
        $(".collapsible-body").css("display", "block");
        $(".expand-toggle").toggleClass("expanded");
        $('#opciones').modal('close');
        $('#tree').modal('open');

      });
    }
  }

  id_padre(tree, nombre_carpeta, id) {
    tree.forEach(e => {
      if (e.padre == nombre_carpeta) e.padre = id
    });
  }

  Mover_Archivos() {
    $('#tree').modal('close');
    this.archivos_mover = []
    let checkboxes = $('.chk:checkbox:checked')

    for (let i = 0; i < checkboxes.length; i++) {
      this.archivos_mover.push({
        ruta_padre: this.carpeta_actual.ruta_padre,
        nombre_archivo: checkboxes[i].attributes[4].nodeValue,
        origen: this.points_to_slash(this.carpeta_actual.ruta_padre)
      })
    }


    let destiny = $("#carpeta_oculta").val()
    this.Carpetas_Service.Mover_Archivos({ destiny: destiny, destino: this.points_to_slash(destiny), files: this.archivos_mover }).subscribe(res => {
      if (!res.success) {
        this.archivo_repetido = res
        $("#mensaje_archivo_repetido").text(`el destino ya tiene un archivo llamado "${res.nombre_archivo}"`)
        $('#archivo_repetido').modal('open');
      }
      else {
        this.flag = true
        this.Archivos(this.carpeta_actual.ruta_padre)
        this.set_flag(true)

        const reporte = {
          nombre: localStorage.getItem('nombre') + ' (' + localStorage.getItem('dni') + ')',
          accion: 'Mover',
          modulo: 'Archivos',
          alterado: 'NONE'
        }

        this.archivos_mover.forEach(e =>{
          reporte.alterado = e.nombre_archivo
          this.reporteService.addReport(reporte).subscribe(data => {
            if (!data.success) {
              Materialize.toast('Error al guardar historial', 3000, 'red rounded')
            }
          })
        })

      }
    })
  }

  rem_omi(opcion) {
    if (opcion == "reemplazar") {
      this.archivos_mover[this.archivo_repetido.pos][opcion] = true
      this.archivos_mover.splice(0, this.archivo_repetido.pos);
    }
    else {
      this.archivos_mover.splice(0, this.archivo_repetido.pos + 1);
    }

    if (this.archivos_mover.length != 0) {
      let destiny = $("#carpeta_oculta").val()

      this.Carpetas_Service.Mover_Archivos({ destiny: destiny, destino: this.points_to_slash(destiny), files: this.archivos_mover }).subscribe(res => {
        if (!res.success) {
          this.archivo_repetido = res
          $("#mensaje_archivo_repetido").text(`el destino ya tiene un archivo llamado "${res.nombre_archivo}"`)
        }
        else {
          $('#archivo_repetido').modal('close');
          this.flag = true
          this.Archivos(this.carpeta_actual.ruta_padre)
          this.set_flag(true)
        }
      })
    }
    else {
      $('#archivo_repetido').modal('close');
      this.flag = true
      this.Archivos(this.carpeta_actual.ruta_padre)
      this.set_flag(true)
    }

  }

  set_flag_carpeta(val) {
    this.flag_carpeta = val
  }

  Confimar_Eliminar_Carpeta() {
    this.carpetas_eliminar = []
    let checkboxes = $('.chk_carpeta:checkbox:checked');

    if (checkboxes.length == 0)
      Materialize.toast(`Debe elejir al menos un archivo`, 3000, 'red rounded');
    else {
      (checkboxes.length == 1)
        ? $('#mensaje_eliminar_carpeta').text("¿Está seguro que desea eliminar este elemento?")
        : $('#mensaje_eliminar_carpeta').text(`¿Está seguro que desea eliminar estos ${checkboxes.length} elementos?`);
      $('#Eliminar_carpeta').modal('open');
    }
  }

  Eliminar_Carpeta() {
    let checkboxes = $('.chk_carpeta:checkbox:checked');

    for (let i = 0; i < checkboxes.length; i++) {
      this.carpetas_eliminar.push({
        nombre_carpeta: this.carpetas[checkboxes[i].attributes[4].nodeValue].nombre_carpeta,
        ruta_points: this.carpetas[checkboxes[i].attributes[4].nodeValue].ruta,
        ruta_slash: this.points_to_slash(this.carpetas[checkboxes[i].attributes[4].nodeValue].ruta)
      })
    }
    this.Carpetas_Service.Eliminar_Carpeta({ carpetas: this.carpetas_eliminar, nombre_proyecto: localStorage.getItem("nombre_proyecto") }).subscribe(res => {
      this.Carpetas(this.carpeta_actual.ruta_padre)
      this.set_flag_carpeta(true)

      const reporte = {
        nombre: localStorage.getItem('nombre') + ' (' + localStorage.getItem('dni') + ')',
        accion: 'Desenlazar',
        modulo: 'Carpetas',
        alterado: 'NONE'
      }

      this.carpetas_eliminar.forEach(e => {
        reporte.alterado = e.nombre_carpeta
        this.reporteService.addReport(reporte).subscribe(data => {
          if (!data.success) {
            Materialize.toast('Error al guardar historial', 3000, 'red rounded')
          }
        })
      });

    })
  }

  Is_Gerente() {
    return (this.ingresarService.isGerente()) ? true : false
  }
}
