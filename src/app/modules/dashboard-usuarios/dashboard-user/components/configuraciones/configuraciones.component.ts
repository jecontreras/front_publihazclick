import { Component, OnInit } from '@angular/core';
import { ConfiguracionService } from '../../services/configuracion.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import FroalaEditor from 'froala-editor';
import { FactoryModelService } from '../../../../../services/factory-model.service';
import { GLOBAL } from '../../../../../services/global';
import { ToolsService } from '../../services/tools.service';
import * as _ from 'lodash';
import swal from 'sweetalert';
// import { departamento } from '../../../json/departamentos';
@Component({
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.component.html',
  styleUrls: ['./configuraciones.component.scss'],
  providers: [ConfiguracionService]
})
export class ConfiguracionesComponent implements OnInit {

  public cuerpo: any;
  public img: any;
  public txtbuscador = '';
  public datafile: any;
  public displayed: string[] = [];
  public displayed2: string[] = [];
  public listdepartamento: any = [];
  public listciudades: any = [];
  public ArrayClick: any = [];
  public carga = true;
  public view = false;
  public viewlive: any = {};
  public disablebanner: boolean = false;
  public datapaquete: any = {};
  public data: any = {};
  public dataclone: any = {};
  public banneritems: any = [];
  public disabledcreatebanner: boolean = false;
  public options: Object = {
    charCounterCount: true,
    toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat', 'alert'],
    toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat', 'alert'],
    toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat', 'alert'],
    toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat', 'alert'],
  };

  constructor(
    private _configuracion: ConfiguracionService,
    private _model: FactoryModelService,
    private _tools: ToolsService,
    public sanitizer: DomSanitizer
  ) {
    this.cuerpo = _configuracion;
    // console.log(this.cuerpo);
  }

  ngOnInit() {
    this.datapaquete = this.cuerpo._model.user;
    if (this.datapaquete) {
      this.datapaquete = this.datapaquete.paquete;
      if (this.datapaquete) {
        if (this.datapaquete.paquete.title === 'Paquete Basico') {
          this.ArrayClick = [
            {
              click: 40,
              disable: false,
              titulo: 'basica'
            },
            {
              click: 20,
              disable: false,
              titulo: 'super'
            }
          ];
        } else {
          this.ArrayClick = [
            {
              click: 400,
              disable: false,
              titulo: 'basica'
            },
            {
              click: 200,
              disable: false,
              titulo: 'super'
            }
          ];
        }
      }
    }
    this.getlist(this.cuerpo);
    this.getBanner();
    FroalaEditor.DefineIcon('alert', { NAME: 'info' });
    FroalaEditor.RegisterCommand('alert', {
      title: 'Hello',
      focus: false,
      undo: false,
      refreshAfterCallback: false,

      callback: () => {
        console.log('hey');
      }
    });
  }
  buscador() {
    this.getlist(this.cuerpo);
  }
  private createdefault() {
    let
      querys: any = {
        user: this.cuerpo.rta._model.user
      }
      ;
    this._configuracion.getPaquete(querys)
      .subscribe(
        (rta: any) => {
          // console.log(rta);
          rta = rta.data[0];
          if (rta) {
            querys = {
              id: rta.id,
              cantidad: 0
            }
              ;
            // console.log(querys);
            if (querys.id) {
              this._configuracion.updatepaquete(querys)
              .subscribe(men=>console.log(men));
            }
            this.cuerpo.rta.cantidaddisponible = rta.cantidaddepublicidad;
            if (this.cuerpo.rta.cantidaddisponible > 0) {
              this.cuerpo.crearBack();
            } else {
              swal('Ok', 'Ya as Consumido Tus Publicaciones', 'error');
            }
          }
        });
  }
  getlist(cuerpo: any) {
    const
      query: any = this.txtbuscador || false,
      data: any = []
      ;
    this.displayed = [
      'posicion',
      'title',
      'type',
      'prioridad',
      'estado',
      'clicks',
      'createdAt'
    ];
    cuerpo.lista(query)
      .subscribe((res: any) => {
        res = res.data;
        for (let i = 0; i < res.length; i++) {
          if (this.ArrayClick.length) {
            if (res[i].prioridad === 'basica') {
              if (res[i].estado === 'activo') {

                // this.ArrayClick[0].disable = true;
              }
              if (this.ArrayClick[0].click <= res[i].clicks && res[i].estado === 'activo') {
                this.publicestado(res[1]);
              }
            } else {
              res[i].disable = true;
              // console.log(this.ArrayClick[1])
              if (res[i].estado === 'activo') {
                // this.ArrayClick[1].disable = true;
              }
              if (this.ArrayClick[1].click <= res[i].clicks && res[i].estado === 'activo') {
                this.publicestado(res[1]);
              }
            }
          }

        }

      });
  }

