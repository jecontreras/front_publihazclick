import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DashboardAdminRoutingModule } from './dashboard-admin-routing.module';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ActividadesComponent } from './actividades/actividades.component';

@NgModule({
  declarations: [UsuariosComponent, ActividadesComponent],
  imports: [
    CommonModule,
    DashboardAdminRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DashboardAdminModule { }
