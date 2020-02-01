import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FactoryModelService } from 'src/app/services/factory-model.service';

@Component({
  selector: 'app-portada',
  templateUrl: './portada.component.html',
  styleUrls: ['./portada.component.css']
})
export class PortadaComponent implements OnInit {
  public usuario:any = {};
  public data:any = {
    dia: 1,
    hora: 2,
    minutos: 60,
    segundos: 60
  };
  public check:any = {};
  constructor(
    private activate: ActivatedRoute,
    private _model: FactoryModelService
  ) { }
  ngOnInit() {
    this._model.query('user',{ where:{ username: (this.activate.snapshot.paramMap.get('username'))} })
    .subscribe((rta)=>{ this.usuario = rta['data'][0]; if(!this.usuario){this._model.query('user',{ where:{ username: "joseeduardo112"} }).subscribe((rta)=>this.usuario['data'][0]);}});
    const interval = setInterval(() => {
      // console.log(data.stop)
      this.data.segundos = this.data.segundos - 1;
      if (this.data.segundos === 0) {
        this.data.segundos = 60;
        this.data.minutos = this.data.minutos - 1;
        if(this.data.minutos === 0){
          this.data.minutos = 60;
          if(this.data.dia === 0) {
            if(this.data.dia === 0){
              this.stopConter(interval);
            }
            this.data.hora = this.data.hora - 1;
          }
        }
      }
    }, 1000);

  }
  stopConter(interval: any) {
    clearInterval(interval);
  }
}
