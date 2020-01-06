import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Usuario } from '../models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  public socketStatus = false;
  public usuario: Usuario;
  constructor(private socket: Socket) {
    this.cargarStorage();
    this.checkStatus();
  }

  checkStatus() {
    this.socket.on('connect', () => {
      console.log('Conectado al servidor');
      this.socketStatus = true;
    });
    this.socket.on('disconnect', () => {
      console.log('Desconectado del servidor');
      this.socketStatus = false;
    });
  }

  emit(evento: string, data?: any, callback?: Function) {
    console.log('Emitiedno :  ' + evento);
    this.socket.emit(evento, data, callback);
  }
  listen( evento: string) {
    return this.socket.fromEvent( evento );
  }
  loginWS( nombre: string ) {
    return new Promise((resolve, reject) => {
      this.emit('configurar-usuario', {nombre}, (response: any) => {
        this.usuario = new Usuario( nombre );
        this.guardarStorage();
        resolve(response);
      });
    } );
  }
  guardarStorage() {
    localStorage.setItem( 'user', JSON.stringify ( this.usuario));
  }
  cargarStorage() {
    if (localStorage.getItem('user')) {
      this.usuario = JSON.parse(localStorage.getItem('user'));
      this.loginWS(this.usuario.nombre);
    }
  }
  getUsuario() {
    return this.usuario;
  }
}
