import { Component, OnInit } from '@angular/core';
import { FactoryModelService } from '../../../../../services/factory-model.service';
import { ToolsService } from '../../services/tools.service';

@Component({
  selector: 'app-quejas',
  templateUrl: './quejas.component.html',
  styleUrls: ['./quejas.component.scss']
})
export class QuejasComponent implements OnInit {
  public data: any = {};
  constructor(
    private _model: FactoryModelService,
    private _tools: ToolsService
  ) { }

  ngOnInit() {
  }
  submit(){
    const
      data: any = {
        ids: this._model.user.id,
        titulo: this.data.titulo,
        prioridad: 'baja',
        tipo: 'quejas',
        user: this._model.user.id,
        descripcion: this.data.descripcion
      }
    ;
    this._model.create('notas',data)
    .subscribe(
      (res: any) =>{
        // console.log(res);
        if(res){
          this._tools.openSnack('Enviado con Exito', 'completado', false);
          this.data = {};
        }else{
          this._tools.openSnack('Error al Enviar', 'false', false);
        }
      }
    )
  }

}
