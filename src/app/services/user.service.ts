import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './global';
import { FactoryModelService } from '../dashboard-user/services/factory-model.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url: string;
  private handleError: any;
  constructor(
    private _http: HttpClient,
    private _model: FactoryModelService
  ) {
    this.url = GLOBAL.url;
 }
  login(user: any) {
    user.app = this.adsSecuryty();
    return this._http.post(this.url + 'user/login', user);
  }
  register(user: any) {
    user.app = this.adsSecuryty();
    return this._http.post(this.url + 'user/register', user);
  }
  cabeza(query: any) {
    return this._model.query('user', {
      username: query
    });
  }
  private adsSecuryty() {
    return 'publihazclickrootadmin';
  }
}
