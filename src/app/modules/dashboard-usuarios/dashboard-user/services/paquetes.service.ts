import { Injectable } from '@angular/core';
import { GLOBAL } from 'src/app/services/global';
import { handleError } from 'src/app/services/errores';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from 'protractor';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaquetesService {

  private url: string;
  private handleError: any;
  public user: any;

  constructor(
    private _http: HttpClient
  ) {
      this.url = GLOBAL.url;
      this.handleError = handleError;
      this.user = JSON.parse(localStorage.getItem('user'));
  }
  /* pagoPayu(item: any): Observable<Config> {
    console.log(this.datosPayu.referenceCode);
    return this._http.post<Config>('https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/', item)
    .pipe(
      // retry(3),
      catchError(this.handleError)
    );
  } */
}
