import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { AuthService } from 'src/app/services/auth-admin.services';
import { UsuariosComponent } from './usuarios/usuarios.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthService],
    children: [
      {path: '', component: UsuariosComponent},
      {path: 'usuarios', component: UsuariosComponent},
      {path: '**', redirectTo: 'usuarios', pathMatch: 'full'}
    ]
   },
   /* {

    path: '',
    canActivate: [AuthService],
    children: [ {
      path: 'usuarios',
      component: UsuariosComponent
    }]
  } */
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardAdminRoutingModule { }
