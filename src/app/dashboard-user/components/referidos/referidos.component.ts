import { Component, OnInit } from '@angular/core';
import {PageEvent} from '@angular/material';
import { ReferidosService } from './../../services/referidos.service';
import * as _ from 'lodash';
import { FactoryModelService } from '../../services/factory-model.service';
import * as moment from 'moment';

@Component({
  selector: 'app-referidos',
  templateUrl: './referidos.component.html',
  styleUrls: ['./referidos.component.scss'],
  providers: [ ReferidosService ]
})
export class ReferidosComponent implements OnInit {

  public list: any;
  public data: any = [];
  public check = true;
  public datos: any = {};
  public txt: any = {};
  public limit = 10;
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 25, 100, 120, 150, 200, 250, 280, 300];
  public txtretiro: any = '';
  constructor(
    private _model: FactoryModelService,
    private _ReferidosService: ReferidosService
  ) {
    // console.log(_ReferidosService);
    this.data = _ReferidosService;
    this.check = false;
    this.datos = {
      recompensas: 0
    };
  }
  ngOnInit() {
    
  }
  openreferidos(obj: any, data: any) {
    this.check = !this.check;
    // console.log(obj);
    if (obj) {
      if (obj.id) {
        this.datos = obj;
        this.populateref(obj, data);
        this.tareashoy(obj);
      }
    } else {
      this.datos = {};
    }
    // console.log(this.datos);
  }
  tareashoy(data: any){
    // console.log(data);
    this._ReferidosService.tareashoy({
      where:{
        user: data.id,
        create: true
      }
    })
    .subscribe(
      (res: any)=>{
        // console.log(res);
        res = res.data;
        data.tareashoy = res.length || 0;
      }
    )
    ;
  }
  populateref(data: any, model: any) {
    // console.log(model);
    if(data){
      this._ReferidosService.ususariosquerys(data)
      .subscribe((res: any) => {
          res = res.data;
          // console.log('referidos', res);
          this.datos.seguidores = res.length;
          model.actividadquerys(data)
          .subscribe((response: any) => {
            // console.log(response);
            // this.datos.clicks = response.data.length;
            let
              recompensa = 0
            ;
            _.forEach(response.data, function(item) {
              if (item.valor) {
                recompensa+= item.valor;
              }
            })
            ;
            // console.log(recompensa);
            this.datos.recompensas = recompensa;
          })
          ;
      })
      ;
    }
  }
  setPageSizeOptions(model: any, ev: any) {
    // console.log(ev);
    ev.pageSize = 10;
    model.getUser(ev);
  }
  buscadortxt(model: any) {
   // console.log('hey');
   const
    ev = {
      or: this.txtretiro,
      pageSize: 10,
      pageIndex: 0
    }
   ;
   model.getUser(ev);
  }
}
