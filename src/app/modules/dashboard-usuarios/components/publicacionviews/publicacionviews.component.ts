import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ActividadService } from '../../dashboard-user/services/actividad.service';
import { PublicacionService } from '../../dashboard-user/services/publicacion.service';
import { FactoryModelService } from '../../../../services/factory-model.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToolsService } from '../../dashboard-user/services/tools.service';
import * as _ from 'lodash';
import * as moment from 'moment';
@Component({
  selector: 'app-publicacionviews',
  templateUrl: './publicacionviews.component.html',
  styleUrls: ['./publicacionviews.component.scss'],
  providers: [ActividadService]
})
export class PublicacionviewsComponent implements OnInit {
  public id: any;
  public cuerpo: any;
  public actividades: any;
  public actividadesReferidos: any;
  public actividad: any;
  public paquete: any;
  public vigencia: any;
  private comenForm: FormGroup;
  public state: boolean;
  public comentario: any = {};
  public user: any;
  public user1: any = {};
  public colores: any;
  public siguiente: any = {};
  public disablereport: any = false;
  public disablerealizado: any = true;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private _actividad: ActividadService,
    private _model: FactoryModelService,
    private _publicacion: PublicacionService,
    private _tools: ToolsService
  ) {
    this.cuerpo = _actividad.rta;
  }

  ngOnInit() {
    this.comenForm = this.formBuilder.group({
        content: ['', Validators.required]
    });
    this.route.params.subscribe(params => {
      // console.log(params);
       if(params['id']!=null){
         this.id = params['id'];
         if(params['ids']!=null){
           this._model.user = {
             name: 'view',
             lastname: 'view',
             id: 123,
             username: 'view'
           };
           this.user1 = this._model.user;
           this.getpublicacionshare();
         }else{
           console.log("hey");
           this._model.loadUser();
           this.getPublicacion();
         }
       }
    });
    this.arraydecolor();
  }
  arraydecolor(){
    this.colores = [
      {
        titulo: 'orange',
        spanis: 'amarrilo',
        posicion: 1
      },
      {
        titulo: 'red',
        spanis: 'rojo',
        posicion: 2
      },
      {
        titulo: 'blue',
        spanis: 'azul',
        posicion: 3
      },
      {
        titulo: 'green',
        spanis: 'verde',
        posicion: 4
      }
    ]
    ;
    var
      rand = this.colores[Math.floor(Math.random() * this.colores.length)],
      posicion = _.random(0, 3)
    ;
    var m = _.orderBy(this.colores, ['posicion', 'age']);
    // console.log(posicion, m);
    if(rand){
      var
        idx = _.findIndex(this.colores, [ 'titulo', rand.titulo])
      ;
      if(idx >-1){
        // console.log(this.colores[idx]);
        this.colores[idx].id = true;
        this.colores[idx].posicion = posicion;
        this.siguiente = {
          spanis: this.colores[idx].spanis,
          titulo: this.colores[idx].titulo
        };
      }

    }
  }
  getPublicacion() {
    // console.log(this.id);
    this._model.query('actividad', {
      where:{
        id: this.id,
        user: {
          '!': null
        }
      },
      populate: 'publicacion'
    })
    .subscribe(
      (res: any) => {
        if(res){
          // console.log(res);
          res = res.data[0];
          // this._model.user=res.user
          this.cuerpo.btn.open(this.cuerpo, res);
          this.actividad = res;
          this.getreportar(res);
          this.cargarComentario(this.cuerpo);
        }
      }
    )
    ;
  }
  getpublicacionshare(){
    // console.log(this.id);
    this._model.query("actividad",{
      where:{
        publicacion: this.id
      },
      populate: 'publicacion'
    })
    .subscribe(
      (res: any)=>{
        // console.log(res);
        res = res.data[0];
        if(res){
          this.actividad = res;
          this.cuerpo.btn.open(this.cuerpo, res);
        }
      }
    )
    ;
  }
  resolved(obj: any) {
      // console.log(obj);
      if(obj.id){
        this.pagarActividad(this.actividad);
      }else{
        this._tools.openSnack('Error Al Seleccionar Color', 'Completado',false);
        this.arraydecolor();
      }
  }
  like(opt, obj) {
    // console.log(obj);
    const
      data = obj.data,
      num = 0,
      query = {
        id: 1,
        megusta: 0,
        nomegusta: 0
      }
    ;
    this.getpublicacion(obj)
    .subscribe((res: any) => {
      // console.log(res);
      res = res.data[0];
      if (res) {
        query.id = res.id;
        if (opt) {
          query.megusta = 1;
          if (res.megusta) {
            query.megusta = 1 + res.megusta;
          }
        } else {
          query.nomegusta = 1;
          if (res.nomegusta) {
            query.nomegusta = 1 + res.nomegusta;
          }
        }
        // console.log(query);
        obj.http.put(obj.url + 'publicacion/' + res.id, query)
        // tslint:disable-next-line:no-shadowed-variable
        .subscribe((res: any) => {
          // console.log(res);
          if (res) {
            data.publicacion.megusta = res.megusta;
            data.publicacion.nomegusta = res.nomegusta;
          }
        })
        ;
      }
    })
    ;
  }
  getpublicacion(obj) {
    return obj._model.query('publicacion', {
      id: obj.data.publicacion.id
    })
    ;

  }
  cargarComentario(model: any) {
    if (model.data.publicacion) {
      // console.log(model.data.publicacion.id);
      // console.log(model._model);
      return model._model.query('comentariopub', {
        publicacion: model.data.publicacion.id
      })
      .subscribe(
        (response: any) => {
          // console.log(response);
          response = response.data;
          const
            populateUser: any = this.populateUser,
            _model: any = this._model
          ;
          _.forEach(response, function(item){
            populateUser(item, _model);
          })
          ;
          this.comentario.list = response;
        },
        (error: any) => {
            console.log('Error', error);
        }
      );
    }
  }
  populateUser(query: any, _model: any){
    // console.log(query);
    return _model.query("user",{
      where:{
        id: query.user
      },
      limit: 1
    })
    .subscribe(
      (rta: any)=>{
        rta = rta.data[0];
        // console.log(rta);
        if(rta){
          query.user = rta;
        }
      }
    )
  }
  pushComentario(query: any, cuerpo: any) {
    // console.log(query, cuerpo);
    if (cuerpo._model.user) {
      query.user = cuerpo._model.user.id;
      return cuerpo._model.create('comentario', query)
        .subscribe(
          data => {
              // console.log('POST Request is successful ', data);
              this.pushput(data, cuerpo);
          },
          error => {
              console.log('Error', error);
          }
      );
    }
  }
  pushput(data, cuerpo) {
    const
      query = {
        comentarios: data.id,
        publicacion: cuerpo.data.publicacion.id,
        user: cuerpo._model.user.id
      }
    ;
    return cuerpo._model.create('comentariopub', query)
      .subscribe(
        (response: any) => {
          // console.log(this.comentario, this.comenForm);
            this.comentario.list.push({
              user: {
                 username: this._model.user.username,
                 foto: this._model.user.foto,
                 id: this._model.user.id
               },
               comentarios: {
                 content: this.comenForm.value.content
               },
               createdAt: new Date()
            })
            ;
            this.comenForm.setValue({content: ''});
            cuerpo._tools.openSnack('Agregado', 'Completado', false);
        },
        error => {
            console.log('Error', error);
        }
    );
  }
  deletepublicacion(obj: any, data: any){
    // console.log(obj);
    const
      query: any = {
        id: obj.id
      },
      idx = _.findIndex(data, ['id', query.id])
    ;
    // console.log(data[idx])
    if(query.id){
      return this._model.delete('comentariopub', query.id, query)
        .subscribe(
          (response: any) => {
              // console.log('POST Request is successful ', response);
              this._tools.openSnack('Eliminado', 'Completado', false);
              data.splice(idx, 1);
          },
          error => {
              console.log('Error', error);
          }
      );
    }
  }
  checkdelete(obj: any){
    // console.log(obj, this._model)
    if(obj.user.id === this._model.user.id){
      obj.check = !obj.check;
    }
  }
  openPublicacion(item: any) {
    this.actividad = item;
    this.cuerpo.btn.open(this.cuerpo, item);
    this.cargarComentario(this.cuerpo);
  }
  actividadRealizada() {
    if (this.cuerpo.btn.chequear(this.cuerpo)) {
      this.pagarActividad(this.actividad);
    }
  }
  private pagarActividad( actividad: any ) {
    if(actividad){
      // console.log(actividad);
      this.disablerealizado = false;
      this._model.query('puntos', {actividad: actividad.id})
      .subscribe(
        (response: any) => {
          // console.log(response);
          if (!response.data.length) {
            const query = {
              codigo: this.codigo(),
              valor: actividad.valor,
              prioridad: actividad.prioridad,
              user: this._model.user,
              actividad: actividad.id
            };
            // console.log(query);
            if ( actividad.estado === 'activo' ) {
              this._model.create('puntos/generatepuntos', query)
              .subscribe(
                (rta: any) => {
                    // console.log(rta);
                    this.cuerpo.cumplidadPagas += 1;
                    this.cuerpo.restantePagas -= 1;
                    this.cambiarEstadoActividad(actividad);
                    this._tools.openSnack('EL pago se registro correctamente', 'Ok', false);
                },
                (error: any) => {
                    console.log('Error', error);
                }
              );
            } else {
              this._tools.openSnack('Verifica tu conexion a internet', 'Error', false);
            }
          } else {
            this.cambiarEstadoActividad(actividad);
            this._tools.openSnack('Esta actividad ya tiene puntos pagados', 'Error', false);
          }
        },
        (error: any) => {
          this._tools.openSnack('Verifica tu conexion a internet', 'Error', false);
        }
      );
    }
  }
  private codigo() {
    return (Date.now().toString(36).substr(2, 3) + Math.random().toString(36).substr(2, 2)).toUpperCase();
  }
  private cambiarEstadoActividad(actividad: any) {
    const query = {
      estado: 'realizado'
    };
    this._model.update('actividad', actividad.id, query)
    .subscribe(
      (response: any) => {
          // this._tools.openSnack('La actividad se registro correctamente', 'Ok', false);
          this.cambiarEstadoPublicacion(actividad);
          return true;
      },
      (error: any) => {
          console.log('Error', error);
      }
    );
  }

  private cambiarEstadoPublicacion(actividad: any) {
    const query = {
      clicks: actividad.publicacion.clicks + 1
    };
    this._model.update('publicacion', actividad.publicacion.id, query)
    .subscribe(
      (response: any) => {
          // this._tools.openSnack('La publicacion se registro correctamente', 'Ok', false);
          // this.cargarActividades();
          this.cuerpo.disable.puble = false;
      },
      (error: any) => {
          console.log('Error', error);
      }
    );
  }
  getreportar(obj: any){
    // console.log(this._model);
    if(obj.publicacion){
      var
        user: any = this._model.user.id,
        query: any = {
          // user: this._model.user.id
          publicacion: obj.publicacion.id
        }
      ;
      // console.log(this.id);
      this._publicacion.getreportar(query)
      .subscribe(
        (res: any)=>{
          // console.log(res);
          for (var i = 0; i < res.data.length; i++) {
            // res.data[i]
            if(res.data[i].user === user){
              this.disablereport = true;
            }
          }
          if (res.data.length >=3) {
            var
              query: any = {
                id: obj.publicacion.id,
                estado: 'inactivo'
              }
            ;
            this._publicacion.bloquearpublicacion(query)
            .subscribe(
              (res: any)=>{
                // console.log(res);
                if (res.id) {
                  this._tools.openSnack('La publicacion se reporto defenitivo', 'Ok', false);
                }
              }
            )
            ;
          }
        }
      )
      ;
    }
  }
  reportar(){
    var
      data: any = this.cuerpo.data,
      query: any = {
        publicacion: data.publicacion.id,
        user: data.user.id
      }
    ;
    // console.log(data, this._publicacion);

    this._publicacion.reportar(query)
    .subscribe(
      (res: any) =>{
        // console.log(res);
        if (res.id) {
          this._tools.openSnack('Publicacion Reportada', 'Ok', false);
          this.disablereport = true;
        }
      }
    )
    ;
  }

}
