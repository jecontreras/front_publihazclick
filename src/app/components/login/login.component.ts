import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { ToolsService } from 'src/app/dashboard-user/services/tools.service';
import { FactoryModelService } from 'src/app/dashboard-user/services/factory-model.service';
import * as _ from 'lodash';
import { GLOBAL } from './../../services/global';
import swal from 'sweetalert';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  public user;
  public response: any;
  public url: string;
  public loginForm: FormGroup;
  public loading = false;
  public submitted = false;
  public reContrasena: boolean = false;
  public returnUrl: string;
  public disabledemail: boolean = true;
  public disabled: any = false;
  public data: any = {};
  // public _publicacion: any;
  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private _userService: UserService,
      private _authSrvice: AuthService,
      private _tools: ToolsService,
      private _model: FactoryModelService
  ) {
    this.user = {};
    if (this._authSrvice.isLoggedIn()) {
      this.router.navigate(['dashboard']);
    }
    // this._model.query('user', false)
    // .subscribe(
    //   (response: any) => {
    //     console.log(response);
    //     response = response.data;
    //       if (response.length > 0) {
    //         return true;
    //       } else {
    //         // this.crearRolDefault();
    //       }
    //   },
    //   (error: any) => {
    //       console.log('Error', error);
    //   }
    // );
    this.url = GLOBAL.url;
  }

  ngOnInit() {
      this.loginForm = this.formBuilder.group({
          username: ['', Validators.required],
          password: ['', Validators.required]
      });
      // this._model.query('paquete', {})
      // .subscribe(
      //   (response: any) => {
      //     console.log(response);
      //     response = response.data;
      //       // if (response.length > 0) {
      //       //   return true;
      //       // } else {
      //       //   this.crearPaquetes();
      //       // }
      //   },
      //   (error: any) => {
      //       console.log('Error', error);
      //   }
      // );
      // // get return url from route parameters or default to '/'
      // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  validadEmail(){
    const
      data: any = this.data
    ;
    this.disabledemail = true;
    if(data.email){
      const
        filtro: any = data.email.split('@', '2')
      ;
      // console.log(filtro);
      if(filtro[1] !== 'gmail.com'){
        this.disabledemail = false;
      }
    }
  }
  submitCorreo(){
    const
      data: any = this.data
    ;
    this._model.query('user/correo',{
      where:{
        email: data.email
      }
    })
    .subscribe(
      (res: any)=>{
        // console.log(res);
        if(res.status === 200){
          swal( 'ok' ,  'Se Te a Enviado una Clave a tu correo!' ,  'success' );
          this.reContrasena = false;
          this.data = {};
        }else{
          swal( 'Oops' ,  'La Contraseña son incorrectos!' ,  'error' );
        }
        return res;
      }
    );
  }

  get f() { return this.loginForm.controls; }
  resolved(obj) {
    // console.log(obj);
    if (obj) {
      this.disabled = true;
    } else {
      this.disabled = false;
    }
  }
  onSubmit() {
    if (this.disabled) {
      this._userService.login(this.loginForm.value).subscribe(
        (response: any) => {
          if (response.success) {
            // console.log(response);
            localStorage.setItem('user', JSON.stringify(response.data));
            this.router.navigate(['dashboard']);
          } else {
            swal( 'Oops' ,  'El usuario o la contraseña son incorrectos!' ,  'error' );
          }
        },
        error => {
          swal( 'Error' ,  'Problema con el servidor!' ,  'error' );
          console.log(<any>error);
        }
      );
    }
    // this.user = this.userService.login()
      // this.submitted = true;
      //
      // // stop here if form is invalid
      // if (this.loginForm.invalid) {
      //     return;
      // }
      //
      // this.loading = true;
      // // this.authenticationService.login(this.f.username.value, this.f.password.value)
      // //     .pipe(first())
      // //     .subscribe(
      // //         data => {
      // //             this.router.navigate([this.returnUrl]);
      // //         },
      // //         error => {
      // //             this.alertService.error(error);
      // //             this.loading = false;
      // //         });

  }




  // form:FormGroup;
  // constructor(private fb:FormBuilder,
  //               private authService: AuthService,
  //               private router: Router) {
  //
  //      this.form = this.fb.group({
  //          email: ['',Validators.required],
  //          password: ['',Validators.required]
  //      });
  //  }
  //
  // ngOnInit() {
  // }
  //
  // login() {
  //       const val = this.form.value;
  //
  //       if (val.email && val.password) {
  //           this.authService.login(val.email, val.password)
  //               .subscribe(
  //                   () => {
  //                       console.log("User is logged in");
  //                       this.router.navigateByUrl('/');
  //                   }
  //               );
  //       }
  //   }
  /* private crearRolDefault() {
    const roles = [
      {nombre: 'user', descripcion: 'rol general para los usuarios'},
      {nombre: 'admin', descripcion: 'rol general para los administradores'}
    ];
    _.forEach(roles, (item: any) => {
      this._model.create('rol', item)
      .subscribe(
        (response: any) => {
            this._tools.openSnack('Roles creados', 'ok', false);
            console.log(response);
            // this.crearNiveles();
        },
        (error: any) => {
            console.log('Error', error);
        }
      );
    });
  }
  private crearUserDefault() {
    const users = [
      {
        name: 'origin',
        lastname: 'origin',
        username: 'origin',
        email: 'luisalbertoj.tober@gmail.com',
        password: '16132243',
        codigo: '123'
      }
    ];
    _.forEach(users, (item: any) => {
      this._model.create('user', item)
      .subscribe(
        (response: any) => {
            this._tools.openSnack('Usuarios creados', 'ok', false);
            console.log(response);
        },
        (error: any) => {
            console.log('Error', error);
        }
      );
    });
  }
  private crearNiveles() {
    const niveles = [
      {title: 'GRATUITO', minretiro: 35000, referidos: 0, countminireg: 0, requiredcountmini:0 },
      {title: 'JADE', minretiro: 35000, referidos: 1, coinclickreferido: 20, countminireg: 1, requiredcountmini: 0},
      {title: 'PERLA', minretiro: 50000, referidos: 3, coinclickreferido: 20, countminireg: 1, requiredcountmini: 0},
      {title: 'ZAFIRO', minretiro: 100000, referidos: 6, coinclickreferido: 30, countminireg: 1, requiredcountmini: 0},
      {title: 'RUBY', minretiro: 150000, referidos: 10, coinclickreferido: 40, countminireg: 1, requiredcountmini: 0},
      {title: 'ESMERALDA', minretiro: 200000, referidos: 21, coinclickreferido: 45, countminireg: 1, requiredcountmini: 0},
      {title: 'DIAMANTE', minretiro: 250000, referidos: 26, coinclickreferido: 55, countminireg: 1, requiredcountmini: 0},
      {title: 'DIAMANTE AZUL', minretiro: 300000, referidos: 31, coinclickreferido: 75, countminireg: 1, requiredcountmini: 0},
      {title: 'DIAMANTE NEGRO', minretiro: 350000, referidos: 36, coinclickreferido: 150, countminireg: 1, requiredcountmini: 0},
      {title: 'DIAMANTE DORADO', minretiro: 400000, referidos: 40, coinclickreferido: 160, countminireg: 1, requiredcountmini: 0},
      {title: 'DIAMENTE DE 1 CORONA', minretiro: 400000, referidos: 45, coinclickreferido: 160, countminireg: 1, requiredcountmini: 0},
      {title: 'DIAMENTE DE 2 CORONAS', minretiro: 400000, referidos: 60, coinclickreferido: 160, countminireg: 1, requiredcountmini: 0},
      {title: 'DIAMENTE DE 3 CORONAS', minretiro: 400000, referidos: 65, coinclickreferido: 160, countminireg: 1, requiredcountmini: 0},
      {title: 'DIAMENTE DE 4 CORONAS', minretiro: 400000, referidos: 70, coinclickreferido: 160, countminireg: 1, requiredcountmini: 0},
      {title: 'DIAMANTE DE 5 CORONAS', minretiro: 400000, referidos: 75, coinclickreferido: 160, countminireg: 1, requiredcountmini: 0}
    ];
    _.forEach(niveles, (item: any, val: any) => {
      this._model.create('nivel', item)
      .subscribe(
        (response: any) => {
            this._tools.openSnack('Niveles creados', 'ok', false);
            // console.log(response, val, niveles.length);
            if(niveles.length-2 < val){
              this.crearUserDefault();
            }
        },
        (error: any) => {
            console.log('Error', error);
        }
      );
    });
  }
  private crearPaquetes() {
    const paquetes = [
      {
        ref: 1,
        title: 'Paquete Basico',
        subtitle: '',
        description: `
          Paquete para nuevos emprendedores
          40 visitas ptc
        `,
        valor: 30000
      },
      {
        ref: 2,
        title: 'Paquete Emprendedor',
        subtitle: '',
        description: `
          Paquete para lideres
          400 visitas ptc
        `,
        valor: 250000
      }
    ];
    _.forEach(paquetes, (item: any) => {
      this._model.create('paquete', item)
      .subscribe(
        (response: any) => {
            this._tools.openSnack('paquetes creados', 'ok', false);
            console.log(response);
        },
        (error: any) => {
            console.log('Error', error);
        }
      );
    });
  }
  */
}
