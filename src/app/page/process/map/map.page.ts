import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Observer, Observable, Subscription } from 'rxjs';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { Pedometer } from '@ionic-native/pedometer/ngx';
import { Platform } from '@ionic/angular';
import { PsuHospitalService } from 'src/app/services/psu-hospital.service';
import { element } from 'protractor';
import { SSL_OP_CRYPTOPRO_TLSEXT_BUG } from 'constants';
@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, OnDestroy {
  canvas: any;
  pedometerData: any;
  imgPath: Array<string> = [];
  imgCanvas: Array<string> = [];
  color: string;
  idStart: string;
  idGoal: string;
  navigateText: string;
  compass: number;
  stepCount: number;
  allLocations: Array<Location> = [];
  bsub: Subscription;
  pathResult: any = {};
  pathCoordinations: any[][] = [[], []];
  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private deviceOrientation: DeviceOrientation,
    private tts: TextToSpeech,
    public pedoCtrl: Pedometer,
    public platform: Platform,
    public ngZoneCtrl: NgZone,
    private psuHospitalService: PsuHospitalService,
  ) {
    this.imgPath.push('../../../../assets/maps/baramee1.png');
    this.imgPath.push('../../../../assets/maps/main1.png');
    this.canvas = document.createElement('canvas');
    this.color = 'rgb(255,255,255)';
    this.navigateText = 'มุ่งหน้าไป';
    this.stepCount = 0;
    this.idStart = this.route.snapshot.paramMap.get('start');
    this.idGoal = this.route.snapshot.paramMap.get('end');
    // console.log(typeof(this.idStart));
    // console.log(this.idGoal);
  }

  findPath() {
    const nodeDijkstra = require('node-dijkstra');
    this.bsub = this.psuHospitalService.loadLocation().subscribe(
      data => {
        this.pathResult = {};
        this.allLocations = data.locations;
        const results = {};
        Object.keys(this.allLocations).map(
          elem => {
            const pathId = this.allLocations[elem]['id'];
            results[pathId] = this.allLocations[elem]['neighbor'];
          }
        );
        const route = new nodeDijkstra(results);
        this.pathResult = route.path(this.idStart, this.idGoal, { cost: true });
        // console.log(this.pathResult);
        // console.log(paths);
        // tslint:disable-next-line: forin
        // this.pathResult['path'].forEach(path => {
          // if
        // });
        const drawResult = [[], []];
        this.pathResult['path'].forEach(element => {
          Object.keys(this.allLocations).map(
            elem => {
              let obj = {};
              if (element === this.allLocations[elem]['id']) {
                obj = {
                  id: this.allLocations[elem]['id'],
                  x: this.allLocations[elem]['x'],
                  y: this.allLocations[elem]['y'],
                };
                if (this.allLocations[elem]['id'].includes('baramee1')) {
                  console.log(true);
                  drawResult[0].push(obj);
                }
                else if (this.allLocations[elem]['id'].includes('main1')) {
                  console.log(false);
                  drawResult[1].push(obj);
                }
                console.log(drawResult);
              }});
        });
        this.pathCoordinations = drawResult;
        // console.log('drawResult => ', drawResult);
      }
    );
  }

  ngOnInit() {
    this.findPath();
    // tslint:disable-next-line: no-shadowed-variable
    this.imgPath.forEach(element => {
      this.getBase64ImageFromURL(element).subscribe(data => {
        this.imgCanvas.push('data:image/jpg;base64,' + data);
      });
    });
  }

  ngOnDestroy() {
    this.bsub.unsubscribe();
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
    // console.log(img.src.includes('baramee1'));
    if (img.src.includes('baramee1')) {
      this.drawLine(this.canvas.getContext('2d'), img, this.pathCoordinations[0]);
    }
    if (img.src.includes('main1')) {
      this.drawLine(this.canvas.getContext('2d'), img, this.pathCoordinations[1]);
    }
    // this.drawLine(this.canvas.getContext('2d'), img);
    const dataURL = this.canvas.toDataURL('image/png');
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
  }

  drawLine(ctx: any, img: HTMLImageElement, nodePath: Object[]) {
    // console.log('in drawline', this.pathCoordinations);
    ctx.drawImage(img, 0, 0);
    ctx.beginPath();
    // ctx.arc(100, 100, 50, 0, 2 * Math.PI, false);
    ctx.strokeStyle = '#00BFFF';
    ctx.setLineDash([20, 5]);
    ctx.lineWidth = 15;
    for (let i = 0; i < nodePath.length; i++) {
      if (i === 0) {
        ctx.moveTo(nodePath[i + 1]['x'], nodePath[i + 1]['y']);
        ctx.fillStyle = '#DC143C';
        ctx.fillRect(nodePath[i + 1]['x'] - 10, nodePath[i + 1]['y'], 20, 20);
      } else if (nodePath[i + 1] == null) {
        // console.log("in case");
        ctx.moveTo(nodePath[i]['x'], nodePath[i]['y']);
        ctx.fillStyle = '#DC143C';
        ctx.fillRect(nodePath[i]['x'] - 10, nodePath[i]['y'] - 20, 20, 20);
      } else if (nodePath[i + 1] != null) {
        ctx.lineTo(nodePath[i + 1]['x'], nodePath[i + 1]['y']);
        // ctx.fillStyle = '#00BFFF';
      }
    }
    ctx.fillStyle = '#DC143C';
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
    if (this.compass === 0 || this.compass === 360) {
      console.log('เหนือ');
    } else if (this.compass === 90) {
      console.log('ออก');
    } else if (this.compass === 180) {
      console.log('ใต้');
    } else if (this.compass === 270) {
      console.log('ตก');
    }
  }

  textToSpeech() {
    this.tts.speak({
      text: this.navigateText,
      locale: 'th-TH',
      rate: 1
    }).then(() => console.log('Success'))
      .catch((reason: any) => console.log(reason));
  }

  startPedometer() {
    if (this.platform.is('cordova')) {
      this.pedoCtrl.startPedometerUpdates().subscribe((PedometerData) => {
        this.pedometerData = PedometerData;
        this.ngZoneCtrl.run(() => {
          this.stepCount = this.pedometerData.numberOfSteps;
        });
      });
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
