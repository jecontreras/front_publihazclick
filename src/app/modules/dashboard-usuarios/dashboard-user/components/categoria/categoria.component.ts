import { Component, OnInit } from '@angular/core';
import { FactoryModelService } from '../../../../../services/factory-model.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss']
})
export class CategoriaComponent implements OnInit {
  cantidadReferidos: any = 0;
  nivel = '';
  listCategoria:any = [];
  constructor(public _model: FactoryModelService) { }

  ngOnInit() {
    // console.log(this.data)
    this._model.query('nivel', {}).subscribe(
      (response: any) => {
        console.log(response);
        this.listCategoria = response.data;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
