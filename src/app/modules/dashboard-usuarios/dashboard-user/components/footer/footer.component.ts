import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NgImageSliderComponent } from 'ng-image-slider';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  @ViewChild('nav') ds: NgImageSliderComponent;
  sliderWidth: Number = 1204;
  sliderImageWidth: Number = 618;
  sliderImageHeight: Number = 44;
  sliderArrowShow: Boolean = true;
  sliderInfinite: Boolean = true;
  sliderImagePopup: Boolean = true;
  sliderAutoSlide: Number = 1;
  sliderSlideImage: Number = 1;
  sliderAnimationSpeed: any = 2.4;
  imageObject: any = [];

  constructor(
    public dialog: MatDialog,
  ) { 
    if( (window.innerWidth >= 1000) ) this.sliderImageWidth = 700;
    if( (window.innerWidth <= 1000) ) this.sliderImageWidth = 700;
    if( (window.innerWidth <= 770) ) this.sliderImageWidth = 460;
    if( (window.innerWidth <= 520) ) this.sliderImageWidth = 420;
    if( (window.innerWidth <= 450) ) this.sliderImageWidth = 370;
    if( (window.innerWidth <= 420) ) this.sliderImageWidth = 300;
  }

  ngOnInit(): void {
    this.listaBanner();
  }

  listaBanner() {
    var count = 0;
    for (let i = 0; i < 18; i++) {
      count++;
      this.imageObject.push({
        image: `./assets/banner/${count}.jpeg`,
        thumbImage: `./assets/banner/${count}.jpeg`,
        alt: 'https://lamejorfabricadeca.wixsite.com/misitio-1',
        id: i,
      });
    }
    console.log(this.imageObject)
  }

  openaVenta() {
    let url: string = `https://publihazclickcom.wixsite.com/misitio`;
    window.open(url);
  }

  arrowOnClick(event) {
    //console.log('arrow click event', event);
  }

  lightboxArrowClick(event) {
    //console.log('popup arrow click', event);
  }

  prevImageClick() {
    this.ds.prev();
  }

  nextImageClick() {
    this.ds.next();
  }

  imageOnClick(ev:any){
    console.log("hey");
  }

}