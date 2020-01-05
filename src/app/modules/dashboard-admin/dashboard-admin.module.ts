import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DashboardAdminRoutingModule } from './dashboard-admin-routing.module';
import { MainComponent } from './main/main.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

@NgModule({
  declarations: [MainComponent, UsuariosComponent],
  imports: [
    CommonModule,
    DashboardAdminRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DashboardAdminModule { }
