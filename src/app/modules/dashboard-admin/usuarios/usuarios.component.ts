import { Component, OnInit } from '@angular/core';
import { FactoryModelService } from '../../../services/factory-model.service';
import { UserService } from 'src/app/services/user.service';
declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: any[][];
}

declare const $: any;
declare const swal: any;
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  public dataTable: DataTable;
  public usuarioSeleccionado: any = {};
  public paqueteSeleccionado: any;
  // modelos inputs
  public contrasenaNueva: string = "";
  public correoNuevo: string = "";
  public puntosNuevos = 0;
  public datoBusqueda = '';
  public cabezaNueva = '';
  public paquete = '';

  public totalUsuarios = 0;
  public loader = true;
  public loaderBotones = false;
  public loadPuntos = false;
  constructor(
    private _factory: FactoryModelService,
    public _usuario: UserService
  ) {
    /* this.dataTable = {
      headerRow: [],
      footerRow: [],
      dataRows: []
    }; */
  }

  ngOnInit() {
    this.cargarTodos();
  }
  cargarTodos() {
    this._factory.post('user/search', { limit: 50, skip: 50, populate: ['cabeza', 'rol'] }).subscribe(
      (response: any) => {
        console.log(response);
        this.dataTable = {
          headerRow: ['Name', 'Lastname', 'Username', 'Cabeza', 'Email', 'Acciones'],
          footerRow: ['Name', 'Lastname', 'Username', 'Cabeza', 'Email', 'Acciones'],
          dataRows: []
        };
        this.dataTable.headerRow = ['Name', 'Lastname', 'Username', 'Cabeza', 'Email', 'Acciones'];
        this.dataTable.footerRow = ['Name', 'Lastname', 'Username', 'Cabeza', 'Email', 'Acciones'];
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
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Buscar",
      }

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
  seleccion(row: any) {
    this.usuarioSeleccionado = row;
    const params = {
      where: {
        user: row.id
      }
    };
    this.cargarUsuario(this.usuarioSeleccionado);
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
    this.cargarPaquete(params);
    this.cargarPuntos();
  }
  cargarPaquete(params: any) {
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
  cargarPuntos() {
    this.loadPuntos = true;
    const params = {
      where: {
        user: this.usuarioSeleccionado.id,
        state: 'valido',
        actividad: {
          '!': null
        }
      },
      limit: -1
    };
    this._factory.query('puntos', params)
      .subscribe(
        (response: any) => {
          // console.log(response);
          if (response.data.length > 0) {
            this.usuarioSeleccionado.puntos = response.data;
            this.usuarioSeleccionado.puntosValor = 0;
            for (const key in this.usuarioSeleccionado.puntos) {
              if (this.usuarioSeleccionado.puntos.hasOwnProperty(key)) {
                const element = this.usuarioSeleccionado.puntos[key];
                this.usuarioSeleccionado.puntosValor += parseInt(element.valor, 10);
              }
            }

          } else {
            this.usuarioSeleccionado.puntos = [];
            this.usuarioSeleccionado.puntosValor = 0;
          }
          this.loadPuntos = false;
        },
        (error: any) => {
          console.log('Error', error);
          this.loadPuntos = false;
        });
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
    if (this.usuarioSeleccionado.paquete.length > 0) {
      swal('Oops', `
      El usuario ya tiene un paquete activo
      ` , 'error');
    } else {
      if (this.usuarioSeleccionado.email && this.paquete != '') {
        this.loaderBotones = true;
        const
          parametros: any = {
            x_id_factura: this.codigo() + ' factura',
            x_currency_code: this.codigo(),
            x_respuesta: 'Aceptada',
            x_amount: this.paquete === 'basico' ? 30000 : 125000,
            x_description: this.paquete === 'basico' ? 'Paquete Basico' : 'Paquete Emprendedor',
            x_bank_name: 'Manual',
            x_transaction_id: this.codigo() + ' x_transaction_id',
            x_fecha_transaccion: new Date(),
            x_customer_doctype: 'cc',
            x_customer_document: '123',
            x_customer_email: this.usuarioSeleccionado.email,
            x_customer_ip: '10.132.70.24',
            disableretiro: false,
            x_test_request: "retiro de nota",
            x_ref_payco: this.codigo()
          }
          ;
          console.log('PEticion para activar paquete');
          console.log(parametros);
        return this._factory.create('paquete/comprado', parametros)
          .subscribe(
            (res: any) => {
              console.log(res);
              swal('Ok', `
      El paquete se activo exitosamente
      ` , 'success');
              this.seleccion(this.usuarioSeleccionado);
              this.loaderBotones = false;
            },
            (error: any) => {
              console.log('Error', error);
              swal('Oops', `
      Error al activar el paquete
      ` , 'error');
              this.loaderBotones = false;
            }
          )
          ;
      }
    }
  }
  codigo() {
    return (Date.now().toString(36).substr(2, 3) + Math.random().toString(36).substr(2, 2)).toUpperCase();
  }
  buscar() {
    this.loader = true;
    console.log(this.datoBusqueda);
    this.datoBusqueda = this.datoBusqueda.trim();
    if (this.datoBusqueda === '') {
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
            this.dataTable.headerRow = ['Name', 'Lastname', 'Username', 'Cabeza', 'Email', 'Acciones'];
            this.dataTable.footerRow = ['Name', 'Lastname', 'Username', 'Cabeza', 'Email', 'Acciones'];
            this.dataTable.dataRows = response.data;
            this.loader = false;
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
    if (this.contrasenaNueva.trim() !== '') {
      this.validarContrasena();
    } else if (this.correoNuevo.trim() !== '') {
      this.validarCorreo();
    } else if (this.cabezaNueva.trim() !== '') {
      this.cambiarCabeza();
    } else {
      swal('Oops', `
      Estas enviando la contraseña y el correo vacios y la cabeza debes llenar almenos uno de los campos
      ` , 'error');
    }
  }
  sumarPuntos() {
    if (this.puntosNuevos > 0) {
      let query = {
        user: this.usuarioSeleccionado.id,
        codigo: this.usuarioSeleccionado.id,
        valor: this.puntosNuevos,
        create: 'admin',
        admin: 'luisalbertoj'
      };
      this._factory.post('puntos/generadorpuntosadmin', query)
        .subscribe(
          (response: any) => {
            console.log(response);
            swal('Ok', `
            Los puntos se han cargado con exito
            ` , 'success');
            this.loaderBotones = false;
            this.cargarPuntos();
          },
          error => {
            console.log('Error', error);
            swal('Oops', `
            Error al cargar los puntos
            ` , 'error');
            this.loaderBotones = false;
          });
      this.puntosNuevos = 0;
    }
  }
  cambiarCabeza() {
    let query = {
      user: this.usuarioSeleccionado.id,
      cabeza: this.cabezaNueva.trim(),
      admin: 'luisalbertoj'
    };
    this._factory.post('user/newcabeza', query)
      .subscribe(
        (response: any) => {
          console.log(response);
          swal('Ok', `
            El patrocinador se cambio con exito
            ` , 'success');
          this.loaderBotones = false;
          this.cargarUsuario(this.usuarioSeleccionado);
          this.cabezaNueva = '';
        },
        error => {
          console.log('Error', error);
          swal('Oops', `
            error al cambiar el patrocinador
            ` , 'error');
          this.loaderBotones = false;
        });
  }
  cargarUsuario(userr) {
    this._factory.query('user', { username: userr.username, populate: 'cabeza' })
      .subscribe(
        (response: any) => {
          console.log(response);
          this.usuarioSeleccionado.cabeza = response.data[0].cabeza;
          this.usuarioSeleccionado.estado = response.data[0].estado;
        },
        error => {
          console.log('Error', error);
          swal('Oops', `
        error al cargar el usuario
        ` , 'error');
          this.loaderBotones = false;
        });
  }
  confirmacionManual() {
    let query = {
      user: this.usuarioSeleccionado.id,
      admin: 'luisalbertoj'
    };
    this._factory.post('user/activacionManual', query)
      .subscribe(
        (response: any) => {
          console.log(response);
          swal('Ok', `
            El usuario se activo
            ` , 'success');
          this.loaderBotones = false;
          this.cargarUsuario(this.usuarioSeleccionado);
        },
        error => {
          console.log('Error', error);
          swal('Oops', `
            error al activar el usuario
            ` , 'error');
          this.loaderBotones = false;
        });
  }
  desactivarPaquete() {
    this.loaderBotones = true;
    const query: any = {
      user: this.usuarioSeleccionado.id,
      admin: 'luisalbertoj'
    };
    this._factory.post('userpaquete/eliminarpaquete', query)
      .subscribe(
        (response: any) => {
          console.log(response);
          swal('Ok', `
                El Paquete se desactivo con exito
                ` , 'success');
          this.loaderBotones = false;
          this.seleccion(this.usuarioSeleccionado);
        },
        error => {
          console.log('Error', error);
          swal('Oops', `
                error al desactivar el paquete
                ` , 'error');
          this.loaderBotones = false;
        });
  }

}