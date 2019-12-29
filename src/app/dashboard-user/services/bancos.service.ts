import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './../../services/global';
import { FactoryModelService } from './factory-model.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ToolsService } from './tools.service';

@Injectable({
  providedIn: 'root'
})
export class BancosService {
  private url: string;
  // private _model: any;
  public data: any;
  public displayedColumns: string[] = [];
  public dataSource: string[] = [];
  public pageIndex = 1;
  public pageSize = 10;
  // public userquerys = this.userquerys;
  // public actividadquerys = this.actividadquerys;
  constructor(
    private _http: HttpClient,
    private _model: FactoryModelService,
    private _tools: ToolsService
  ) {
    // console.log(this._model.user);
    this.url = GLOBAL.url;
    this._model = this._model;
  }
  getBancos(query: any){
    return this._model.query('bancos', query);
  }
  getRetiros(query: any){
    return this._model.query('retiros', query);
  }
  getPuntosUser(query: any){
    return this._model.query('puntos', query);
  }
  // getpuntosretiros(query: any){
  //   return this._model.query('puntos', query);
  // }
  getUsuarios(query: any){
    return this._model.query('user', query);
  }
  pushRetiro(query: any){
    return this._model.create('retiros/retiroform', query);
  }
  deleteRetiro(query: any){
    return this._model.delete('retiros', query.id, query);
  }
  deleteBanco(query: any){
    return this._model.delete('bancos', query.id, query);
  }
  updatepuntos(query: any){
    return this._model.update('puntos', query.id, query);
  }
  pushpuntosretiros(query: any){
    return this._model.create('puntosretiros', query);
  }
  pushBanco(query: any){
    return this._model.create('bancos', query);
  }
  updatebanco(query: any){
    return this._model.update('bancos', query.id, query);
  }
  updateretiro(query: any){
    return this._model.update('retiros', query.id, query);
  }
  getnota(query: any){
    return this._model.query('notas', query);
  }
  createnota(query: any){
    return this._model.create('notas', query);
  }
}
