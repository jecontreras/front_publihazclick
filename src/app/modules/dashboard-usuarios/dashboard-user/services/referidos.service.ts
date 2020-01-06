import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { GLOBAL } from '../../../../services/global';
import { FactoryModelService } from '../../../../services/factory-model.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ToolsService } from './tools.service';

@Injectable({
  providedIn: 'root'
})
export class ReferidosService {
  private url: string;
  // private _model: any;
  public data: any;
  public get = this.getUser;
  public displayedColumns: string[] = [];
  public dataSource: string[] = [];
  public pageIndex: any = 0;
  public pageSize: any = 10;
  public or: any = ''
  // public userquerys = this.userquerys;
  // public actividadquerys = this.actividadquerys;
  constructor(
    private _http: HttpClient,
    private _model: FactoryModelService,
    private _tools: ToolsService
  ) {
    // console.log(this._model.user);
    this.url = GLOBAL.url;
    this.getUser('');
  }
  getUser(paginate: any) {
    // console.log(this._model.user, paginate);
    if (this._model.user) {
      this.displayedColumns = [
        'posicion',
        'foto',
        'username',
        'fechadelpack',
        // 'email',
        'celular',
        'nivel',
        // 'createdAt'
      ];
      return this.userquerys(this._model.user.id, paginate)
      .subscribe((res: any) => {
          // console.log(res);
          if(paginate.or){
            this.dataSource = [];
          }
          const
            populateNivel :any = this.populateNivel,
            _model: any = this._model
          ;
          _.forEach(res.data, function(item){
            item.nivel = 'GRATUITO';
            item.fechadelpack = 'none';
            populateNivel(item, _model)
            .subscribe(
              (res: any)=>{
                // console.log(res);
                // console.log(res);
                if(res){
                  item.fechadelpack = res.fechadelpack;
                  item.nivel = res.title;
                }
              }
            );
          })
          ;
          // console.log(res.data);
          this.dataSource = _.unionBy(this.dataSource || [], res.data, 'id');
      })
      ;
    }
  }
  populateNivel(item: any, _model: any){
    return _model.query('usernivel/cargarNivel',{
      where:{
        user: item.id
      }
    })
    ;
  }
  userquerys(data: any, paginate: any) {
    // console.log('data_:', data);
    // console.log(paginate);
    if (paginate) {
      if (paginate.pageSize) {
        this.pageIndex = paginate.pageIndex;
        this.pageSize = paginate.pageSize;
      }
    }
    // console.log(data);
    const
      querys: any = {
          where:{
            cabeza: data,
            estado: ['activo', 'verificando']
          },
          limit: this.pageSize || 5,
          skip: this.pageIndex || 0
      }
    ;
    if(paginate){
      if(paginate.or){
        querys.where.or = [
          {
            name:{
              contains: paginate.or || ''
            }
          },
          {
            email:{
              contains: paginate.or || ''
            }
          },
          {
            celular:{
              contains: paginate.or || ''
            }
          },
          {
            estado:{
              contains: paginate.or || ''
            }
          },
          {
            lastname:{
              contains: paginate.or || ''
            }
          }
        ];
      }
    }
    // console.log(querys);
    querys.limit= -1;
    // // console.log(pageIndex, pageSize);
    return this._model.query('user', querys)
    ;
  }
  // TODO no buscar por los 2 atributos solo busca por 1
  actividadquerys(data: any) {
    // console.log(data);
    return this._model.query('actividad', {
      user: data.id,
      estado: 'realizado'
    })
    ;
  }
  ususariosquerys(data: any){
    return this._model.query('user', {
      where:{
        cabeza: data.id,
        estado: ['activo', 'verificando']
      },
      limit: -1
    })
    ;
  }
  tareashoy(query: any){
    return this._model.query("actividad",query);
  }
}
