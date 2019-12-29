import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-compra-finalizada',
  templateUrl: './compra-finalizada.component.html',
  styleUrls: ['./compra-finalizada.component.scss']
})
export class CompraFinalizadaComponent implements OnInit {

  constructor(private _route: ActivatedRoute) { }

  ngOnInit() {
    const data: any = this._route.snapshot.params;
    console.log(data);
  }

}
