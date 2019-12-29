import { Injectable } from '@angular/core';
import { Config } from './Config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './../../services/global';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { handleError } from '../../services/errores';
import { AuthService } from 'src/app/services/auth.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
declare var estadoVentana: any;

@Injectable({
  providedIn: 'root'
})
export class FactoryModelService {
  private url: string;
  private handleError: any;
  public user: any;
  public niveles: any;
  public global: any;
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  public verificacion = false;
  public estadoV: boolean;
  public carga: boolean = false;

  constructor(
    private _http: HttpClient,
    private router: Router,
    private _auth: AuthService,
    // private _notas: NotasService
  ) {
    this.url = GLOBAL.url;
    this.global = GLOBAL;
    this.handleError = handleError;
    this.getEstadoVentana();
  }
  loadUser() {
    this.user = JSON.parse(localStorage.getItem('user'));
    // console.log(this.user);
    if (this._auth.canActivate()) {
      this.query('user', {
          id: this.user.id,
          // id: "5d5adac13992c33d1d506381"
      })
        .subscribe(
          (response: any) => {
            // console.log(response);
            response = response.data[0];
            if (response) {
              localStorage.clear();
              localStorage.setItem('user', JSON.stringify(response));
              this.user = JSON.parse(localStorage.getItem('user'));
              // console.log(this.user);
              if (response.estado === 'verificando') {
                this.verificacion = true;
              } else {
                this.cargarNivel();
              }
            } else {
              localStorage.clear();
              this.router.navigate(['login']);
            }
          },
          (error: any) => {
            console.log(error);
            this._auth.canActivate();
            localStorage.clear();
            this.router.navigate(['login']);
          }
        );
    }
  }
  cargarNivel() {
    // console.log(this.user);
    this.query('usernivel/cargarNivel', {
      user: this.user.id
    })
      .subscribe(
        (response: any) => {
          // console.log(response, this.user);
          this.user.titleNivel = response.title;
          this.user.nivel = response;
          localStorage.clear();
          localStorage.setItem('user', JSON.stringify(this.user));
        }
      );
  }
  cargarPuntosUser() {
    if (this._auth.canActivate()) {
      const params = {
        where: {
          user: this.user.id,
          state: 'valido',
          actividad: {
            '!': null
          }
        },
        limit: -1
      };
      this.query('puntos', params)
        .subscribe(
          (response: any) => {
            // console.log(response);
            if (response.data.length > 0) {
              this.user.puntos = response.data;
              this.user.puntosValor = 0;
              for (const key in this.user.puntos) {
                if (this.user.puntos.hasOwnProperty(key)) {
                  const element = this.user.puntos[key];
                  this.user.puntosValor += parseInt(element.valor, 10);
                }
              }
              /* _.forEach(this.user.puntos, (item: any) => {
                if (item.valor) {
                  this.user.puntosValor += parseInt(item.valor, 10);
                }
              }); */
              localStorage.clear();
              localStorage.setItem('user', JSON.stringify(this.user));

            } else {
              this.user.puntos = [];
              this.user.puntosValor = 0;
            }
          },
          (error: any) => {
            console.log('Error', error);
          });
    }
  }

