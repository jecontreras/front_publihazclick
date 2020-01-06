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
declare const swal: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {
  public dataTable: DataTable;
  public usuarioSeleccionado: any = {};
  public contrasenaNueva: string = "";
  public correoNuevo: string = "";
  public loader = true;
  public datoBusqueda = '';
  public loaderBotones = false;
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
    this.cargarTodos();
  }
  ngAfterViewInit() {}
  cargarTodos() {
    this._factory.query('user', { limit: 10, skip: 10, populate: ['cabeza', 'rol'] }).subscribe(
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
      this.loaderBotones = true;
      this.usuarioSeleccionado.password = this.contrasenaNueva;
      const query = {
        user: this.usuarioSeleccionado
      };
      this._factory
        .post(
          'user/contrasena', query
        ).subscribe(
          (response: any) => {
            console.log(response);
            swal('Ok', `
      La contraseña se a cambiado con exito
      ` , 'success');
      this.loaderBotones = false;
          },
          error => {
            console.log('Error', error);
            swal('Oops', `
        Error al cambiar la contraseña
        ` , 'error');
        this.loaderBotones = false;
          });
    }
  }
  activaPaquete() {
    if (this.usuarioSeleccionado.paquete.length>0) {
      swal('Oops', `
      El usuario ya tiene un paquete activo
      ` , 'error');
    } else {
      this.loaderBotones = true;
      const url = 'https://backpublihazclick.herokuapp.com/paquete/comprado';
      this._factory
      .paquete(url, {
        user: this.usuarioSeleccionado
      }).subscribe(
        (response: any) => {
          console.log(response);
          swal('Ok', `
      El paquete se activo exitosamente
      ` , 'success');
          this.loaderBotones = false;
        },
        error => {
          console.log('Error', error);
          swal('Oops', `
      Error al activar el paquete
      ` , 'error');
          this.loaderBotones = false;
        });
    }
  }
  buscar() {
    this.loader = true;
    console.log(this.datoBusqueda);
    this.datoBusqueda = this.datoBusqueda.trim();
    if(this.datoBusqueda === '') {
      this.cargarTodos();
    } else {
      this._factory
      .post('user/search', {
        populate: ['cabeza', 'rol'],
        username: {
          'startsWith': this.datoBusqueda
        }
      }).subscribe(
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
  reenviarCorreo() {
    this.loaderBotones = true;
    const query = {
      where: {
        admin: this.usuarioSeleccionado
      }
    };
    this._factory
      .post(
        'user/correo', query
      ).subscribe(
        (response: any) => {
          console.log(response);
          swal('Ok', `
      El correo se envio exitosamente
      ` , 'success');
      this.loaderBotones = false;
        },
        error => {
          console.log('Error', error);
          swal('Oops', `
      Error al enviar el correo
      ` , 'error');
      this.loaderBotones = false;
        });
  }
  validarCorreo() {
    const regex = /^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
    if (!regex.exec(this.correoNuevo)) {
      swal('Oops', ` El correo debe cumplir los siguientes parametros: 
      -Mayúsculas y minúsculas del alfabeto ingles.
      -Números de 0 al 9
      -puede contener punto pero no al inicio o repetirse.
      -puede usar los caracteres: !#$%&'*+-/=?^_{|}~
      ` , 'error');
    } else {
      this.loaderBotones = true;
      this.usuarioSeleccionado.email = this.correoNuevo;
      const query = {
        user: this.usuarioSeleccionado
      };
      this._factory
        .post(
          'user/newcorreo', query
        ).subscribe(
          (response: any) => {
            console.log(response);
            swal('Ok', `
      El correo se a cambiado con exito
      ` , 'success');
      this.loaderBotones = false;
          },
          error => {
            console.log('Error', error);
            swal('Oops', `
        Error al cambiar el correo
        ` , 'error');
        this.loaderBotones = false;
          });
    }
  }

  actualizarDatos() {
    if(this.contrasenaNueva.trim() !== '') {
      this.validarContrasena();
    } else if(this.correoNuevo.trim() !== '') {
      this.validarCorreo();
    } else {
      swal('Oops', `
      Estas enviando la contraseña y el correo vacios
      ` , 'error');
    }
  }
}