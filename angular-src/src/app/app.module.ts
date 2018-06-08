import { BrowserModule } from '@angular/platform-browser'
import { CommonModule } from '@angular/common';
import { NgModule, OnInit } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'

import { AuthGuard } from './Guards/auth.guard'
import { GerenteGuard } from './Guards/gerente.guard'

import { AgmCoreModule } from '@agm/core';

import { AppComponent } from './app.component';
import { NgxElectronModule } from 'ngx-electron';
import { NgxChildProcessModule } from 'ngx-childprocess';
import { MaterializeModule } from 'angular2-materialize'
import { NgxPaginationModule } from 'ngx-pagination'

import { ClientesService } from './services/clientes.service'
import { IngresarService } from './services/ingresar.service'
import { EmpleadosService } from './services/empleados.service'
import { ProyectosService } from './services/proyectos.service'
import { ProveedoresService } from './services/proveedores.service'
import { PlanillaService } from './services/planilla.service'
import { CarpetasService } from './services/carpetas.service'
import { ArchivosService } from './services/archivos.service'
import { ReporteService } from './services/reporte.service'
import { ClienteArchivosService } from './services/cliente-archivos.service'
import { CommandsService } from './services/commands.service'

import { ClienteComponent } from './Components/cliente/cliente.component';
import { ArchivosComponent } from './Components/archivos/archivos.component';
import { ClienteArchivosComponent } from './Components/cliente-archivos/cliente-archivos.component';
import { EmpleadosComponent } from './Components/empleados/empleados.component';
import { FooterComponent } from './Components/footer/footer.component';
import { GerenteBridgeComponent } from './Components/gerente-bridge/gerente-bridge.component';
import { GoogleComponent } from './Components/google/google.component';
import { HistorialComponent } from './Components/historial/historial.component';
import { IngresarComponent } from './Components/ingresar/ingresar.component';
import { MainPageComponent } from './Components/main-page/main-page.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { PlanillaComponent } from './Components/planilla/planilla.component';
import { ProveedoresComponent } from './Components/proveedores/proveedores.component';
import { ProyectosComponent } from './Components/proyectos/proyectos.component';
import { ReporteComponent } from './Components/reporte/reporte.component';

import { FilterClientePipe } from './Filters/filter-cliente.pipe';
import { FilterEmpleadoPipe } from './Filters/filter-empleado.pipe';
import { FilterPlanillaPipe } from './Filters/filter-planilla.pipe';
import { FilterProveedorPipe } from './Filters/filter-proveedor.pipe';
import { FilterProyectoPipe } from './Filters/filter-proyecto.pipe';
import { FilterReportePipe } from './Filters/filter-reporte.pipe';
import { FilterClienteArchivosPipe } from './Filters/filter-cliente-archivos.pipe';
import { FilterCarpetasProyectoPipe } from './Filters/filter-carpetas-proyecto.pipe';
import { FilterArchivosProyectoPipe } from './Filters/filter-archivos-proyecto.pipe';
import { FilterCarpetasPapeleraPipe } from './Filters/filter-carpetas-papelera.pipe';
import { FilterArchivosProyectoPapeleraPipe } from './Filters/filter-archivos-proyecto-papelera.pipe';
import { FilterArchivosPapeleraPipe } from './Filters/filter-archivos-papelera.pipe';

const appRoutes: Routes = [
  { path: '', component: ClienteComponent, canActivate: [AuthGuard]},
  { path: 'cliente', component: ClienteComponent, canActivate: [AuthGuard] },
  { path: 'inicio', component: MainPageComponent },
  { path: 'ingresar', component: IngresarComponent },
  { path: 'historial', component: HistorialComponent, canActivate: [AuthGuard, GerenteGuard] },
  { path: 'archivos', component: ArchivosComponent },
  { path: 'gerente_bridge', component: GerenteBridgeComponent },
  { path: 'empleado', component: EmpleadosComponent, canActivate: [AuthGuard, GerenteGuard] },
  { path: 'proyecto', component: ProyectosComponent, canActivate: [AuthGuard] },
  { path: 'google', component: GoogleComponent, canActivate: [AuthGuard] },
  { path: 'planilla', component: PlanillaComponent },
  { path: 'proveedores', component: ProveedoresComponent },
  { path: 'reporte', component: ReporteComponent },
  { path: 'cliente_archivos', component: ClienteArchivosComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    ClienteComponent,
    ArchivosComponent,
    ClienteArchivosComponent,
    EmpleadosComponent,
    FooterComponent,
    GerenteBridgeComponent,
    GoogleComponent,
    HistorialComponent,
    IngresarComponent,
    MainPageComponent,
    NavbarComponent,
    PlanillaComponent,
    ProveedoresComponent,
    ProyectosComponent,
    ReporteComponent,
    FilterClientePipe,
    FilterEmpleadoPipe,
    FilterPlanillaPipe,
    FilterProveedorPipe,
    FilterProyectoPipe,
    FilterReportePipe,
    FilterClienteArchivosPipe,
    FilterCarpetasProyectoPipe,
    FilterArchivosProyectoPipe,
    FilterCarpetasPapeleraPipe,
    FilterArchivosProyectoPapeleraPipe,
    FilterArchivosPapeleraPipe
  ],
  imports: [
    CommonModule,
    BrowserModule,
    NgxElectronModule,
    NgxChildProcessModule,
    MaterializeModule,
    NgxPaginationModule,
    RouterModule.forRoot(appRoutes),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCojg33P1ZSFRgnjLFJqAtivnT1bm_krRU'
    }),
    FormsModule,
    HttpClientModule
  ],
  providers: [ProveedoresService, PlanillaService, ClientesService, IngresarService, EmpleadosService, ClienteArchivosService,
    ProyectosService, ReporteService, CarpetasService, ArchivosService, AuthGuard, GerenteGuard, CommandsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
