import { Component, OnInit, ChangeDetectionStrategy, DoCheck } from '@angular/core';
import { FactoryModelService } from '../../services/factory-model.service';
import { ToolsService } from '../../services/tools.service';
import { PublicacionService } from '../../services/publicacion.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { GLOBAL } from '../../../../../services/global';
import * as _ from 'lodash';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ShareService } from '@ngx-share/core';
declare var estadoVentana: any;
@Component({
  selector: 'app-publicacion',
  templateUrl: './publicacion.component.html',
  styleUrls: ['./publicacion.component.scss'],
})
export class PublicacionComponent implements OnInit, DoCheck {
  public publicaciones: any;
  public height: number;
  public ruta: string;
  public url: string = GLOBAL.urlFront;
  private comenForm: FormGroup;
  public data: any = {};
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  public carga: boolean;
  public global = GLOBAL;

  // tslint:disable-next-line:no-shadowed-variable
  items = Array.from({ length: 100000 }).map((_, i) => `Item #${i}`);
  public comentario: any = {};

  constructor(
    private formBuilder: FormBuilder,
    public _model: FactoryModelService,
    private _tools: ToolsService,
    private router: Router,
    public share: ShareService,
    public _publicacion: PublicacionService
  ) {
    this.ruta = this.router.url;
    this.publicaciones = [{}];
    this.carga = false;
  }

  ngOnInit() {
    this.comenForm = this.formBuilder.group({
      content: ['', Validators.required]
    });
    this.height = window.innerHeight - 100;
    this.loadPublicaciones();
  }
  ngDoCheck() {
  }
  initshare(obj: any){
    // console.log(obj);
    const
      val = this.url + 'publicacionviews/' + obj.id + '/true'
    ;
    if(obj.type === 'url'){
      this.data.urlimg = obj.imgdefault;
    }else{
      this.data.urlimg = obj.content;
    }
    this.data.urlshare = val;
    this.data.descripcion = "Comparta y Gana Dinero Por Ver Publicidad Con Un Solo Click con Publick Hazclick";

  }
  loadPublicaciones() {
    // console.log(this._model, this._publicacion);
    const
      _model: any = this._model,
      _publicacion: any = this._publicacion
      ;
    this._publicacion.chequiarPublicacion();
    return _publicacion.getpublicacion(_model, _publicacion);
  }
  setPageSizeOptions(_model: any, _publicacion: any, ev: any) {
    // console.log(ev);
    ev.pageSize = ev.pageSize + ev.pageSize;
    return _publicacion.getpublicacion(_model, _publicacion, ev);
  }
  pushComentario(query: any, cuerpo: any) {
    // console.log(query, cuerpo);
    if (this._model.user) {
      query.user = this._model.user.id;
      // console.log(query);
      return this._model.create('comentario', query)
        .subscribe(
          (data: any) => {
            // console.log(data, this._model.user);
            // console.log('POST Request is successful ', data);

            cuerpo.comentario.push({
              user: {
                username: this._model.user.username,
                foto: this._model.user.foto,
                id: this._model.user.id
              },
              comentarios: {
                content: query.content
              },
              id: data.id,
              createdAt: new Date()
            })
              ;
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
        publicacion: cuerpo.id,
        user: this._model.user.id
      }
      ;
    // console.log(query);
    return this._model.create('comentariopub', query)
      .subscribe(
        (response: any) => {
          // console.log('POST Request is successful ', data);
          this.comenForm.setValue({ content: '' });
          // cuerpo._tools.openSnack('Agregado', false);
        },
        error => {
          console.log('Error', error);
        }
      );
  }
  deletepublicacion(obj: any, data: any) {
    // console.log(obj);
    const
      query: any = {
        id: obj.id
      },
      idx = _.findIndex(data, ['id', query.id])
      ;
    // console.log(data[idx])
    if (query.id) {
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
  checkdelete(obj: any) {
    // console.log(obj, this._model)
    if (obj.user.id === this._model.user.id) {
      obj.check = !obj.check;
    }
  }
  openPublicacion(item: any) {
    // console.log(item);
    item.check = !item.check;
    item.comentario = [];
    // this.cargarComentario(item);
  }
  like(obj: any, opt: any) {
    const
     user: any = this._model.user
    ;
    return this._model.query("megustas",{
      where:{
        publicacion: obj.id,
        user: user.id
      },
      limit: 1
    })
    .subscribe(
      (megusta: any)=>{
        // console.log(megusta);
        megusta = megusta.data[0];
        if(megusta){
          const
           datos:any = {
            id: obj.id,
            puntos: 1
          },
          query:any = {}
          ;
          if(opt === 'megusta'){
            query.tipo = 'megusta';
          }else{
            query.tipo = 'nomegusta';
          }
          this._model.update("megustas", megusta.id,query)
          .subscribe((res: any)=>{console.log(res)});
          if(megusta.tipo !== opt){
            this._model.query("publicacion",{
              where:{
                id: datos.id
              },
              limit: 1
            })
            .subscribe(
              (res: any)=>{
                res = res.data[0];
                // console.log(res);
                if(res){
                  const
                    query:any = {
                      id: res.id
                    }
                  ;
                  if(megusta.tipo === 'megusta'){
                    query.megusta= res.megusta-1;
                    if(query.megusta <= -1){
                      query.megusta = 0;
                    }
                    obj.megusta = query.megusta;
                  }
                  if(megusta.tipo === 'nomegusta'){
                    query.nomegusta= res.nomegusta-1;
                    if(query.nomegusta <= -1){
                      query.nomegusta = 0;
                    }
                    obj.nomegusta = query.nomegusta;
                  }
                  if(opt === 'megusta'){
                    query.megusta= res.megusta+1;
                    obj.megusta = query.megusta;
                    obj.disablelike = "megusta";
                  }else{
                    query.nomegusta= res.nomegusta+1;
                    obj.nomegusta = query.nomegusta;
                    obj.disablelike = "nomegusta";
                  }
                  // console.log(res);
                  // console.log(query);
                  this.updatelike(query);
                }
              }
            );
          }
        }else{
          const
            query:any = {
              publicacion: obj.id,
              user: user.id,
              puntos: 1,
            }
          ;
          if(opt === 'megusta'){
            query.tipo = "megusta";
          }else{
            query.tipo = "nomegusta";
          }
          return this._model.create("megustas",query)
          .subscribe(
            (rta: any)=>{
              // console.log(rta);
              if(rta){
                const
                  datos:any = {
                    id: obj.id,
                    puntos: 1
                  }
                  ;
                  this._model.query("publicacion",{
                    where:{
                      id: datos.id
                    },
                    limit: 1
                  })
                  .subscribe(
                    (res: any)=>{
                      res = res.data[0];
                      // console.log(res);
                      if(res){
                        const
                          query:any = {
                            id: res.id
                          }
                        ;
                        if(opt === 'megusta'){
                          query.megusta= res.megusta+1
                          obj.megusta = query.megusta;
                          obj.disablelike = "megusta";
                        }else{
                          query.nomegusta= res.nomegusta+1
                          obj.nomegusta = query.nomegusta;
                          obj.disablelike = "nomegusta";
                        }
                        this.updatelike(query);
                      }
                    }
                  );
              }
            }
          )
          ;
        }
      }
    )
    ;
  }
  updatelike(query: any){
    // console.log(query);
    this._model.update("publicacion", query.id,query)
    .subscribe((res: any)=>{
      // console.log(res);
    });
  }


}
