import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './modules/dashboard-usuarios/components/login/login.component';
import { RegistryComponent } from './modules/dashboard-usuarios/components/registry/registry.component';
import { VerificacionComponent } from './modules/dashboard-usuarios/components/verificacion/verificacion.component';
import { PublicacionviewsComponent } from './modules/dashboard-usuarios/components/publicacionviews/publicacionviews.component';
import { InfoComponent } from './modules/dashboard-usuarios/components/info/info.component';
import { AuthLayoutComponent } from './modules/layouts/auth/auth-layout.component';
import { AdminLayoutComponent } from './modules/layouts/admin/admin-layout.component';
import { AuthService } from './services/auth-admin.services';
import { PortadaComponent } from './modules/layouts/portada/portada.component';


const routes: Routes = [
  { path: '', component: InfoComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistryComponent },
  { path: 'registro/:username', component: RegistryComponent },
  { path: 'portada/:username', component: PortadaComponent},
  { path: 'verificacion/:id', component: VerificacionComponent },
  { path: 'publicacionviews/:id', component: PublicacionviewsComponent },
  { path: 'publicacionviews/:id/:ids', component: PublicacionviewsComponent },
  { path: 'info/:username', component: InfoComponent },
  { path: 'info', component: InfoComponent },
  {
    path: 'dashboard', 
    children: [{
      path: '',
      loadChildren: './modules/dashboard-usuarios/dashboard-user/dashboard.module#DashboardModule'
    }]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthService],
    children: [{
      path: 'dashboard-admin',
      loadChildren: './modules/dashboard-admin/dashboard-admin.module#DashboardAdminModule'
    }]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [AuthService],
    children: [{
      path: 'pages',
      loadChildren: './modules/pages/pages.module#PagesModule'
    }]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
