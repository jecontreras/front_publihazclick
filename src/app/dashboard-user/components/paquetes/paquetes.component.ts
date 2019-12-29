import { Component, OnInit } from '@angular/core';
import { PaquetesService } from '../../services/paquetes.service';
import { ToolsService } from '../../services/tools.service';
import * as _ from 'lodash';
import * as md5 from 'md5';
import { FactoryModelService } from '../../services/factory-model.service';
import { GLOBAL } from '../../../services/global';
declare var ePayco: any;
@Component({
  selector: 'app-paquetes',
  templateUrl: './paquetes.component.html',
  styleUrls: ['./paquetes.component.scss']
})
export class PaquetesComponent implements OnInit {
  public paquetes: any;
  private globalUrl: string = GLOBAL.url;
  public disable = true;
  public user: any = {};
  constructor(
    private _paquetesService: PaquetesService,
    private _tools: ToolsService,
    private _model: FactoryModelService,
  ) {
    this.cargarPaquetes();
    this.user = this._model.user;
    // console.log(this.user);
  }

  ngOnInit() {
    if (this._model.user) {
      const
        userpaquete: any = this._model.user
        ;
      // console.log(this._model.user);
      this.disable = false;
      if (userpaquete.paquete) {
        if (userpaquete.vigencia >= 9) {
          this.disable = true;
        }
      }
    }
  }
  cargarPaquetes() {
    this._model.query('paquete', {
      where:{
        estado: "activo"
      },
      sort: {
        createdAt: 'asc'
      }
    })
      .subscribe(
        (response: any) => {
          response = response.data;
          if (response.length > 0) {
            this.paquetes = response;
            this.datospayu();
            // console.log(response);
          } else {
            this._tools.openSnack('No se encontraron paquetes que cargar', 'Error', false);
          }
        },
        (error: any) => {
          this._tools.openSnack('Ha ocurrido un error al cargar los paquetes', 'Error', false);
          console.log('Error', error);
        }
      );
  }
  datospayu() {
    const
      _model: any = this._model,
      codigo: any = this.codigo
      ;
    // console.log(_model);
    _.forEach(this.paquetes, function (item) {
      if(item.title === "Paquete Basico"){
        item.url = item.url || "https://recaudos.pagosinteligentes.com/CollectForm.aspx?Token=be3c7e95-5c30-47e3-9209-9e88a2e6f57d";
        item.otrourl = item.otrourl || "https://publihazclick.s3.amazonaws.com/paquetes/19fd8728-c89b-44c7-951b-79dcbbace3ff.jpg";
        item.wester = item.wester || "https://www.google.com.co/";
        item.imgwester = item.imgwester || "https://www.viviendocali.com/wp-content/uploads/2017/10/Western-Union-en-bucaramanga.jpg"
      }else{
        item.url = item.url || "https://recaudos.pagosinteligentes.com/CollectForm.aspx?Token=4413c925-ffdf-4543-a2da-bd22ca4f4dff";
        item.otrourl = item.otrourl || "https://publihazclick.s3.amazonaws.com/paquetes/19fd8728-c89b-44c7-951b-79dcbbace3ff.jpg";
        item.wester = item.wester || "https://www.google.com.co/";
        item.imgwester = item.imgwester || "https://www.viviendocali.com/wp-content/uploads/2017/10/Western-Union-en-bucaramanga.jpg"
      }
      item.name = item.title;
      item.invoice = codigo;
      item.currency = 'cop';
      item.amount = item.valor;
      item.tax_base = '0';
      item.tax = '0';
      item.country = 'co';
      item.test = false;
      item.lang = 'eng';
      item.external = 'true';
      item.extra1 = 'extra1';
      item.extra2 = 'extra2';
      item.extra3 = 'extra3';
      // item.confirmation = 'http://api.publihazclick.com/paquete/comprado';
      // item.response = 'https://publihazclick.com/paquete';
      // Atributos cliente
      item.name_billing = _model.user.name + ' ' + _model.user.lastname;
      item.email_billing = _model.user.email;
      item.address_billing = _model.user.ciudad || 'cucuta';
      item.type_doc_billing = _model.user.tipdoc;
      item.mobilephone_billing = _model.user.celular;
      item.number_doc_billing = _model.user.celular;
      // }
      // if(item.title === 'Paquete Basico'){
      //   item.url = 'https://payco.link/191876';
      // }
    });
  }
  codigo() {
    return (Date.now().toString(36).substr(2, 3) + Math.random().toString(36).substr(2, 2)).toUpperCase();
  }
  comprar(obj: any) {
    // console.log(obj);
    if (obj) {
      this.buy(obj);
    }
  }
  private buy(obj: any) {
    if (!this.disable) {
      const handler: any = ePayco.checkout.configure({
        key: GLOBAL.keyEpayco,
        test: GLOBAL.estadoPruebaPagos
      })
        ;
      handler.open(obj);
    }
  }
}
