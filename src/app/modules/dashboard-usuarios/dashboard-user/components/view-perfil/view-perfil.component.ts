import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FactoryModelService } from '../../services/factory-model.service';

@Component({
  selector: 'app-view-perfil',
  templateUrl: './view-perfil.component.html',
  styleUrls: ['./view-perfil.component.scss']
})
export class ViewPerfilComponent implements OnInit {
  public data:any = {};
  public id:any = String();
  public list_product:Array<Object>;
  public progreses:any = true;

  constructor(
    private route: ActivatedRoute,
    private _model: FactoryModelService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if(params['id']){
        this.id = params['id'];
        this.get_perfil();
        this.get_publicacion();
      }
    });
  }

  get_perfil(){
    return this._model.query("user",{
      where:{
        id: this.id
      }
    })
    .subscribe(
      (res:any)=>{
        res = res.data[0];
        if(res){
          return this._model.query("usernivel/cargarNivel",{
            user: res.id
          })
          .subscribe((rta:any)=>{
            this.data = res;
            this.progreses = false;
            if(rta){
              this.data.nivel = rta.title;
            }
          });
        }
      }
    );
  }

  get_publicacion(){
    return this._model.query("publicacion",{
      where:{
        user: this.id,
        autocreo: false
      },
      sort:{
        createdAt: 'asc'
      }
    })
    .subscribe((rta:any)=>{
      console.log(rta);
      rta = rta.data;
      this.list_product = rta;
    });
  }
}
