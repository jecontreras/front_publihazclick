import { Component, OnInit, VERSION, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActividadService } from '../../services/actividad.service';
import { FactoryModelService } from '../../../../../services/factory-model.service';
import { PublicacionService } from '../../services/publicacion.service';
import { ToolsService } from '../../services/tools.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import swal from 'sweetalert';
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
  public principiante = true;
  constructor(
    private router: Router,
    // private formBuilder: FormBuilder,
    private _actividad: ActividadService,
    private _model: FactoryModelService,
    private _tools: ToolsService,
    public _publicacion: PublicacionService
  ) {
    this.cuerpo = _actividad.rta;
    this.state = false;
  }
  ngOnInit() {
      this._model.user = JSON.parse(localStorage.getItem('user'));
      this.cargarPublicaciones();  
  }
  onSelect(cuerpo: any) {
    // console.log(cuerpo);
  }
  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 400) ? 1 : 6;
  }
  loadPublicaciones() {
    const
      _model: any = this._model,
      _publicacion: any = this._publicacion
      ;
    this._publicacion.chequiarPublicacion();
  }
  posiciontab(idx: any) {
    if (idx === 0) {
      this._actividad.consulActividades();
    }
    if(this.principiante) {
      swal( 'Error' ,  'No pudes realizar otro tipo de actividades sin comprar paquete' ,  'error' );
      return;
    }
    if (idx === 1) {
      this._actividad.getactividadesextra();
    }
    if (idx === 2) {
      this._actividad.getactividadesreferido();
    }

  }
  cargarPublicaciones() {
    if (this._model.user) {
      const userpaquete: any = this._model.user.paquete;
      /* if (!userpaquete) {
        console.log('debug: aqui');
        this.cuerpo.disable.state = true;
        this._actividad.cargarActividades();
      } else { */
        this._actividad.getPaquete({
          user: this._model.user
        })
          .subscribe(
            (rta: any) => {
              rta = rta.data[0];

              if (rta) {
                this.cuerpo.disable.state = true;
                this._actividad.cargarActividades();
                this.principiante = false;
              } else {
                this.cuerpo.disable.state = true;
                this._actividad.cargarActividades();
                this.principiante = true;
                swal( 'ok' ,  'recuerda que estas realizando tareas como principiante' ,  'success' );
              }
            },
            (error: any) => {
              console.log(this._model.user);    
                swal( 'Error' ,  'Algo anda mal informa este error' ,  'error' );
            }
          )
          ;
      /* } */
    }
    /* this.breakpoint = (window.innerWidth <= 400) ? 1 : 6;
    this.loadPublicaciones(); */
  }
}