  publicestado(obj: any) {
    // console.log(obj, this.cuerpo.rta.data);
    if (obj) {
      this.cuerpo.rta.data.id = obj.id;
      obj.estado = 'consumido';
      this.cuerpo.rta.data.estado = 'consumido';
      // console.log(this.cuerpo.rta.data);
      this.cuerpo.editar(this.cuerpo, 'estado');
      if (obj.prioridad === 'basica' && obj.estado === 'consumido') {
        this.ArrayClick[0].disable = false;
      }
      if (obj.prioridad === 'super' && obj.estado === 'consumido') {
        this.ArrayClick[1].disable = false;
      }
    }
  }

  vista() {
    this.view = !this.view;
    this.viewlive = this.sanitizer.bypassSecurityTrustResourceUrl(this.cuerpo.rta.data.content);
  }
  agregar(cuerpo: any) {
    // console.log(cuerpo.rta);
    const
      data: any = cuerpo.rta.data
      ;
    // console.log(data);
    if(data.descripcion){
      if (data.prioridad && data.title && data.type && data.content) {
        let
          querys: any = {
            user: cuerpo.rta._model.user
          }
          ;
        this._configuracion.getPaquete(querys)
          .subscribe(
            (rta: any) => {
              // console.log(rta);
              rta = rta.data[0];
              if (rta) {
                cuerpo.rta.cantidaddisponible = rta.cantidaddepublicidad;
                if (rta.cantidaddepublicidad > 0) {
                  if(data.tipolink === 'youtube'){
                    data.content = this.urlprueba(data.content);
                    // console.log(this.urlprueba(data.content));
                  }
                  return this._configuracion.agregar(cuerpo)
                    .subscribe(
                      (res: any) => {
                        if (res) {
                          // console.log(res);
                          querys = {
                            id: rta.id,
                            cantidad: rta.cantidaddepublicidad - 1
                          }
                            ;
                          // console.log(querys);
                          if (querys.id) {
                            this._configuracion.updatepaquete(querys)
                            .subscribe(men=>console.log(men));
                          }
                          swal('Ok', 'Publicacion creada de forma correcta!', 'success');
                          cuerpo.rta.disable.action = !cuerpo.rta.disable.action;
                          this.getlist(cuerpo);
                          if (res.type === 'img') {
                            this.file();
                          }
                        }
                      }
                    )
                    ;
                } else {
                  swal('Ok', 'Ya as Consumido Tus Publicaciones', 'error');
                }
              }
            }
          );
      } else {
        swal('Completar', 'Por Favor Completar Campos', 'error');
      }
    }else{
      swal('Completar', 'Por Favor Agregar una Descripcion de la publicacion', 'error');
    }
  }
  updatecontent(){
    const
      data: any = this.cuerpo.rta.data
    ;
    // console.log(data);
    if(data.tipolink === 'youtube'){
      data.content = this.urlprueba(data.content);
      // console.log(this.urlprueba(data.content));
    }
    this.cuerpo.rta.btn.editar(this.cuerpo, 'content')
  }
  urlprueba(text){
        if (!text) return text;
        const self = this;

        const linkreg = /(?:)<a([^>]+)>(.+?)<\/a>/g;
        const fullreg = /(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([^& \n<]+)(?:[^ \n<]+)?/g;
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^& \n<]+)(?:[^ \n<]+)?/g;

        let resultHtml = text;

