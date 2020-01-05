import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-plan',
  templateUrl: './plan.page.html',
  styleUrls: ['./plan.page.scss']
})
export class PlanPage implements OnInit {
  findLocationDetail = '';
  showDetail = false;
  statusFindMyLocation = true;
  idGoal: string;
  nameGoal: string;
  idStart: string;
  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private barcodeScanner: BarcodeScanner,
    private storage: Storage
  ) {
    this.idGoal = this.route.snapshot.paramMap.get('id');
    this.nameGoal = this.route.snapshot.paramMap.get('name');
  }

  ngOnInit() {
  }

  onQrCode() {
    this.showDetail = true;
    this.findLocationDetail = 'เป็นการระบุตำแหน่งโดยการสแกน Qr Code บริเวณที่คุณอยู่';
  }

  onBeacon() {
    this.showDetail = true;
    this.findLocationDetail =
      'เป็นการระบุตำแหน่งโดยการสแกน Bluetooth Low Energy บริเวณที่คุณอยู่กรุณาเปิดbluetooth ขณะใช้งาน';
  }

  backBeforePage() {
    this.location.back();
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

  nextPage() {
    this.storage.set('id', this.idStart);
    this.storage.get('id').then((val) => {
      console.log('Your age is', val);
    });
    this.router.navigateByUrl('/map');
  }
}
