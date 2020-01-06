import { Component, OnInit } from '@angular/core';
import { WebsocketService } from 'src/app/sockets/websocket.service';
import { GLOBAL } from  './../../../services/global';

@Component({
  selector: 'app-page-status',
  templateUrl: './page-status.component.html',
  styleUrls: ['./page-status.component.css']
})
export class PageStatusComponent implements OnInit {
  public estadoApp: string = GLOBAL.estadoApp;
  public version: string = GLOBAL.version;
  public show = true;
  constructor(public wsSocket: WebsocketService) { }

  ngOnInit() {
  }

  mostrar() {
    this.show = !this.show;
  }

}
