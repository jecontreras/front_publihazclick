import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { BancosService } from '../../services/bancos.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FactoryModelService } from '../../services/factory-model.service';
import { ActividadService } from '../../services/actividad.service';
import { ToolsService } from '../../services/tools.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-bancos',
  templateUrl: './bancos.component.html',
  styleUrls: ['./bancos.component.scss']
})
export class BancosComponent implements OnInit {
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 25, 100];
  public disableretiro: any = false;
  public disablebanco: any = false;
  public displayedRetiros: string[] = [];
  public displayedBancos: string[] = [];
  public bancosSource: string[] = [];
  public retirosSource: string[] = [];
  public txtretiro = '';
  public txtbancos = '';
  public bancoForm: any = {};
  public retiroForm: any = {};
  private dataPuntos: any = [];
  private disable: any = false;
  public disablepermiso: boolean = true;
  public cantidaddisabled: boolean = true;
  public disableFecha: boolean = false;
  public user: any = {};
  constructor(
    private _bancos: BancosService,
    private formBuilder: FormBuilder,
    private _actividad: ActividadService,
    private _model: FactoryModelService,
    private _tools: ToolsService
  ) {
  }

  ngOnInit() {
    // console.log(this._model.user);
    this.getdisabled();
    this.getretiros(null);
    this.user = this._model.user;
    // console.log(this.user.id);
  }
  getdisabled(){
    // console.log(this._model.user.nivel.nivel);
    if(this._model.user){
      if(this._model.user.nivel){
        // console.log("hey", this._model.user, this._model.user.nivel.nivel.nivel);
        if(this._model.user.nivel.nivel){
          this.puntosdisable();
        }else{
          this._model.query('usernivel/cargarNivel',{
            user: this._model.user.id
          })
          .subscribe(
            (response: any) =>{
              if(response){
                // console.log(response);
                this._model.user.titleNivel = response.title;
                this._model.user.nivel = response;
                this.puntosdisable();
              }
            }
          );
        }
        // console.log(this._model.user.nivel.nivel);
        if(this._model.user.nivel.nivel.title === 'gratuito' && !this._model.user.nivel.nivel.title){
          this.disablepermiso = false;
        }
      }else {
        this.disable = false;
        this.disablepermiso = false;
        // TODO Memsaje
      }
    }
  }
  puntosdisable(){
    // console.log(this._model.user)
    if(this._model.user.puntosValor >= this._model.user.nivel.nivel.nivel.minretiro && this._model.user.paquete.disableretiro){
      const
        query = {
          where:{
            user: this._model.user.id
          }
        }
      ;
      this._model.query("user/referidos",query)
      .subscribe(
        (res: any)=>{
          console.log(res);
          res = res.data[0];
          if(res){
            this.disable = true;
          }
        }
      )
      ;
    }else{
      this.disable = false;
    }
    this.restoredataretiro();
  }
  codigo() {
    return (Date.now().toString(36).substr(2, 3) + Math.random().toString(36).substr(2, 2)).toUpperCase();
  }
  restoredataretiro(){
    this.retiroForm = {
      titulo: moment().format(),
      user: this._model.user.id,
      estado: 'pendiente',
      coins: 0,
      tipoBanco: {},
      codigo: this.codigo()
    }
    ;
    this.getpaqueteretiro();
    this.getPuntosUser();
  }
  getpaqueteretiro(){
    const
      user: any = this._model.user
    ;
    // console.log(user);
    if(user.paquete){
      if(user.paquete.disableretiro){
        this.disableFecha = true;
      }
    }else{
      this._actividad.getPaquete({
        user: this._model
      })
      .subscribe(
        (res: any)=>{
          res = res.data[0];
          if(res){
            if(res.disableretiro){
              this.disableFecha = true;
            }else{
              this.disableFecha = false;
            }
          }
        }
      )
    }
  }
  restoredatabanco(){
    this.bancoForm = {
      user: this._model.user.id,
    }
    ;
  }
  posiciontab(idx){
    // console.log(idx);
    if(idx ===1){
      this.restoredatabanco();
      // this.getBancos();
    }
  }

  search(obj: any, opt: any){
    // console.log(obj, opt);
    if(opt === 'retiro'){
      if(obj){
        this.getretiros(obj);
      }else{
        this.getretiros(null);
      }
    }
    if(opt === 'bancos'){
      if(obj){
        this.getBancos(obj);
      }else{
        this.getBancos(null);
      }
    }
  }
  getretiros(obj: any){
    const
      query: any = {
        where:{
          user: this._model.user.id,
          estado: {
            '!': 'eliminada'
          }
        },
        sort:{
          createdAt: 'desc'
        },
        populate: 'tipoBanco',
        limit: 20
      }
    ;
    // console.log(query);
    if(obj){
      this.retirosSource = [];
      query.where.or = [
        {
          codigo:{
            contains: obj || ''
          }
        },
        {
          titulo:{
            contains: obj || ''
          }
        },
        {
          cantidad:{
            contains: obj || ''
          }
        },
        {
          estado:{
            contains: obj || ''
          }
        }
      ]
      ;
    }
    this.displayedRetiros = [
      'posicion',
      'codigo',
      'titulo',
      'cantidad',
      'estado',
      'tipoBanco',
      'createdAt',
      // 'updatedAt',
      // 'descripcion'
    ];
    // console.log(query);
    this._bancos.getRetiros(query)
    .subscribe(
      (res: any) =>{
        // console.log(res);
        res = res.data;
        this.retirosSource = _.unionBy(this.retirosSource || [], res, 'id');
        // if(res[0]){
        //   var
        //     fecha1 = moment(res[0].createdAt),
        //     fecha2 = moment()
        //   ;
        //   // console.log(moment(fecha1).format('DD/MM'), moment(fecha2).format('DD/MM'));
        //   if(moment(fecha1).format('MM') !== moment(fecha2).format('MM')){
        //     if(moment(fecha1).format('DD') >= moment(fecha2).format('DD')){
        //       this.disableFecha = true;
        //     }
        //   }
        // }
        if(!obj){
          this.getBancos(null);
        }
      }
    )
    ;
  }
  getBancos(obj: any){
    // console.log("hey")
    const
      query: any = {
        where:{
          user: this.retiroForm.user,
          estado: 'activo'
        },
        limit: -1
      }
    ;
    if(obj){
      this.bancosSource = [];
      query.where.or = [
        {
          titulo:{
            contains: obj || ''
          }
        },
        {
          tipoCuenta:{
            contains: obj || ''
          }
        }
      ]
      ;
    }
    this.displayedBancos = [
      'posicion',
      'titulo',
      'nCuenta',
      'tipoCuenta',
      'createdAt',
      // 'updatedAt',
      // 'descripcion'
    ];
    this._bancos.getBancos(query)
    .subscribe(
      (res: any) =>{
        // console.log(res);
        res = res.data;
        this.bancosSource = _.unionBy(this.bancosSource || [], res, 'id');
        // this.getretiros();
      }
    )
    ;
  }

  openretiro(){
    this.disableretiro = !this.disableretiro;
    this.restoredataretiro();
  }
  private getPuntosUser(){
    // console.log("hey");
    // console.log(this._model.user.nivel)
    const
      data: any = {
        where:{
          user: this.retiroForm.user,
          state: "valido",
          valor: {
            '!': null
          }
        },
        limit: -1
      },
      usernivel: any = this._model.user
    ;
    let
      coins: any = 0,
      refer: any = this._model.user.nivel
    ;
    // console.log(refer);
    if(refer){
      refer = refer.nivel.nivel.referidos;
    }
    if(data.where.user){
      this._bancos.getPuntosUser(data)
      .subscribe(
        (res: any)=>{
          // console.log(res);
          _.forEach(res.data, function(item){
            if(item.valor){
              coins+=item.valor;
            }
          })
          ;
          this.dataPuntos = res.data;
          this.retiroForm.cantidad=coins;
          this.retiroForm.coins=coins;

          if(refer >=30){
            this.cantidaddisabled = false;
          }else{
            if(usernivel.puntosValor >= usernivel.nivel.nivel.nivel.minretiro){
              this.retiroForm.cantidad = usernivel.nivel.nivel.nivel.minretiro;
            }
            // coins = coins-30000;
            // this.retiroForm.pagopaquete = 30000;
          }
          // console.log(this.retiroForm);
        }
      )
      ;
    }
  }
  open(obj: any, data: any, opt:any){
    // console.log(opt, this.user);
    if (opt === 'bancos') {
      if(obj){
        this.bancoForm = obj;
      }
      this.disablebanco = !this.disablebanco;
      // console.log(this.user);
      if(!this.user.documento || !this.user.pais || !this.user.departamento || !this.user.ciudad){
        swal("Completar! Por Favor Completar Todo la Informacion de Tu Perfil en Especial tu Documento y Pais!", {
          icon: "error",
        });
      }
    }
    if(opt === 'retiro'){
      this.retiroForm = obj;
      if(this.retiroForm.tipoBanco){
        obj.datatipobanco = this.retiroForm.tipoBanco;
        this.retiroForm.tipoBanco = this.retiroForm.tipoBanco.id;
      }
      this.disableretiro = !this.disableretiro;
    }
  }
  delete(obj: any,  opt: any){
    if(opt === 'retiro'){
      // this.deleteretiro(obj);
    }
    if(opt === 'bancos'){
      this.deletebancos(obj);
    }
  }
  deletebancos(obj: any){
    // console.log(obj);
    if(obj.id){
      swal({
        title: "Deseas Eliminar Este Banco?",
        text: "Se Iniciar la eliminacion del banco seleccionado! "+ obj.titulo,
        icon: "warning",
        buttons: ["No!", "Eliminar!"],
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          var
            query: any = {
              id: obj.id
            }
          ;
          this._bancos.getRetiros({
            where:{
              tipoBanco: query.id
            },
            limit: 1
          })
          .subscribe(
            (rta: any)=>{
              rta = rta.data[0];
              if(rta){
                this._bancos.updatebanco({
                  id: query.id,
                  estado: 'inactivo'
                })
                .subscribe(
                  () =>{
                    // console.log(rta);
                  }
                )
                ;
              }else{
                this._bancos.deleteBanco(query)
                .subscribe(
                  (res: any) =>{
                    // console.log(res);
                    if(res.id){
                      var
                        idx:any = _.findIndex(this.bancosSource, ['id', obj.id])
                      ;
                      if(idx >-1){
                        this.bancosSource.splice(idx, 1);
                      }
                      swal("Completado! As Eliminado este Banco! " + obj.titulo, {
                        icon: "success",
                      });
                    }
                  }
                )
                ;
              }
            }
          )
          ;
        }
      });
    }
  }
  deleteretiro(obj: any){
    // console.log(obj);
    if(obj.id){
      var
        query: any = {
          id: obj.id
        }
      ;
      this._bancos.deleteRetiro(query)
      .subscribe(
        (res: any) =>{
          // console.log(res);
          if(res.id){
            var
              idx:any = _.findIndex(this.retirosSource, ['id', obj.id])
            ;
            if(idx >-1){
              this.retirosSource.splice(idx, 1);
            }
            this._tools.openSnack('Eliminado Exitoso', 'Completado', false);
          }
        }
      )
      ;
    }

  }
  onSubmitRetiro(){
    // console.log(this.retiroForm);
    const
      data: any = this.retiroForm,
      usernivel: any = this._model.user
    ;
    let
      coins: any = 0,
      refer: any = this._model.user.nivel
    ;
    // console.log(refer);
    if(refer){
      refer = refer.nivel.nivel.referidos;
    }
    // console.log(data.codigo, data.user, this.disable, data.cantidad)
    if(refer >=30){
      this.cantidaddisabled = false;
      swal({
        title: "Deseas Comprar Tu Paquete?",
        text: "Al desear Comprar tu paquete te vamos a descontar de tus ganancias automaticamente!",
        icon: "warning",
        buttons: ["No!", "Comprar!"],
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          // this.retiroForm.cantidad = this.retiroForm.coins-250000;
          data.pagopaquete = 250000;
          swal("En Espera! As Seleccionado comprar paquete!", {
            icon: "success",
          });
        }
      });
    }else{
      // console.log("hey1",usernivel.nivel);
      if(usernivel.puntosValor >= usernivel.nivel.nivel.nivel.minretiro){
        // console.log("hey",this.retiroForml);
        data.cantidad = usernivel.nivel.nivel.nivel.minretiro;
      }
      // coins = coins-30000;
      // this.retiroForm.pagopaquete = 30000;
    }
    // console.log(usernivel, data);
    if(data.codigo && data.user && this.disable && data.cantidad >= usernivel.nivel.nivel.nivel.minretiro && this.disableFecha){
      if(data.tipoBanco){
        data.tipo = 'estado';
        data.slug = _.kebabCase(data.titulo);
        this._bancos.pushRetiro(data)
        .subscribe(
          (res: any)=>{
            res = res.data;
            console.log(res);
            if(res){
              this.retiroForm = {};
              res.tipoBanco = {
                titulo: data.tipoBanco
              };
              this.retirosSource.push(res);
              this.disableretiro = !this.disableretiro;
              this.disableFecha = false;
              this._model.cargarPuntosUser();
              this.restoredataretiro();
              this.updatepqEstado();
              swal("En Espera! Tu Retiro Esta En Proceso Cantidad de Retiro ! $" + res.cantidad + " Este Proceso Podra Tardar Maximo 3 Dias Por Favor Ten Paciencia Si A Demorado el tiempo acordado por favor informar a tu lider Gracias", {
                icon: "success",
              });
            }
          }
        )
        ;
      }else{
      this._tools.openSnack('Error no hay Un Banco Seleccionado', 'Fallo', false);
      }
    }else{
      this._tools.openSnack('Error no hay Suficiente Saldo Para Retirar', 'Completado', false);
    }

  }
  updatepqEstado(){
    if(this._model.user.paquete){
      return this._model.update("userpaquete", this._model.user.paquete.id, {
        id: this._model.user.paquete.id,
        disableretiro: false
      })
      .subscribe(
        (rta: any)=>{
          // console.log(rta);
          if(rta){
            return this._model.query("notas",{
              where:{
                user: this._model.user.id,
                valor: {
                  '!':null
                },
                estado: "novisto"
              }
            })
            .subscribe(
              (res: any)=>{
                // console.log(res);
                if(res){
                  const
                    ref:any = res.datosepayco
                  ;
                  ref.disableretiro = false;
                  return this._model.update("notas", res.id, {
                    id: res.id,
                    datosepayco: ref
                  })
                }
              }
            )
            ;
          }
        }
      );
    }
  }
  onSubmitbanco(){
    var
      data: any = this.bancoForm
    ;
    // console.log(data, this.user);
    if (data.titulo && this.user.tipdoc !== 'sin-expesificar') {
      data.slug = _.kebabCase(data.titulo);
      this._bancos.pushBanco(data)
      .subscribe(
        (res: any)=>{
          // console.log(res);
          if(res.id){
            this.bancoForm = {};
            this.bancosSource.push(res);
            this.disablebanco = !this.disablebanco;
            this.restoredatabanco();
          }
        }
      )
      ;
    }else{
      swal("Completar! Por Favor Completar Todo la Informacion de Tu Perfil en Especial tu Documento! ", {
        icon: "error",
      });
    }
  }
  onBlur(obj: any){
    var
      data: any = this.bancoForm,
      query:any = {
        id: data.id
      }
    ;
    if(query.id){
      if(data[obj]){
        query[obj]=data[obj];
        this._bancos.updatebanco(query)
        .subscribe(
          (res: any)=>{
            // console.log(res);
            if(res.id){
              this._tools.openSnack('Actualizado Banco', 'Completado', false);
            }
          }
        )
        ;
      }
    }
  }

}
