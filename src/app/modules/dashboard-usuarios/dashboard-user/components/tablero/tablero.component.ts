import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import * as _ from 'lodash';
import * as moment from 'moment';
import { TableroService } from '../../services/tablero.service';
import { FactoryModelService } from '../../../../../services/factory-model.service';


@Component({
  selector: 'app-tablero',
  templateUrl: './tablero.component.html',
  styleUrls: ['./tablero.component.scss'],
  providers: [TableroService, FactoryModelService]
})
export class TableroComponent implements OnInit {

  canvas: any = {};
  dataPuntos: any = [];
  dataPuntosRef: any = {};
  dataCantidadRef: any = {};
  dataPaquetes: any = {};
  dataRetiradoPuntos: any = {};
  totalPuntos: any = 0;
  dataActividad: any = [];
  disablever: boolean = false;
  eje: any = 0;
  general: any = {
    publicacion: {},
    recompensa: {},
    referidos: {},
    Tareas: {},
    paquete: {},
    click: {}
  }
  ;

  constructor(
    private _Tablero: TableroService,
    private _model: FactoryModelService
  ) {
  }

  ngOnInit() {
    // console.log(this._model);
    const user: any  = JSON.parse(localStorage.getItem('user'));
    this._model.user = user;
    if (this._model.user) {
      this.getPuntos();
      this.getPaquetes();
      this.getCantidadRef();
      this.getActividad();
      this.getRetiradoPuntos();
      this.getPublicaciones();
    }
  }
  getPuntos() {
    // console.log("men", this._model.user.id);
    const
      query: any = {
        where:{
          user: this._model.user.id,
          state: ['valido', 'retirado']
        },
        limit: -1
      }
    ;
    return this._Tablero.getPuntos(query)
    .subscribe(
      (res: any) => {
        // console.log(res);
        const
          labels: any = [],
          datasets: any = []
        ;
        let
          flag: any = 0,
          totalDisponible: any = 0,
          totalRetirado: any = 0,
          click: any = 0,
          clickreferidos: any = 0
        ;
        _.forEach(res.data, function(item: any, val: any) {
          if(item.tipo === 'directo'){
            click +=item.valor;
          }
          if(item.tipo === 'cabeza'){
            clickreferidos +=item.valor;
          }
          if(item.state === 'valido'){
            if (item.valor) {
              totalDisponible += item.valor;
            }
          }
          if(item.state === 'retirado'){
            if (item.valor) {
              totalRetirado += item.valor;
            }
          }
        })
        ;
        // console.log(totalRetirado, totalDisponible);
        this.general.recompensa.click = click;
        this.general.recompensa.clickreferidos = clickreferidos;
        this.general.recompensa.disponible = totalDisponible;
        this.general.recompensa.retirado = totalRetirado;
      }
    )
    ;
  }
  getCantidadRef() {
    // console.log(res);
    const
      labels: any = [],
      datasets: any = [],
      query: any = {
        where:{
          cabeza: this._model.user.id
        },
        limit: -1
      }
    ;
    let
      totalactivos: any = 0,
      totalinactivos: any = 0
    ;
    this._Tablero.getUserCabeza(query)
    .subscribe(
      (res: any) =>{
        // console.log(res);
        res = res.data;
        var
          map: any = _.map(res, 'id'),
          _Tablero: any = this._Tablero,
          general:any = this.general
        ;
        // console.log(map[0]);
        _.forEach(map, function(item: any, val: any){
          return _Tablero.getnivel({
            user: item
          })
          .subscribe(
            (rta: any) =>{
              // console.log(rta);
              rta = rta.data[0];
              if(rta){
                // rta = _.unionBy(rta || [], rta, 'user');
                // console.log(rta);
                totalactivos+=1;
              }
              general.referidos.activos = totalactivos;
              general.referidos.inactivos = map.length - totalactivos;
            }
          )
          ;
        })
        ;
        // this.general.referidos.activos = totalactivos;
        // this.general.referidos.inactivos = totalinactivos;
      }
    )
    ;
  }
  getPaquetes() {
    const
      _Tablero = this._Tablero,
      dataPaquetes = this.dataPaquetes,
      general = this.general,
      query: any = {
        where:{
          user: this._model.user.id,
          x_respuesta: "Aceptada"
        },
        limit: -1
      }
    ;
    return this._Tablero.getPaquetes(query)
    .subscribe(
      (res: any) => {
        // console.log(res);
        const
          estadis: any = {
            totalBasic: 0,
            totalEmprend: 0,
            totalLider: 0
          }
        ;
        _.forEach(res.data, function(item) {
          _Tablero.populatePaquete(item.paquete)
          .subscribe(
            // tslint:disable-next-line:no-shadowed-variable
            (res: any) => {
              // console.log(res);
              next(res, general, estadis);
            }
          )
          ;
        })
        ;
      }
    )
    ;
    // tslint:disable-next-line:no-shadowed-variable
    function next(res: any, general: any, estadis: any) {
      // console.log(res);
      const
        labels: any = [],
        datasets: any = []
      ;
      let
        flag: any = 0
      ;
      _.forEach(res.data, function(item, val) {
        // console.log(item);
        if (item.title === 'Paquete Basico') {
          estadis.totalBasic += 1;
          // console.log(estadis.totalBasic);
        } else if (item.title === 'Paquete Emprendedor') {
          estadis.totalEmprend += 1;
        } else {
          estadis.totalLider += 1;
        }
        // tslint:disable-next-line:no-shadowed-variable
        _.forEach(labels, function(labels, i) {
          // console.log(labels, moment(item.createdAt).format('DD/MM/YYYY'))
          if (labels.indexOf(item.title) > -1) {
            datasets[i] += item.valor;
            flag++;
          }
        })
        ;
        if (flag === 0) {
          labels.push(item.title);
          datasets.push(item.valor);
        }
        flag = 0;
      })
      ;
      // console.log(estadis.totalBasic);
      general.paquete.basico = estadis.totalBasic;
      general.paquete.emprendedor = estadis.totalEmprend;
      general.paquete.lider = estadis.totalLider;
    }
  }
  getRetiradoPuntos() {

  }
  getActividad(){
    const
      query: any = {
        where:{
          user: this._model.user.id,
          estado: ['activo', 'realizado']
        },
        limit: -1
      }
    ;
    this._Tablero.getActividad(query)
    .subscribe(
      (res: any)=>{
        // console.log(res);
        let
          realizado: any = 0,
          norealizado: any = 0,
          dataActividad: any = [],
          contador = 0,
          data = [],
          flag = 0,
          obj={}
        ;
        _.forEach(res.data, function(item, val){
          if(item.estado === 'realizado'){
            realizado+=1;
          }else{
            norealizado+=1;
          }
          _.forEach(dataActividad, function(labels, i){
            if(labels.create.indexOf(item.create) > -1){
              if(item.estado === 'realizado'){
                dataActividad[i].cantidadrealizado += 1;
              }else{
                dataActividad[i].cantidadnorealizado += 1;
              }
              flag += 1;
            }
          })
          ;
          if(flag === 0){
            if(item.estado === 'realizado'){
              dataActividad.push({
                create: item.create,
                cantidadrealizado: 1,
                cantidadnorealizado: 0
              });
            }else{
              dataActividad.push({
                create: item.create,
                cantidadrealizado: 0,
                cantidadnorealizado: 1
              });
            }
          }
          flag = 0;
        })
        ;
        // console.log(dataActividad);
        this.dataActividad = dataActividad;
        this.general.click.realizado = realizado;
        this.general.click.norealizado = norealizado;
      }
    )
    ;
  }
  getPublicaciones() {
    const
      query: any = {
        where:{
          user: this._model.user.id,
          autocreo: false
        },
        limit: -1
      }
    ;
    return this._Tablero.getPublicaciones(query)
    .subscribe(
      (res: any) => {
        // console.log(res);
        var
          disponible: any = 0,
          utilizado: any = 0,
          data: []
        ;
        _.forEach(res.data, function(item){
          item.cantidad = 0;
          if(item.prioridad === 'super'){
            utilizado+=1;
          }
          if(item.prioridad === 'basica'){
            disponible+=1;
          }
        })
        ;
        this.general.publicacion.dispoble = disponible;
        this.general.publicacion.utilizado = utilizado;
      }
    )
    ;
  }
  verActividad(){

  }

}
