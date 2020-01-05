import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  public username = '';
  constructor(
    private activate: ActivatedRoute,
  ) {
    this.username = (this.activate.snapshot.paramMap.get('username'));
    this.modificaciones();
  }

  ngOnInit() {
  }
  private modificaciones() {
  }

}
