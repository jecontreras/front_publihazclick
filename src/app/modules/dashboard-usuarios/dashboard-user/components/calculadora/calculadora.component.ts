import { Component, OnInit } from '@angular/core';
import { FactoryModelService } from '../../../../../services/factory-model.service';

@Component({
  selector: 'app-calculadora',
  templateUrl: './calculadora.component.html',
  styleUrls: ['./calculadora.component.scss']
})
export class CalculadoraComponent implements OnInit {
  cantidadReferidos: any = 0;
  nivel = '';
  constructor(public _model: FactoryModelService) { }

  ngOnInit() {
    this._model.query('nivel', {}).subscribe(
      (response: any) => {
        console.log(response);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  calcular() {
    console.log(this.cantidadReferidos);
    if (this.cantidadReferidos === null) {
      this.cantidadReferidos = 0;
    }
  }
}
