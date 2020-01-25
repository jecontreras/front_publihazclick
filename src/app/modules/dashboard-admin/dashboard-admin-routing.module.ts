import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth-admin.services';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ActividadesComponent } from './actividades/actividades.component';
import { NotificacionComponent } from './notificacion/notificacion.component';
import { RetirosComponent } from './retiros/retiros.component';
import { PuntosComponent } from './puntos/puntos.component';
import { PanelComponent } from './panel/panel.component';

const routes: Routes = [
  /* {
    path: '',
    component: MainComponent,
    canActivate: [AuthService],
    children: [
      {path: '', component: UsuariosComponent},
      {path: 'usuarios', component: UsuariosComponent},
      {path: 'actividades', component: ActividadesComponent}
    ]
   }, */
   {
    path: '',
    children: [
      {path: '', component: PanelComponent},
      {path: 'panel', component: PanelComponent},
      {path: 'usuarios', component: UsuariosComponent},
      {path: 'actividades', component: ActividadesComponent},
      {path: 'retiros', component: RetirosComponent},
      {path: 'notificacion', component: NotificacionComponent},
      {path: 'puntos', component: PuntosComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardAdminRoutingModule { }
