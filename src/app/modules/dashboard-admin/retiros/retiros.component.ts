import { Component, OnInit } from '@angular/core';
import { FactoryModelService } from 'src/app/services/factory-model.service';
import { BancosService } from '../../dashboard-usuarios/dashboard-user/services/bancos.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ToolsService } from '../../dashboard-usuarios/dashboard-user/services/tools.service';

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: any[][];
}

declare const $: any;
declare const swal: any;

@Component({
  selector: 'app-retiros',
  templateUrl: './retiros.component.html',
  styleUrls: ['./retiros.component.scss']
})
export class RetirosComponent implements OnInit {
  public dataTable: DataTable;
  public pagina = 10;
  public paginas = 0;
  public loader = true;
  public disableretiro: any = false;
  public disablebanco: any = false;
  public disablepunto: any = false;
  public displayedRetiros: string[] = [];
  public displayedBancos: string[] = [];
  public displayedPuntos: string[] = [];
  public bancosSource: string[] = [];
  public retirosSource: string[] = [];
  public puntoSource: string[] = [];
  public txt = '';
  public bancoForm: any = {};
  public retiroForm: any = {};
  public puntoForm: any = {};
  public txtretiro: any;
  constructor(
    private _factory: FactoryModelService,
    private _bancos: BancosService,
    private _tools: ToolsService
  ) { }

  ngOnInit() {
    this.cargarTodos();
    this.restoredataretiro();
  }

