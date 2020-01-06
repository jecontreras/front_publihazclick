import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FactoryModelService } from '../../../services/factory-model.service';
import { config } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: any[][];
}

declare const $: any;
declare const  swal: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {
  public dataTable: DataTable;
  public usuarioSeleccionado: any = {};
  public contrasenaNueva: string = "";
  public loader = true;
  public datoBusqueda = '';
  constructor(
    private _factory: FactoryModelService,
    public _usuario: UserService
  ) {
    this.dataTable = {
      headerRow: [],
      footerRow: [],
      dataRows: []
    };
  }

  ngOnInit() {
    // {limit: 10, skip: 10 }
    this._factory.query('user', { limit: 10, skip: 10, populate: ['cabeza','rol'] }).subscribe(
      (response: any) => {
        console.log(response);
        this.dataTable.headerRow = ['Name', 'Lastname', 'Username', 'Cabeza', 'Email', 'Celular', 'Acciones'];
        this.dataTable.footerRow = ['Name', 'Lastname', 'Username', 'Cabeza', 'Email', 'Celular', 'Acciones'];
        this.dataTable.dataRows = response.data;
        this.loader = false;
        this.config();
      },
      error => {
        console.log('Error', error);
      });
    this._factory.search({ limit: 10, skip: 10, joins: 'cabeza', app: 'publihazclickrootadmin' }).subscribe(
      (response: any) => {
        console.log('search');
        console.log(response);
      },
      error => {
        console.log('Error', error);
      });
  }

  ngAfterViewInit() {
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
  seleccion(row: any) {
    this.usuarioSeleccionado = row;
    const params = {
      where: {
        user: row.id
      }
    };
    this._factory.query('userpaquete/consulpaquete', params)
    .subscribe(
      (response: any) => {
        this.usuarioSeleccionado.paquete = response.data;
        console.log(this.usuarioSeleccionado);
      },
      error => {
        console.log('Error', error);
      }
    );
  }

  validarContrasena() {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,15}[^'\s]/;
    if (!regex.exec(this.contrasenaNueva)) {
      swal('Oops', ` La Contraseña debe cumplir los siguientes parametros: 
      -Minimo 8 caracteres
      -Maximo 15
      -Al menos una letra mayúscula
      -Al menos una letra minucula
      -Al menos un dígito
      -No espacios en blanco
      ` , 'error');
    } else {
      swal('Ok', `
      La contraseña se a cambiado con exito
      ` , 'success');
    }
  }
  activaPaquete() {
    if (false) {
      swal('Oops', `
      Paquete no activado
      ` , 'error');
    } else {
      swal('Ok', `
      El paquete se activo exitosamente
      ` , 'success');
    }
  }
  buscar(evt: any) {
    this.loader = true;
    this._factory
    .query('user', { limit: 10, skip: 10,  populate: ['cabeza','rol'] , or: [ {username: { 'like': '%' +  this.datoBusqueda }}, {username: this.datoBusqueda}] }).subscribe(
      (response: any) => {
        console.log(response);
        this.dataTable.headerRow = ['Name', 'Lastname', 'Username', 'Cabeza', 'Email', 'Celular', 'Acciones'];
        this.dataTable.footerRow = ['Name', 'Lastname', 'Username', 'Cabeza', 'Email', 'Celular', 'Acciones'];
        this.dataTable.dataRows = response.data;
        this.loader = false;
        this.config();
      },
      error => {
        console.log('Error', error);
      });
  }
}