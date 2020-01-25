import { Injectable } from '@angular/core';
import { FactoryModelService } from '../../../../services/factory-model.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ToolsService } from './tools.service';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { GLOBAL } from '../../../../services/global';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {
  private url: string;
  public rta: any;
  public data: any;
  public  publicaciones: any;
  constructor(
    private _http: HttpClient,
    private _model: FactoryModelService,
    private route: ActivatedRoute,
    private router: Router,
    // public sanitizer: DomSanitizer,
    private _tools: ToolsService
  ) {
    this.url = GLOBAL.url;
    this.publicaciones = [];
    // this.chequiar();
    // this.chequiarPublicacion();
  }
  getreportar(query: any){
    return this._model.query('reportepublicacion', query);
  }
  reportar(query: any){
    return this._model.create('reportepublicacion', query);
  }
  bloquearpublicacion(query: any){
    return this._model.update('publicacion', query.id, query);
  }
  chequiarPublicacion(){
    const
      query: any = {
        user: this._model.user
      }
    ;
    if(query.user.paquete){
      // console.log(query);
      return this._model.query('publicacion/chequiar', query)
      .subscribe(
        (res: any) =>{
          // console.log(res);
          if(res.data === 'No Tiene Actividades Creadas'){
            this.alertar();
          }
        }
      );
    }
  }
  alertar(){
    // swal('Ok', 'Por Favor Consuma Su Paquete Publicitario!', 'success');
    swal({
      title: "Por Favor Consuma Su Paquete Publicitario?",
      text: "Por Favor Consuma Su Paquete Publicitario en Menos de 24 horas!",
      icon: "warning",
      buttons: ["Mas Tarde!", "Consumir!"],
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        // this.router.navigate(['/configuraciones']);
        this.router.navigate(['dashboard/configuraciones']);
      } else {
        swal("Ok Por Favor No Olvides Consumir Tu Paquete!");
      }
    });
  }
  chequiar() {
    const
      promises = []
    ;
    promises.push(
      this._model.query('publicacion', {
        // type: 'tarea-diaria'
      })
      .subscribe(
        (data: any) => {
          data = data.data;
            // console.log(data);
        },
        error => {
            console.log('Error', error);
        }
      ));
  }
  getpublicacion(_model: any, _publicacion: any, ev: any) {
    // console.log(_model);
    const query: any = {
      where: {
        estado: ['activo', 'consumido'],
        autocreo: false,
        type: ['img', 'url']
        // clicks: {'<': 20}
      },
      sort:{
        createdAt: 'desc'
      },
      limit: 20,
      skip: 1
    };
    if (ev) {
      query.limit = ev.pageSize;
      query.skip = ev.pageIndex;
    }
    // console.log(query);
    this._model.query('publicacion', query)
    .subscribe(
      (response: any) => {
        // console.log(response);
        const
          carga: any = this.cargarComentario,
          model: any = this._model,
          estadolike: any = this.estadolike;
          // _publicacion.publicaciones = response.data;
          _.forEach(response.data, function(rta){
            // console.log(rta);
            rta.oculto = 150
            if(rta.user){
              if(!rta.user.foto){
                rta.user.foto = "https://www.selikoff.net/blog-files/null-value.gif";
              }
            }
            carga(rta, model);
            estadolike(rta, model);
          })
          ;
          _publicacion.publicaciones = _.unionBy(_publicacion.publicaciones || [], response.data, 'id');
          // _publicacion._tools.openSnack('Publicaciones cargadas', 'Ok', false);
      },
      (error: any) => {
          console.log('Error', error);
      }
    );
  }
  estadolike(data: any, model: any){
    return model.query('megustas',{
      publicacion: data.id,
      user: model.user.id
    })
    .subscribe(
      (res: any) =>{
        res = res.data[0];
        if(res){
          // console.log(res, data);
          if(res.tipo === 'megusta'){
            data.disablelike = "megusta";
          }else{
            data.disablelike = "nomegusta";
          }
        }
      }
    )
    ;
  }
  cargarComentario(data: any, model) {
    // console.log(data);
    if (data.id) {
      // console.log(data.data.publicacion.id);
      return model.query('comentariopub', {
        where:{
          publicacion: data.id
        },
        populate: 'user'
      })
      .subscribe(
        (response: any) => {
          response = response.data;
          // console.log(response);
          _.forEach(response, function(item){
            return model.query('comentario',{
              where:{
                id: item.comentarios
              },
              limit: 1
            })
            .subscribe(
              (res: any)=>{
                // console.log(res);
                res = res.data[0];
                item.comentarios = res;
              }
            )
          })
          ;
          data.comentario = response;
        },
        (error: any) => {
            console.log('Error', error);
        }
      );
    }
  }
  // getpaginate(paginate: any) {
  //   // console.log(this._model.user, paginate);
  //   if (this._model.user) {
  //     return this._model.querys(this._model.user.id, paginate)
  //     .subscribe((res: any) => {
  //         // console.log(res);
  //         this.dataSource = _.unionBy(this.dataSource || [], res.data, 'id');
  //     })
  //     ;
  //   }
  // }
}
