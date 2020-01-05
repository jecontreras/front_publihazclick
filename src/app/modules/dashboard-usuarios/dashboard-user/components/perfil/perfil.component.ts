import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../../services/perfil.service';
import { departamento } from '../../../json/departamentos';
import { pais } from '../../../json/paises';
import { GLOBAL } from '../../../../../services/global';
import * as _ from 'lodash';
import { FactoryModelService } from '../../services/factory-model.service';
import swal from 'sweetalert';
import { Indicativo } from 'src/app/modules/dashboard-usuarios/json/indicativo';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  providers: [PerfilService]
})
export class PerfilComponent implements OnInit {

  public cuerpo: any;
  public img: any;
  public global  =  GLOBAL;
  public url: string = GLOBAL.urlFront;
  public datafile: any;
  public user: any = this._model.user;
  public carga = true;
  public disabledpais: boolean = false;
  public listdepartamento: any = [];
  public listciudades: any = [];
  public disabledemail = true;
  public listpais: any = [];
  public data: any = {};
  public list_indicativo: any = {};
  constructor(
      private _perfil: PerfilService,
      public _model: FactoryModelService
  ) {
    this.cuerpo = _perfil.rta;
    // console.log(this.user);
  }

  ngOnInit() {

    this.list_indicativo = Indicativo


    this._perfil.loadUser()
    .subscribe(
      (response: any) => {
        // console.log(response);
        response = response.data[0];
        this._perfil.rta.data = response;
        this._perfil.rta.clon = _.clone(response);
        this.blurdepartamento();
        if (this._perfil.rta.data.cabeza) {
          if (!this._perfil.rta.data.cabeza.username) {
            this._perfil.cargarCabeza();
          }
        }
      },
      (error: any) => {
        console.error('error', error);
      }
    )
    ;
    this.listdepartamento = departamento;
    this.listpais = pais;
  }
  datafiles(ev) {
    this.datafile = ev.target.files;
    // console.log(this.datafile);
  }
  portapapeles() {
    const
      val = this.url + 'info/' + this.cuerpo.data.username
    ;
    const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = val;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
    this.cuerpo._tools.openSnack('Copiado:' + ' ' + val, 'completado', false);

  }
  viewpais(){
    const
      data: any = this.cuerpo.data
    ;
    // console.log(data);
    this.disabledpais = true;
    if(data.pais === 'Colombia'){
      this.disabledpais = false;
    }
    this.cuerpo.btn.edit(this.cuerpo, 'pais')

  }
  validadEmail() {
    const
      data: any = this.cuerpo.data
      ;
    this.disabledemail = true;
    data.disabledemail = true;
    if (data.email) {
      const
        filtro: any = data.email.split('@', '2')
        ;
      // console.log(filtro);
      if (filtro[1] !== 'gmail.com') {
        this.disabledemail = false;
        data.disabledemail = false;
      }else{
        this.cuerpo.btn.edit(this.cuerpo, 'email')
      }
    }
  }
  blurdepartamento() {
    // console.log(this.registerForm.value);
    const
      data: any = this.cuerpo.data
    ;
    let idx: any = 0;
    idx = _.findIndex(this.listdepartamento, ['departamento', data.departamento]);
    // console.log(idx);
    if (idx > -1) {
      // console.log(this.listdepartamento[idx]);
      this.listciudades = this.listdepartamento[idx].ciudades;
    }
    this.cuerpo.btn.edit(this.cuerpo, 'departamento')
  }
  file() {
    // console.log(ev, this._perfil);
    if (this.img) {
      const
        cuerpo = this.cuerpo,
        _perfil = this._perfil,
        file = this.datafile
      ;
      // console.log(file);
      this.carga = false;
      _perfil.pushfile(cuerpo, file)
      .subscribe(
        (data: any) => {
            // console.log('POST Request is successful ', data);
            if (data.files.length) {
              this.carga = true;
              swal('Ok!', 'Imagen agregada correctamente', 'success');
              if (this._model.user.foto !== 'https://s3.amazonaws.com/publihazclick/usuarios/chico.png') {
                deletefile(cuerpo, _perfil);
                cuerpo.data.foto = data.Location;
              }
              cuerpo.data.foto = 'https://s3.amazonaws.com/publihazclick/usuarios/' + data.files[0].fd;
              cuerpo.btn.edit(cuerpo, 'foto');
            }
        },
        (error: any) => {
            console.log('Error', error);
            this.carga = true;
            swal('Error!', 'Error al subir la imagen', 'error');
        }
    );
    }
    function deletefile(cuerpo: any, _perfil: any) {
      // console.log(cuerpo.data);
      if (cuerpo.data.foto) {
        let urldelete: any = _.split(cuerpo.data.foto, 'users', 10)
        ;
        urldelete = 'users' + urldelete[1];
        // console.log(urldelete, cuerpo);
        _perfil.deletefile(cuerpo, urldelete)
        // .subscribe(
        //   data => {
        //     // console.log(data);
        //   }
        // )
        ;
      }
    }
  }

  edit_portada(obj){
    return this.cuerpo.btn.edit(this.cuerpo, obj)

  }

}
