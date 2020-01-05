import { Injectable } from '@angular/core';
import { GLOBAL } from '../../../../services/global';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { ToolsService } from './tools.service';
import { FactoryModelService } from './factory-model.service';
import * as _ from 'lodash';
import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private url: string;
  private handleError: any;
  public rta: any;
  constructor(
    private _http: HttpClient,
    private _model: FactoryModelService,
    private _tools: ToolsService
  ) {
    this.url = GLOBAL.url;
    this.rta = {
      url: GLOBAL.url,
      _model: this._model,
      _tools: this._tools,
      http: _http,
      data: {},
      clon: {},
      btn: {
        edit: this.update
      }
    }
    ;
  }
  loadUser() {
    // console.log(this._model.user);
    this.rta.data = this._model.user;
    return this._model.query('user', {id: this._model.user.id});
    // console.log(this.rta.data);
  }
  cargarCabeza(): any {
    this._model.query('user', {id: this.rta.data.cabeza})
    .subscribe(
      (response: any) => {
        // console.log(response);
        response = response.data[0];
        this.rta.data.cabeza = response;
      },
      (error: any) => {
          console.log('Error', error);
      }
    );
  }
 update(cuerpo: any, obj: any) {
    // console.log(cuerpo, obj);
    if (cuerpo.data.id) {
      const
        query: any = {
          id: cuerpo.data.id
        }
      ;
      query[obj] = cuerpo.data[obj];
      if(cuerpo.data[obj] !== cuerpo.clon[obj] || obj === 'password'){
        // console.log(query);
        if (obj === 'username') {
          query.username = query.username.replace(/ /g, "");
          consult(cuerpo, query);
        } else {
          if(obj === 'password'){
            if(cuerpo.data.passwordAfter){
              query.password = cuerpo.data.password1;
              query.passwordverified = cuerpo.data.passwordverified;
              query.passwordAfter = cuerpo.data.passwordAfter;
              updd(cuerpo, query);
            }else{
              cuerpo._tools.openSnack('Error Ingrese Contraseña Anterior', false);
            }
          }else{
            if(obj === 'email'){
              // console.log(cuerpo.data);
              if(cuerpo.data.disabledemail){
                cuerpo._model.query("user/correo",{
                  user: cuerpo.data,
                  camEmail: true
                })
                .subscribe(
                  (rta: any)=>{
                    // console.log(rta);
                    if(rta.status === 200){
                      rta = rta.data[0];
                      var
                        params: any = {
                          text: 'Por Favor Introducir el Codigo que te Enviamos a tu Correo Gmail".',
                          content: "input",
                          buttons: ["Mas Tarde!", "Cambiar!"],
                          dangerMode: false,
                        }
                      ;
                      swal(params)
                      .then(name => {
                        if (!name) throw null;
                        // console.log(name);
                        return name;
                      })
                      .then(name=>{
                        if(name === rta.codigo){
                          updd(cuerpo, query);
                          swal.stopLoading();
                          swal.close();
                        }else{
                          swal('Opps', 'El Codigo Es Incorrecto Por favor Revisar tu Codigo en Tu Correo', 'error');
                        }
                      })
                      .catch(err=>{
                        swal.close();
                      })
                      ;
                    }else{
                      swal('Opps', 'La Cuenta Gmail Tiene Problemas Por Favor Intente Con Otro Correo Gmail', 'error');
                    }
                  }
                )
                ;
              }
            }else{
              updd(cuerpo, query);
            }

          }
        }
      }
    }
    // tslint:disable-next-line:no-shadowed-variable
    function consult(cuerpo: any, query: any) {
      // console.log(query);
      return cuerpo._model.query('user', {
        where:{
          username: query.username,
          id: {
            '!': query.id
          }
        }
      })
      .subscribe(
        data => {
          // console.log(data);
          data = data.data[0];
          if (!data) {
            updd(cuerpo, query);
          } else {
            cuerpo._tools.openSnack('Error el Username Ya Existe', false);
          }
        }
      );
    }
    // tslint:disable-next-line:no-shadowed-variable
    function updd(cuerpo: any, query: any) {
      return cuerpo._model.update('user', query.id, query)
      .subscribe(
        data => {
            // console.log(data);
            if(data){
              cuerpo._tools.openSnack('Actualizado', false);
              actualizauser(cuerpo);
            }
        },
        error => {
            console.log('Error', error);
        }
      );
    }
    // tslint:disable-next-line:no-shadowed-variable
    function actualizauser(cuerpo: any) {
      // cuerpo._model.user = cuerpo.data;
      _.forEach(cuerpo.data, function(item, val) {
        if (cuerpo.data[val] !== cuerpo._model.user[val]) {
          cuerpo._model.user[val] = item;
        }
      })
      ;
    }
  }
  pushfile(cuerpo: any, obj: any) {
    const
      form = new FormData()
    ;
    if (obj) {
      form.append('file', obj[0]);
      return cuerpo._model.create('user/file', form);
    } else {
      cuerpo._tools.openSnack('Error', false);
    }

  }
  deletefile(cuerpo: any, obj: any ) {
    if (obj) {
      return cuerpo._model.query('user/deletefile', {
        name: obj
      })
      ;
    }
  }
}
