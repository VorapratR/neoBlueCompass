import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Observer, Observable, Subscription } from 'rxjs';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { Pedometer } from '@ionic-native/pedometer/ngx';
import { Platform } from '@ionic/angular';
import { PsuHospitalService } from 'src/app/services/psu-hospital.service';
@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, OnDestroy {
  canvas: any;
  pedometerData: any;
  imgPath: string;
  imgCanvas: string;
  color: string;
  idStart: string;
  idGoal: string;
  navigateText: string;
  compass: number;
  stepCount: number;
  allLocations: Array<Location> = [];
  bsub: Subscription;
  pathResult: any = {};
  pathCoordinations: any = [];
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
    this.imgPath = '../../../../assets/maps/baramee1.png';
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
            const query = this.allLocations[elem]['id'];
            results[query] = this.allLocations[elem]['neighbor'];
          }
        );
        const route = new nodeDijkstra(results);
        this.pathResult = route.path('baramee1_1', 'baramee1_10', { cost: true });
        const drawResult = [];
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
                drawResult.push(obj);
              }
            }
          );
        });
        this.pathCoordinations = drawResult;
        // console.log('drawResult => ', drawResult);
      }
    );
  }

  ngOnInit() {
    this.getBase64ImageFromURL(this.imgPath).subscribe(data => {
      this.imgCanvas = 'data:image/jpg;base64,' + data;
    });
    this.findPath();
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
    this.drawLine(this.canvas.getContext('2d'), img);
    const dataURL = this.canvas.toDataURL('image/png');
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
  }

  drawLine(ctx: any, img: HTMLImageElement) {
    console.log('in drawline', this.pathCoordinations);
    // console.log('in drawLine', this.pathResult);
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
