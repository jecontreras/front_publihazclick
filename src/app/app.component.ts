import { Component } from '@angular/core';
import * as _ from 'lodash';
import { WebsocketService } from './sockets/websocket.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private title = 'PubliHazClick';
  constructor(public wsService: WebsocketService) {}
}
