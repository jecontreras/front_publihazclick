import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { tap } from 'rxjs/operators';
import {Router, CanActivate } from '@angular/router';

export interface User {
  heroesUrl: string;
  textfile: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

  constructor(
    private http: HttpClient,
    private router: Router,
    // private route: ActivatedRoute
  ) {}
    canActivate() {
        
    const userLogeado = JSON.parse(localStorage.getItem('user'));
    if(userLogeado == null) return false;
    if(userLogeado['rol'] == '5cedd99b520be0ef6856715f') {
        return true;
    } else {
        this.router.navigate(['/info']);
        return false;
    }        
    }
}
