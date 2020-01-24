import { Component, OnInit } from '@angular/core';
import { FactoryModelService } from 'src/app/services/factory-model.service';

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

  constructor(
    private _factory: FactoryModelService,
  ) { }

  ngOnInit() {
    this.cargarTodos();
  }

  cargarTodos() {
    this._factory.query('retiros', {limit: 10, skip: 10 }).subscribe(
      (response: any) => {
        console.log(response);
        this.dataTable = {
          headerRow: ['Name', 'Lastname', 'Username', 'Cabeza', 'Email', 'Celular', 'Acciones'],
          footerRow: ['Name', 'Lastname', 'Username', 'Cabeza', 'Email', 'Celular', 'Acciones'],
          dataRows: []
        };
        this.dataTable.headerRow = ['Name', 'Lastname', 'Username', 'Cabeza', 'Email', 'Celular', 'Acciones'];
        this.dataTable.footerRow = ['Name', 'Lastname', 'Username', 'Cabeza', 'Email', 'Celular', 'Acciones'];
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
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Buscar",
      }

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

}
