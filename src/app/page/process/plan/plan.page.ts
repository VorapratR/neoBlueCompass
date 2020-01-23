import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { BLE } from '@ionic-native/ble/ngx';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-plan',
  templateUrl: './plan.page.html',
  styleUrls: ['./plan.page.scss']
})
export class PlanPage implements OnInit {
  showDetail: boolean;
  typeScan: boolean;
  statusFindMyLocation: boolean;
  findLocationDetail: string;
  idGoal: string;
  nameGoal: string;
  idStart: string;
  uuidName: string;
  devices: any[] = [];
  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private barcodeScanner: BarcodeScanner,
    private storage: Storage,
    private ble: BLE,
  ) {
    this.showDetail = false;
    this.statusFindMyLocation = true;
    this.idGoal = this.route.snapshot.paramMap.get('id');
    this.nameGoal = this.route.snapshot.paramMap.get('name'); 
  }

  ngOnInit() {
  }

  onQrCode() {
    this.showDetail = true;
    this.typeScan = true;
    this.findLocationDetail = 'เป็นการระบุตำแหน่งโดยการสแกน Qr Code บริเวณที่คุณอยู่';
  }

  onBeacon() {
    this.showDetail = true;
    this.typeScan = false
    this.findLocationDetail =
      'เป็นการระบุตำแหน่งโดยการสแกน Bluetooth Low Energy บริเวณที่คุณอยู่กรุณาเปิดbluetooth ขณะใช้งาน';
  }

  qrCodeScaner() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', typeof barcodeData.text);
      this.idStart = barcodeData.text;
      if (barcodeData) {
        this.statusFindMyLocation = false;
      }
     }).catch(err => {
         console.log('Error', err);
     });
  }

  beaconScaner() {
    // https://github.com/VorapratR/ionic-ble
    this.devices = [];  // clear list
    this.ble.scan([], 5).subscribe(
      device => this.devices.push(device),
      error => console.log(error)
    );
    this.statusFindMyLocation = false;
  }

  nextPage() {
    this.router.navigateByUrl(`/map/${this.idStart}/${this.idGoal}`);
  }

  backBeforePage() {
    this.location.back();
  }
}