  cargarTodos() {
    let query = {
      where: {
        // user: this.retiroForm.user,
        estado: {
          '!': 'eliminada'
        }
      },
      sort: {
        createdAt: 'desc'
      },
      populate: 'tipoBanco',
      limit: -1
    }
    this._bancos.getRetiros(query)
    .subscribe(
      (response: any) => {
        console.log(response);
        this.dataTable = {
          headerRow: ['Usuario', 'Email', 'Cantidad', 'Estado', 'Tipo Banco', 'Creado'],
          footerRow: ['Usuario', 'Email', 'Cantidad', 'Estado', 'Tipo Banco', 'Creado'],
          dataRows: []
        };
        this.dataTable.headerRow = this.dataTable.headerRow;
        this.dataTable.footerRow = this.dataTable.footerRow;
        this.dataTable.dataRows = response.data;
        this.paginas = Math.ceil(response.count/10);
        console.log(this.paginas);
        /* new Array(response.count);
        let contador = 1; 
        for(let i=this.pagina-10; i<10; i++) {
          this.dataTable.dataRows[i] = response.data[contador];
          contador++;
        } */
        this.loader = false;
        this.config();
      },
      error => {
        console.log('Error', error);
      });
  }
  config() {
    $('#datatables').DataTable({
      "pagingType": "full_numbers",
      "lengthMenu": [
        [10, 25, 50, -1],
        [10, 25, 50, "All"]
      ],
      responsive: true,
      /*language: {
        search: "_INPUT_",
        searchPlaceholder: "Buscar",
      }
      */

    });

    const table = $('#datatables').DataTable();

    // Edit record
    table.on('click', '.edit', function (e) {
      let $tr = $(this).closest('tr');
      if ($($tr).hasClass('child')) {
        $tr = $tr.prev('.parent');
      }

      var data = table.row($tr).data();
      alert('You press on Row: ' + data[0] + ' ' + data[1] + ' ' + data[2] + '\'s row.');
      e.preventDefault();
    });

    // Delete a record
    table.on('click', '.remove', function (e) {
      const $tr = $(this).closest('tr');
      table.row($tr).remove().draw();
      e.preventDefault();
    });

    //Like record
    table.on('click', '.like', function (e) {
      alert('You clicked on Like button');
      e.preventDefault();
    });

    $('.card .material-datatables label').addClass('form-group');
  }
  restoredataretiro() {
    this.retiroForm = {
      titulo: moment().format(),
      //user: this._factory.user.id,
      estado: 'pendiente',
      coins: 0,
      codigo: this.codigo()
    }
      ;
    // this.getPuntosUser()
  }
  private codigo() {
    return (Date.now().toString(36).substr(2, 3) + Math.random().toString(36).substr(2, 2)).toUpperCase();
  }
  open(obj: any, opt: any) {
    // console.log(obj, data, opt);
    if (opt === 'bancos') {
      this.bancoForm = obj;
      this.disablebanco = !this.disablebanco;
    }
    if (opt === 'retiro') {
      this.retiroForm = obj;
      this.disableretiro = !this.disableretiro;
      this.getPuntos(false);
      // this.getUser(obj);
    }
    if (opt === 'puntos') {
      this.puntoForm = obj;
      this.disablepunto = !this.disablepunto;
    }
    // console.log(this.puntoForm);
  }
  getPuntos(page: any) {
    // console.log(this.retiroForm);
    // console.log(page)
    let
      pageSize: any = 5,
      pageIndex: any = 0
      ;
    if (page) {
      pageSize = page.pageSize;
      pageIndex = page.pageIndex;
    }
    const
      query: any = {
        where: {
          retiros: this.retiroForm.id
        },
        limit: pageSize,
        skip: pageIndex
      }
      ;
    this.displayedPuntos = [
      'posicion',
      'codigo',
      'valor',
      'actividad',
      'state',
      'createdAt',
    ];
    this._bancos.getPuntosUser(query)
      .subscribe(
        (res: any) => {
          // console.log(res);
          res = res.data;
          // tslint:disable-next-line:no-shadowed-variable
          let query: any = {};
          const  _bancos: any = this._bancos
            ;
          _.forEach(res, function (item) {
            item.actividad = {
              prioridad: 'tareas'
            };
            query = {
              where: {
                id: item.id,
              },
              populate: 'actividad',
              limit: 1
            };
            _bancos.getPuntosUser(query)
              .subscribe(
                (rta: any) => {
                  // console.log(rta);
                  rta = rta.data[0];
                  if (rta) {
                    // console.log(item, res);
                    item.actividad = rta.actividad;
                    if (!rta.codigo) {
                      rta.codigo = 'no generado';
                    }
                    item.puntos = rta;
                  }
                }
              )
              ;

          })
            ;
          this.puntoSource = _.unionBy(this.bancosSource || [], res, 'id');
          // console.log(this.puntoSource);
          // this.puntoSource = _.unionBy(this.bancosSource || [], res, 'id');
        }
      )
      ;
  }
  openretiro() {
    this.disableretiro = !this.disableretiro;
    this.restoredataretiro();
  }
  onBlur(obj: any) {
    const data: any = this.retiroForm;
    const query: any = {
        id: data.id
      }
      ;
    if (data[obj]) {
      query[obj] = data[obj];
      this._bancos.updateretiro(query)
        .subscribe(
          (res: any) => {
            console.log(res);
            if (res.id) {
              this._tools.openSnack('Actualizado Retiro', 'Completado', false);
              this.estadopuntos(res);
              if (res.pagopaquete) {
                if(res.pagopaquete === 20000){
                  if(res.estado === 'completado')this.createnota(res);
                }
              }
            }
          }
        )
        ;
    }
  }
  createnota(res: any) {
    if (res.pagopaquete) {
      const
        query: any = {
          ids: res.id,
          titulo: 'reactivacion de paquete',
          prioridad: 'alta',
          tipo: 'notificaciones',
          user: this._factory.user.id,
          descripcion: 'consumir paquete que pagaste por el ultimo retiro de dinero',
          valor: 33000
        };
      this._bancos.getnota({
        where: {
          ids: query.ids,
          tipo: 'notificaciones'
        }
      })
        .subscribe(
          (rta: any) => {
            // console.log(rta);
            if (!rta.data.length) {
              this._bancos.createnotapaquete(query)
                .subscribe(
                  () => {
                    // console.log(res);
                  }
                )
                ;
            }
          }
        )
        ;
    }
  }
  estadopuntos(res: any) {
    // dataPuntos
    // console.log(res);
    let query: any = {};
    const  promises: any = [];
    const  _bancos: any = this._bancos;
    const
      data: any = {
        where: {
          retiros: res.id
        },
        limit: -1
      }
      ;
    if (data.where.retiros) {
      this._bancos.getPuntosUser(data)
        .subscribe(
          // tslint:disable-next-line:no-shadowed-variable
          (res: any) => {
            // console.log(res);
            res = res.data;
            for (let i = 0; i < res.length; i++) {
              // tslint:disable-next-line:no-unused-expression
              res[i];
              query = {
                id: res[i].id,
                state: 'retirado'
              }
                ;
              // console.log(query);
              promises.push(
                _bancos.updatepuntos(query)
              )
                ;
            }
          }
        )
        ;
    }
  }

}
