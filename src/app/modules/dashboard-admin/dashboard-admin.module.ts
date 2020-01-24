import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DashboardAdminRoutingModule } from './dashboard-admin-routing.module';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ActividadesComponent } from './actividades/actividades.component';
import { PanelComponent } from './panel/panel.component';
import { MdModule } from '../md/md.module';

@NgModule({
  declarations: [UsuariosComponent, ActividadesComponent, PanelComponent],
  imports: [
    CommonModule,
    DashboardAdminRoutingModule,
    FormsModule,
    MdModule,
    ReactiveFormsModule
  ]
})
export class DashboardAdminModule { }
