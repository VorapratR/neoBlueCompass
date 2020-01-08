import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Observer, Observable } from 'rxjs';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation/ngx';
@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  canvas: any;
  imgPath: string;
  imgCanvas: string;
  color: string;
  compass: number;
  constructor(private location: Location, private router: Router, private deviceOrientation: DeviceOrientation) {
    this.imgPath = '../../../../assets/A-1.png';
    this.canvas = document.createElement('canvas');
    this.color = 'rgb(255,255,255)';
  }

  ngOnInit() {
    this.getBase64ImageFromURL(this.imgPath).subscribe(data => {
      this.imgCanvas = 'data:image/jpg;base64,' + data;
    });
  }

  getBase64ImageFromURL(url: string) {
    return Observable.create((observer: Observer<string>) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      if (!img.complete) {
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = (err) => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }

  getBase64Image(img: HTMLImageElement) {
    this.canvas.width = img.width;
    this.canvas.height = img.height;
    this.drawLine(this.canvas.getContext('2d'), img);
    const dataURL =  this.canvas.toDataURL('image/png');
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
  }

  drawLine(ctx: any, img: HTMLImageElement) {
    ctx.drawImage(img, 0, 0);
    ctx.beginPath();
    ctx.strokeStyle = '#00BFFF';
    ctx.setLineDash([10, 10]);
    ctx.lineWidth = 5;
    ctx.moveTo(0, 0);
    ctx.fillStyle = '#DC143C';
    ctx.lineTo(500, 500);
    ctx.stroke();
  }

  getCompass() {
    setInterval(() => {
      console.log('test');
      this.deviceOrientation.getCurrentHeading().then(
        (data: DeviceOrientationCompassHeading) => {
          this.compass = data.magneticHeading;
        },
        (error: any) => console.log(error)
      );
    }, 1000);
    if (this.compass === 0 || this.compass === 360 ) {
      console.log('เหนือ');
    } else if (this.compass === 90 ) {
      console.log('ออก');
    } else if (this.compass === 180) {
      console.log('ใต้');
    } else if (this.compass === 270) {
      console.log('ตก');
    }
  }
  backBeforePage() {
    this.location.back();
    console.log('back');
  }
  backFeedsPage() {
    this.router.navigateByUrl('/app/tabs/feeds');
  }

}
