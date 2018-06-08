var express = require('express');
var router = express.Router();

var db = require('../queries');

//Planilla
// ------------ GET PLANILLA
router.post('/api/workers', db.getAllWorkers);
// ------------ SALVAR PLANILLA
router.post('/api/saveworker', db.SaveWorker);
// ------------ EDITAR PLANILLA
router.put('/api/workers', db.EditWorker);
// ------------ GET PLANILLA
router.post('/api/getworker', db.GetWorker);
// ------------ EDITAR PLANILLA
router.post('/api/deleteworkers', db.DeleteWorker);
// ------------ BUSCAR PLANILLA
router.post('/api/searchworkers', db.SearchWorkers);

//Proveedores
// ------------ GET PROVEEDORES
router.get('/api/providers', db.getAllProviders);
// ------------ SALVAR PROVEEDOR
router.post('/api/providers', db.SaveProvider);
// ------------ EDITAR PROVEEDOR
router.put('/api/providers', db.EditProvider);
// ------------ GET PROVEEDOR
router.post('/api/getprovider', db.GetProvider);
// ------------ EDITAR PROVEEDOR
router.post('/api/deleteproviders', db.DeleteProvider);
// ------------ BUSCAR PROVEEDORES
router.post('/api/searchproviders', db.SearchProviders);

//Clientes
// ------------ GET CLIENTES
router.get('/api/customers', db.getAllCustomers);
router.post('/api/getdetailcustomer', db.getdetailcustomer);
// ------------ SALVAR CLIENTE
router.post('/api/customers', db.SaveCustomer);
// ------------ EDITAR CLIENTE
router.put('/api/customers', db.EditCustomer);
// ------------ GET CLIENTE
router.post('/api/getcustomer', db.GetCustomer);
// ------------ EDITAR CLIENTE
router.post('/api/deletecustomers', db.DeleteCustomer);
// ------------ BUSCAR CLIENTES
router.post('/api/searchcustomers', db.SearchCustomers);
// ------------ BUSCAR CLIENTES SOLO CON NOMBRE, APELLIDOS Y CEDULA
router.get('/api/customerscna', db.getCNA);

//Empleados

// ------------ LOG IN 
router.post('/api/empleados', db.login);
// ------------ GET EMPLEADOS 
router.get('/api/getemployees', db.getAllEmployees);
// ------------ SALVAR EMPLEADOS
router.post('/api/saveemployee', db.saveEmployee);
// ------------ EDITAR EMPLEADO
router.put('/api/editemployee', db.editEmployee);
// ------------ GET EMPLEADO
router.post('/api/getemployee', db.getEmployee);
// ------------ ELIMINAR EMPLEADO
router.post('/api/deleteemployee', db.deleteEmployee);
// ------------ BUSCAR EMPLEADO
router.post('/api/searchemployee', db.searchEmployee);
// ------------ BUSCAR CLIENTES SOLO CON NOMBRE, APELLIDOS Y CEDULA
router.get('/api/employeescna', db.getEmployeesCNA);

//Proyectos

// ------------ GET PROYECTOS 
router.post('/api/getprojects', db.getAllProject);
// ------------ SALVAR PROYECTOS
router.post('/api/saveproject', db.saveProject);
// ------------ EDITAR PROYECTOS
router.put('/api/editproject', db.editProject);
// ------------ GET PROYECTOS
router.post('/api/getproject', db.getProject);
// ------------ ELIMINAR PROYECTOS
router.post('/api/deleteproject', db.deleteProject);
// ------------ BUSCAR PROYECTOS
router.post('/api/searchproject', db.searchProject);
// ------------ GUARDAR ARCHIVOS
router.post('/api/savefiles', db.savefiles);

router.post('/api/detailproject', db.detailproject);

//------------- GET REPORTES
router.get('/api/getreportes', db.getAllReportes);
router.get('/api/limpiareport', db.limpiaReporte);
router.post('/api/savereport', db.saveReporte);

// ------------ BUSCAR ARCHIVOS
router.post('/api/searchfiles', db.searchfiles);

router.post('/api/deletefile', db.deletefile);

router.post('/api/unlink', db.unlink);

router.get('/api/getunlinkfiles', db.getunlinkfiles); 

router.post('/api/recoveryfile', db.recoveryfile); 

router.post('/api/replacefiles', db.replacefiles);

router.post('/api/searchfiles', db.searchfiles);

router.post('/api/verifyduplicatefiles', db.verifyduplicatefiles);

router.post('/api/changefilename', db.changefilename);

//Carpetas
router.post('/api/getfolders', db.getfolders);

router.post('/api/savefolder', db.savefolder);

router.post('/api/deletefolder', db.deletefolder);

router.post('/api/getfoldertree', db.getfoldertree);

router.post('/api/movefiles', db.movefiles);

router.post('/api/editfoldername', db.editfoldername)

router.get('/api/getunlinkfolders', db.getunlinkfolders)

router.post('/api/deletepermanentfolder', db.deletepermanentfolder)

router.post('/api/recoveryfolders', db.recoveryfolders)

router.post('/api/replacefolders', db.replacefolders)

//Archivos_clientes
router.post('/api/savecustomerfiles', db.savecustomerfiles)

router.post('/api/getcustomerfiles', db.getcustomerfiles)

router.post('/api/getpath', db.get_path)

router.post('/api/changecustomerfilename', db.changecustomerfilename)

router.post('/api/unlinkcustomerfiles', db.unlinkcustomerfiles)

router.get('/api/getunlinkcustomerfiles', db.getunlinkcustomerfiles)

router.post('/api/deletecustomerfile', db.deletecustomerfile)

router.post('/api/recoverycustomerfile', db.recoverycustomerfile)

router.post('/api/replacecustomerfile', db.replacecustomerfile)

module.exports = router;