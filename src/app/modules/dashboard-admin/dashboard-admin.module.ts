import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DashboardAdminRoutingModule } from './dashboard-admin-routing.module';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ActividadesComponent } from './actividades/actividades.component';
import { RetirosComponent } from './retiros/retiros.component';
import { NotificacionComponent } from './notificacion/notificacion.component';
import { PuntosComponent } from './puntos/puntos.component';

@NgModule({
  declarations: [UsuariosComponent, ActividadesComponent, RetirosComponent, NotificacionComponent, PuntosComponent],
  imports: [
    CommonModule,
    DashboardAdminRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DashboardAdminModule { }
