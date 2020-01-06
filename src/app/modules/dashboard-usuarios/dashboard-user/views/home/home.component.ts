import { Component, OnInit } from '@angular/core';
import { FactoryModelService } from '../../../../../services/factory-model.service';
import { User } from '../../models/User';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private response: any;
  private user: User;
  constructor(
    private _Model: FactoryModelService
  ) {
/*     this.user = new User('', 'prueba', 'prueba', 'prueba', 'prueba@prueba.mail.com', 'prueba', '', '', '');
 */   }

  ngOnInit() {
  }


}
