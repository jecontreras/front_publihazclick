import { Component, OnInit } from '@angular/core';
import { FactoryModelService } from '../../../../../services/factory-model.service';
import * as _ from 'lodash';
export interface CalculadorData {
  categoria?: string,
  referidos?: number,
  recompActivacionInvitados?: number,
  gananciasDiariasClick?: number,
  cantidadMiniAnunciosNumeroInvitados?: string,
  gananciasMensualMinianuncios?: number,
  valorPagarClickReferidos?: number,
  recomPensaDiariaInvitado?: number,
  recomPensaMes?: number,
  totalGananciasMensualesInvitado?: number,
  totalMes?: number
};

@Component({
  selector: 'app-calculadora',
  templateUrl: './calculadora.component.html',
  styleUrls: ['./calculadora.component.scss']
})
export class CalculadoraComponent implements OnInit {
  cantidadReferidos: any = 1;
  nivel = '';
  listCategoria:any = [];
  data:CalculadorData = {};
  constructor(public _model: FactoryModelService) { }

  ngOnInit() {
    // console.log(this.data)
    this._model.query('nivel', {}).subscribe(
      (response: any) => {
        console.log(response);
        this.listCategoria = response.data;
        this.calcular();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  async calcular() {
    // console.log(this.cantidadReferidos);
    if (this.cantidadReferidos === null) { this.cantidadReferidos = 0; return;}
    this.listCategoria = _.orderBy(this.listCategoria, ['referidos', 'asc']);
    for(let row of this.listCategoria){
      if(row.referidos<=this.cantidadReferidos){
        // console.log(row);
        let gruporeferidos = this.calcularMinianunciosInvitados(row);
        this.data = {
          categoria: row.title,
          recompActivacionInvitados: ( row.recompActivacionInvitados * 5 ) * this.cantidadReferidos,
          gananciasDiariasClick: (( row.cantidadminianuncios * 100 ) * row.cantidadminianunciosdiarios)+(134*5*30),
          cantidadMiniAnunciosNumeroInvitados: gruporeferidos + ` Actividades a $ ${ row.coinclickreferido } Total al Mes $ ${ ((( gruporeferidos * row.coinclickreferido ) * 30) || 0).toLocaleString('de-DE', { style: 'currency', currency: 'COP' }) }`,
          gananciasMensualMinianuncios: ((row.coinclickreferido * 5) * 30) * this.cantidadReferidos,
          valorPagarClickReferidos: row.coinclickreferido,
          recomPensaDiariaInvitado: row.coinclickreferido * 5,
          recomPensaMes: (((row.coinclickreferido * 5) *this.cantidadReferidos) * 30),
          totalGananciasMensualesInvitado: 0,
          totalMes: 0
        };
        this.data.totalGananciasMensualesInvitado = (this.data.recompActivacionInvitados + 
          this.data.gananciasMensualMinianuncios) + this.data.recomPensaMes ;

        this.data.totalMes = this.data.totalGananciasMensualesInvitado + this.data.gananciasDiariasClick;
      }
    }
  }
  calcularMinianunciosInvitados(row){
    let grupo = 0;
    let count = 0;
    for(var i = 0; i < this.cantidadReferidos; i++){
      // console.log(i);
      count++;
      if(count === row.countminireg){
        grupo++;
        count=0;
      }
    }
    return grupo;
  }
}