  cargarPaquete() {
    const params = {
      where: {
        user: this.user.id
      }
    };
    this.query('userpaquete/consulpaquete', params)
      .subscribe(
        (response: any) => {
          response = response.data[0];
          // console.log(response);
            let
              init:any = 0
            ;
            const interval = setInterval(() => {
              // console.log(init);
              init+= 1;
              if(init === 10){
                this.carga = true;
                this.stopConter(interval);
              }
            }, 1000);
          if (response) {
            const
              dias: any = moment(response.createdAt).diff(moment(new Date()), 'days');
            this.user.vigencia = dias || 0;
            // console.log(this.user.vigencia);
            if (response) {
              // console.log(response);
              this.user.paquete = response;
              this.user.fechaHoy = this.cargarFecha();
            } else {
              this.user.vigencia = 0;
            }
            if (!response.paquete) {
              this.pushNota(response);
            }
          } else {
            this.user.vigencia = 0;
          }
          localStorage.clear();
          localStorage.setItem('user', JSON.stringify(this.user));
        },
        (error: any) => {
          console.log('Error', error);
        });
  }
  stopConter(interval: any) {
    clearInterval(interval);
  }
  pushNota(response: any) {
    this.query('notas', {
      where: {
        ids: response.id
      }
    })
      .subscribe(
        (rta: any) => {
          // console.log(rta);
          rta = rta.data[0];
          if (!rta) {
            const
              data: any = {
                ids: response.id,
                titulo: 'no tiene paquete Relacionado con el sistema en modelo userpaquete',
                prioridad: 'alta',
                tipo: 'sistema',
                user: this.user.id,
                descripcion: 'reparacion de esta relacion ya que es importante para las estadistica solucion lo mas pronto posible'
              }
              ;
            // console.log(data);
            this.create('notas', data)
              .subscribe(
                (res: any) => {
                  // console.log(res);
                }
              );
          }
        }
      );
  }
  cargarFecha(): any {
    // console.log("men");
    this.getFechaServidor()
      .subscribe(
        (response: any) => {
          // console.log(response, this.user.paquete);
          this.user.fechaHoy = { status: true, data: response };
          if (this.user.paquete) {
            this.user.vigencia = 30 - moment(this.user.fechaHoy.data.fechaManana).diff(moment(this.user.paquete.createdAt), 'days');
          } else {
            this.cargarPaquete();
          }
        }
      );
  }

  create(modelo: string, query: any): Observable<Config> {
    query.app = this.adsSecuryty();
    return this._http.post<Config>(this.url + modelo, query).pipe(
      // retry(3),
      catchError(this.handleError)
    );
  }
  update(modelo: string, referencia: string, query: any): Observable<Config> {
    query.app = this.adsSecuryty();
    return this._http.put<Config>(this.url + modelo + '/' + referencia, query, { headers: this.httpHeaders }).pipe(
      // retry(3),
      catchError(this.handleError)
    );
  }
  delete(modelo: string, referencia: string, query: any) {
    query.app = this.adsSecuryty();
    return this._http.delete(this.url + modelo + '/' + referencia, query).pipe(
      // retry(3),
      catchError(this.handleError)
    );
  }
  get(modelo: string, query: any) {
    if (!query) {
      query = {};
    }
    // if (query) {
    // if(!query.where){
    //   query ={
    //     where: query
    //   };
    // }
    const options: any = {
      params: query
    };
    console.log(options);
    // options.params.app = this.adsSecuryty();
    return this._http.get(this.url + modelo, options).pipe(
      // retry(3),
      catchError(this.handleError)
    );
    // } else {
    //   return this._http.get(this.url + modelo).pipe(
    //     // retry(3),
    //     catchError(this.handleError)
    //   );
    // }
  }
  query(modelo: string, query: any) {
    if (!query) {
      query = {};
    }
    if (!query.where) {
      query = {
        where: query
      }
        ;
    }
    const ruta = _.split(modelo, '/', 2);
    if (ruta[1]) {
      modelo = modelo;
    } else {
      modelo = modelo + '/query';
    }

    query.app = this.adsSecuryty();
    return this._http.post(this.url + modelo, query).pipe(
      catchError(this.handleError)
    );
  }
  private adsSecuryty() {
    return 'publihazclickrootadmin';
  }
  getFechaServidor() {
    return this.query('user/fecha', {}).pipe(
      // retry(3),
      catchError(this.handleError)
    );
  }
  bloquearCierreVentana(bPreguntar: boolean) {
    window.onbeforeunload = preguntarAntesDeSalir;
    function preguntarAntesDeSalir() {
      if (bPreguntar) {
        return '¿Seguro que quieres salir?';
      }
    }
  }
  getEstadoVentana() {
    document.addEventListener('visibilitychange', function() {
      estadoVentana = ( document.visibilityState );
      // console.log(estadoVentana);
    });
  }
}
