import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// Modulos
import { DashboardModule } from './dashboard-user/dashboard.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyOwnCustomMaterialModule } from './app.material.module';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './services/auth.service';
import { RegistryComponent } from './components/registry/registry.component';
import { MomentModule } from 'ngx-moment';
import { PublicacionviewsComponent } from './components/publicacionviews/publicacionviews.component';

import { RecaptchaModule } from 'ng-recaptcha';
import { VerificacionComponent } from './components/verificacion/verificacion.component';
import { InfoComponent } from './components/info/info.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

import { ShareModule } from '@ngx-share/core';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistryComponent,
    PublicacionviewsComponent,
    VerificacionComponent,
    InfoComponent
  ],
  imports: [
    HttpClientModule,
    FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),
    ShareModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    MyOwnCustomMaterialModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DashboardModule,
    RecaptchaModule,
    MomentModule
  ],
  providers: [
    AuthService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
