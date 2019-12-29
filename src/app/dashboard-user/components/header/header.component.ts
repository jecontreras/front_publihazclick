import { Component, OnDestroy, ChangeDetectorRef, OnInit, VERSION, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { FactoryModelService } from '../../services/factory-model.service';
import { ConfiguracionService } from './../../services/configuracion.service';
import { ToolsService } from '../../services/tools.service';
import { GLOBAL } from './../../../services/global';
import * as _ from 'lodash';
import * as moment from 'moment';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy, OnInit {
  public mobileQuery: any;
  private _mobileQueryListener: () => void;
  public user: any = {};
  public btndisable: boolean = false;
  public global: any = GLOBAL;
  public url: string = GLOBAL.urlFront;
  breakpoint: number;
  public imgbanner1: any = {};
  public imgbanner2: any = {};
  public imgbanner3: any = {};
  public agente: any = '';
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher, private router: Router,
    public _model: FactoryModelService,
    private _configuracion: ConfiguracionService,
    private _tools: ToolsService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 290px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    // tslint:disable-next-line:no-unused-expression
    this.mobileQuery.ds;
    this._model.loadUser();
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  ngOnInit() {
    this.user = this._model.user;
    this._model.cargarPuntosUser();
    this._model.cargarPaquete();
    this.breakpoint = (window.innerWidth <= 400) ? 1 : 6;
    this.onResize(null);
    this.initbanner();
    // console.log(this.breakpoint, this.mobileQuery);
    this.createruta();
  }
  createruta(){
    this.agente = `${GLOBAL.url}portada/?${this.user.id}`;
  }
  initbanner(){
    let
      init:any = 0,
      count:any = 1
    ;
    const
      img:any = [
        {
          src: "./assets/img/1.jpg"
        },
        {
          src: "./assets/img/2.jpg"
        },
        {
          src: "./assets/img/3.jpg"
        },
        {
          src: "./assets/img/4.jpg"
        },
        {
          src: "./assets/img/5.jpg"
        }
      ]
    ;
    this._model.query("publicacion",{
      where:{
        type: 'banner',
        estado: "activo"
      },
      sort:{
        clicks: 'asc'
      },
      limit: 10
    })
    .subscribe(
      (res: any)=>{
        // console.log(res);
        res = res.data;
        this.editarbanner(res);
        var
          posicion: any = _.random(0, 2)
        ;
        this.imgbanner1 = res[posicion];
        posicion= _.random(0, 9);
        this.imgbanner2 = res[posicion];
        posicion = _.random(0, 9);
        this.imgbanner3 = res[posicion];
        // console.log(this.imgbanner, img);
        const interval = setInterval(() => {
          init++;
          // console.log(init);
          if(init === 5){
            count++;
            if(count ===5){
              count = 0;
            }
            posicion = _.random(0, 9);
            this.imgbanner1 = res[posicion];
            posicion = _.random(0, 9);
            this.imgbanner2 = res[posicion];
            posicion = _.random(0, 9);
            this.imgbanner3 = res[posicion];
            init=0;
          }
        }, 1000);
      }
    )
    ;
  }
  editarbanner(item:any){
    const
      data: any = item,
      _configuracion: any = this._configuracion
    ;
    _.forEach(data, function(item: any){
      const
        query: any = {
          id: item.id,
          clicks: 1
        }
      ;
      query.clicks=(item.clicks || 0)+1;
        return _configuracion.updatebanner(query)
        .subscribe(
          ()=>{
            // console.log(res);
          }
        )
        ;
    })
    ;
  }
  portapapeles() {
    const
      val = this.url + 'info/' + this._model.user.username
      ;
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this._tools.openSnack('Copiado:' + ' ' + val, 'completado', false);

  }
  onResize(event) {
    // console.log("hey", event);
    if (event) {
      this.breakpoint = (event.target.innerWidth <= 700) ? 1 : 6;
    }
    // console.log(this.breakpoint);
    if (this.breakpoint === 1) {
      // console.log(this.mobileQuery);
      this.mobileQuery.ds = true;
    } else {
      // console.log(this.mobileQuery);
      this.mobileQuery.ds = false;
    }
  }
  reset() {
    this.btndisable= true;
    let
      init:any = 0
    ;
    this._model.cargarPuntosUser();
    const interval = setInterval(() => {
      // console.log(init);
      init+= 1;
      if(init === 3){
        this.btndisable= false;
        this.stopConter(interval);
      }
    }, 1000);
  }
  stopConter(interval: any) {
    clearInterval(interval);
  }
  logout() {
    localStorage.clear();
    location.href = GLOBAL.urlFront;
  }
}
