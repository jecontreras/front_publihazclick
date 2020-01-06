import { Injectable } from '@angular/core';
import { FactoryModelService } from '../../../../services/factory-model.service';
import { ToolsService } from './tools.service';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class PuntosService {
  public puntos: any;
  public puntosValor: number;
  constructor(
    private _model: FactoryModelService,
    private _tools: ToolsService
  ) {
    this.puntosValor = 0;
  }
  cargarPuntosUser() {
    const params = {
      where: {
        user: this._model.user.id,
        state: 'valido'
      }
    };
    this._model.query('puntos', params)
    .subscribe(
      (response: any) => {
        console.log(response);
          if (response.data.length > 0) {
            this._tools.openSnack('Puntos cargados correctamente', 'Ok', false);
            this.puntos = response.data;
            _.forEach(this.puntos, (item: any) => {
                this.puntosValor += parseInt(item.valor, 10);
            });
          } else {
            this._tools.openSnack(' No tienes puntos vigentes', 'Ok', false);
            this.puntos = [];
            this.puntosValor = 0;
          }
      },
      (error: any) => {
          console.log('Error', error);
      });
  }
}
