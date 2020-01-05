import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from '../../../../services/global';
import { interval } from 'rxjs';
import { retryWhen, delayWhen, catchError, tap } from 'rxjs/operators';
import { timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { FactoryModelService } from './factory-model.service';
import * as _ from 'lodash';
import { ToolsService } from './tools.service';
import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService implements OnInit {
  private url: string;
  private handleError: any;
  public rta: any = {};
  public lista: any = this.List;
  constructor(
    private _http: HttpClient,
    private _model: FactoryModelService,
    private _tools: ToolsService
  ) {
    this.url = GLOBAL.url;
    this.rta = {
      _tools: _tools,
      data: {},
      cantidaddisponible: 0,
      items: [],
      _model: this._model,
      http: _http,
      url: GLOBAL.url,
      list: this.List,
      select: this.select,
      disable: {
        action: false,
        pack: false
      },
      btn: {
        editar: this.editar,
        elimiar: this.eliminar,
        crear: this.crear,
        agregar: this.agregar
      }
    }
      ;
  }
  ngOnInit() {
    // this.getPaquete(null);
  }
  getPaquete(obj: any) {
    return this._model.query('userpaquete/consulpaquete', {
      where: {
        user: obj.user.id
      },
      limit: 1
    })
      ;
  }
  updatepaquete(obj: any) {
    return this._model.update('userpaquete', obj.id, {
      cantidaddepublicidad: obj.cantidad
    })
      ;
  }
  List(cuerpo: any) {

    const
      query: any = {
        where: {
          user: this._model.user.id,
          type: ['img', 'url'],
          estado: ['activo', 'consumido'],
          autocreo: false
        }
      }
      ;
    // console.log(query)
    if (cuerpo) {
      // query.title = cuerpo;
      query.where.ort = [
        {
          title: {
            contains: cuerpo || ''
          }
        },
        {
          type: {
            contains: cuerpo || ''
          }
        },
        {
          prioridad: {
            contains: cuerpo || ''
          }
        },
        {
          estado: {
            contains: cuerpo || ''
          }
        },
        {
          clicks: {
            contains: cuerpo || ''
          }
        }
      ]
        ;
    }
    return this._model.query('publicacion', query)
      .pipe(
        map((res: any) => {
          // console.log(res, query);
          this.rta.items = res.data;
          // res = res.data;
          const
            querys = {
              user: this._model.user
            }
            ;
          this.getPaquete(querys)
            .subscribe(
              (rta: any) => {
                rta = rta.data[0];
                if (rta) {
                  this.rta.disable.pack=true;
                  this.rta.cantidaddisponible = rta.cantidaddepublicidad;
                  // if(!rta.cantidaddepublicidad === 2){
                  //   querys = {
                  //     id: rta.id,
                  //     cantidad: (res.data.length - rta.cantidaddepublicidad) || 0
                  //   }
                  //   ;
                  //   this.updatepaquete(querys);
                  // }
                }
              }
            );
          // this.rta.cantidaddisponible = 2-res.data.length;
          return res;
        }));
  }
  crear(cuerpo: any, obj: any) {
    cuerpo.rta.disable.action = !cuerpo.rta.disable.action;
    if (obj) {
      cuerpo.rta.data = obj;
    } else {
      cuerpo.rta.data = {};
    }
  }
  agregar(cuerpo: any) {
    /* console.log(cuerpo, cuerpo.rta.data); */
    // console.log(cuerpo.rta);
    if (cuerpo._model.user && cuerpo.rta.cantidaddisponible > 0) {
      cuerpo.rta.data.user = cuerpo._model.user.id;
      // console.log(parseInt(cuerpo.rta.data.prerioda));
      // tslint:disable-next-line:radix
      cuerpo.rta.data.prerioda = parseInt(cuerpo.rta.data.prerioda);
      // console.log(cuerpo.rta.data);
      return cuerpo._model.create('publicacion', cuerpo.rta.data)
        .pipe(
          map((res) => {
            // console.log(res, cuerpo);
            // cuerpo.rta.cantidaddisponible = cuerpo.rta.cantidaddisponible-1;
            // cuerpo.rta.items.push(res);
            cuerpo.rta.list(false);
            return res;
          })
        );
    } else {
      console.log('else');
    }
  }
  editar(cuerpo: any, obj: any) {
    // console.log(cuerpo);
    const
      data = cuerpo.rta.data
      ;
    let query: any = {};
    const
      promises = []
      ;
    if (data) {
      if (data.id) {
        query = {
          id: data.id
        }
          ;
        query[obj] = data[obj];

        // console.log(query, data);
        promises.push(cuerpo.rta._model.update('publicacion', query.id, query)
          .subscribe(
            // tslint:disable-next-line:no-shadowed-variable
            (data: any) => {
              // console.log('PUT Request is successful ', data);
              cuerpo.rta._tools.openSnack('Actualizado', false);
              return data;
            },
            (error: any) => {
              console.log('Error', error);
            }
          ));
      }
    }
  }
  pushfile(cuerpo: any, obj: any) {
    const
      form = new FormData()
      ;
    if (obj) {
      form.append('file', obj[0]);
      return cuerpo._model.create('publicacion/file', form);
    } else {
      cuerpo._tools.openSnack('Error', false);
    }

  }
  deletefile(cuerpo: any, obj: any) {
    if (obj) {
      return cuerpo._model.query('publicacion/deletefile', {
        name: obj
      })
        ;
    }
  }
  eliminar(ev: any, cuerpo: any, data: any) {
    // console.log(cuerpo);
    if (data) {
      if (data.id) {
        const
          promises = []
          ;
        data.app = 'publihazclickrootadmin';
        promises.push(cuerpo.rta.http.delete(cuerpo.rta.url + 'publicacion/' + data.id, data)
          // promises.push(cuerpo.rta._model.delete('publicacion', data.id, data)
          .subscribe(
            // tslint:disable-next-line:no-shadowed-variable
            (data: any) => {
              // console.log("PUT Request is successful ", data);
              cuerpo.rta._tools.openSnack('Eliminado', false);
              if (data.id) {
                const
                  idx = _.findIndex(cuerpo.items, ['id', data.id])
                  ;
                // console.log(idx);
                if (idx > -1) {
                  // console.log(cuerpo.items[idx]);
                  if (cuerpo.items[idx]) {
                    cuerpo.items.splice(idx, 1);
                  }
                }
              }
              return data;
            },
            (error: any) => {
              console.log('Error', error);
            }
          ));
      }
    }
  }
  select(obj: any) {
    // console.log(obj);
    obj.check = !obj.check;
  }

  getBanner(query: any){
    return this._model.query("publicacion",query);
  }
  createbanner(query:any){
    return this._model.create("publicacion",query);
  }
  updatebanner(query:any){
    return this._model.update("publicacion",query.id, query);
  }
  pushfilebanner(query: any){
    const
      form: any = new FormData()
    ;
    if(query){
      form.append('file', query[0]);
      return this._model.create("publicacion/file",form);
    }
  }


  private crearBack() {
    if (this.rta.cantidaddisponible > 0) {
      const
        user: any = this._model.user,
        prioridades: any = [{ id: 'basica' }, { id: 'super' }]
        ;
      if (this.rta.items[0]) {
        var
          idx: any = _.findIndex(prioridades, ['id', this.rta.items[0].prioridad])
          ;
      }
      if (idx > -1) {
        prioridades.splice(idx, 1);
      }
      this._model.query('publicacion', {
        where: {},
        sort: {
          'clicks': 'asc'
        },
        limit: 2
      })
        .subscribe(
          (res: any) => {
            // console.log(res);
            for (let i = 0; i < res.data.length - this.rta.items.length; i++) {
              // console.log(i);
              delete res.data[i].id;
              delete res.data[i].click;
              delete res.data[i].updatedAt;
              delete res.data[i].createdAt;
              res.data[i].user = user.id;
              res.data[i].autocreo = false;
              res.data[i].prioridad = prioridades[i].id;
              this._model.create('publicacion', res.data[i])
                .subscribe(
                  (response: any) => {
                    // console.log(response, this._model.user, res.data.length-this.rta.items.length, res.data);
                    if (response.id) {
                      res.data[i] = response;
                      // this.rta.items.push(response);
                      // console.log(this.rta);
                      if (res.data.length - this.rta.items.length >= res.data.length - 1) {
                        this.rta.list();
                        this._tools.openSnack('Publicaciones creadas', 'ok', false);
                        this.rta.cantidaddisponible = this.rta.cantidaddisponible - 1;
                      }
                    }
                    // console.log(response);
                  }
                );
            }
            this.rta.disable.action = false;
          }
        )
        ;
    } else {
      swal('Ok', 'Ya as Consumido Tus Publicaciones', 'success');
    }
  }

}
