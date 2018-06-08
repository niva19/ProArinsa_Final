var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
//var connectionString = 'postgres://postgres:database@localhost:5432/PROARINSADB';
//var connectionString = 'postgres://postgres:l53s@localhost:5432/PROARINSADB';
var connectionString = 'postgres://postgres:mio@localhost:8485/PROARINSADB';
//var connectionString = 'postgres://postgres:mio@localhost:5432/PROARINSADB';

var db = pgp(connectionString);

// METER CADA QUERIE DE CADA TABLA EN UNA .JS POR SEPARADO !!!!!!!!!!!!!!!!!!!!!!!!!

/*********************************************************************************
***************************** TRANSACCIONES DE LA BASE ***************************
************************************* DE DATOS ***********************************
**********************************************************************************/

//  ******************************** REPORTES ************************************
function limpiaReporte(req, res, next) {
  console.log('LIMPIANDO REPORTES')
  db.any('Delete from Historial where fecha < NOW() - INTERVAL \'31 days\'')
    .then(function (data) {
      res.status(200)
        .json({
          success: true
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getAllReportes(req, res, next) {
  db.any('select  to_char(fecha, \'yyyy/mm/dd\') as fecha, to_char(fecha, \'hh:mi:ss am\') as hora, nombre, accion, modulo, alterado from historial order by fecha desc, hora desc')
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function saveReporte(req, res, next) {
  db.none('insert into historial values(now(), ${nombre}, ${accion},${modulo},${alterado})',
    req.body)
    .then(() => {
      res.status(200)
        .json({
          success: true
        });
    })
    .catch((err) => {
      res.status(200)
        .json({
          success: false
        });
    })
}
//  ******************************** PLANILLA ************************************

function getAllWorkers(req, res, next) {
  db.any('select * from planilla where nombreProyecto = ${proyecto}', req.body)
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function saveWorker(req, res, next) {

  db.none('insert into Planilla values(${nombre}, ${apellidos}, ${dni}, ${puesto}, ${telefono}, ${fechaEntrada}, ${fechaSalida}, ${tipoSalario}, ${montoSalario}, ${nombreproyecto})',
    req.body)
    .then(() => {
      res.status(200)
        .json({
          success: true
        });
    })
    .catch((err) => {
      res.status(200)
        .json({
          success: false
        });
    })
}

function editWorker(req, res, next) {

  db.none('update Planilla set nombre = ${nombre}, apellidos = ${apellidos}, puesto = ${puesto}, telefono = ${telefono}, fechaEntrada = ${fechaEntrada}, fechaSalida = ${fechaSalida}, tipoSalario = ${tipoSalario}, montoSalario=${montoSalario} where dni = ${dni} and nombreproyecto = ${nombreproyecto}',
    req.body)
    .then(() => {
      res.status(200)
        .json({
          success: true
        });
    })
    .catch((err) => {
      res.status(200)
        .json({
          success: false
        });
    })
}

function getWorker(req, res, next) {

  db.any('select * from Planilla where dni=${dni}', req.body)
    .then((data) => {
      console.log(data);
      res.status(200)
        .json(data[0]);
    })
    .catch(function (err) {
      res.status(200)
        .json({
          success: false
        });
    });
}

function deleteWorker(req, res, next) {

  db.none('DELETE FROM Planilla WHERE dni = ${dni} and nombreproyecto = ${nombreproyecto}', req.body)
    .then(() => {
      res.status(200)
        .json({
          success: true
        });
    })
    .catch((err) => {
      res.status(200)
        .json({
          success: false
        });
    })
}

function searchWorkers(req, res, next) {

  db.any('select * from Planilla where ' + req.body.filtro + ' = ${parametro}', req.body)
    .then((data) => {
      console.log(data);
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      res.status(200)
        .json({
          success: false
        });
    });
}

//  ******************************** PROVEEDORES ************************************

function getAllProviders(req, res, next) {
  db.any('select * from Proveedor')
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function SaveProvider(req, res, next) {

  db.none('insert into Proveedor values(${empresa}, ${contacto}, ${telefono}, ${correo} , ${producto})',
    req.body)
    .then(() => {
      res.status(200)
        .json({
          success: true
        });
    })
    .catch((err) => {
      res.status(200)
        .json({
          success: false
        });
    })
}

function EditProvider(req, res, next) {

  db.none('UPDATE Proveedor SET empresa = ${empresa}, contacto = ${contacto}, telefono = ${telefono}, correo = ${correo}, producto = ${producto} where empresa = ${pk}',
    req.body)
    .then(() => {
      res.status(200)
        .json({
          success: true
        });
    })
    .catch((err) => {
      res.status(200)
        .json({
          success: false
        });
    })
}

function GetProvider(req, res, next) {

  db.any('select * from Proveedor where empresa=${empresa}', req.body)
    .then((data) => {
      console.log(data);
      res.status(200)
        .json(data[0]);
    })
    .catch(function (err) {
      res.status(200)
        .json({
          success: false
        });
    });
}

function DeleteProvider(req, res, next) {

  db.none('DELETE FROM Proveedor WHERE empresa = ${empresa}', req.body)
    .then(() => {
      res.status(200)
        .json({
          success: true
        });
    })
    .catch((err) => {
      res.status(200)
        .json({
          success: false
        });
    })
}

function SearchProviders(req, res, next) {

  db.any('select * from Proveedor where ' + req.body.filtro + ' = ${parametro}', req.body)
    .then((data) => {
      console.log(data);
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      res.status(200)
        .json({
          success: false
        });
    });
}


//  ******************************** CLIENTES ************************************

function getAllCustomers(req, res, next) {
  db.any('select nombre, apellidos, cedula, ruta from Cliente')
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function getdetailcustomer(req, res, next) {
  db.any('select direccion, telefono_trabajo, telefono_casa, celular, correo_personal, correo_empresarial from Cliente where cedula = ${cedula}', req.body)
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function SaveCustomer(req, res, next) {
  let path = `userprofile.Documents.SistemaPROARINSA.${req.body.cedula}`
  req.body["ruta"] = path
  db.none('insert into Cliente values(${nombre}, ${apellidos}, ${cedula}, ${direccion},${telefono_trabajo}, ${telefono_casa}, ${celular}, ${correo_personal}, ${correo_empresarial}, ${ruta})',
    req.body)
    .then(() => {
      res.status(200)
        .json({
          success: true
        });
    })
    .catch((err) => {
      res.status(200)
        .json({
          success: false
        });
    })
}

function EditCustomer(req, res, next) {
  db.none('UPDATE Cliente SET cedula = ${cedula}, ruta = ${ruta} ,nombre = ${nombre}, apellidos = ${apellidos}, direccion = ${direccion}, telefono_trabajo = ${telefono_trabajo}, telefono_casa = ${telefono_casa}, celular = ${celular}, correo_empresarial = ${correo_empresarial}, correo_personal = ${correo_personal} where cedula = ${key}',
    req.body)
    .then(() => {
      if (req.body.oldruta != req.body.ruta) {
        db.func('Update_Folders', [req.body.oldruta, req.body.ruta])
          .then(data => {

            db.any('select nombreproyecto, ruta from proyecto where cliente = ${cedula}', req.body)
              .then(proyects => {
                var info = proyects.map(e => {
                  var up = update_path_customer(e.ruta, req.body.cedula)
                  return { nombre_proyecto: e.nombreproyecto, up: up }
                });
                var json = JSON.stringify(info)
                db.func('update_customer_proyects', [json])
                  .then(() => {
                    res.status(200)
                      .json({ success: true });
                  })
                  .catch(error => {
                    res.status(200)
                      .json({
                        success: false
                      });
                  });
              })

          })
          .catch(error => {
            res.status(200)
              .json({
                success: false
              });
          });
      }
      else {
        res.status(200).json({ success: true });
      }
    })
    .catch((err) => {
      res.status(200)
        .json({
          success: false
        });
    })
}

function GetCustomer(req, res, next) {

  db.any('select * from Cliente where cedula=${cedula}', req.body)
    .then((data) => {
      console.log(data);
      res.status(200)
        .json(data[0]);
    })
    .catch(function (err) {
      res.status(200)
        .json({
          success: false
        });
    });
}

function DeleteCustomer(req, res, next) {

  db.none('DELETE FROM cliente WHERE cedula = ${cedula}', req.body)
    .then(() => {
      res.status(200)
        .json({
          success: true
        });
    })
    .catch((err) => {
      res.status(200)
        .json({
          success: false
        });
    })
}

function SearchCustomers(req, res, next) {

  db.any('select * from Cliente where ' + req.body.filtro + ' = ${parametro}', req.body)
    .then((data) => {
      console.log(data);
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      res.status(200)
        .json({
          success: false
        });
    });
}

function getCNA(req, res, next) {
  db.any('select cedula, nombre, apellidos from Cliente')
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}


//  ******************************** EMPLEADOS ************************************

function login(req, res, next) {
  db.any('select * from Usuario where usuario=${user} and contrasena=${password}',
    req.body)
    .then((data) => {
      console.log(data);
      res.status(200)
        .json({
          success: true, data: { nombre: data[0].nombre, dni: data[0].dni, isgerente: data[0].isgerente }
        });
    })
    .catch(function (err) {
      res.status(200)
        .json({
          success: false
        });
    });
}

function getAllEmployees(req, res, next) {
  console.log('Req: ', req)
  db.any('select * from Usuario')
    .then(function (data) {
      console.log(data)
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function getEmployeesCNA(req, res, next) {
  db.any('select cedula, nombre, apellidos from Empleado')
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function saveEmployee(req, res, next) {

  db.none('insert into Usuario values(${nombre}, ${apellidos}, ${dni}, ${direccion}, ${telefono}, ${correo}, ${usuario}, ${contrasena}, ${isgerente}, ${fechaentrada}, ${fechasalida}, ${tiposalario}, ${montosalario})',
    req.body)
    .then(() => {
      res.status(200)
        .json({
          success: true
        });
    })
    .catch((err) => {
      res.status(200)
        .json({
          success: false
        });
    })
}

function editEmployee(req, res, next) {

  db.none('update Usuario set nombre = ${nombre}, usuario = ${usuario}, apellidos = ${apellidos}, direccion = ${direccion}, correo = ${correo}, telefono = ${telefono}, contrasena = ${contrasena}, isgerente = ${isgerente}, fechaentrada = ${fechaentrada}, fechasalida = ${fechasalida}, tiposalario = ${tiposalario}, montosalario = ${montosalario} where dni = ${dni}',
    req.body)
    .then(() => {
      res.status(200)
        .json({
          success: true
        });
    })
    .catch((err) => {
      res.status(200)
        .json({
          success: false
        });
    })
}

function getEmployee(req, res, next) {

  db.any('select * from Usuario where dni=${dni}', req.body)
    .then((data) => {
      console.log(data);
      res.status(200)
        .json(data[0]);
    })
    .catch(function (err) {
      res.status(200)
        .json({
          success: false
        });
    });
}

function deleteEmployee(req, res, next) {

  db.none('DELETE FROM Usuario WHERE dni = ${dni}', req.body)
    .then(() => {
      res.status(200)
        .json({
          success: true
        });
    })
    .catch((err) => {
      res.status(200)
        .json({
          success: false
        });
    })
}

function searchEmployee(req, res, next) {

  db.any('select * from Empleado where ' + req.body.filtro + ' = ${parametro}', req.body)
    .then((data) => {
      console.log(data);
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      res.status(200)
        .json({
          success: false
        });
    });
}

//  ********************************* PROYECTO ************************************
function getAllProject(req, res, next) {
  db.any('select nombreProyecto, ruta from Proyecto where cliente = ${cedula}', req.body)
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}
// ---------- ARBOL DE CARPETAS ----------
var exec = require('child_process').exec;

function execute(command, callback) {
  exec(command, function (error, stdout, stderr) { callback(stdout); });
};

function saveProject(req, res, next) {
  db.task(function* (t) {

    var ruta_padre = yield t.any(`select ruta from Cliente where cedula = '${req.body.cliente}'`)
      .then(data => data[0].ruta)

    //EL NOMBRE SE JUNTA EN UNA SOLA CADENA
    var nomProy = req.body.nombreProyecto;
    //Separador: el split elimina los caracteres asignados a lo separadores
    var separador = " ";
    var nomJunto = nomProy.split(separador).join('');

    //LAS FECHAS SE JUNTA EN UNA SOLA CADENA
    var fecha = req.body.fechaInicio;
    //Separador: el split elimina los caracteres asignados a lo separadores
    var separador1 = " ";
    var separador2 = ", ";
    // Se logra el formato mes y año de las carpetas
    var mes = fecha.split(separador2).splice(0, 1).toString().split(separador1).pop();
    var anio = fecha.split(separador1).pop();

    var data_path = `${ruta_padre}.${anio}.${mes}.${nomJunto}`
    var path = points_to_slash(data_path)

    yield t.none('insert into Proyecto values(${nombreProyecto}, ${direccion}, ${tipoProyecto}, ${tipoObra}, ${descripcion}, ${fechaInicio}, ${fechaFinaliza}, ${estado}, ${banco}, ${cliente})',
      req.body)
      .then(() => {

        db.none('UPDATE Proyecto SET ruta = $1 WHERE nombreProyecto = $2', [data_path, req.body.nombreProyecto]);
        db.none("insert into Carpeta values('" + data_path + ".publico" + "')")
        db.none("insert into Carpeta values('" + data_path + ".privado" + "')")

        res.status(200)
          .json({
            success: true,
            ruta: path
          });
      })
      .catch((err) => {
        res.status(200)
          .json({
            success: false
          });
      })
  })
    .then(events => { })
    .catch(error => { });
}

function detailproject(req, res, next) {

  db.any('select direccion, tipoProyecto, tipoObra, descripcion, fechaInicio, fechaFinaliza, estado, banco from Proyecto where nombreProyecto = ${id}', req.body)
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function editProject(req, res, next) {
  db.none('UPDATE proyecto SET nombreProyecto = ${nombreProyecto}, direccion = ${direccion}, tipoproyecto = ${tipoProyecto}, tipoobra = ${tipoObra}, descripcion = ${descripcion}, fechainicio = ${fechaInicio}, fechafinaliza = ${fechaFinaliza}, estado = ${estado}, banco = ${banco}, ruta = ${ruta}  where nombreproyecto = ${key}',
    req.body)
    .then(() => {
      db.func('Update_Folders', [req.body.oldruta, req.body.ruta])
        .then(data => {
          res.status(200)
            .json({ success: true });
        })
        .catch(error => {
          res.status(200)
            .json({
              success: false
            });
        });
    })
    .catch((err) => {
      res.status(200)
        .json({
          success: false, err: err
        });
    })
}

function getProject(req, res, next) {

  db.any('select * from Proyecto where nombreproyecto=${nombreProyecto}', req.body)
    .then((data) => {
      console.log(data);
      res.status(200)
        .json(data[0]);
    })
    .catch(function (err) {
      res.status(200)
        .json({
          success: false
        });
    });
}

function deleteProject(req, res, next) {

  db.none('DELETE FROM Proyecto WHERE nombreproyecto = ${nombreProyecto}', req.body)
    .then(() => {
      res.status(200)
        .json({
          success: true
        });
    })
    .catch((err) => {
      res.status(200)
        .json({
          success: false
        });
    })
}

function searchProject(req, res, next) {

  db.any('select * from Proyecto where ' + req.body.filtro + ' = ${parametro}', req.body)
    .then((data) => {
      console.log(data);
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      res.status(200)
        .json({
          success: false
        });
    });
}

function savefiles(req, res, next) {
  db.task(function* (t) {
    var arr = []
    for (let i = 0; i < req.body.length; i++) {
      var file = req.body[i];
      let query_res = yield t.none('insert into Archivos values(${nombre_archivo}, ${ruta_padre})',
        file).then(val => {
          return { success: true }
        }).catch(err => {
          return { success: false, err: err }
        });
      arr.push(query_res);
    }

    res.status(200).json({ arr: arr });
  })
    .then(events => { })
    .catch(error => { });

}


function unlink(req, res, next) {//VALIDAR PARA POSIBLES ROLLBACKS
  var files = toObject(req.body.files);
  var json_files = JSON.stringify(files)

  db.func('insert_archivos_papelera', [json_files, req.body.ruta_padre, req.body.nombre_proyecto])
    .then(data => {
      res.status(200)
        .json({
          success: true,
          arr: req.body.files,
          auto_increment: data[0]
        });
    })
    .catch(error => {
      res.status(200)
        .json({
          success: false
        });
    });
}

function deletefile(req, res, next) {
  let ids = req.body.map(e => parseInt(e.id))
  db.func('delete_archivos_papelera', [ids])
    .then(data => {
      req.body.forEach(e => {
        let path = `del %userprofile%\\Documents\\SistemaPROARINSA\\papelera\\\"papelera${e.id}.${get_extension(e.nombre_archivo)}\"`
        require('child_process').execSync(path)
      })
      res.status(200)
        .json({
          success: true,
          arr: req.body
        });
    })
    .catch(error => {
      res.status(200)
        .json({
          success: false
        });
    });
}

function searchfiles(req, res, next) {
  console.log(req.body)
  db.any('select * from Archivos where ruta_padre = ${ruta_padre}', req.body)
    .then((data) => {
      console.log(data);
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      res.status(200)
        .json({
          success: false
        });
    });
}

function getunlinkfiles(req, res, next) {
  db.any('select * from archivos_papelera')
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function verifyduplicatefiles(req, res, next) {
  db.task(function* (t) {

    var arr = []
    for (let i = 0; i < req.body.length; i++) {
      var file = req.body[i];
      let query_res = yield t.any('select * from archivos where ruta_padre = ${ruta_padre} and nombre_carpeta = ${nombre_carpeta} and nombre_archivo = ${nombre_archivo}',
        file).then(vals => {
          return (vals.length == 1)
            ? { repeat: true, file: file }
            : { repeat: false, file: file }
        }).catch(err => {
          return { err: err, nombre_archivo: file.nombre_archivo }
        });
      arr.push(query_res);
    }

    res.status(200).json({ arr: arr });
  })
    .then(events => { })
    .catch(error => { });
}

function recoveryfile(req, res, next) {
  db.task(function* (t) {

    //Inicia verificar si existe archivo
    var not_repeat_files = [], repeat_files = []
    for (let x = 0; x < req.body.length; x++) {
      let exist = yield t.any(`select * from archivos where nombre_archivo = '${req.body[x].nombre_archivo}' and ruta_padre = '${req.body[x].ruta_padre}'`)
        .then(val => { return (val.length == 0) ? false : true });
      (!exist) ? not_repeat_files.push(req.body[x]) : repeat_files.push(req.body[x])
    }
    //Termina verificar si existe archivo


    //Inicia crear carpetas
    for (let j = 0; j < not_repeat_files.length; j++) {
      var update_full_path = not_repeat_files[j].ruta_padre;
      var carpeta_arr = []
      while (true) {
        let folder = yield t.any(`SELECT * FROM subltree ('${update_full_path}', nlevel('${update_full_path}')-1, nlevel('${update_full_path}'))`).then(val => val)
        if (folder[0].subltree != "publico" && folder[0].subltree != "privado") {
          let query_res = yield t.any(`SELECT * FROM carpeta WHERE ruta = '${update_full_path}'`).then(vals => {
            return (vals.length == 0) ? { father: false } : { father: true }
          })

          if (query_res.father) break;
          else {
            yield t.none(`insert into Carpeta values('${update_full_path}')`)
            let father = yield t.any(`select subltree from subltree('${update_full_path}',0,nlevel('${update_full_path}')-1)`)
            carpeta_arr.push(update_full_path)
            update_full_path = father[0].subltree
          }
        }
        else break
      }

      if (carpeta_arr.length != 0) {
        for (var i = carpeta_arr.length - 1; i > -1; i--) {
          require('child_process').execSync(`mkdir ${points_to_slash(carpeta_arr[i])}`)
        }
      }
    }
    //Termina crear carpetas


    if (not_repeat_files.length != 0) {
      var parameters = not_repeat_files.map(e => {
        return {
          nombre_archivo: e.nombre_archivo,
          ruta_padre: e.ruta_padre,
          id: parseInt(e.id)
        }
      })

      var json_files = JSON.stringify(parameters)

      db.func('recovery_proyecto_archivos', [json_files])
        .then(data => {
          not_repeat_files.forEach(e => {
            let path = `ren %userprofile%\\Documents\\SistemaPROARINSA\\papelera\\papelera${e.id}.${get_extension(e.nombre_archivo)} \"${e.nombre_archivo}\"`
            require('child_process').execSync(path)
            path = `move %userprofile%\\Documents\\SistemaPROARINSA\\papelera\\\"${e.nombre_archivo}\" ${e.ruta_slash}`
            require('child_process').execSync(path)
          })
          res.status(200)
            .json({
              success: true,
              repeat_files: repeat_files,
              not_repeat_files: not_repeat_files
            });
        })
        .catch(error => {
          res.status(200)
            .json({
              success: false
            });
        });
    }
    else {
      res.status(200)
        .json({
          success: true,
          repeat_files: repeat_files,
          not_repeat_files: not_repeat_files
        });
    }
  })
    .then(events => { })
    .catch(error => { });
}

function replacefiles(req, res, next) {
  let ids = req.body.map(e => parseInt(e.id))
  db.func('delete_archivos_papelera', [ids])
    .then(() => {
      req.body.forEach(e => {
        let path = `ren %userprofile%\\Documents\\SistemaPROARINSA\\papelera\\papelera${e.id}.${get_extension(e.nombre_archivo)} \"${e.nombre_archivo}\"`
        require('child_process').execSync(path)
        path = `move /y %userprofile%\\Documents\\SistemaPROARINSA\\papelera\\\"${e.nombre_archivo}\" ${e.ruta_slash}`
        require('child_process').execSync(path)
      })
      res.status(200)
        .json({
          success: true,
          files: req.body
        });
    })
    .catch(error => {
      res.status(200)
        .json({
          success: false
        });
    });
}

function movefiles(req, res, next) {
  db.task(function* (t) {
    for (let i = 0; i < req.body.files.length; i++) {
      var destiny = req.body.destiny
      var file = req.body.files[i];
      if (file.reemplazar) {
        let del = yield t.none(`delete from archivos where ruta_padre = '${file.ruta_padre}' and nombre_archivo = '${file.nombre_archivo}'`)

        let ax = yield execute(`del ${req.body.destino}\\\"${file.nombre_archivo}\"`, output => {
          return output
        });

        let bx = yield execute(`move ${file.origen}\\\"${file.nombre_archivo}\" ${req.body.destino}`, output => {
          return output
        });

      }
      else {
        let query_res = yield t.none(`update archivos set ruta_padre = '${destiny}' where ruta_padre = '${file.ruta_padre}' and nombre_archivo = '${file.nombre_archivo}'`)
          .then(() => {
            return { success: true }
          }).catch(err => {
            return { success: false, nombre_archivo: file.nombre_archivo, pos: i }
          });

        if (!query_res.success) {
          res.status(200).json(query_res);
          return;
        }
        else {
          let ax = yield execute(`move ${file.origen}\\\"${file.nombre_archivo}\" ${req.body.destino}`, output => {
            return output
          });
        }
      }
    }
    res.status(200).json({ success: true });
  })
    .then(events => { })
    .catch(error => { });
}

function changefilename(req, res, next) {
  db.none("update archivos set nombre_archivo = ${new_name} where ruta_padre = ${ruta_padre} and nombre_archivo = ${nombre_archivo}", req.body)
    .then(() => {
      let file = req.body
      let path = `ren ${file.real_path}\\\"${file.nombre_archivo}\" \"${file.new_name}\"`
      execute(path, output2 => { });
      res.status(200)
        .json({ success: true });
    })
    .catch(function (err) {
      res.status(200)
        .json({
          success: false
        });
    })
}

function editfoldername(req, res, next) {
  let folder = req.body
  db.func('Update_Folders', [folder.origin_point, folder.destiny_point])
    .then(data => {
      let path = `ren ${folder.origin_slash} ${folder.new_name}`
      execute(path, output2 => { });

      res.status(200)
        .json({ success: true });
    })
    .catch(error => {
      res.status(200)
        .json({
          success: false
        });
    });
}

function getfolders(req, res, next) {
  console.log("select * from carpeta where ruta ~ '" + req.body.ruta + ".*{1}'")
  db.any("select * from carpeta where ruta ~ '" + req.body.ruta + ".*{1}'")
    .then((data) => {
      console.log(data);
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      res.status(200)
        .json({
          success: false
        });
    });
}

function savefolder(req, res, next) {
  db.none('insert into Carpeta values(${ruta})', req.body)
    .then(() => {

      execute(`mkdir ${req.body.real_path}`, function (output) {
        console.log(output);
      });

      res.status(200)
        .json({
          success: true
        });
    })
    .catch((err) => {
      res.status(200)
        .json({
          err: err
        });
    })
}

function deletefolder(req, res, next) {
  var folders = req.body.carpetas.map(e => e.ruta_points)
  console.log("asd")

  db.func('delete_carpetas', [folders, req.body.nombre_proyecto])
    .then(data => {

      let folder_paths = req.body.carpetas.map(e => {
        return { ruta: e.ruta_slash, nombre_carpeta: e.nombre_carpeta }
      })
      var path

      for (let i = 0; i < folder_paths.length; i++) {
        path = `move ${folder_paths[i].ruta} %userprofile%\\Documents\\SistemaPROARINSA\\papelera`
        require('child_process').execSync(path)

        path = `ren %userprofile%\\Documents\\SistemaPROARINSA\\papelera\\${folder_paths[i].nombre_carpeta} papelera${data[0].delete_carpetas[i]}`
        require('child_process').execSync(path)
      }

      res.status(200)
        .json({
          success: true,
          arr: req.body.files
        });
    })
    .catch(error => {
      res.status(200)
        .json({
          success: false
        });
    });

}

function getfoldertree(req, res, next) {

  db.any("SELECT ruta, nlevel(ruta)," +
    "subpath(ruta,nlevel(ruta)-1) as nombre_carpeta," +
    "subltree(ruta,nlevel(ruta)-2 ,nlevel(ruta)-1) as padre " +
    "FROM carpeta WHERE ruta <@ '" + req.body.ruta + "' order by nlevel")
    .then((data) => {

      db.any("select * from subpath('" + req.body.ruta + "', nlevel('" + req.body.ruta + "')-1)")
        .then((nombre) => {
          res.status(200)
            .json({ tree: data, nombre: nombre[0].subpath });
        })
    })
    .catch(function (err) {
      res.status(200)
        .json({
          success: false
        });
    });
}

function getunlinkfolders(req, res, next) {
  db.any('select subltree(ruta, nlevel(ruta)-1, nlevel(ruta)) nombre_carpeta, ruta, nombreproyecto, id from Carpetas_Papelera')
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}
function deletepermanentfolder(req, res, next) {
  
  let ids = req.body.map(e => parseInt(e))
  db.func('delete_carpetas_papelera', [ids])
    .then(data => {
      req.body.forEach(e => {
        let path = `rd /s /q %userprofile%\\Documents\\SistemaPROARINSA\\papelera\\papelera${e}`
        require('child_process').execSync(path)
      })
      res.status(200)
        .json({
          success: true
        });
    })
    .catch(error => {
      res.status(200)
        .json({
          success: false
        });
    });
}
function recoveryfolders(req, res, next) {
  db.task(function* (t) {

    //Inicia verificar si existe carpeta
    var not_repeat_folders = [], repeat_folders = []
    for (let x = 0; x < req.body.length; x++) {
      let exist = yield t.any(`select * from carpeta where ruta = '${req.body[x].update_full_path}.${req.body[x].nombre_carpeta}'`)
        .then(val => { return (val.length == 0) ? false : true });
      (!exist) ? not_repeat_folders.push(req.body[x]) : repeat_folders.push(req.body[x])
    }
    var obj = JSON.stringify(toObject(not_repeat_folders))
    //Termina verificar si existe carpeta

    //Inicia crear carpetas

    for (let j = 0; j < not_repeat_folders.length; j++) {
      var update_full_path = not_repeat_folders[j].update_full_path;
      var carpeta_arr = []
      while (true) {
        let folder = yield t.any(`SELECT * FROM subltree ('${update_full_path}', nlevel('${update_full_path}')-1, nlevel('${update_full_path}'))`).then(val => val)
        if (folder[0].subltree != "publico" && folder[0].subltree != "privado") {
          let query_res = yield t.any(`SELECT * FROM carpeta WHERE ruta = '${update_full_path}'`).then(vals => {
            return (vals.length == 0) ? { father: false } : { father: true }
          })

          if (query_res.father) break;
          else {
            yield t.none(`insert into Carpeta values('${update_full_path}')`)
            let father = yield t.any(`select subltree from subltree('${update_full_path}',0,nlevel('${update_full_path}')-1)`)
            carpeta_arr.push(update_full_path)
            update_full_path = father[0].subltree
          }
        }
        else break
      }

      if (carpeta_arr.length != 0) {
        for (var i = carpeta_arr.length - 1; i > -1; i--) {
          require('child_process').execSync(`mkdir ${points_to_slash(carpeta_arr[i])}`)
        }
      }
    }
    //Termina crear carpetas


    //Inicia recuperar carpetas
    yield db.func('recovery_folders', [obj])
      .then(data => {
        not_repeat_folders.forEach(e => {
          let path = `ren %userprofile%\\Documents\\SistemaPROARINSA\\papelera\\papelera${e.id} ${e.nombre_carpeta}`
          require('child_process').execSync(path)
          path = `move %userprofile%\\Documents\\SistemaPROARINSA\\papelera\\${e.nombre_carpeta} ${e.slash_path}`
          require('child_process').execSync(path)
        })
        res.status(200)
          .json({
            success: true,
            repeat_folders: repeat_folders,
            not_repeat_folders: not_repeat_folders
          });
      })
      .catch(error => {
        res.status(200)
          .json({
            success: false
          });
      });
    //Termina recuperar carpetas

  })
    .then(events => { })
    .catch(error => { });
}

function replacefolders(req, res, next) {
  var ids = req.body.map(e => parseInt(e.id))
  var folders_path = req.body.map(e => `${e.update_full_path}.${e.nombre_carpeta}`)
  var obj = JSON.stringify(toObject(req.body
    .map(e => { return { id: e.id, update_path: e.update_path } })))


  db.func('delete_folder_permanently', [folders_path])
    .then(() => {
      db.func('recovery_folders', [obj])
        .then(() => {
          db.func('delete_carpetas_papelera', [ids])
            .then(() => {
              req.body.forEach(e => {
                let path = `rd /s /q ${e.slash_path}\\\"${e.nombre_carpeta}\"`
                require('child_process').execSync(path)
                path = `ren %userprofile%\\Documents\\SistemaPROARINSA\\papelera\\papelera${e.id} \"${e.nombre_carpeta}\"`
                require('child_process').execSync(path)
                path = `move %userprofile%\\Documents\\SistemaPROARINSA\\papelera\\\"${e.nombre_carpeta}\" ${e.slash_path}`
                require('child_process').execSync(path)
              })
              res.status(200)
                .json({
                  success: true,
                  folders: req.body
                });
            })
            .catch(error => {
              res.status(200)
                .json({
                  success: false
                });
            });
        })
        .catch(error => {
          res.status(200)
            .json({
              success: false
            });
        });
    })
    .catch(error => {
      res.status(200)
        .json({
          success: false
        });
    });

}

function get_path(req, res, next) {
  db.any('select ruta from cliente where cedula = ${cliente}', req.body)
    .then(data => {
      res.status(200)
        .json({ ruta: data[0].ruta });
    })
    .catch(function (err) {
      return next(err);
    });
}

function savecustomerfiles(req, res, next) {
  db.task(function* (t) {
    var arr = []
    for (let i = 0; i < req.body.length; i++) {
      var file = req.body[i];

      file.destiny = points_to_slash(file.destiny)

      let query_res = yield t.none('insert into Archivos_Cliente values(${nombre_archivo}, ${cedula})',
        file).then(val => {
          execute(`copy \"${file.realPath}\" ${file.destiny}`, output => output)
          return { success: true }
        }).catch(err => {
          return { success: false, err: err }
        });
      arr.push(query_res);
    }

    res.status(200).json({ arr: arr });
  })
    .then(events => { })
    .catch(error => { });
}

function getcustomerfiles(req, res, next) {
  db.any('select * from Archivos_Cliente where cedula = ${cliente}', req.body)
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function changecustomerfilename(req, res, next) {
  db.none("update Archivos_Cliente set nombre_archivo = ${new_name} where cedula = ${cedula} and nombre_archivo = ${nombre_archivo}", req.body)
    .then(() => {
      let file = req.body
      let path = `ren ${file.real_path}\\\"${file.nombre_archivo}\" \"${file.new_name}\"`
      execute(path, output2 => { });
      res.status(200)
        .json({ success: true });
    })
    .catch(function (err) {
      res.status(200)
        .json({
          success: false
        });
    })
}

function unlinkcustomerfiles(req, res, next) {
  var files = toObject(req.body.files);
  var json_files = JSON.stringify(files)

  db.func('insert_cliente_archivos_papelera', [json_files, req.body.ruta_padre])
    .then(data => {

      let path_files = req.body.path_files
      var path

      for (let i = 0; i < path_files.length; i++) {
        path = `move ${path_files[i]} %userprofile%\\Documents\\SistemaPROARINSA\\papelera`
        require('child_process').execSync(path)

        path = `ren %userprofile%\\Documents\\SistemaPROARINSA\\papelera\\\"${files[i]}\" \"clientepapelera${data[0].insert_cliente_archivos_papelera[i]}.${get_extension(files[i])}\"`
        require('child_process').execSync(path)
      }

      res.status(200)
        .json({
          success: true,
          arr: req.body.files
        });
    })
    .catch(error => {
      res.status(200)
        .json({
          success: false
        });
    });
}

function getunlinkcustomerfiles(req, res, next) {
  db.any(`select pl.id, pl.nombre_archivo, pl.cedula, cl.ruta from 
  (select id, nombre_archivo, cedula from archivos_cliente_papelera) as pl, cliente as cl
  where cl.cedula = pl.cedula`)
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function deletecustomerfile(req, res, next) {
  let ids = req.body.map(e => parseInt(e.id))
  db.func('delete_archivos_clientes_papelera', [ids])
    .then(() => {
      req.body.forEach(e => {
        let path = `del %userprofile%\\Documents\\SistemaPROARINSA\\papelera\\\"clientepapelera${e.id}.${get_extension(e.nombre_archivo)}\"`
        require('child_process').execSync(path)
      })
      res.status(200)
        .json({
          success: true,
          arr: req.body
        });
    })
    .catch(error => {
      res.status(200)
        .json({
          success: false
        });
    });
}

function recoverycustomerfile(req, res, next) {
  db.task(function* (t) {
    var not_repeat_files = [], repeat_files = []
    for (let x = 0; x < req.body.length; x++) {
      let exist = yield t.any(`select * from Archivos_Cliente where nombre_archivo = '${req.body[x].nombre_archivo}' and cedula = '${req.body[x].cedula}'`)
        .then(val => { return (val.length == 0) ? false : true });
      (!exist) ? not_repeat_files.push(req.body[x]) : repeat_files.push(req.body[x])
    }

    if (not_repeat_files.length != 0) {
      var parameters = not_repeat_files.map(e => {
        return {
          nombre_archivo: e.nombre_archivo,
          cedula: e.cedula,
          id: parseInt(e.id)
        }
      })

      var json_files = JSON.stringify(parameters)

      db.func('recovery_cliente_archivos', [json_files])
        .then(data => {

          not_repeat_files.forEach(e => {
            let path = `ren %userprofile%\\Documents\\SistemaPROARINSA\\papelera\\clientepapelera${e.id}.${get_extension(e.nombre_archivo)} \"${e.nombre_archivo}\"`
            require('child_process').execSync(path)
            path = `move %userprofile%\\Documents\\SistemaPROARINSA\\papelera\\\"${e.nombre_archivo}\" ${e.ruta_slash}\\archivos_cliente`
            require('child_process').execSync(path)
          })
          res.status(200)
            .json({
              success: true,
              repeat_files: repeat_files,
              not_repeat_files: not_repeat_files
            });
        })
        .catch(error => {
          res.status(200)
            .json({
              success: false
            });
        });
    }
    else {
      res.status(200)
        .json({
          success: true,
          repeat_files: repeat_files,
          not_repeat_files: not_repeat_files
        });
    }
  })
    .then(events => { })
    .catch(error => { });
}

function replacecustomerfile(req, res, next) {
  let ids = req.body.map(e => parseInt(e.id))
  db.func('delete_archivos_clientes_papelera', [ids])
    .then(() => {
      req.body.forEach(e => {
        let path = `ren %userprofile%\\Documents\\SistemaPROARINSA\\papelera\\clientepapelera${e.id}.${get_extension(e.nombre_archivo)} \"${e.nombre_archivo}\"`
        require('child_process').execSync(path)
        path = `move /y %userprofile%\\Documents\\SistemaPROARINSA\\papelera\\\"${e.nombre_archivo}\" ${e.ruta_slash}\\archivos_cliente`
        require('child_process').execSync(path)
      })
      res.status(200)
        .json({
          success: true,
          files: req.body
        });
    })
    .catch(error => {
      res.status(200)
        .json({
          success: false
        });
    });
}

/*FUNCIONES AUXILIARES*/

function get_extension(nombre_archivo) {
  var extension = ""
  for (var i = nombre_archivo.length - 1; i > -1; i--) {
    if (nombre_archivo.charAt(i) != '.') extension += nombre_archivo.charAt(i)
    else break
  }
  return invertir(extension)
}

function invertir(cadena) {
  var x = cadena.length;
  var cadenaInvertida = "";

  while (x >= 0) {
    cadenaInvertida += cadena.charAt(x);
    x--;
  }
  return cadenaInvertida;
}

function toObject(arr) {
  var rv = {};
  for (var i = 0; i < arr.length; ++i)
    rv[i] = arr[i];
  return rv;
}

function points_to_slash(str) {
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

function string_val(name, id) {
  var i;
  for (i = name.length - 1; i > -1; i--) {
    if (name.charAt(i) == '.') break
  }
  var pos = i
  var p1 = name.substring(0, pos);
  var p2 = name.substring(pos, name.length);
  return `${p1}papelera${id}${p2}`
}

function get_folder_name(path) {
  var name = ""
  var i
  for (i = path.length - 1; i > -1; i--) {
    if (path.charAt(i) == '\\') break
    else name += path.charAt(i)
  }

  var new_path = path.substring(0, i)

  let res = { nombre_carpeta: name.split("").reverse().join(""), ruta_padre: new_path }
  return res
}

function update_path_customer(ruta, new_ced) {
  var cont = 0;
  var p1, p2;
  for (var i = 0; i < ruta.length; i++) {
    if (ruta.charAt(i) == '.') cont++
    if (cont == 2) p1 = i
    if (cont == 4) {
      p2 = i
      break
    }
  }
  return ruta.substring(0, p1 + 2) + new_ced + ruta.substring(p2, ruta.length)
}

//  ********************************* ARCHIVOS ************************************

module.exports = {
  // REPORTES
  getAllReportes: getAllReportes,
  saveReporte: saveReporte,
  limpiaReporte: limpiaReporte,
  // PLANILLA 
  getAllWorkers: getAllWorkers,
  SaveWorker: saveWorker,
  EditWorker: editWorker,
  GetWorker: getWorker,
  DeleteWorker: deleteWorker,
  SearchWorkers: searchWorkers,
  // PROVEEDORES 
  getAllProviders: getAllProviders,
  SaveProvider: SaveProvider,
  EditProvider: EditProvider,
  GetProvider: GetProvider,
  DeleteProvider: DeleteProvider,
  SearchProviders: SearchProviders,
  // CLIENTES
  getAllCustomers: getAllCustomers,
  getdetailcustomer: getdetailcustomer,
  SaveCustomer: SaveCustomer,
  EditCustomer: EditCustomer,
  GetCustomer: GetCustomer,
  DeleteCustomer: DeleteCustomer,
  SearchCustomers: SearchCustomers,
  getCNA: getCNA,
  // EMPLEADOS
  login: login,
  getAllEmployees: getAllEmployees,
  saveEmployee: saveEmployee,
  editEmployee: editEmployee,
  getEmployee: getEmployee,
  deleteEmployee: deleteEmployee,
  searchEmployee: searchEmployee,
  getEmployeesCNA: getEmployeesCNA,
  // PROYECTOS
  getAllProject: getAllProject,
  saveProject: saveProject,
  editProject: editProject,
  getProject: getProject,
  deleteProject: deleteProject,
  searchProject: searchProject,
  detailproject: detailproject,
  savefiles: savefiles,
  searchfiles: searchfiles,
  deletefile: deletefile,
  unlink: unlink,
  getunlinkfiles: getunlinkfiles,
  recoveryfile: recoveryfile,
  replacefiles: replacefiles,
  verifyduplicatefiles: verifyduplicatefiles,
  changefilename: changefilename,
  getfolders: getfolders,
  savefolder: savefolder,
  deletefolder: deletefolder,
  getfoldertree: getfoldertree,
  movefiles: movefiles,
  editfoldername: editfoldername,
  getunlinkfolders: getunlinkfolders,
  deletepermanentfolder: deletepermanentfolder,
  recoveryfolders: recoveryfolders,
  replacefolders: replacefolders,
  savecustomerfiles: savecustomerfiles,
  getcustomerfiles: getcustomerfiles,
  get_path: get_path,
  changecustomerfilename: changecustomerfilename,
  unlinkcustomerfiles: unlinkcustomerfiles,
  getunlinkcustomerfiles: getunlinkcustomerfiles,
  deletecustomerfile: deletecustomerfile,
  recoverycustomerfile: recoverycustomerfile,
  replacecustomerfile: replacecustomerfile,

}