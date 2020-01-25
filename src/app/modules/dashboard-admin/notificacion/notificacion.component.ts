import { Component, OnInit } from '@angular/core';
import { FactoryModelService } from 'src/app/services/factory-model.service';
import { NotasService } from '../../dashboard-usuarios/dashboard-user/services/notas.service';

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: any[][];
}

declare const $: any;
declare const swal: any;

@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.component.html',
  styleUrls: ['./notificacion.component.scss']
})
export class NotificacionComponent implements OnInit {

  public dataTable: DataTable;
  public totalUsuarios = 0;
  public loader = true;
  public loaderBotones = false;
  public loadPuntos = false;
  public datoBusqueda = '';
  public query:any = {
    limit: 50, 
    where:{
      tipo: "notificaciones"
    },
    skip: 0,
  };

  constructor(
    private _factory: FactoryModelService,
    private _Nota: NotasService
  ) { }

  ngOnInit() {
    this.cargarTodos();
  }

  cargarTodos() {
    this._factory.post('notas/query', this.query).subscribe(
      (response: any) => {
        //console.log(response);
        this.dataTable = {
          headerRow: ['Foto', 'Usuario', 'Titulo', 'Fecha', 'Prioridad', 'Estado', 'Tipo', 'Descripcion', 'Acciones'],
          footerRow: ['Foto', 'Usuario', 'Titulo', 'Fecha', 'Prioridad', 'Estado', 'Tipo', 'Descripcion', 'Acciones'],
          dataRows: []
        };
        this.dataTable.headerRow = this.dataTable.headerRow;
        this.dataTable.footerRow = this.dataTable.footerRow;
        this.dataTable.dataRows = response.data;
        this.totalUsuarios = response.count;
        this.loader = false;
        setTimeout(() => {
          this.config();
          console.log("se cumplio el intervalo");
        }, 500);
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
      }*/

    });

    const table = $('#datatables').DataTable();

    /* // Edit record
    table.on('click', '.edit', function (e) {
      let $tr = $(this).closest('tr');
      if ($($tr).hasClass('child')) {
        $tr = $tr.prev('.parent');
      }

      var data = table.row($tr).data();
      alert('You press on Row: ' + data[0] + ' ' + data[1] + ' ' + data[2] + '\'s row.');
      e.preventDefault();
    }); */

    /* // Delete a record
    table.on('click', '.remove', function (e) {
      const $tr = $(this).closest('tr');
      table.row($tr).remove().draw();
      e.preventDefault();
    }); */

    //Like record
    table.on('click', '.like', function (e) {
      alert('You clicked on Like button');
      e.preventDefault();
    });

    $('.card .material-datatables label').addClass('form-group');
  }
  seleccion(obj:any, index){
    return this._Nota.deleteNota(obj)
    .subscribe(rta=>this.dataTable.dataRows.splice(index, 1));
  }
  buscar() {
    this.loader = true;
    //console.log(this.datoBusqueda);
    this.datoBusqueda = this.datoBusqueda.trim();
    if (this.datoBusqueda === '') {
      this.cargarTodos();
    } else {
      this.query.where.or = [
        {
          codigo: {
            contains: this.datoBusqueda|| ''
          }
        }
      ];
      this.cargarTodos();
    }
  }

}
