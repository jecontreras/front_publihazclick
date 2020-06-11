import { NgModule } from '@angular/core';
import { MyOwnCustomMaterialModule } from '../../../app.material.module';
import { MainComponent } from './main.component';
import { MainRoutingModule } from './main-routing.module';
import { HomeComponent } from './views/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { PublicacionComponent } from './components/publicacion/publicacion.component';
import { ActividadesComponent } from './components/actividades/actividades.component';
import { ConfiguracionesComponent } from './components/configuraciones/configuraciones.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReferidosComponent } from './components/referidos/referidos.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { RecaptchaModule } from 'ng-recaptcha';
import { MomentModule } from 'ngx-moment';
import { ReactiveFormsModule,  FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TableroComponent } from './components/tablero/tablero.component';
import { PaquetesComponent } from './components/paquetes/paquetes.component';
import { CompraFinalizadaComponent } from './views/compra-finalizada/compra-finalizada.component';
// import { PublicacionviewsComponent } from './components/publicacionviews/publicacionviews.component';
import { BancosComponent } from './components/bancos/bancos.component';
import { AdminComponent } from './components/admin/admin.component';
import { InvitarComponent } from './components/invitar/invitar.component';
import { QuejasComponent } from './components/quejas/quejas.component';
import { CalculadoraComponent } from './components/calculadora/calculadora.component';
import { AlertasComponent } from './components/alertas/alertas.component';
import { MenuLateralComponent } from './components/menu-lateral/menu-lateral.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { ShareModule } from '@ngx-share/core';
import { ViewPerfilComponent } from './components/view-perfil/view-perfil.component';
import { CategoriaComponent } from './components/categoria/categoria.component';
import { NgImageSliderModule } from 'ng-image-slider';
// Componentes

@NgModule({
  declarations: [
    MainComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    PublicacionComponent,
    ActividadesComponent,
    ConfiguracionesComponent,
    PerfilComponent,
    ReferidosComponent,
    TableroComponent,
    PaquetesComponent,
    CompraFinalizadaComponent,
    // PublicacionviewsComponent,
    BancosComponent,
    AdminComponent,
    InvitarComponent,
    QuejasComponent,
    CalculadoraComponent,
    CategoriaComponent,
    AlertasComponent,
    MenuLateralComponent,
    ViewPerfilComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),
    NgImageSliderModule,
    ShareModule,
    RouterModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MyOwnCustomMaterialModule,
    MainRoutingModule,
    FormsModule,
    RecaptchaModule,
    MomentModule
  ],
  providers: [
  ],
  bootstrap: [MainComponent]
})
export class DashboardModule { }