        // get all the matches for youtube links using the first regex
        const match = text.match(fullreg);
        if (match && match.length > 0) {
          // get all links and put in placeholders
          const matchlinks = text.match(linkreg);
          if (matchlinks && matchlinks.length > 0) {
            for (var i=0; i < matchlinks.length; i++) {
              resultHtml = resultHtml.replace(matchlinks[i], "#placeholder" + i + "#");
            }
          }

          // now go through the matches one by one
          for (var i=0; i < match.length; i++) {
            // get the key out of the match using the second regex
            let matchParts = match[i].split(regex);
            // replace the full match with the embedded youtube code
            resultHtml = resultHtml.replace(match[i], self.createYoutubeEmbed(matchParts[1]));
          }

          // ok now put our links back where the placeholders were.
          if (matchlinks && matchlinks.length > 0) {
            for (var i=0; i < matchlinks.length; i++) {
              resultHtml = resultHtml.replace("#placeholder" + i + "#", matchlinks[i]);
            }
          }
        }
        return resultHtml;
  }
  createYoutubeEmbed(key: any){
    return 'https://www.youtube.com/embed/' + key +"?rel=0&autoplay=1";
  };

  datafiles(ev: any) {
    this.datafile = ev.target.files;
    // console.log(this.datafile);
  }
  file() {
    // if(this.img){
    const
      cuerpo = this.cuerpo,
      _configuracion = this._configuracion,
      file = this.datafile
      ;
    // console.log(file);
    this.carga = false;
    this._configuracion.pushfile(cuerpo, file)
      .subscribe(
        (data: any) => {
          // console.log(data, cuerpo);
          // console.log('POST Request is successful ', data);
          if (data.files.length) {
            this.carga = true;
            swal('Ok!', 'Imagen agregada correctamente', 'success');
            if (cuerpo.rta.data.type === 'img') {
              if (cuerpo.rta.data.content !== 'https://s3.amazonaws.com/publihazclick/publicaciones/basic.png') {
                deletefile(cuerpo, _configuracion);
                cuerpo.rta.data.content = data.Location;
              }
              cuerpo.rta.data.content = 'https://s3.amazonaws.com/publihazclick/publicaciones/' + data.files[0].fd;
              cuerpo.rta.btn.editar(cuerpo, 'content');
            } else {
              cuerpo.rta.data.imgdefault = 'https://s3.amazonaws.com/publihazclick/publicaciones/' + data.files[0].fd;
              cuerpo.rta.btn.editar(cuerpo, 'imgdefault');
            }
          }
        },
        (error: any) => {
          console.log('Error', error);
          this.carga = true;
          swal('Error!', 'Error al subir la imagen', 'error');
        }
      );
    // }
    // tslint:disable-next-line:no-shadowed-variable
    function deletefile(cuerpo: any, _configuracion: any) {
      // console.log(cuerpo)
      if (cuerpo.rta.data.foto) {
        let
          urldelete: any = _.split(cuerpo.rta.data.foto, 'users', 10)
          ;
        urldelete = 'users' + urldelete[1];
        // console.log(urldelete, cuerpo);
        _configuracion.deletefile(cuerpo, urldelete)
          // .subscribe(
          //   data => {
          //     // console.log(data);
          //   }
          // )
          ;
      }
    }
  }

  getBanner(){
    this.displayed2 = [
      'posicion',
      'title',
      'estado',
      'clicks',
      'createdAt'
    ]
    ;
    this._configuracion.getBanner({
      where:{
        user: this._model.user.id,
        type: 'banner',
      }
    })
    .subscribe(
      (res:any)=>{
        // console.log(res);
        res = res.data;
        this.banneritems = res;
        if(res.length){
          for(let row of res){
            if(row.estado == 'activo' && row.clicks <=100) this.disabledcreatebanner = true;
          }
        }
      }
    )
    ;
  }
  open(obj:any){
    this.disablebanner = !this.disablebanner;
    if(obj){
      this.data = obj;
      this.dataclone= _.clone(obj);
    }else{
      this.data = {
        user: this._model.user.id,
        type: "banner"
      };
    }
    if(!this.disablebanner){
      if(this.data.content){
        this.data.content = this.data.imgdefault;
        this.editar('content');
      }
      this.data = {};
    }
    this.datafile=[];
  }
  filebanner(){
    this.carga = false;
    this._configuracion.pushfilebanner(this.datafile)
    .subscribe(
      (rta: any) => {
        // console.log(rta);
        this.carga = true;
        if(rta.files.length){
          this.data.imgdefault = 'https://s3.amazonaws.com/publihazclick/publicaciones/' + rta.files[0].fd;
          this.editar('imgdefault');
        }

    });

  }
  createbanner(){
    const
      data: any = this.data
    ;
    // console.log(data);
    if(!data.content){
      data.content = "https://www.dilisap.tk/";
    }
    if(data.title && !this.disabledcreatebanner){
     this._configuracion.createbanner(data)
      .subscribe(
        (res: any)=>{
          // console.log(res);
          if(res){
            this._tools.openSnack('Creado Banner', 'ok', false);
            data.id = res.id;
            this.disabledcreatebanner=true;
            this.banneritems.push(res);
          }
        }
      )
      ;
    }
  }
  editar(obj: any){
    const
      data: any = this.data
    ;
    if(data.id){
      console.log(this.dataclone[obj], data[obj]);
      if(this.dataclone[obj] !== data[obj]){
        const
          query: any = {
            id: data.id
          }
        ;
        query[obj]=data[obj];
          this._configuracion.updatebanner(query)
          .subscribe(
            (rta: any)=>{
              // console.log(rta);
              this._tools.openSnack('Actualizado Banner', 'ok', false);
            }
          )
          ;
      }
    }else{
      this.createbanner();
    }
  }

}
