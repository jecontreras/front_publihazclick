import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { HomeComponent } from './views/home/home.component';
import { PublicacionComponent } from './components/publicacion/publicacion.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { ActividadesComponent } from './components/actividades/actividades.component';
import { ConfiguracionesComponent } from './components/configuraciones/configuraciones.component';
import { AuthService } from '../../../services/auth.service';
import { TableroComponent } from './components/tablero/tablero.component';
import { ReferidosComponent } from './components/referidos/referidos.component';
import { PaquetesComponent } from './components/paquetes/paquetes.component';
// import { PublicacionviewsComponent } from './components/publicacionviews/publicacionviews.component';
import { BancosComponent } from './components/bancos/bancos.component';
import { AdminComponent } from './components/admin/admin.component';
import { InvitarComponent } from './components/invitar/invitar.component';
import { QuejasComponent } from './components/quejas/quejas.component';
import { CompraFinalizadaComponent } from './views/compra-finalizada/compra-finalizada.component';
import { CalculadoraComponent } from './components/calculadora/calculadora.component';
import { ViewPerfilComponent } from './components/view-perfil/view-perfil.component';

const dashboardRoutes: Routes = [
 {
   path: '',
   component: MainComponent,
   canActivate: [AuthService],
   children: [
     {path: '', redirectTo: 'home', pathMatch: 'full'},
     {path: 'publicacion', component: PublicacionComponent},
     {path: 'home', component: HomeComponent},
     {path: 'perfil', component: PerfilComponent },
     {path: 'tablero', component: TableroComponent },
     {path: 'actividades', component: ActividadesComponent },
     {path: 'configuraciones', component: ConfiguracionesComponent },
     {path: 'configuraciones/:confirmation', component: ConfiguracionesComponent },
     {path: 'referidos', component: ReferidosComponent},
     {path: 'paquetes', component: PaquetesComponent},
     {path: 'bancos', component: BancosComponent},
     {path: 'admin', component: AdminComponent},
     {path: 'lider', component: InvitarComponent},
     {path: 'calculadora', component: CalculadoraComponent},
     {path: 'quejas', component: QuejasComponent},
     {path: 'view_perfil/:id', component: ViewPerfilComponent},
     // {path: 'actividades/publicacionviews/:id', component: PublicacionviewsComponent},
     {path: 'compra-finalizada/:state/:paquete/:payu', component: CompraFinalizadaComponent},
     {path: '**', redirectTo: 'home', pathMatch: 'full'}
   ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
