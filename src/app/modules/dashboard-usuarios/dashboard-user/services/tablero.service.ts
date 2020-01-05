import { Injectable } from '@angular/core';
import { FactoryModelService } from './factory-model.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TableroService {
  constructor(
    private _model: FactoryModelService,
    private _http: HttpClient
  ) {

  }
  getActividad(query){
    return this._model.query('actividad', query);
  }
  getnivel(query){
    return this._model.query('userpaquete/consulpaquete', query);
  }
  getPuntos(query){
    return this._model.query('puntos', query);
  }
  getUserCabeza(query){
    return this._model.query('user', query);
  }
  getPaquetes(query){
    return this._model.query('userpaquete', query);
  }
  populatePaquete(query){
    return this._model.query('paquete', query);
  }

  getPublicaciones(query){
    return this._model.query('publicacion', query);
  }
}
