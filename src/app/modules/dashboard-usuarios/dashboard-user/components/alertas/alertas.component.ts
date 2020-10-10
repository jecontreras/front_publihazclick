import { Component, OnInit } from '@angular/core';
import { FactoryModelService } from '../../../../../services/factory-model.service';
import swal from 'sweetalert';
import * as moment from 'moment';
import * as _ from 'lodash';
import { PaquetesService } from '../../services/paquetes.service';

@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.component.html',
  styleUrls: ['./alertas.component.scss']
})
export class AlertasComponent implements OnInit {
  public titulo: string;
  public mensaje: string;
  public titulo2: string;
  public mensaje2: string;
  public carga: boolean;
  public log: any = [];
  public nivelase: boolean = false;
  listActivacion: any = [];
  disabled:boolean = false;

  constructor(
    public _model: FactoryModelService,
    private _paquete: PaquetesService
  ) {
    this.titulo = '';
    this.mensaje = '';
    this.titulo2 = '';
    this.mensaje2 = '';
    this.carga = true;
  }
  ngOnInit() {
    setTimeout(() => {
      //console.log(this._model.user);
      if (this._model.user) {
        if (this._model.user.nivel) {
          if (this._model.user.nivel.title === 'GRATUITO') {
            this.nivelase = true;
            this.log.push({
              titulo: 'Importante',
              mensaje: 'Recuerda que tienes 15 dias para comprar un paquete o tu cuenta sera inhabilitada !'
            });
            /*if( this._model.user['puntosValor'] >= 20100 ){
              this.listActivacion = [ this.formatiando() ];
            }*/
          }
        }
        this.chequiarPublicacion();
        this.chequiarNotas();
      }
      this.carga = false;
    }, 6000);
  }

  formatiando() {
    return {
      "ids": this._model.user.email,
      "titulo": "Paquete",
      "prioridad": "alta",
      "valor": "33000",
      "tipo": "notificaciones",
      "user": "5e8b6044482a870459c32a79",
      "datosepayco": {
        "x_description": "Paquete Basico",
        "x_id_factura": this.codigo() + " factura",
        "x_currency_code": "SZ10P",
        "x_respuesta": "Aceptada",
        "x_amount": "33000",
        "x_bank_name": "Compra Manual",
        "x_transaction_id": "SZ1E4 x_transaction_id",
        "x_fecha_transaccion": "2020-05-04T21:03:33.811Z",
        "x_customer_doctype": "cc",
        "x_customer_document": "123",
        "x_customer_email": this._model.user.email,
        "x_customer_ip": "10.132.70.24",
        "x_test_request": "Manual Admin",
        "x_ref_payco": this.codigo(),
        "app": "publihazclickrootadmin"
      },
      "descripcion": `Puedes comprar paquete con tu acomulado ${ this._model.user.email } el dia ${ moment().format("DD/MM/YYYY") } se Te Activara Cuando Le Des Consumir ->`,
      "app": "publihazclickrootadmin",
      "estado": "visto",
    }
  }

  chequiarPublicacion() {
    const
      query: any = {
        user: this._model.user
      }
      ;
    if (query.user.paquete) {
      // console.log(query);
      return this._model.query('publicacion/chequiar', query)
        .subscribe(
          (res: any) => {
            // console.log(res);
            if (res.data === 'No Tiene Actividades Creadas') {
              this.log.push({
                titulo: 'Importante',
                mensaje: 'Recuerda que debes consumir tu espacio publicitario!'
              })
                ;
            }
          }
        );
    }
  }

  chequiarNotas() {
    const
      query: any = {
        user: this._model.user.id,
        tipo: 'notificaciones',
        estado: 'novisto'
      },
      nivelase: any = this.nivelase,
      log: any = this.log
      ;
    // console.log(query);
    if (query.user) {
      return this._model.query('notas', query)
        .subscribe(
          (res: any) => {
            // console.log(res);
            _.forEach(res.data, function (item) {
              if (item.valor) {
                if (nivelase) {
                  log.push({
                    titulo: item.titulo,
                    id: item.id,
                    mensaje: item.descripcion,
                    valor: item.valor,
                    datosepayco: item.datosepayco
                  })
                    ;
                }
              } else {
                log.push({
                  titulo: item.titulo,
                  id: item.id,
                  mensaje: item.descripcion
                })
                  ;
              }
            })
              ;
          });
    }
  }

  evento(indice: any, data: any, opt: string) {
    const
      query: any = {
        id: data.id,
        estado: 'visto'
      }
      ;
    // console.log(query);
    if (opt === 'paquete') {
      this.disabled = true;
      this.eventpaquete(indice, data, opt);
    } else {
      this.log.splice(indice, 1);
      if (query.id) {
        return this._model.update('notas', query.id, query)
          .subscribe(
            (res: any) => {
              // console.log(res);
            })
          ;
      }
    }
  }

  eventpaquete(indice: any, data: any, opt: string, nopase:boolean = false) {
    if (this._model.user.email) {
      const
        parametros: any = {
          x_description: data.datosepayco.x_description || 'Paquete Basico',
          x_id_factura: data.datosepayco.x_id_factura || this.codigo() + ' factura',
          x_currency_code: data.datosepayco.x_currency_code || this.codigo(),
          x_respuesta: data.datosepayco.x_respuesta || 'Aceptada',
          x_amount: data.datosepayco.x_amount || data.valor,
          x_bank_name: data.datosepayco.x_bank_name || 'AutoCompra',
          x_transaction_id: data.datosepayco.x_transaction_id || this.codigo() + ' x_transaction_id',
          x_fecha_transaccion: data.datosepayco.x_fecha_transaccion || new Date(),
          x_customer_doctype: data.datosepayco.x_customer_doctype || this._model.user.tipdoc || 'cc',
          x_customer_document: data.datosepayco.x_customer_document || this._model.user.documento || '123',
          x_customer_email: data.datosepayco.x_customer_email || this._model.user.email,
          x_customer_ip: data.datosepayco.x_customer_ip || '10.132.70.24',
          disableretiro: data.datosepayco.disableretiro || false,
          x_test_request: data.datosepayco.x_test_request || "retiro de nota",
          x_ref_payco: data.datosepayco.x_ref_payco || this.codigo(),
          prueba: true
        }
        ;
      if (data.valor !== 30000) {
        parametros.x_description = 'Paquete Emprendedor';
      }
      return this._model.create('paquete/comprado', parametros)
        .subscribe(
          (res: any) => {
            // console.log(res);
            if (res) {
              swal('ok', 'Se Te a Reactivado el paquete Por Favor Salir De Sesión y Volver a Entrar!', 'success');
              if( !nopase ) this.evento(indice, data, 'visto');
              else this.resetiarPuntos();
            } else {
              swal('Oops', 'Error En La Activacion Por Favor Informanos!', 'error');
            }
          }
        )
        ;
    }
  }

  resetiarPuntos(){
    this._paquete.reportar({
      user: this._model.user.id,
      cantidad: 20100
    }).subscribe((res:any)=>console.log(res),(error:any)=>console.error(error));
  }

  codigo() {
    return (Date.now().toString(36).substr(2, 3) + Math.random().toString(36).substr(2, 2)).toUpperCase();
  }

}
