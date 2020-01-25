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
export class NotasService {

  constructor(
    private _model: FactoryModelService
  ) { }
  pushNota(query: any){
    return this._model.create('notas', query);
  }
  deleteNota(query: any){
    return this._model.delete('notas', query.id, query);
  }
}
