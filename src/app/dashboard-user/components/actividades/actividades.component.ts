import { Component, OnInit, VERSION, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActividadService } from './../../services/actividad.service';
import { FactoryModelService } from '../../services/factory-model.service';
import { PublicacionService } from './../../services/publicacion.service';
import { ToolsService } from '../../services/tools.service';
import * as _ from 'lodash';
import * as moment from 'moment';
// import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.component.html',
  styleUrls: ['./actividades.component.scss'],
  providers: [ActividadService]
})
export class ActividadesComponent implements OnInit {
  public cuerpo: any;
  public actividades: any;
  public actividadesReferidos: any;
  public actividad: any;
  public paquete: any;
  public vigencia: any;
  // private comenForm: FormGroup;
  public state: boolean;
  public comentario: any = {};
  public user: any;
  ngVersion: string = VERSION.full;
  matVersion = '5.1.0';
  breakpoint: number;
  constructor(
    private router: Router,
    // private formBuilder: FormBuilder,
    private _actividad: ActividadService,
    private _model: FactoryModelService,
    private _tools: ToolsService,
    public _publicacion: PublicacionService
  ) {
    this.cuerpo = _actividad.rta;
    // console.log(this.cuerpo);
    this._model.query('publicacion', {})
      .subscribe(
        (response: any) => {
          // console.log(response);
          response = response.data;
          // this.crearBack();
          if (response.length > 0) {
            return true;
          } else {
            this.cargarUserOrigin();
          }
        },
        (error: any) => {
          console.log('Error', error);
        }
      );
    this.state = false;
  }
  ngOnInit() {
    // console.log("hey");
    if(!this._model.user){
      this._model.user = JSON.parse(localStorage.getItem('user'));
    }
    if(this._model.user){
      // this.cargarPaquete();
      const
        userpaquete: any = this._model.user.paquete
      ;
      // console.log(userpaquete);
      if(!userpaquete){
        this.cuerpo.disable.state = true;
        this._actividad.cargarActividades();
      }else{
        this._actividad.getPaquete({
          user: this._model.user
        })
        .subscribe(
          (rta: any)=>{
            // console.log(rta);
            rta = rta.data[0];
            if(rta){
              this.cuerpo.disable.state = true;
              this._actividad.cargarActividades();
            }else{
              this.cuerpo.disable.state = false;
              this._tools.openSnack(' No hay Tienes paquetes Activos', 'Ok', false);
            }
          }
        )
        ;
      }
    }
    // this.cargarPaquete();
    this.breakpoint = (window.innerWidth <= 400) ? 1 : 6;
    this.loadPublicaciones();
  }
  onSelect(cuerpo: any) {
    // console.log(cuerpo);
  }
  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 400) ? 1 : 6;
  }
  loadPublicaciones() {
    // console.log(this._model, this._publicacion);
    const
      _model: any = this._model,
      _publicacion: any = this._publicacion
      ;
    this._publicacion.chequiarPublicacion();
  }
  posiciontab(idx: any) {
    // console.log(idx);
    if (idx === 0) {
      this._actividad.consulActividades();
    }
    if (idx === 1) {
      this._actividad.getactividadesextra();
    }
    if (idx === 2) {
      this._actividad.getactividadesreferido();
    }

  }
  private cargarUserOrigin() {
    this._model.query('user', { username: 'origin' })
      .subscribe(
        (response: any) => {
          // console.log(response);
          response = response.data;
          this.user = response[0];
          if (this.user) {
            // this.crearBack();
          }
        },
        (error: any) => {
          console.log('Error', error);
        }
      );
  }
  /* private crearBack() {
    const user = this.user;
    // console.log(user);
    const publicaciones = [
      {
        // tslint:disable-next-line:max-line-length
        content: 'https://www.youtube.com/embed/6xBciWcauog',
        imgdefault: 'https://publihazclick.s3.amazonaws.com/publicaciones/WhatsApp+Image+2019-06-11+at+9.59.47+AM.jpeg',
        title: 'JUSTO Y BUENO',
        descripcion: `Ven y Compra en Justo y Bueno`,
        type: 'url',
        prioridad: 'basica',
        state: 0,
        autocreo: false,
        clicks: 0,
        // user: user.id
        user: '5cedd99d520be0ef68567180'
      },
      {
        // tslint:disable-next-line:max-line-length
        content: 'https://www.youtube.com/embed/30_bsp5ArXg',
        imgdefault: 'https://publihazclick.s3.amazonaws.com/publicaciones/WhatsApp+Image+2019-06-11+at+10.02.33+AM.jpeg',
        title: 'ALMACÉN EXITO',
        descripcion: `Ven y Compra en ALMACÉN EXITO`,
        type: 'url',
        prioridad: 'basica',
        state: 0,
        autocreo: false,
        clicks: 0,
        // user: user.id
        user: '5cedd99d520be0ef68567180'
      },
      {
        // tslint:disable-next-line:max-line-length
        content: 'https://www.youtube.com/embed/vPLQZTT-W3Q',
        imgdefault: 'https://publihazclick.s3.amazonaws.com/publicaciones/WhatsApp+Image+2019-06-11+at+10.05.55+AM.jpeg',
        title: 'OLIMPICA',
        descripcion: `Ven y Disfruta en OLIMPICA`,
        type: 'url',
        prioridad: 'basica',
        state: 0,
        autocreo: false,
        clicks: 0,
        // user: user.id
        user: '5cedd99d520be0ef68567180'
      },
      {
        // tslint:disable-next-line:max-line-length
        content: 'https://www.youtube.com/embed/ghZKf-6azH4',
        imgdefault: 'https://publihazclick.s3.amazonaws.com/publicaciones/WhatsApp+Image+2019-06-11+at+10.07.44+AM.jpeg',
        title: 'JARDÍN PLAZA CÚCUTA',
        descripcion: `Ven y Disfruta en JARDÍN PLAZA CÚCUTA`,
        type: 'url',
        prioridad: 'basica',
        state: 0,
        autocreo: false,
        clicks: 0,
        // user: user.id
        user: '5cedd99d520be0ef68567180'
      },
      {
        // tslint:disable-next-line:max-line-length
        content: 'https://www.youtube.com/embed/sV2_VqxbIKw',
        imgdefault: 'https://publihazclick.s3.amazonaws.com/publicaciones/WhatsApp+Image+2019-06-11+at+10.09.14+AM.jpeg',
        title: 'VENTURA PLAZA',
        descripcion: `Ven y Disfruta en VENTURA PLAZA`,
        type: 'url',
        prioridad: 'basica',
        state: 0,
        autocreo: false,
        clicks: 0,
        // user: user.id
        user: '5cedd99d520be0ef68567180'
      },
      {
        // tslint:disable-next-line:max-line-length
        content: 'https://www.youtube.com/embed/BTEK7m69ra8',
        imgdefault: 'https://publihazclick.s3.amazonaws.com/publicaciones/WhatsApp+Image+2019-06-11+at+10.11.12+AM.jpeg',
        title: 'Ara',
        descripcion: `Ven y Compra en Ara`,
        type: 'url',
        prioridad: 'basica',
        state: 0,
        autocreo: false,
        clicks: 0,
        // user: user.id
        user: '5cedd99d520be0ef68567180'
      },
      {
        // tslint:disable-next-line:max-line-length
        content: 'https://www.youtube.com/embed/y8MZXu0RlVY',
        imgdefault: 'https://publihazclick.s3.amazonaws.com/publicaciones/WhatsApp+Image+2019-06-11+at+10.12.45+AM.jpeg',
        title: ' CARULLA',
        descripcion: `Ven y Compra en CARULLA`,
        type: 'url',
        prioridad: 'basica',
        state: 0,
        autocreo: false,
        clicks: 0,
        // user: user.id
        user: '5cedd99d520be0ef68567180'
      },
      {
        // tslint:disable-next-line:max-line-length
        content: 'https://www.youtube.com/embed/Etv-_H8-HSE',
        imgdefault: 'https://publihazclick.s3.amazonaws.com/publicaciones/WhatsApp+Image+2019-06-11+at+10.14.12+AM.jpeg',
        title: ' UBER',
        descripcion: `Ven y Compra en UBER`,
        type: 'url',
        prioridad: 'basica',
        state: 0,
        autocreo: false,
        clicks: 0,
        // user: user.id
        user: '5cedd99d520be0ef68567180'
      },
    ];
    _.forEach(publicaciones, (item: any) => {
      this._model.create('publicacion', item)
        .subscribe(
          (response: any) => {
            this._tools.openSnack('Publicaciones creadas', 'ok', false);
            // console.log(response);
          },
          (error: any) => {
            console.log('Error', error);
          }
        );
    });
  } */
}
