import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { BancosService } from '../../services/bancos.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FactoryModelService } from '../../../../../services/factory-model.service';
import { ToolsService } from '../../services/tools.service';
import { MomentModule } from 'ngx-moment';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 25, 100];
  public disableretiro: any = false;
  public disablebanco: any = false;
  public disablepunto: any = false;
  public displayedRetiros: string[] = [];
  public displayedBancos: string[] = [];
  public displayedPuntos: string[] = [];
  public bancosSource: string[] = [];
  public retirosSource: string[] = [];
  public puntoSource: string[] = [];
  public txt = '';
  public bancoForm: any = {};
  public retiroForm: any = {};
  public puntoForm: any = {};
  public txtretiro: any;
  private dataPuntos: any = [];
  length2 = 100;
  pageSize2 = 10;
  pageSizeOptions2: number[] = [10, 25, 100, 120, 150, 200, 250, 280, 300];
  constructor(
    private _bancos: BancosService,
    private formBuilder: FormBuilder,
    private _model: FactoryModelService,
    private _tools: ToolsService
  ) { }

  ngOnInit() {
    this.getretiros(null);
    this.restoredataretiro();
  }
  private codigo() {
    return (Date.now().toString(36).substr(2, 3) + Math.random().toString(36).substr(2, 2)).toUpperCase();
  }
  restoredataretiro() {
    this.retiroForm = {
      titulo: moment().format(),
      user: this._model.user.id,
      estado: 'pendiente',
      coins: 0,
      codigo: this.codigo()
    }
      ;
    // this.getPuntosUser()
  }
  setPageSizeOptions(ev: any) {
    console.log(ev);
    ev.pageSize = ev.pageSize * ev.pageSize;
    this.getPuntos(ev);
  }
  search(obj: any, opt: any) {
    // console.log(obj, opt);
    if (opt === 'retiro') {
      if (obj) {
        this.getretiros(obj);
      } else {
        this.getretiros(null);
      }
    }
  }
  getretiros(obj: any) {
    const
      query: any = {
        where: {
          // user: this.retiroForm.user,
          estado: {
            '!': 'eliminada'
          }
        },
        sort: {
          createdAt: 'desc'
        },
        populate: 'tipoBanco',
        limit: -1
      }
      ;
    if (obj) {
      this.retirosSource = [];
      query.where.or = [
        {
          codigo: {
            contains: obj || ''
          }
        },
        {
          titulo: {
            contains: obj || ''
          }
        },
        {
          cantidad: {
            contains: obj || ''
          }
        },
        {
          estado: {
            contains: obj || ''
          }
        }
      ]
        ;
    }
    this.displayedRetiros = [
      'posicion',
      'codigo',
      'user',
      'cantidad',
      'estado',
      'tipoBanco',
      'createdAt',
      // 'updatedAt',
      // 'descripcion'
    ];
    this._bancos.getRetiros(query)
      .subscribe(
        (res: any) => {
          // console.log(res);
          res = res.data;
          this.retirosSource = _.unionBy(this.retirosSource || [], res, 'id');
          // for (let i = 0; i < res.length; i++) {
          //   this.getBancos(res[i]);
          // }
        }
      )
      ;
  }
  getBancos(obj: any) {
    // console.log("hey")
    const
      query: any = {
        where: {
          // user: this.retiroForm.user
          id: obj.tipoBanco
        },
        limit: 1
      }
      ;
    this._bancos.getBancos(query)
      .subscribe(
        (res: any) => {
          // console.log(res);
          res = res.data[0];
          if (res) {
            obj.tipoBanco = res;
          }
        }
      )
      ;
  }
  getPuntos(page: any) {
    // console.log(this.retiroForm);
    // console.log(page)
    let
      pageSize: any = 5,
      pageIndex: any = 0
      ;
    if (page) {
      pageSize = page.pageSize;
      pageIndex = page.pageIndex;
    }
    const
      query: any = {
        where: {
          retiros: this.retiroForm.id
        },
        limit: pageSize,
        skip: pageIndex
      }
      ;
    this.displayedPuntos = [
      'posicion',
      'codigo',
      'valor',
      'actividad',
      'state',
      'createdAt',
    ];
    this._bancos.getPuntosUser(query)
      .subscribe(
        (res: any) => {
          // console.log(res);
          res = res.data;
          // tslint:disable-next-line:no-shadowed-variable
          let query: any = {};
          const  _bancos: any = this._bancos
            ;
          _.forEach(res, function (item) {
            item.actividad = {
              prioridad: 'tareas'
            };
            query = {
              where: {
                id: item.id,
              },
              populate: 'actividad',
              limit: 1
            };
            _bancos.getPuntosUser(query)
              .subscribe(
                (rta: any) => {
                  // console.log(rta);
                  rta = rta.data[0];
                  if (rta) {
                    // console.log(item, res);
                    item.actividad = rta.actividad;
                    if (!rta.codigo) {
                      rta.codigo = 'no generado';
                    }
                    item.puntos = rta;
                  }
                }
              )
              ;

          })
            ;
          this.puntoSource = _.unionBy(this.bancosSource || [], res, 'id');
          // console.log(this.puntoSource);
          // this.puntoSource = _.unionBy(this.bancosSource || [], res, 'id');
        }
      )
      ;
  }
  openretiro() {
    this.disableretiro = !this.disableretiro;
    this.restoredataretiro();
  }
  open(obj: any, data: any, opt: any) {
    // console.log(obj, data, opt);
    if (opt === 'bancos') {
      this.bancoForm = obj;
      this.disablebanco = !this.disablebanco;
    }
    if (opt === 'retiro') {
      this.retiroForm = obj;
      this.disableretiro = !this.disableretiro;
      this.getPuntos(false);
      // this.getUser(obj);
    }
    if (opt === 'puntos') {
      this.puntoForm = obj;
      this.disablepunto = !this.disablepunto;
    }
    // console.log(this.puntoForm);
  }
  getUser(obj: any) {
    const
      query: any = {
        where: {
          id: obj.user,
        },
        populate: 'rol'
      }
      ;
    this._bancos.getUsuarios(query)
      .subscribe(
        (res: any) => {
          // console.log(res);
          res = res.data[0];
          if (res) {
            this.retiroForm.user = res;
          }
        }
      )
      ;
  }
  onBlur(obj: any) {
    const data: any = this.retiroForm;
    const query: any = {
        id: data.id
      }
      ;
    if (data[obj]) {
      query[obj] = data[obj];
      this._bancos.updateretiro(query)
        .subscribe(
          (res: any) => {
            console.log(res);
            if (res.id) {
              this._tools.openSnack('Actualizado Retiro', 'Completado', false);
              this.estadopuntos(res);
              if (res.pagopaquete) {
                if(res.pagopaquete === 20000){
                  if(res.estado === 'completado')this.createnota(res);
                }
              }
            }
          }
        )
        ;
    }
  }
  createnota(res: any) {
    if (res.pagopaquete) {
      const
        query: any = {
          ids: res.id,
          titulo: 'reactivacion de paquete',
          prioridad: 'alta',
          tipo: 'notificaciones',
          user: this._model.user.id,
          descripcion: 'consumir paquete que pagaste por el ultimo retiro de dinero',
          valor: 33000
        };
      this._bancos.getnota({
        where: {
          ids: query.ids,
          tipo: 'notificaciones'
        }
      })
        .subscribe(
          (rta: any) => {
            //console.log(rta);
            if (!rta.data.length) {
              this._bancos.createnotapaquete(query)
                .subscribe(
                  () => {
                    // console.log(res);
                  }
                )
                ;
            }
          }
        )
        ;
    }
  }
  estadopuntos(res: any) {
    // dataPuntos
    // console.log(res);
    let query: any = {};
    const  promises: any = [];
    const  _bancos: any = this._bancos;
    const
      data: any = {
        where: {
          retiros: res.id
        },
        limit: -1
      }
      ;
    if (data.where.retiros) {
      this._bancos.getPuntosUser(data)
        .subscribe(
          // tslint:disable-next-line:no-shadowed-variable
          (res: any) => {
            // console.log(res);
            res = res.data;
            for (let i = 0; i < res.length; i++) {
              // tslint:disable-next-line:no-unused-expression
              res[i];
              query = {
                id: res[i].id,
                state: 'retirado'
              }
                ;
              // console.log(query);
              promises.push(
                _bancos.updatepuntos(query)
              )
                ;
            }
          }
        )
        ;
    }
  }
}
