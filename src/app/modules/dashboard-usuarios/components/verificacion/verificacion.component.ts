import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FactoryModelService } from '../../dashboard-user/services/factory-model.service';
import { ToolsService } from '../../dashboard-user/services/tools.service';

@Component({
  selector: 'app-verificacion',
  templateUrl: './verificacion.component.html',
  styleUrls: ['./verificacion.component.scss']
})
export class VerificacionComponent implements OnInit {
  private id: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _model: FactoryModelService,
    private _tools: ToolsService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id'] != null) {
        // console.log(params['id']);
        this.id = params['id'];
        this.getUser();
      }
    });
  }
  getUser() {
    if (this.id) {
      return this._model.query('user', {
        where: {
          codigo: this.id,
          // estado: 'verificando'
        },
        limit: 1
      })
        .subscribe(
          (res: any) => {
            // console.log(res);
            res = res.data[0];
            if (res) {
              if(res.estado === 'verificando'){
                const
                  data: any = {
                    id: res.id,
                    estado: 'activo'
                  }
                  ;
                this.updateUser(data)
                  .subscribe(
                    // tslint:disable-next-line:no-shadowed-variable
                    (res: any) => {
                      // console.log(res);
                      if (res) {
                        localStorage.setItem('user', JSON.stringify(res));
                        this.router.navigate(['dashboard']);
                      } else {
                        this._tools.openSnack('No se pudo registrar porfavor verifica los datos', 'Error', false);
                      }
                    }
                  );
              }else{
                if(res.estado === 'activo'){
                  localStorage.setItem('user', JSON.stringify(res));
                  this.router.navigate(['dashboard']);
                }
              }
            } else {
              this._tools.openSnack('No se pudo registrar porfavor verifica los datos', 'Error', false);
            }
          }
        )
        ;
    }
  }
  updateUser(query: any) {
    return this._model.update('user', query.id, query);
  }

}
