import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyOwnCustomMaterialModule } from './app.material.module';
import { LoginComponent } from './modules/dashboard-usuarios/components/login/login.component';
import { AuthService } from './services/auth.service';
import { RegistryComponent } from './modules/dashboard-usuarios/components/registry/registry.component';
import { MomentModule } from 'ngx-moment';
import { PublicacionviewsComponent } from './modules/dashboard-usuarios/components/publicacionviews/publicacionviews.component';

import { RecaptchaModule } from 'ng-recaptcha';
import { VerificacionComponent } from './modules/dashboard-usuarios/components/verificacion/verificacion.component';
import { InfoComponent } from './modules/dashboard-usuarios/components/info/info.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

import { ShareModule } from '@ngx-share/core';
import { AuthLayoutComponent } from './modules/layouts/auth/auth-layout.component';
import { AdminLayoutComponent } from './modules/layouts/admin/admin-layout.component';
import { NavbarModule } from './modules/shared/navbar/navbar.module';
import { FixedpluginModule } from './modules/shared/fixedplugin/fixedplugin.module';
import { SidebarModule } from './modules/sidebar/sidebar.module';
import { FooterModule } from './modules/shared/footer/footer.module';
import { PageStatusComponent } from './modules/layouts/page-status/page-status.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
const config: SocketIoConfig = {
  url: environment.wsUrl,
  options: {}
};
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistryComponent,
    PublicacionviewsComponent,
    VerificacionComponent,
    InfoComponent,
    AuthLayoutComponent,
    AdminLayoutComponent,
    PageStatusComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),
    SocketIoModule.forRoot(config),
    ShareModule,
    ReactiveFormsModule,
    FormsModule,
    MyOwnCustomMaterialModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RecaptchaModule,
    MomentModule,
    SidebarModule,
    NavbarModule,
    FooterModule,
    FixedpluginModule
  ],
  providers: [
    AuthService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
