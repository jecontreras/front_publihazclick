import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistryComponent } from './components/registry/registry.component';
import { VerificacionComponent } from './components/verificacion/verificacion.component';
import { PublicacionviewsComponent } from './components/publicacionviews/publicacionviews.component';
import { InfoComponent } from './components/info/info.component';

const routes: Routes = [
  { path: '', component: InfoComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistryComponent },
  { path: 'registro/:username', component: RegistryComponent },
  { path: 'verificacion/:id', component: VerificacionComponent },
  { path: 'publicacionviews/:id', component: PublicacionviewsComponent },
  { path: 'publicacionviews/:id/:ids', component: PublicacionviewsComponent },
  { path: 'info/:username', component: InfoComponent },
  { path: 'info', component: InfoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
