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
import { async } from '@angular/core/testing';
import { __await } from 'tslib';
declare let unityARCaller: any;

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
  nameGoal: string;
  navigateText: string;
  arOrder: string[];
  costOrder: string[];
  costAllPath: number[] = [];
  costBuffer = '';
  messagesUnity = '';
  compass: number;
  stepCount: number;
  meterCount: number;
  allLocations: Array<Location> = [];
  bsub: Subscription;
  graph: any = {};
  graphCost: any = {};
  textOrder: string[] = ['เริ่มต้น'];
  index = 0;
  pathResults: any[] = [];
  buildings: string[] = [];
  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private deviceOrientation: DeviceOrientation,
    private tts: TextToSpeech,
    public pedoCtrl: Pedometer,
    public platform: Platform,
    public ngZoneCtrl: NgZone,
    private psuHospitalService: PsuHospitalService) {
    this.imgPath.push('../../../../assets/maps/baramee1.png');
    this.imgPath.push('../../../../assets/maps/main1.png');
    this.canvas = document.createElement('canvas');
    this.color = 'rgb(255,255,255)';
    this.navigateText = 'สวัสดีครับ.';
    this.stepCount = 0;
    this.meterCount = 0;
    this.idStart = this.route.snapshot.paramMap.get('start');
    this.idGoal = this.route.snapshot.paramMap.get('end');
    this.startPedometer();
  }
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
   async findPath() {
    const nodeDijkstra = require('node-dijkstra');
    this.bsub = this.psuHospitalService.loadLocation().subscribe(
      async data => {
        data.locations.forEach(element => {
          if (element.id === this.idGoal) {
            this.nameGoal = element.name;
          }
        });
        this.graph = {};
        this.allLocations = data.locations;
        const results = {};
        Object.keys(this.allLocations).map(
          elem => {
            const pathId = this.allLocations[elem].id;
            results[pathId] = this.allLocations[elem].neighbor;
          }
        );
        const route = new nodeDijkstra(results);
        this.graph = route.path(this.idStart, this.idGoal, { cost: true });
        console.log(this.graph);
        // const drawResult = [];
        // let buildingPath = {};
        let tmpObj = {};
        let buildings = [];
        if (this.graph) {
          this.graph.path.forEach(path => {
            if (!buildings.includes(path.split('_')[0])) {
              buildings.push(path.split('_')[0]);
            }
          });
        }
        this.buildings = buildings;
        for (let building of buildings) {
          let tmpArray = [];
          // console.log(building);
          this.graph.path.forEach(element => {
            Object.keys(this.allLocations).map(
              elem => {
                let obj = {};
                if (element === this.allLocations[elem].id) {
                  obj = {
                    id: this.allLocations[elem].id,
                    x: this.allLocations[elem].x,
                    y: this.allLocations[elem].y,
                    name: this.allLocations[elem].name
                  };
                  if (obj['id'].includes(building)) {
                    // console.log(obj['id'])
                    tmpArray.push(obj);
                  }
                }
              });
          });
          tmpObj[building] = tmpArray;
          // console.table(tmpObj[building]);
        }

        for (let i = 0; i < buildings.length; i++) {
          this.pathResults.push(Object.values(tmpObj)[i]);
        }
        await this.sleep(1000);
        console.table(this.pathResults[0]);
        if (buildings.length > 1) {
          for (let i = 0; i < buildings.length - 1; i++) {
            this.generateARdata(this.pathResults[i].concat(this.pathResults[i + 1]));
            this.generateText(this.pathResults[i].concat(this.pathResults[i + 1]));
          }
        } else {
          this.generateARdata(this.pathResults[0]);
          this.generateText(this.pathResults[0]);
        }
      });
  }

  findCost(start: string, goal: string) {
    const nodeDijkstra = require('node-dijkstra');
    this.psuHospitalService.loadLocation().subscribe(
      data => {
        data.locations.forEach(element => {
          if (element.id === this.idGoal) {
            this.nameGoal = element.name;
          }
        });
        this.graphCost = {};
        this.allLocations = data.locations;
        const results = {};
        Object.keys(this.allLocations).map(
          elem => {
            const pathId = this.allLocations[elem].id;
            results[pathId] = this.allLocations[elem].neighbor;
          }
        );
        const route = new nodeDijkstra(results);
        this.graphCost = route.path(start, goal, { cost: true });
        // console.log(`Cost ${start}-${goal} : ${this.graphCost.cost} `);
        this.addCostAllPath(this.graphCost.cost);
      }
    );
  }
  addCostAllPath(data: any) {
    // console.log(data);
    this.costAllPath.push(data);
  }
  showCostAllPath() {
    console.log(this.costAllPath);
  }

  ngOnInit() {
    this.textOrder = ['เริ่มต้น'];
    this.index = 0;
    this.pathResults = [];
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
    for (let building of this.buildings) {
      if (img.src.includes(building)) {
        this.drawLine(this.canvas.getContext('2d'), img, this.pathResults[this.buildings.indexOf(building)]);
      }
    }
    const dataURL = this.canvas.toDataURL('image/png');
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
  }
  // nodePath เป็น array ของ pathResults ที่ใช้ในการสร้าง map
  drawLine(ctx: any, img: HTMLImageElement, nodePath: Object[]) {
    ctx.drawImage(img, 0, 0);
    ctx.beginPath();
    ctx.strokeStyle = '#00BFFF';
    ctx.setLineDash([20, 5]);
    ctx.lineWidth = 15;
    for (let i = 0; i < nodePath.length; i++) {
      if (i === 0 && nodePath[i + 1]) {
        // ctx.font = "40px Verdana";
        // ctx.fillText('Start', nodePath[i]['x'] - 10, nodePath[i]['y'] - 10);
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(nodePath[i]['x'] - 10, nodePath[i]['y'], 20, 20);
        ctx.fillStyle = '#000000';

        // ctx.drawImage(img, nodePath[i]['x'], nodePath[i]['x']);
        ctx.moveTo(nodePath[i]['x'], nodePath[i]['y'])
        ctx.lineTo(nodePath[i + 1]['x'], nodePath[i + 1]['y'])
      } else if (!nodePath[i + 1]) {
          // ctx.moveTo(nodePath[i - 1]['x'], nodePath[i - 1]['y'])
          // ctx.lineTo(nodePath[i]['x'], nodePath[i]['y'])
          ctx.fillStyle = '#00BFFF';
          ctx.fillRect(nodePath[i]['x'] - 10, nodePath[i]['y'], 20, 20);
      } else {
        ctx.lineTo(nodePath[i + 1]['x'], nodePath[i + 1]['y']);
      }
    }
    ctx.stroke();
  }
  // getCompass() {
  //   setInterval(() => {
  //     console.log('test');
  //     this.deviceOrientation.getCurrentHeading().then(
  //       (data: DeviceOrientationCompassHeading) => {
  //         this.compass = data.magneticHeading;
  //       },
  //       (error: any) => console.log(error)
  //     );
  //   }, 1000);
  //   if (this.compass === 0 || this.compass === 360) {
  //     console.log('เหนือ');
  //   } else if (this.compass === 90) {
  //     console.log('ออก');
  //   } else if (this.compass === 180) {
  //     console.log('ใต้');
  //   } else if (this.compass === 270) {
  //     console.log('ตก');
  //   }
  // }

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
          if (this.stepCount > 1) {
            this.meterCount = this.stepCount * 0.76;
          }
        });
      });
    }
  }

  CalculateCrossProduct(A: any, B: any, C: any): string {
    const bx = B.x - A.x;
    const by = B.y - A.y;
    const cx = C.x - A.x;
    const cy = C.y - A.y;
    const crossProduct = bx * cy - by * cx;
    // console.log('====> b in cp', B);
    if (crossProduct > 0) {
      // console.log(`เลี้ยวขวา${B.name}`);
      return `เลี้ยวขวาที่${B.name},`;
    } else if (crossProduct < 0) {
      // console.log(`เลี้ยวซ้าย${B.name}`);
      return `เลี้ยวซ้ายที่${B.name},`;
    }
    return '';
  }
  CalculateCrossProductAR(A: any, B: any, C: any): string {
    const bx = B.x - A.x;
    const by = B.y - A.y;
    const cx = C.x - A.x;
    const cy = C.y - A.y;
    const crossProduct = bx * cy - by * cx;
    // console.log('====> b in cp', B);
    if (crossProduct > 0) {
      // console.log(`เลี้ยวขวา${B.name}`);
      return `R-${B.id},`;
    } else if (crossProduct < 0) {
      // console.log(`เลี้ยวซ้าย${B.name}`);
      return `L-${B.id},`;
    } else if (crossProduct === 0) {
      return `N-${B.id},`;
    }
    return '';
  }
  CalculateCrossProductID(A: any, B: any, C: any): string {
    const bx = B.x - A.x;
    const by = B.y - A.y;
    const cx = C.x - A.x;
    const cy = C.y - A.y;
    const crossProduct = bx * cy - by * cx;
    // console.log('====> b in cp', B);
    if (crossProduct > 0) {
      // console.log(`เลี้ยวขวา${B.name}`);
      return `${B.id}`;
    } else if (crossProduct < 0) {
      // console.log(`เลี้ยวซ้าย${B.name}`);
      return `${B.id}`;
    }
    return '';
  }

  generateText(data: any) {
    let command = 'เดินตรงไปแล้ว';
    // console.table(data);
    for (let i = 0; i < data.length - 2; i++) {
      const buffer = this.CalculateCrossProduct(data[i], data[i + 1], data[i + 2]);
      if (buffer !== '') {
        command += buffer;
        command += 'จากนั้นมุ่งหน้าต่อไปแล้ว';
      }
    }
    this.textOrder = command.split(',');
    this.textOrder.unshift('เริ่มต้น');
    this.textOrder.pop();
    this.textOrder.push('เดินตรงไป');
    this.textOrder.push('ถึงจุดหมาย');
    // console.log(this.textOrder);
  }

  generateARdata(data: any) {
    // console.table(data);
    let command = '';
    for (let i = 0; i < data.length - 2; i++) {
      const buffer = this.CalculateCrossProductAR(data[i], data[i + 1], data[i + 2]);
      if (buffer !== '') {
        command += buffer;
      }
    }
    const firstnode = data[0].id;
    const lastnode = data.pop().id;
    this.arOrder = command.split(',');
    this.arOrder.unshift('S-' + firstnode);
    this.arOrder.push('E-' + lastnode);
    this.arOrder.forEach(element => {
      if (element) {
        element += ',';
        this.messagesUnity += element;
      }
    });
    // console.log(this.messagesUnity);
  }

  CostData(data: any) { // data =  path node ทั้งหมด
    // console.table(data);
    let command = '';
    const firstnode = data[0].id;
    const lastnode = data.pop().id;
    for (let i = 0; i < data.length - 2; i++) {
      const buffer = this.CalculateCrossProductID(data[i], data[i + 1], data[i + 2]);
      if (buffer !== '') {
        command += buffer;
      }
    }
    this.costOrder = command.split(',');
    this.costOrder.unshift(firstnode);
    this.costOrder.push(lastnode);
    this.costOrder.forEach(ele => {
      if (ele) {
        ele += ',';
        this.costBuffer += ele;
      }
    });
    const dataPath = this.costBuffer.split(',');
    dataPath.pop();
    for (let i = 0; i < Object.keys(dataPath).length - 1; i++) {
      this.findCost(dataPath[i], dataPath[i + 1]);
    }
  }

  nextText() {
    if (this.index < this.textOrder.length) {
      this.navigateText = this.textOrder[this.index];
      this.index++;
      this.textToSpeech();
    }
  }

  backText() {
    this.index--;
    if (this.index <= 0) {
      // console.log('back1');
    } else if (this.index < this.textOrder.length) {
      this.navigateText = this.textOrder[this.index - 1];
      this.textToSpeech();
    }
  }

  openUnity() {
    // It is possible to send a string message to Unity-side (optional)
    unityARCaller.launchAR(this.messagesUnity, this.uReturnedFromUnity, this.uMessageReceivedFromUnity);
  }

  sendMessageToUnity() {
    // Send a message to Unity while Unity is still running
    unityARCaller.sendMessage('Function name', 'Optional parameter');
  }

  uReturnedFromUnity = (param) => {
    // param:String is the (optional) message returned from Unity-side
    alert(param);
  }

  uMessageReceivedFromUnity = (message) => {
    // message:String is the message received from Unity-side
    // If you call a UI-blocking function here like 'alert', subsequent messages from Unity
    // will be queued by the OS and will only be received after returning to Ionic and
    // unblocking the UI
    console.log('=========' + message + '=========');
  }

  backBeforePage() {
    this.location.back();
    console.log('back');
  }
  backFeedsPage() {
    this.router.navigateByUrl('/app/tabs/feeds');
    // this.showCostAllPath();
  }
}
