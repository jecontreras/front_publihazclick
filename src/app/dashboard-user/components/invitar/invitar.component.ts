import { Component, OnInit } from '@angular/core';
import { FactoryModelService } from '../../services/factory-model.service';
import { ToolsService } from '../../services/tools.service';
import { GLOBAL } from './../../../services/global';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-invitar',
  templateUrl: './invitar.component.html',
  styleUrls: ['./invitar.component.scss']
})
export class InvitarComponent implements OnInit {
  public data: any = [];
  public url: string = GLOBAL.urlFront;
  constructor(
    private _model: FactoryModelService,
    private _tools: ToolsService
  ) { }

  ngOnInit() {
    // console.log(this._model.user);
    this.data = this._model.user;
    this.getCabeza();
    // this.eje();
  }
  // eje(){
  //   this._model.query("userpaquete/consulpaquete",{
  //     where:{
  //     },
  //     limit: 1
  //   })
  //   .subscribe(
  //     (res:any)=>{
  //       console.log(res);
  //       res = res.data;
  //       let m = Array();
  //       _.forEach(res, (row, idx:any)=>{
  //         return this._model.query("actividad",{
  //           where:{
  //             // prioridad: "tarea-diaria",
  //             user: row.user,
  //             create: "16/09/2019"
  //           },
  //           limit: 1
  //         }).subscribe((rta:any)=>{
  //           // console.log(rta);
  //           rta = rta.data[0];
  //           if(!rta) m.push(row);
  //           if(idx === Object.keys(res).length-1){
  //             // console.log(m);
  //             _.forEach(m, (el)=>{
  //               return this._model.query('usernivel/cargarNivel', {
  //                 where:{
  //                   user: el.user
  //                 }
  //               })
  //                 .subscribe(
  //                   (response: any) => {
  //                     console.log(response);
  //                     if (response) {
  //                       return this._model.query('actividad/generarActividades',{
  //                         where:{
  //                           id: el.user,
  //                           nivel: response.nivel.nivel
  //                         }
  //                       })
  //                       .subscribe(
  //                         (res:any)=>{
  //                           console.log(res);
  //                         }
  //                       )
  //                     }
  //                   }
  //                 )
  //                 ;
  //             })
  //           }
  //         });
  //       });
  //     }
  //   );
  // }
  getCabeza(){
    this._model.query('user',{
      where:{
        id: this.data.cabeza
      }
    })
    .subscribe(
      (res: any) =>{
        // console.log(res);
        res = res.data[0];
        if(res){
          this.data.cabeza = res;
          this.getnivel(res);
        }
      }
    );
  }
  getnivel(obj: any){
    this._model.query('usernivel', {
      where:{
        user: obj.id,
        nivel: {
          '!': null
        }
      },
      sort:{
        createdAt: 'desc'
      }
    })
    .subscribe(
      (response: any) => {
        // console.log(response);
        response = response.data[0];
        if(response){
          this.data.cabeza.nivel = response.nivel.title;
        }
      }
    );
  }
}
